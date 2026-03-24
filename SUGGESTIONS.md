# Suggestions d'amélioration — Movie in the Park
> Analyse complète du projet • Mars 2026

---

## Rappel : Nommage des dossiers (inversé)
| Dossier | Port | Contenu réel |
|---|---|---|
| `frontend-admin` | 3001 | **Site public** (accueil, films, réservation) |
| `frontend-user` | 3002 | **Dashboard admin** (tickets, stats, scan) |

---

## 🔴 CRITIQUE — À corriger avant tout déploiement

### Sécurité

**1. Secrets exposés dans le `.env`**
Le fichier `backend/.env` contient le mot de passe PostgreSQL, les secrets JWT et QR en clair.
Ces valeurs sont prévisibles (`movie_in_the_park_jwt_secret_2026`) et ne doivent jamais être versionnées.
```
Solution : Ajouter .env au .gitignore, utiliser des secrets aléatoires (openssl rand -hex 32)
```

**2. Tokens stockés dans `localStorage`**
`frontend-user/lib/api.ts` stocke `admin_token` et `admin_refresh_token` dans le localStorage —
vulnérable au vol via XSS. Les cookies `httpOnly` empêchent cela nativement.
```
Solution : Migrer vers des cookies httpOnly Set-Cookie côté backend
```

**3. ID utilisateur codé en dur dans les réservations**
Dans `backend/src/routes/reservationRoutes.js`, le created_by des paiements publics pointe vers
un UUID fixe `"02ae193b-..."` au lieu d'un utilisateur système ou d'un rôle réservé.
```
Solution : Créer un utilisateur système "public" avec rôle réservé dans la base
```

**4. Page de scan avec données fictives**
`frontend-user/app/admin/scan/page.tsx` utilise `mockTicketData` codé en dur.
Le scan ne valide aucun ticket réel.
```
Solution : Brancher sur l'API /api/scan/validate + intégrer une lib de lecture QR caméra (html5-qrcode)
```

---

## 🟠 HAUTE PRIORITÉ — Expérience utilisateur

### Site public (`frontend-admin` / port 3001)

**5. Validation du numéro de téléphone incohérente**
Le formulaire demande 9 chiffres, mais le backend ajoute le préfixe 237 (total = 12 chiffres).
L'utilisateur ne comprend pas le format attendu.
```
Solution : Afficher un champ avec préfixe +237 visible, accepter 9 chiffres, envoyer 237XXXXXXXXX
```

**6. Pas de récupération si sessionStorage perdu**
Si l'utilisateur ferme et rouvre l'onglet entre les étapes de réservation, toutes les données sont perdues.
```
Solution : Persister l'état en localStorage (avec TTL 30 min) ou dans les query params de l'URL
```

**7. Compteur de participants non affiché**
Le formulaire ne montre pas "2/5 participants renseignés". L'utilisateur doit compter manuellement.
```
Solution : Ajouter une progress bar ou un badge "X / N" au-dessus des champs participants
```

**8. Aucun indicateur de progression dans le tunnel de réservation**
Le flux Pack → Formulaire → Résumé → Confirmation n'a pas de stepper visible.
L'utilisateur ne sait pas où il en est.
```
Solution : Ajouter un composant stepper horizontal en haut du tunnel (étape 1/3, 2/3, 3/3)
```

**9. Absence de page de suivi de réservation fonctionnelle**
La page `/reservation/suivi` existe mais l'expérience est minimale.
Pas de lien vers le QR code, pas d'état en temps réel.
```
Solution : Enrichir avec affichage du QR code, statut coloré, historique des paiements
```

### Dashboard admin (`frontend-user` / port 3002)

**10. Tableaux sans état vide visuel**
"Aucune réservation trouvée" s'affiche en texte brut. Peu engageant, peu clair.
```
Solution : Illustrer avec une icône et un texte d'action ("Créer la première réservation")
```

**11. Formatage de dates dépendant du navigateur**
`toLocaleDateString()` sans paramètres affiche différemment selon la langue du système.
```
Solution : Utiliser toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric' })
```

**12. Pas de confirmation avant actions destructives**
Annuler une réservation ou supprimer un pack ne demande aucune confirmation.
```
Solution : Ajouter un Dialog de confirmation avec résumé de l'action ("Annuler la réservation de Jean Dupont ?")
```

---

## 🟡 MOYEN — Code & Architecture

### Backend

**13. Code dupliqué — réservations publiques vs admin**
Les routes `POST /reservations` et `POST /reservations/public` dans `reservationRoutes.js`
partagent 95% du même code (130+ lignes répétées).
```
Solution : Extraire une fonction createReservation(data, isPublic) dans le controller
```

**14. Pas de pagination côté serveur sur les listes**
La route `/api/reservations` utilise `limit: 1000` par défaut.
Avec beaucoup de données, cela surchargera le serveur et le navigateur.
```
Solution : Forcer limit/offset côté backend, retourner { data, pagination: { total, page, pageSize } }
```

**15. Format de réponse API incohérent**
Certains endpoints retournent `{ data: { reservations: [] } }`, d'autres `{ data: [] }`.
Le frontend doit gérer les deux cas partout.
```
Solution : Standardiser : toujours { status, message, data, pagination? }
```

**16. Transactions sans gestion de l'échec email**
Si l'envoi d'email échoue après une réservation confirmée, l'erreur est silencieuse.
L'utilisateur pense avoir reçu un email mais non.
```
Solution : File de messages (table email_queue) avec retry automatique, ou service externe (SendGrid)
```

**17. Requêtes N+1 sur les réservations**
Chaque réservation charge séparément : pack, paiements, participants.
Sur 100 réservations = 300 requêtes SQL.
```
Solution : Utiliser Sequelize include avec eager loading dans la query principale
```

**18. Map mémoire pour la déduplication de requêtes**
`requestsInProgress` dans reservationRoutes est une Map en mémoire.
Elle fuite sur le long terme et ne résiste pas aux redémarrages.
```
Solution : Utiliser un identifiant idempotency_key dans le body, validé en base de données
```

### Frontend

**19. `typescript: { ignoreBuildErrors: true }` dans next.config.js**
Les erreurs TypeScript sont silencées — des bugs critiques passent en production sans alerte.
```
Solution : Supprimer cette option et corriger les erreurs une par une
```

**20. `images: { unoptimized: true }` dans next.config.js (site public)**
Désactive l'optimisation d'image de Next.js. Les posters de films chargent en pleine résolution.
```
Solution : Supprimer l'option et utiliser le composant <Image> de next/image
```

**21. Pas de timeout sur les appels API**
Un appel bloqué peut suspendre l'UI indéfiniment.
```
Solution : Wrapper fetch avec AbortController et un timeout de 10s
```

**22. `any` utilisé comme type dans les composants**
Plusieurs interfaces de props utilisent `any` au lieu de types précis.
Rend le refactoring dangereux.
```
Solution : Définir des interfaces TypeScript partagées dans un fichier types/ commun (front + back)
```

---

## 🟢 AMÉLIORATIONS — Fonctionnalités manquantes

**23. Réinitialisation du mot de passe**
Aucun flux "Mot de passe oublié" n'existe pour les admins.
```
Ajouter : /admin/forgot-password → envoi d'un lien tokenisé → formulaire de reset
```

**24. Export CSV/Excel**
Le dashboard admin n'a pas de bouton d'export fonctionnel (présence visuelle seulement).
```
Ajouter : Export CSV des réservations avec filtres de date appliqués
```

**25. Notifications SMS/WhatsApp**
Au Cameroun, SMS et WhatsApp sont plus fiables que l'email pour les confirmations.
```
Ajouter : Intégration Twilio ou un opérateur local (Nexah, Orange BULK SMS)
```

**26. Suivi des présences par participant**
Actuellement, on sait si un ticket est "utilisé" mais pas lequel des participants du groupe est entré.
```
Ajouter : Endpoint PATCH /participants/:id/validate + UI scan par participant
```

**27. Journal d'audit visible dans l'UI**
Les logs existent en base (`AuditLog`) mais il n'y a aucune page pour les consulter.
```
Ajouter : Page /admin/audit avec filtres par action, utilisateur, date
```

**28. Tableau de bord avec graphiques**
Les stats affichent des chiffres mais aucun graphique de tendance.
```
Ajouter : Graphique réservations/jour sur 30 jours (Recharts ou Chart.js)
```

**29. Versioning de l'API**
L'API n'est pas versionnée. Une modification casse tous les clients.
```
Ajouter : Préfixe /api/v1/ dans toutes les routes
```

**30. Documentation API (Swagger)**
Aucune documentation auto-générée.
```
Ajouter : swagger-jsdoc + swagger-ui-express sur /api/docs
```

---

## 📋 Récapitulatif par priorité

| # | Sujet | Priorité | Effort |
|---|---|---|---|
| 1 | Secrets .env non versionnés | 🔴 Critique | 1h |
| 2 | Tokens dans localStorage → httpOnly cookies | 🔴 Critique | 1 jour |
| 3 | ID utilisateur codé en dur | 🔴 Critique | 2h |
| 4 | Scan QR fonctionnel | 🔴 Critique | 2 jours |
| 5 | Validation téléphone cohérente | 🟠 Haute | 2h |
| 6 | Récupération sessionStorage perdu | 🟠 Haute | 4h |
| 7 | Compteur participants | 🟠 Haute | 1h |
| 8 | Stepper tunnel de réservation | 🟠 Haute | 4h |
| 9 | Page suivi enrichie | 🟠 Haute | 1 jour |
| 10 | État vide visuel dans les tableaux | 🟠 Haute | 2h |
| 11 | Formatage dates explicite | 🟠 Haute | 30min |
| 12 | Confirmation actions destructives | 🟠 Haute | 2h |
| 13 | Déduplication code réservations | 🟡 Moyen | 4h |
| 14 | Pagination côté serveur | 🟡 Moyen | 1 jour |
| 15 | Normalisation format réponse API | 🟡 Moyen | 1 jour |
| 16 | Gestion échec email | 🟡 Moyen | 4h |
| 17 | Eager loading Sequelize | 🟡 Moyen | 4h |
| 18 | Idempotency key en base | 🟡 Moyen | 4h |
| 19 | Supprimer ignoreBuildErrors | 🟡 Moyen | 2h |
| 20 | Optimisation images Next.js | 🟡 Moyen | 2h |
| 21 | Timeout fetch API | 🟡 Moyen | 1h |
| 22 | Types TypeScript stricts | 🟡 Moyen | 2 jours |
| 23 | Reset mot de passe admin | 🟢 Futur | 1 jour |
| 24 | Export CSV | 🟢 Futur | 4h |
| 25 | SMS/WhatsApp | 🟢 Futur | 2 jours |
| 26 | Présences par participant | 🟢 Futur | 1 jour |
| 27 | Journal audit UI | 🟢 Futur | 1 jour |
| 28 | Graphiques dashboard | 🟢 Futur | 1 jour |
| 29 | Versioning API v1 | 🟢 Futur | 4h |
| 30 | Documentation Swagger | 🟢 Futur | 1 jour |

---

*Fichier généré le 24 mars 2026 • Analyse Claude Code*
