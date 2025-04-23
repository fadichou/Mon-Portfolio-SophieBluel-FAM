# Portfolio d’architecte - Sophie Bluel

Projet "Sophie Bluel".

## Fonctionnalités

- Affichage dynamique de la galerie de projets
- Filtrage par catégories
- Page de connexion avec authentification
- Mode administrateur complet :
  - Accès à une interface de gestion des projets via une modale
  - Ajout de projet avec formulaire (image, titre, catégorie)
  - Suppression de projets avec mise à jour dynamique du DOM
- Upload sécurisé des fichiers via 'FormData'
- Communication avec une API REST locale

## Lancer le projet

### Front-end :

- Ouvrir le fichier 'index.html' dans un navigateur

### Back-end :

- Lancer le serveur local à l’aide de Node.js ('npm install' puis 'node server.js')

## Structure

- 'FrontEnd/' : fichiers index.html, login.html, style.css, categories.js, login.js
- 'BackEnd/' : serveur API fourni (Express + Swagger) : server.js (fourni par OC)

## Remarque

Les console.log() sont désactivés en production via une variable DEBUG
L’indentation et la syntaxe ont été validées avec Prettier et JSHint
