#  Cloner le projet

git clone https://github.com/elaboudibrahim/todoList.git
## Accéder au dossier backend
cd  toDoList-core
composer install

## Spec de la BDD
dans le fcihier .env

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=todolist
DB_USERNAME=root
DB_PASSWORD=votre_password
## Générer la clé d'application
php artisan key:generate
## Configurer JWT
php artisan jwt:secret
## Migrer la base de données
php artisan migrate
## Démarrer le serveur Laravel
php artisan serve

## #############################################################################################
## Configuration Frontend

cd toDoList-ui

## Installer les dépendances Node.js
npm install

## Démarrer le serveur de développement
npm run dev

## Tester l'application
Allez sur http://localhost:5173
Cliquez sur "S'inscrire"
Remplissez le formulaire
Vous serez automatiquement connecté
