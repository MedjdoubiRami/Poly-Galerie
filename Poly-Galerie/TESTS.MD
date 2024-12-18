# Jest et tests unitaires

La bibliothèque <a href="https://jestjs.io/">Jest</a> est utilisée dans ce travail pratique. La librairie <a href="https://github.com/ladjs/supertest#readme">Supertest</a> sera également utilisée pour les tests des gestionnaires de routes HTTP de votre serveur.

Pour exécuter les tests unitaires de jest, vous pouvez utiliser la commande `npm run test` qui va exécuter vos tests dans le terminal.

## Tests du serveur avec Jest

Les tests sont une partie importante du développement d'applications. Ils permettent de valider le bon fonctionnement de votre application et de détecter les bogues. Dans ce travail pratique, vous allez implémenter quelques tests unitaires pour votre serveur afin de valider le bon fonctionnement de celui-ci.  

On vous fournit quelques fichiers de tests unitaires dans le dossier `tests` : Ces fichiers de tests implémentent des tests unitaires pour les différentes routes de votre serveur. Ceux-ci couvrent la plupart des cas d'utilisation de votre serveur.

## Tests des gestionnaires

Les tests unitaires dans [authManager.test.js](./server/tests/authManager.test.js), [galleryManager.test.js](./server/tests/galleryManager.test.js) et [fileManager.test.js](./server/tests/fileManager.test.js) vous sont fournis à titre d'exemples pour bien comprendre le fonctionnement du système.

## Tests de routes

Les tests dans [gallery.test.js](./server/tests/gallery.test.js) vous sont fournis à titre d'exemple pour bien comprendre le fonctionnement des outils à utiliser.

Vous devez compléter la vérification et les tests des gestionnaires des requêtes pour la route `/auth` et la classe `AuthRouter` dans le fichier [auth.test.js](./server/tests/auth.test.js). Deux tests vous sont fournis à titre d'exemple pour vous aider.

**Important**: Notez que les tests assument l'utilisation de certaines méthodes HTTP pour la gestion des requêtes. Si votre implémentation diffère de cette hypothèse, vous devez modifier le test pour correspondre à votre implémentation.

Vous pouvez ajouter d'autres tests unitaires si vous le désirez. Vous serez évalués sur la pertinence et qualité de vos tests. Tous les tests implémentés doivent passer lors de la remise, sans quoi vous serez pénalisés sur la qualité de vos tests.

## Test de bout en bout

Le fichier [e2e.test.js](./server/tests/e2e.test.js) contient une suite de tests de bout en bout pour valider le bon fonctionnement de votre serveur à travers une séquence de plusieurs actions :
1. Créer un compte et récupérer le jeton d'authentification
2. Téléverser une image en tant qu'utilisateur connecté
3. Récupérer la liste des images avec la nouvelle image créée
4. Changer l'état de l'image et valider qu'elle est maintenant privée
5. Se déconnecter et tenter de récupérer l'image (ne devrait pas être possible)
6. Tenter de supprimer l'image après s'être déconnecté (ne devrait pas être possible)

## Tests fonctionnels

Contrairement aux derniers TPs, les tests fonctionnels ne couvrent pas l'entièreté des fonctionnalités de votre application. Il est donc important de valider le fonctionnement de celles-ci tout au long de votre processus de développement. Pour ce faire, vous pouvez utiliser les outils de développement de votre navigateur web pour vous aider à déboguer votre code JS (raccourci <kbd>F12</kbd>). Vous pouvez également utiliser [Postman](https://www.postman.com/) pour tester vos requêtes ou bien [ThunderClient](https://www.thunderclient.com/).