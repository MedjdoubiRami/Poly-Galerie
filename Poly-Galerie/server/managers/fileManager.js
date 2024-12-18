const fs = require("fs/promises");

class FileManager {
    constructor(path) {
        this.path = path;
    }

    /**
     * Lit le contenu du fichier et le retourne dans une seule string.
     * @returns {Promise<string>} retourne une promesse résolue avec le contenu du fichier
    */
    async readFile() {
        return fs.readFile(this.path, { encoding: "utf-8" });
    }

    /**
     * Écrit le contenu d'un objet JS dans le fichier
     * @param {Object} content contenu à écrire. Doit être sérialisable en JSON
     * @returns {Promise<void>} retourne une promesse résolue une fois l'écriture terminée
    */
    async writeData(content) {
        await fs.writeFile(this.path, JSON.stringify(content, null, 2));
    }

    /**
     * Sauvegarde le contenu d'un fichier à un emplacement donné
     * @param {Buffer} imageFile contenu du fichier
     * @param {string} path chemin vers le fichier à créer
     * 
     * TODO : Implémenter cette méthode à l'aide du module fs
     */
    async saveFile(imageFile, path) {
        await fs.writeFile(path, imageFile);
    }

    /**
     * Supprimer un fichier en fonction de son chemin 
     * @param {string} path chemin du fichier à supprimer
     * 
     * TODO : Implémenter cette méthode à l'aide du module fs 
     */
    async deleteFile(path) {
        await fs.unlink(path);
    }
}

module.exports = { FileManager };