## Lettria test

Développer une application web.

Elle devra avoir:
-  /login: Une page de connexion
-  /signup: Une page de création de compte (identifiant/mot de passe)
- /home: Une page accessible qu’une fois connecté, qui permettra de sauvegarder sur l’utilisateur, et via des <input type=« text » /> autant de champs texte souhaité.

Le tout devra être transmis avec un dossier racine qui comportera:

- Un dossier api qui contiendra l’api
- Un dossier app qui contiendra l’app web

## Pour utiliser l'application, vous devez:

* `git clone`
* `npm install`
* Créer un fichier à la racine, `.env`
* Ajouter dans le `.env` l'accès à la DB (donné par mail).
* Lancer un server back avec la commande `node api/index.js`
* Lancer un server front avec la commande `npm run start` et choisir un autre port (hors 3000).

