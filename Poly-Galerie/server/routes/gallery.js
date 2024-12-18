const path = require("path");
const express = require("express");
const { HTTP_STATUS } = require("../utils/http");

class GalleryRouter {

    constructor(galleryManager, authManager) {
        this.galleryManager = galleryManager;
        this.authManager = authManager;
        this.router = express.Router();
        this.configureRoutes();
    }

    /**
     * Valide l'entête d'autorisation pour vérifier la présence du préfixe "Bearer" et retourne le jeton, si présent
     * @param {string} authorization valeur complète de l'entête d'autorisation
     * @returns {string } la valeur du jeton ou la chaîne vide en cas d'entête invalide
     */
    parseBearerToken(authorization) {
        if (!authorization) {
            return null;
        }
        const [type, token] = authorization.split(" ");
        if (type !== "Bearer") {
            return null;
        }
        return token;
    }

    /**
     * Configure les routes HTTP pour la gestion de la galerie d'images
     * 
     * TODO : Compléter le code des routes HTTP pour l'accès, ajout, suppression et modification des images
     * Note : vous pouvez décider des méthodes HTTP à utiliser pour chaque route. Vous devez gérer les différents codes de retour HTTP
     * Astuce : consultez le fichier server/utils/http.js pour les codes de retour HTTP
     */
    configureRoutes() {
        // Sert les fichiers d'images statiques sur le chemin /static
        this.router.use('/static', express.static(path.resolve(__dirname, '../data/images')));

        // TODO : Valider que l'utilisateur est authentifié pour accéder aux images. Retourner le code de retour HTTP approprié en cas d'échec
        // Un accès public est autorisé pour les requêtes GET, mais seulement les images publiques doivent être retournées. 
        // Modifier l'objet req pour indiquer si la requête provient d'un utilisateur authentifié ou non
        this.router.use(async (req, res, next) => {
            const token = this.parseBearerToken(req.headers.authorization);
        
            if (token) {
                try {
                    const user = await this.authManager.validateToken(token);
                    if (user) {
                        req.publicOnly = false; 
                        return next();
                    } else {
                        return res.status(HTTP_STATUS.UNAUTHORIZED).send("Unauthorized");
                    }
                } catch (error) {
                    return res.status(HTTP_STATUS.UNAUTHORIZED).send("Unauthorized");
                }
            }
        
            if (req.method === 'GET') {
                req.publicOnly = true;
                return next();
            } else {
                return res.status(HTTP_STATUS.UNAUTHORIZED).send("Unauthorized");
            }
        });
        
        // Gestion d'une requête pour récupérer toutes les images (code fourni pour vous)
        this.router.get('/', async (req, res) => { 
            const images = await this.galleryManager.getImages(req.publicOnly);
            return res.status(HTTP_STATUS.SUCCESS).json(images);
        });

        // TODO : Implémenter la gestion d'une requête de récupération d'une image par son identifiant
        this.router.get('/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const image = await this.galleryManager.getImageById(id, req.publicOnly);
                if (image) {
                    return res.status(HTTP_STATUS.SUCCESS).json(image);
                } else {
                    return res.status(HTTP_STATUS.NOT_FOUND).send("Image not found");
                }
            } catch (error) {
                return res.status(HTTP_STATUS.SERVER_ERROR).send(error.message);
            }
        });

        // TODO : Implémenter la gestion d'une requête de suppression d'une image
        this.router.delete('/:id', async (req, res) => {
            const { id } = req.params;

            try {
                const success = await this.galleryManager.deleteImage(id);
                if (success) {
                    return res.status(HTTP_STATUS.SUCCESS).send("Image deleted successfully");
                } else {
                    return res.status(HTTP_STATUS.NOT_FOUND).send("Image not found");
                }
            } catch (error) {
                return res.status(HTTP_STATUS.SERVER_ERROR).send(error.message);
            }
        });

        // TODO : Implémenter la gestion d'une requête de création d'une nouvelle image
        this.router.put('/', async (req, res) => {
            //console.log("File:", req.files.file);
            if (!req.files || !req.files.file) {  // Accès au fichier via req.files.image
                return res.status(HTTP_STATUS.BAD_REQUEST).send("No image file provided");
            }
        
            try {
                const fileName = path.parse(req.files.file.name).name;  
                //console.log("Extracted file name:", fileName);
 
                const imageFile = {
                    data: req.files.file.data,  
                    mimetype: req.files.file.mimetype  
                };
                //console.log("imageFile:", imageFile);
                
                // Sauvegarde de l'image en utilisant la méthode saveImage de galleryManager
                await this.galleryManager.saveImage({ name: fileName }, imageFile); 
                return res.status(HTTP_STATUS.CREATED).send("Image uploaded successfully");
            } catch (error) {
                return res.status(HTTP_STATUS.SERVER_ERROR).send(error.message);
            }
        });

        // TODO : Implémenter la gestion d'une requête de changement de l'état privé/public d'une image
        this.router.patch('/privacy/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const updatedImage = await this.galleryManager.changeImagePrivacy(id);
        
                if (updatedImage) {
                    // Return the updated image with the new privacy status
                    return res.status(HTTP_STATUS.SUCCESS).json(updatedImage);
                } else {
                    return res.status(HTTP_STATUS.NOT_FOUND).send("Image not found");
                }
            } catch (error) {
                return res.status(HTTP_STATUS.SERVER_ERROR).send(error.message);
            }
        });        
    }
}


module.exports = { GalleryRouter };