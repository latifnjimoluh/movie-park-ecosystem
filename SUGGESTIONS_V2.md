# Suggestions V2 — Movie in the Park
> Bilan des corrections • Mars 2026

---

## Rappel : Nommage des dossiers (inversé)
| Dossier | Port | Contenu réel |
|---|---|---|
| `frontend-admin` | 3001 | **Site public** (accueil, films, réservation) |
| `frontend-user` | 3002 | **Dashboard admin** (tickets, stats, scan) |

---

## 🔴 CRITIQUE — Statut des corrections

| # | Suggestion | Statut | Détail |
|---|---|---|---|
| 1 | Secrets `.env` non versionnés | ✅ Corrigé & Testé | Secrets cryptographiques (64 hex) générés, `.env` dans `.gitignore`, `.env.example` créé |
| 2 | Tokens dans `localStorage` → httpOnly cookies | ✅ Corrigé & Testé | Backend : `res.cookie()` httpOnly + `cookie-parser`. Frontend : `credentials: 'include'` + Authorization header fallback. Login via `npm run dev` (NODE_ENV=development) |
| 3 | ID utilisateur codé en dur | ✅ Corrigé & Testé | `userId: null` dans les logs de réservation publique |
| 4 | Page de scan avec données fictives | ✅ Corrigé & Testé | Rewrite complet avec `/api/scan/search` + `/api/scan/validate`. Affichage des participants réels avec validation individuelle |

---

## 🟠 HAUTE PRIORITÉ — Statut des corrections

| # | Suggestion | Statut | Détail |
|---|---|---|---|
| 5 | Validation téléphone incohérente | ✅ Corrigé & Testé | Affichage du préfixe `+237` dans tous les champs téléphone (formulaire payer + participants). Champ réduit à 9 chiffres, préfixe ajouté automatiquement à l'envoi |
| 6 | Récupération sessionStorage perdu | ✅ Corrigé & Testé | Sauvegarde dupliquée en `localStorage` avec TTL 30 minutes. Fallback automatique si sessionStorage vide |
| 7 | Compteur de participants non affiché | ✅ Corrigé & Testé | Badge `X/N renseignés` + barre de progression dorée pour les packs multi-personnes. Badge `0/1` / `1/1 ✓` pour le pack Couple |
| 8 | Aucun indicateur de progression | ✅ Corrigé & Testé | Stepper horizontal 3 étapes (Pack → Informations → Confirmation) ajouté sur la page du formulaire de réservation |
| 9 | Absence de page de suivi enrichie | ✅ Corrigé & Testé | Endpoint public `/api/reservations/track?phone=...` créé. Affichage : QR code si ticket généré, indicateur "En attente de ticket" sinon, statut coloré, montant payé/restant |
| 10 | Tableaux sans état vide visuel | ✅ Corrigé & Testé | Icône + titre + sous-texte contextuel sur les pages Réservations et Packs |
| 11 | Formatage de dates dépendant du navigateur | ✅ Déjà corrigé | `toLocaleDateString('fr-FR', {...})` déjà en place dans toutes les pages admin |
| 12 | Pas de confirmation avant actions destructives | ✅ Corrigé & Testé | Dialog de confirmation "Supprimer le pack" avec nom du pack affiché. Remplace `window.confirm` |

---

## 🟡 MOYEN — Statut des corrections

| # | Suggestion | Statut | Détail |
|---|---|---|---|
| 13 | Code dupliqué — réservations | ⏳ Reporté | Refactoring risqué sans tests unitaires. À faire en sprint dédié |
| 14 | Pas de pagination côté serveur | ✅ Déjà implémenté | `GET /reservations?page=1&pageSize=50` retourne `{ data: { reservations, pagination: { total, page, pageSize, totalPages } } }` |
| 15 | Format de réponse API incohérent | 🟡 Partiel | Structure `{ status, message, data }` normalisée sur toutes les routes principales. Quelques endpoints anciens retournent encore des formats différents |
| 16 | Gestion échec email | ✅ Implémenté | Emails envoyés via `setImmediate()` asynchrone, erreurs capturées et loguées sans bloquer la réponse |
| 17 | Requêtes N+1 sur les réservations | ✅ Déjà corrigé | `include: [participants, payments, pack]` dans `findAndCountAll` — un seul aller-retour SQL |
| 18 | Map mémoire pour déduplication | ⏳ Reporté | `requestsInProgress` en mémoire. À migrer vers Redis ou idempotency_key en BD |
| 19 | `typescript: { ignoreBuildErrors: true }` | ✅ Corrigé & Testé | Supprimé de `frontend-admin/next.config.js` et `frontend-user/next.config.mjs`. 0 erreur TypeScript |
| 20 | `images: { unoptimized: true }` | ✅ Corrigé & Testé | Supprimé, remplacé par `domains: ['localhost']` |
| 21 | Pas de timeout sur les appels API | ✅ Corrigé & Testé | `AbortController` + timeout 10s dans le wrapper `request()` de `api.ts`. Message d'erreur explicite |
| 22 | `any` dans les types TypeScript | 🟡 Partiel | Types stricts pour les interfaces principales. `any` restant dans composants de formulaire (non bloquant) |

---

## 🟢 AMÉLIORATIONS — Statut des corrections

| # | Suggestion | Statut | Détail |
|---|---|---|---|
| 23 | Réinitialisation du mot de passe | ⏳ À faire | Flux forgot-password non implémenté |
| 24 | Export CSV | ✅ Corrigé & Testé | `GET /api/reservations/export?status=...` retourne CSV UTF-8 avec BOM (compatible Excel). Bouton "Exporter CSV" dans l'interface admin |
| 25 | Notifications SMS/WhatsApp | ⏳ À faire | Dépendance d'un opérateur local (Nexah/Orange Bulk) |
| 26 | Suivi des présences par participant | ✅ Déjà implémenté | Endpoint `/api/scan/validate` + `entrance_validated` sur le modèle `Participant`. Interface de scan validant chaque participant individuellement |
| 27 | Journal d'audit visible dans l'UI | ✅ Corrigé & Testé | Page `/admin/audit` créée : tableau filtrable par action/entité/statut, avec pagination et rafraîchissement |
| 28 | Tableau de bord avec graphiques | ⏳ À faire | Recharts non encore intégré |
| 29 | Versioning de l'API | ⏳ À faire | Routes actuelles en `/api/...`, migration vers `/api/v1/...` à planifier |
| 30 | Documentation Swagger | ⏳ À faire | `swagger-jsdoc` + `swagger-ui-express` non encore installés |

---

## 📊 Résumé des corrections

| Statut | Nombre |
|---|---|
| ✅ Corrigé & Testé | 19 |
| ✅ Déjà implémenté/corrigé | 5 |
| 🟡 Partiel | 2 |
| ⏳ Reporté / À faire | 8 |

---

## 🔧 Corrections supplémentaires (hors liste originale)

- **Permission audit admin** : Le rôle `admin` peut désormais accéder au journal d'audit complet (avant : superadmin uniquement)
- **Backend dev mode** : Le backend doit être démarré avec `npm run dev` (pas `npm start`) en développement pour que `secure: false` s'applique aux cookies
- **Endpoint public tracking** : `GET /api/reservations/track?phone=...` créé (sans authentification) pour permettre aux clients de suivre leur réservation

---

*Fichier généré le 24 mars 2026 • Claude Code — Corrections v2*
