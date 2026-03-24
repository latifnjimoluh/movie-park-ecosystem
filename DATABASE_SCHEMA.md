# Schéma complet de la base de données
> Movie in the Park — Easter 2026
> Base : PostgreSQL • ORM : Sequelize

---

## Vue d'ensemble des tables

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────┐
│    packs    │◄──────│   reservations   │──────►│    users    │
└─────────────┘       └──────────────────┘       └─────────────┘
                              │                         │
                    ┌─────────┼─────────┐               │
                    │         │         │               │
               ┌────▼───┐ ┌──▼────┐ ┌──▼────┐         │
               │partici-│ │pay-   │ │tickets│         │
               │ pants  │ │ments  │ │       │         │
               └────────┘ └───────┘ └───┬───┘         │
                                        │               │
                              ┌─────────┘               │
                              └── generated_by ─────────┘
```

---

## 1. `users` — Utilisateurs du système

```sql
CREATE TABLE users (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  email        VARCHAR(255)  UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name         VARCHAR(255)  NOT NULL,
  phone        VARCHAR(50),
  role         ENUM(
                 'superadmin',
                 'admin',
                 'cashier',
                 'scanner'
               )             NOT NULL DEFAULT 'cashier',
  last_login   TIMESTAMP,
  "createdAt"  TIMESTAMP     NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMP     NOT NULL DEFAULT NOW()
);
```

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id` | UUID | PK | Identifiant unique |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email de connexion |
| `password_hash` | VARCHAR(255) | NOT NULL | Hash bcrypt du mot de passe |
| `name` | VARCHAR(255) | NOT NULL | Nom complet |
| `phone` | VARCHAR(50) | nullable | Téléphone |
| `role` | ENUM | NOT NULL | Niveau d'accès |
| `last_login` | TIMESTAMP | nullable | Dernière connexion |

**Rôles :**
- `superadmin` — Accès complet + gestion utilisateurs + audit
- `admin` — Gestion des réservations, paiements, tickets + audit
- `cashier` — Création et gestion de réservations/paiements
- `scanner` — Validation des entrées seulement

---

## 2. `packs` — Offres tarifaires

```sql
CREATE TABLE packs (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) UNIQUE NOT NULL,
  price       INTEGER      NOT NULL,           -- En XAF (ex: 5000)
  description TEXT,
  capacity    INTEGER,                          -- Nb personnes (null = individuel)
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP    NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP    NOT NULL DEFAULT NOW()
);
```

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id` | UUID | PK | Identifiant unique |
| `name` | VARCHAR(255) | UNIQUE, NOT NULL | Nom du pack (ex: "VIP", "Famille") |
| `price` | INTEGER | NOT NULL | Prix en XAF |
| `description` | TEXT | nullable | Description détaillée |
| `capacity` | INTEGER | nullable | Capacité max (null = solo) |
| `is_active` | BOOLEAN | DEFAULT true | Visible pour les clients |

---

## 3. `reservations` — Réservations

```sql
CREATE TABLE reservations (
  id                  UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  payeur_name         VARCHAR(255) NOT NULL,
  payeur_phone        VARCHAR(50)  NOT NULL,
  payeur_email        VARCHAR(255),
  pack_id             UUID         NOT NULL REFERENCES packs(id),
  pack_name_snapshot  VARCHAR(255) NOT NULL,  -- Copie du nom au moment de la réservation
  unit_price          INTEGER      NOT NULL,  -- Prix unitaire en XAF
  quantity            INTEGER      NOT NULL DEFAULT 1,
  total_price         INTEGER      NOT NULL,  -- unit_price × quantity
  total_paid          INTEGER      NOT NULL DEFAULT 0,
  status              ENUM(
                        'pending',
                        'partial',
                        'paid',
                        'ticket_generated',
                        'cancelled'
                      )            NOT NULL DEFAULT 'pending',
  "createdAt"         TIMESTAMP    NOT NULL DEFAULT NOW(),
  "updatedAt"         TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Colonne virtuelle (calculée, non stockée)
-- remaining_amount = total_price - total_paid
```

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id` | UUID | PK | Identifiant unique |
| `payeur_name` | VARCHAR(255) | NOT NULL | Nom du payeur |
| `payeur_phone` | VARCHAR(50) | NOT NULL | Téléphone (format: `237XXXXXXXXX`) |
| `payeur_email` | VARCHAR(255) | nullable | Email du payeur |
| `pack_id` | UUID | FK → packs | Pack réservé |
| `pack_name_snapshot` | VARCHAR(255) | NOT NULL | Nom du pack copié (historique) |
| `unit_price` | INTEGER | NOT NULL | Prix unitaire XAF au moment de réservation |
| `quantity` | INTEGER | NOT NULL | Nombre de places |
| `total_price` | INTEGER | NOT NULL | Montant total XAF |
| `total_paid` | INTEGER | DEFAULT 0 | Montant encaissé |
| `status` | ENUM | DEFAULT 'pending' | Avancement de la réservation |

**Statuts :**
- `pending` — En attente de paiement
- `partial` — Acompte reçu
- `paid` — Paiement complet
- `ticket_generated` — Ticket émis
- `cancelled` — Annulée

---

## 4. `participants` — Participants d'une réservation

```sql
CREATE TABLE participants (
  id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id     UUID         NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  name               VARCHAR(255) NOT NULL,
  phone              VARCHAR(50),
  email              VARCHAR(255),
  ticket_id          UUID         REFERENCES tickets(id),
  entrance_validated BOOLEAN      NOT NULL DEFAULT FALSE,
  "createdAt"        TIMESTAMP    NOT NULL DEFAULT NOW(),
  "updatedAt"        TIMESTAMP    NOT NULL DEFAULT NOW()
);
```

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id` | UUID | PK | Identifiant unique |
| `reservation_id` | UUID | FK → reservations | Réservation parente |
| `name` | VARCHAR(255) | NOT NULL | Nom complet du participant |
| `phone` | VARCHAR(50) | nullable | Téléphone |
| `email` | VARCHAR(255) | nullable | Email |
| `ticket_id` | UUID | FK → tickets, nullable | Ticket associé (après génération) |
| `entrance_validated` | BOOLEAN | DEFAULT false | Entrée physique validée au contrôle |

---

## 5. `payments` — Paiements

```sql
CREATE TABLE payments (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID    NOT NULL REFERENCES reservations(id) ON DELETE RESTRICT,
  amount         INTEGER NOT NULL,             -- Montant en XAF
  method         ENUM(
                   'momo',
                   'cash',
                   'orange',
                   'card',
                   'other'
                 )       NOT NULL,
  proof_url      VARCHAR(500),                 -- URL/chemin vers la preuve de paiement
  comment        TEXT,
  created_by     UUID    NOT NULL REFERENCES users(id),
  "createdAt"    TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMP NOT NULL DEFAULT NOW()
);
```

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id` | UUID | PK | Identifiant unique |
| `reservation_id` | UUID | FK → reservations | Réservation concernée |
| `amount` | INTEGER | NOT NULL | Montant en XAF |
| `method` | ENUM | NOT NULL | Mode de paiement |
| `proof_url` | VARCHAR(500) | nullable | Preuve de paiement (mobile money) |
| `comment` | TEXT | nullable | Note interne |
| `created_by` | UUID | FK → users | Caissier ayant enregistré le paiement |

---

## 6. `tickets` — Tickets d'entrée

```sql
CREATE TABLE tickets (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID         NOT NULL REFERENCES reservations(id) ON DELETE RESTRICT,
  ticket_number  VARCHAR(50)  UNIQUE NOT NULL,  -- Format: MIP-XXXXXXXX-YYYYYY
  qr_payload     TEXT         NOT NULL,          -- JSON signé avec QR_SECRET
  qr_image_url   VARCHAR(500),                   -- Chemin vers l'image PNG du QR
  pdf_url        VARCHAR(500),                   -- Chemin vers le PDF du ticket
  status         ENUM(
                   'valid',
                   'used',
                   'cancelled'
                 )            NOT NULL DEFAULT 'valid',
  generated_by   UUID         NOT NULL REFERENCES users(id),
  generated_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
  "createdAt"    TIMESTAMP    NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMP    NOT NULL DEFAULT NOW()
);
```

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id` | UUID | PK | Identifiant unique |
| `reservation_id` | UUID | FK → reservations | Réservation associée |
| `ticket_number` | VARCHAR(50) | UNIQUE, NOT NULL | Numéro lisible (MIP-XXXXXXXX-YYYYYY) |
| `qr_payload` | TEXT | NOT NULL | Payload JSON signé HMAC-SHA256 |
| `qr_image_url` | VARCHAR(500) | nullable | URL de l'image QR générée |
| `pdf_url` | VARCHAR(500) | nullable | URL du PDF du ticket |
| `status` | ENUM | DEFAULT 'valid' | État du ticket |
| `generated_by` | UUID | FK → users | Admin ayant généré le ticket |
| `generated_at` | TIMESTAMP | DEFAULT now | Date de génération |

---

## 7. `action_logs` — Journal des actions sur les réservations

```sql
CREATE TABLE action_logs (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID         NOT NULL REFERENCES users(id),
  reservation_id UUID         REFERENCES reservations(id),
  action_type    VARCHAR(100) NOT NULL,
  description    TEXT,
  meta           JSONB        DEFAULT '{}',
  "createdAt"    TIMESTAMP    NOT NULL DEFAULT NOW()
);
```

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id` | UUID | PK | Identifiant unique |
| `user_id` | UUID | FK → users | Utilisateur ayant effectué l'action |
| `reservation_id` | UUID | FK → reservations, nullable | Réservation concernée |
| `action_type` | VARCHAR(100) | NOT NULL | Type d'action (ex: `payment.add`) |
| `description` | TEXT | nullable | Description textuelle |
| `meta` | JSONB | DEFAULT `{}` | Données additionnelles |

---

## 8. `activity_logs` — Journal d'audit technique

```sql
CREATE TABLE activity_logs (
  id          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID  NOT NULL REFERENCES users(id),
  permission  VARCHAR(100),
  entity_type ENUM(
                'reservation',
                'pack',
                'payment',
                'ticket',
                'scan',
                'participant',
                'user'
              )    NOT NULL,
  entity_id   UUID,
  action      ENUM('create','read','update','delete','export','validate') NOT NULL,
  description TEXT,
  changes     JSONB    DEFAULT '{}',
  status      ENUM('success','failed') DEFAULT 'success',
  ip_address  VARCHAR(45),
  user_agent  VARCHAR(500),
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
```

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id` | UUID | PK | Identifiant unique |
| `user_id` | UUID | FK → users | Utilisateur ou `null` (public) |
| `permission` | VARCHAR(100) | nullable | Permission utilisée |
| `entity_type` | ENUM | NOT NULL | Type d'entité concernée |
| `entity_id` | UUID | nullable | ID de l'entité |
| `action` | ENUM | NOT NULL | Action effectuée |
| `description` | TEXT | nullable | Description humaine |
| `changes` | JSONB | DEFAULT `{}` | Diff avant/après |
| `status` | ENUM | DEFAULT 'success' | Résultat |
| `ip_address` | VARCHAR(45) | nullable | IP du client |
| `user_agent` | VARCHAR(500) | nullable | User-Agent |
| `created_at` | TIMESTAMP | NOT NULL | Date de l'action |

---

## 9. `daily_visits` — Statistiques de visite quotidiennes

```sql
CREATE TABLE daily_visits (
  id             UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_date     DATE     UNIQUE NOT NULL,
  total_visits   INTEGER  NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 10. `visits` — Visites individuelles

```sql
CREATE TABLE visits (
  id           UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id   VARCHAR(64),   -- Hash anonyme de l'IP
  ip_hash      VARCHAR(64),
  user_agent   TEXT,
  referer      VARCHAR(500),
  page         VARCHAR(255),
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 11. `unique_visitors` — Visiteurs uniques

```sql
CREATE TABLE unique_visitors (
  id           UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_hash VARCHAR(64) UNIQUE NOT NULL,
  first_seen   TIMESTAMP NOT NULL DEFAULT NOW(),
  last_seen    TIMESTAMP NOT NULL DEFAULT NOW(),
  visit_count  INTEGER   NOT NULL DEFAULT 1
);
```

---

## Relations complètes

```
users
  ├── hasMany payments (created_by)
  ├── hasMany tickets (generated_by)
  ├── hasMany action_logs (user_id)
  └── hasMany activity_logs (user_id)

packs
  └── hasMany reservations (pack_id)

reservations
  ├── belongsTo packs (pack_id)
  ├── hasMany participants (reservation_id)
  ├── hasMany payments (reservation_id)
  ├── hasMany tickets (reservation_id)
  └── hasMany action_logs (reservation_id)

participants
  ├── belongsTo reservations (reservation_id)
  └── belongsTo tickets (ticket_id) [nullable]

payments
  ├── belongsTo reservations (reservation_id)
  └── belongsTo users (created_by)

tickets
  ├── belongsTo reservations (reservation_id)
  ├── belongsTo users (generated_by)
  └── hasMany participants (ticket_id)

action_logs
  ├── belongsTo users (user_id)
  └── belongsTo reservations (reservation_id)

activity_logs
  └── belongsTo users (user_id)
```

---

## Index recommandés

```sql
-- Recherche rapide par téléphone
CREATE INDEX idx_reservations_phone ON reservations(payeur_phone);

-- Filtrage par statut
CREATE INDEX idx_reservations_status ON reservations(status);

-- Numéro de ticket unique (déjà UNIQUE)
-- CREATE UNIQUE INDEX idx_tickets_number ON tickets(ticket_number);

-- Logs d'audit par date
CREATE INDEX idx_activity_logs_date ON activity_logs(created_at DESC);

-- Logs d'audit par utilisateur
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);

-- Participants par ticket
CREATE INDEX idx_participants_ticket ON participants(ticket_id);

-- Statistiques par date
CREATE UNIQUE INDEX idx_daily_visits_date ON daily_visits(visit_date);
```

---

## Notes de déploiement

- **Encodage** : UTF-8 (`client_encoding = 'UTF8'`)
- **UUID** : Extension `pgcrypto` ou `uuid-ossp` pour `gen_random_uuid()`
- **JSONB** : Opérateurs `@>`, `->`, `->>` pour requêter les métadonnées
- **Migrations** : Via Sequelize CLI (`npm run migrate`)

---

*Schéma généré le 24 mars 2026 — Movie in the Park*
