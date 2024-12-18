const path = require("path");
const express = require("express");
const fileUpload = require('express-fileupload'); // middleware pour des fichiers
const cors = require('cors'); // Middleware pour gérer les CORS

const { FileManager } = require("./managers/fileManager");
const { AuthManager } = require("./managers/authManager");
const { GalleryManager } = require("./managers/galleryManager");

const { GalleryRouter } = require("./routes/gallery");
const { AuthRouter } = require("./routes/auth");

class Server {
    constructor() {
        this.galleryManager = new GalleryManager(new FileManager(path.resolve(__dirname, "data/images.json")));
        this.authManager = new AuthManager(new FileManager(path.resolve(__dirname, "data/users.json")));

        this.galleryRouter = new GalleryRouter(this.galleryManager, this.authManager);
        this.authRouter = new AuthRouter(this.authManager);

        this.configureRoutes();
    }

    configureRoutes() {
        this.app = express();
        // TODO : Ajouter les bons middlewares pour accepter les requêtes de plusieurs origines ainsi que des requêtes avec des fichiers
        this.app.use(cors());

        /* eslint-disable-next-line no-magic-numbers */
        this.app.use(fileUpload({ limits: { fileSize: 1024 * 1024 }, abortOnLimit: true })); // Pas plus que 1MB
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json({ limit: "10mb" }));

        // TODO : Rajouter les routeurs sur les bon prefixes
        this.app.use("/api/auth", this.authRouter.router); 
        this.app.use("/api/images", this.galleryRouter.router); 
    }

    launch() {
        const PORT = 5020;
        this.server = this.app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    }
}

const server = new Server();

module.exports = server;