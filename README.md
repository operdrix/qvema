# QVEMA - API
Par Olivier PERDRIX M2 IW

## Installation

### Prérequis
- Node.js (v18 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn

### Configuration

1. Cloner le projet
```bash
git clone https://github.com/operdrix/qvema.git
cd qvema
```

2. Installer les dépendances
```bash
npm install
# ou
yarn install
```

3. Configuration de l'environnement
```bash
# Copier le fichier .env.example
cp .env.example .env

# Modifier les variables d'environnement dans .env
DB_HOST=localhost
DB_PORT=33061
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=qvema

PORT=3001

JWT_SECRET=votre_secret_jwt
JWT_EXPIRATION=3600
```

1. Créer la base de données ou utiliser le docker compose fourni

2. Lancer l'application
```bash
# Développement
npm run start:dev
# ou
yarn start:dev

# Production
npm run build
npm run start:prod
# ou
yarn build
yarn start:prod
```

L'API sera accessible à l'adresse : `http://localhost:3001`

## Données de test (fixtures)

Pour initialiser la base de données avec des données de test réalistes (utilisateurs, projets, intérêts, investissements), utilisez le système de fixtures fourni.

### Charger les fixtures

Assurez-vous que votre base de données est accessible et que les variables d'environnement (.env) sont correctement configurées.

Lancez simplement :

```bash
npm run load-fixtures
```

Ce script va :
- Créer des utilisateurs (admin, entrepreneurs, investisseurs)
- Créer des centres d'intérêt
- Créer des projets associés
- Créer des investissements variés

Vous pouvez relancer ce script à tout moment pour réinitialiser les données de test.

## Autorisations

### Routes d'authentification

| Route | Méthode | Accès | Body | Retour |
|-------|---------|-------|------|---------|
| `/auth/register` | POST | Public | ```json { "firstName": "string", "lastName": "string", "email": "string", "password": "string", "role": "entrepreneur" \| "investor" } ``` | ```json { "access_token": "string" } ``` |
| `/auth/login` | POST | Public | ```json { "email": "string", "password": "string" } ``` | ```json { "access_token": "string" } ``` |

Notes :
- Le rôle par défaut est `entrepreneur` si non spécifié
- Seuls les rôles `entrepreneur` et `investor` sont autorisés lors de l'inscription
- Le token JWT contient l'email, l'id et le rôle de l'utilisateur

### Routes utilisateurs

| Route | Méthode | Accès | Body | Retour |
|-------|---------|-------|------|---------|
| `/users` | GET | Admin | - | Liste des utilisateurs |
| `/users/profile` | GET | Authentifié | - | Profil de l'utilisateur connecté |
| `/users/:id` | GET | Admin | - | Détails d'un utilisateur |
| `/users/email/:email` | GET | Admin | - | Utilisateur par email |
| `/users` | POST | Admin | ```json { "firstName": "string", "lastName": "string", "email": "string", "password": "string", "role": "entrepreneur" \| "investor" \| "admin" } ``` | Utilisateur créé |
| `/users/:id` | PATCH | Self ou Admin | ```json { "firstName": "string", "lastName": "string", "email": "string", "password": "string", "role": "entrepreneur" \| "investor" \| "admin" } ``` | Utilisateur mis à jour |
| `/users/:id` | DELETE | Admin | - | ```json { "message": "Utilisateur supprimé avec succès" } ``` |
| `/users/interests` | POST | Authentifié | ```json { "interestIds": ["uuid"] } ``` | Utilisateur avec ses intérêts |
| `/users/interests` | GET | Authentifié | - | Liste des intérêts de l'utilisateur |

Notes :
- Toutes les routes sont protégées par JWT
- Le mot de passe est toujours exclu des réponses
- Les validations de données sont effectuées sur tous les champs
- Les rôles possibles sont : `entrepreneur`, `investor`, `admin`

### Routes projets

| Route | Méthode | Accès | Body | Retour |
|-------|---------|-------|------|---------|
| `/projects` | GET | Authentifié | - | Liste des projets |
| `/projects/my-projects` | GET | Authentifié | - | Projets de l'utilisateur connecté |
| `/projects/recommended` | GET | Authentifié | - | Projets recommandés selon les intérêts |
| `/projects/:id` | GET | Authentifié | - | Détails d'un projet |
| `/projects` | POST | Entrepreneur | ```json { "title": "string", "description": "string", "budget": "number", "category": "string" } ``` | Projet créé |
| `/projects/:id` | PATCH | Entrepreneur (créateur) | ```json { "title": "string", "description": "string", "budget": "number", "category": "string" } ``` | Projet mis à jour |
| `/projects/:id` | DELETE | Admin ou Entrepreneur (créateur) | - | ```json { "message": "Projet supprimé avec succès" } ``` |

Notes :
- Toutes les routes sont protégées par JWT
- Seuls les entrepreneurs peuvent créer et modifier des projets
- Un entrepreneur ne peut modifier que ses propres projets
- La suppression est possible par l'admin ou le créateur du projet

### Routes centres d'intérêt

| Route | Méthode | Accès | Body | Retour |
|-------|---------|-------|------|---------|
| `/interests` | GET | Public | - | Liste des centres d'intérêt |
| `/interests/:id` | GET | Public | - | Détails d'un centre d'intérêt |
| `/interests` | POST | Admin | ```json { "name": "string" } ``` | Centre d'intérêt créé |
| `/interests/:id` | PATCH | Admin | ```json { "name": "string" } ``` | Centre d'intérêt mis à jour |
| `/interests/:id` | DELETE | Admin | - | ```json { "message": "Centre d'intérêt supprimé avec succès" } ``` |

Notes :
- Les routes de consultation sont publiques
- Seul l'admin peut créer, modifier et supprimer des centres d'intérêt
- Le nom doit être unique

### Routes investissements

| Route | Méthode | Accès | Body | Retour |
|-------|---------|-------|------|---------|
| `/investments` | GET | Admin | - | Liste des investissements |
| `/investments/project/:id` | GET | Authentifié | - | Investissements d'un projet |
| `/investments/:id` | GET | Self ou Admin | - | Détails d'un investissement |
| `/investments` | POST | Investor | ```json { "projectId": "uuid", "amount": "number" } ``` | Investissement créé |
| `/investments/:id` | PATCH | Self ou Admin | ```json { "amount": "number" } ``` | Investissement mis à jour |
| `/investments/:id` | DELETE | Self ou Admin | - | ```json { "message": "Investissement supprimé avec succès" } ``` |

Notes :
- Toutes les routes sont protégées par JWT
- Seuls les investisseurs peuvent créer des investissements
- Un investisseur ne peut voir/modifier/supprimer que ses propres investissements
- L'admin peut voir/modifier/supprimer tous les investissements
- La relation project est exclue des réponses de la route `/investments/project/:id`
