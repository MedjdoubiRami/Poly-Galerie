const { HTTP_STATUS } = require("../utils/http");
const express = require("express");

class AuthRouter {

    constructor(authManager) {
        this.authManager = authManager;
        this.router = express.Router();
        this.configureRoutes();
    }

    /**
     * Configure les routes HTTP pour la gestion de l'authentification
     * 
     * TODO : Compléter le code des 3 routes HTTP pour la création, la connexion et la déconnexion d'un utilisateur
     * Note : vous pouvez décider des méthodes HTTP à utiliser pour chaque route. Vous devez gérer les différents codes de retour HTTP
     * Astuce : consultez le fichier server/utils/http.js pour les codes de retour HTTP
     */
    configureRoutes() {

        this.router.post('/', async (req, res) => {
            const { username, password } = req.body;
            // TODO : Valider les informations fournies. Retourner les code de retour HTTP appropriés en fonction de la validation
            if (!username || !password) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Nom d'utilisateur et mot de passe sont requis." });
            }

            const userToken = await this.authManager.createUser({username: username, password: password}); 
            if (userToken == null) {  return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Nom d'utilisateur ou mot de passe incorrect." }); }

            // TODO : Retourner le jeton d'authentification dans l'entête X-Auth-Token
            res.setHeader("X-Auth-Token", userToken);
            return res.status(HTTP_STATUS.CREATED).json(userToken);
        });

        this.router.post('/login', async (req, res) => {
            // TODO : Valider les informations fournies. Retourner les code de retour HTTP appropriés en fonction de la validation
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Nom d'utilisateur et mot de passe sont requis." });
            }

            const userToken = await this.authManager.logInUser(username, password); 
            if (userToken == null) {  return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Nom d'utilisateur ou mot de passe incorrect." }); }

            // TODO : Retourner le jeton d'authentification dans l'entête X-Auth-Token
            res.setHeader("X-Auth-Token", userToken);
            return res.status(HTTP_STATUS.SUCCESS).json(userToken);
        });

        this.router.post('/logout', async (req, res) => {
            const authHeader = req.get('Authorization');
        
            if (!authHeader) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Jeton d'authentification manquant." });
            }

            const userToken = authHeader.split(' ')[1];
        
            const deconnect = await this.authManager.logOffUser(userToken);
            if (!deconnect) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Jeton d'authentification invalide." });
            }
            return res.status(HTTP_STATUS.NO_CONTENT).json({ message: "Déconnexion réussie." });
        });
        

    }
}

module.exports = { AuthRouter };