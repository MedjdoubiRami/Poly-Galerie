/**
 * @typedef {import('./fileManager').FileManager} FileManager
 */

/**
 * Metadonnées d'une image
 * @typedef {Object} ImageData
 * @property {string} name nom de l'image
 * @property {string} id identifiant 
 * @property {string} url url de l'image sur le serveur
 */

const path = require("path");
const { v4: uuidv4 } = require('uuid');

class GalleryManager {
    constructor(fileManager) {
        this.fileManager = fileManager;
        this.basePath = path.resolve(__dirname, "../data/images");
    }

    /**
     * Récupère la liste des images disponibles. Le retour peut être filtré pour ne retourner que les images publiques
     * 
     * @param {boolean} publicOnly true si on veut seulement les images publiques
     * @returns {Promise<Array<ImageData>} la liste des images
     */
    async getImages(publicOnly = false) {
        const images = JSON.parse(await this.fileManager.readFile());
        if (publicOnly) {
            return images.filter(image => !image.private);
        }
        return images;
    }

    /**
     * Récupère une image par son identifiant.
     * @param {string} id identifiant de l'image
     * @param {boolean} publicOnly si on veut seulement une image publique
     * @returns {ImageData | undefined} l'image correspondante ou undefined si non trouvée
     * 
     * TODO : retourner l'image en fonction de son identifiant. Si publicOnly est vrai, retourner une image seulement si elle est publique
     */
    async getImageById(id, publicOnly = false) {
        const images = await this.getImages(publicOnly);
        return images.find(image => image.id === id);
    }    

    /**
     * Sauvegarde une image sur le serveur. L'information de l'image est sauvegardée dans le JSON et l'image est sauvegardé sur le disque
     * Un identifiant unique est généré pour l'attribut id de l'image ainsi que pour le nom du fichier
     * 
     * @param {{name:string}} imageInfo information de l'image (nom)
     * @param {{data:Buffer, mimetype:string}} imageFile le fichier de l'image. 
     * L'attribut data contient les données binaires de l'image et mimetype le type de l'image sous format "image/type"
     * 
     * TODO : générer un nouveau identifiant et sauvegarder l'image dans le fichier. La sauvegarde sur disque vous est fournie.
     * Le nom du fichier doit être "id.type" où id est l'identifiant généré et type est le type de l'image extrait de mimetype
     */

    async saveImage(imageInfo, imageFile) {
        try {
            const id = uuidv4();  // Generate unique ID for image
            const fileType = imageFile.mimetype.split("/")[1];  // Extract file extension (jpeg, png, etc.)
            const fileName = `${id}.${fileType}`;
            //console.log("Generated file name:", fileName);
    
            const imageData = {
                id,
                name: imageInfo.name,
                url: fileName
            };
            //console.log("Image data to be saved:", imageData);
    
            // Retrieve existing images 
            const images = await this.getImages();
            images.push(imageData);
            await this.fileManager.writeData(images);  // Save updated image data
    
            // Check the file path before saving the image
            const filePath = path.join(this.basePath, fileName);
            //console.log("Image file path:", filePath);
    
            // Save the image to disk
            await this.fileManager.saveFile(imageFile.data, filePath);
        } catch (error) {
            throw new Error(`Failed to save image: ${error.message}`);
        }
    }
    
    /**
     * Supprime une image du serveur. La suppression est faite dans le fichier JSON et le fichier de l'image est supprimé du disque
     * @param {string} id identifiant de l'image à supprimer 
     * @returns {boolean} true si l'image a été supprimée avec succès, false sinon
     * 
     * TODO : supprimer l'image du fichier JSON et du disque. Retourner true si l'image a été supprimée avec succès, false sinon
     */
    async deleteImage(id) {
        const images = await this.getImages();
        const imageIndex = images.findIndex(image => image.id === id);

        if (imageIndex === -1) {
            return false; 
        }

        try {
            const [imageToDelete] = images.splice(imageIndex, 1);
            const imagePath = path.join(this.basePath, imageToDelete.url);
            await this.fileManager.deleteFile(imagePath);
            await this.fileManager.writeData(images);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * Modifier l'état privé/public d'une image et sauvegarder le changement dans le fichier JSON 
     * @param {string} id identifiant de l'image 
     * @returns {boolean} true si l'état a été changé avec succès, false sinon
     * 
     * TODO : changer l'état de l'image et mettre à jour le fichier JSON.
     */
    async changeImagePrivacy(id) {
        const images = await this.getImages();
        const image = images.find(image => image.id === id);

        if (!image) {
            return false; 
        }

        image.private = !image.private;

        await this.fileManager.writeData(images);
    
        return image;
    }
    

}

module.exports = { GalleryManager };