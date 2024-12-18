# Correction

Vous serez corrigés sur le respect des exigences fonctionnelles de l’énoncé ainsi que la qualité du code JS.

Quelques astuces :

- Lisez **attentivement** l'énoncé, le code fourni et les commentaires dans le code.
- Utilisez les outils de développement de votre navigateur web pour vous aider à déboguer votre code JS (raccourci <kbd>F12</kbd>).
- Respectez la convention de codage établie par _ESLint_. Utilisez la commande `npm run lint` pour valider cet aspect.
- Consultez la documentation de [Express](https://expressjs.com/fr/api.html)
- On vous conseille d'utiliser [Postman](https://www.postman.com/) ou bien [ThunderClient](https://www.thunderclient.com/) pour tester votre serveur.
- Exécutez les tests fournis souvent afin de valider votre code.

## Grille de correction

| **Exigences**                            | **Note**  | **Points** |
| ---------------------------------------- | :-------: | :--------: |
| Complétion de `server.js`                |     1     |     1      |
| Complétion du routeur `auth.js`          |     2     |     2      |
| Complétion du routeur `gallery.js`       |     2     |     2      |
| Complétion de `fileManager.js`           |     1     |     1      |
| Complétion de `authManager.js`           |    1.5    |     2      |
| Complétion de `galleryManager.js`        |    1.5    |     2      |
| Complétion des tests dans `auth.test.js` |     1     |     1      |
|                                          |           |            |
| Complétion de `connect.js`               |   1.75    |     2      |
| Complétion de `gallery.js`               |   1.75    |     2      |
| Complétion de `image.js`                 |     1     |     2      |
| Complétion de `header.js`                |     2     |     2      |
|                                          |           |            |
| Qualité du code JS                       |   0.25    |     1      |
|                                          |           |            |
| Bonus                                    |     0     |     1      |
| **Total**                                | **16.75** |   **20**   |

**Note** : Des points peuvent être retirés pour une mauvaise sémantique du protocole HTTP. Des points peuvent être retirés pour des problèmes de qualité dans le code.

**Note** : la note maximale pour ce travail ne peut pas dépasser 20/20.

auth manager:

- Create a new user fail

gallery manager:

- Retrieve all images and see the created image fail

connect.js:

- token doit être récupéré du header `X-Auth-Token` et non du body avec `response.json()`

gallery.js:

- L'erreur lors du téléchargement d'une image quand on est pas connecté n'est pas représentative

image.js:

- Les images ne sont pas trouvées quand on est pas connecté

Qualité:

- Erreur lint (6 site web, 11 server) -0.75
