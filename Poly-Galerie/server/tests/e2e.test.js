const supertest = require("supertest");
const fs = require("fs/promises");
const path = require("path");

const { HTTP_STATUS } = require("../utils/http");

const server = require("../server");
server.launch();
const request = supertest(server.server);

const API_AUTH_URL = '/api/auth';
const API_GALLERY_URL = '/api/images';

/* Ce fichier décrit un test de bout en bout qui valide un scénario d'utilisation complet de l'API : 
    1. Créer un compte
    2. Téléverser une image
    3. Récupérer la liste des images avec la nouvelle image créée
    4. Changer la confidentialité de l'image et valider qu'elle est maintenant privée
    5. Se déconnecter et tenter de récupérer l'image
    6. Tenter de supprimer l'image après s'être déconnecté
*/
describe('E2E test', () => {
    const authPath = "tests/users_e2e.json";
    const galleryPath = "tests/images_e2e.json";

    let token;
    let imageId;

    beforeAll(() => {

        // Remplacer les chemins des fichiers pour éviter de modifier les fichiers de production
        server.authManager.fileManager.path = path.resolve(__dirname, `../${authPath}`);
        server.galleryManager.fileManager.path = path.resolve(__dirname, `../${galleryPath}`);
        server.galleryManager.basePath = path.resolve(__dirname, "../tests/images");

        // Créer les fichiers de données vides
        server.galleryManager.fileManager.writeData([]);
        server.authManager.fileManager.writeData([]);
    });

    afterAll(async () => {
        server.server.close();

        // Supprimer les fichiers temporaires
        fs.unlink(path.resolve(__dirname, `../${authPath}`));
        fs.unlink(path.resolve(__dirname, `../${galleryPath}`));
        (await fs.readdir(path.resolve(__dirname, "../tests/images"))).forEach(async (file) => {
            if (file !== ".gitkeep")
                await fs.unlink(path.resolve(__dirname, `../tests/images/${file}`));
        });
    });

    it("Create a new user", async () => {
        const createUserRes = await request
            .post(API_AUTH_URL)
            .send({ username: "test", password: "test" });

        token = createUserRes.header['x-auth-token'];

        expect(createUserRes.status).toBe(HTTP_STATUS.CREATED);
        expect(token).toBeDefined();
        expect(createUserRes.body.message).toBe("User created");
    });

    it("Upload an image while authenticated", async () => {
        const uploadImageRes = await request
            .put(API_GALLERY_URL)
            .set('Authorization', `Bearer ${token}`)
            .field('name', 'testFile')
            .attach('file', Buffer.from("test"), 'image.jpg');

        expect(uploadImageRes.status).toBe(HTTP_STATUS.CREATED);
    });

    it("Retrieve all images and see the created image", async () => {
        const allImagesRes = await request
            .get(`${API_GALLERY_URL}`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        imageId = allImagesRes.body[0].id;

        expect(allImagesRes.status).toBe(HTTP_STATUS.SUCCESS);
        expect(allImagesRes.body.length).toBe(1);
        expect(allImagesRes.body[0].name).toBe("testFile");
        expect(allImagesRes.body[0].private).not.toBeDefined();
    });

    it("Change the privacy of the image and refetch all images", async () => {
        const changePrivacyRes = await request
            .patch(`${API_GALLERY_URL}/privacy/${imageId}`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(changePrivacyRes.status).toBe(HTTP_STATUS.SUCCESS);
        expect(changePrivacyRes.body.private).toBe(true);

        const getImageRes = await request
            .get(`${API_GALLERY_URL}/${imageId}`)
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(getImageRes.status).toBe(HTTP_STATUS.SUCCESS);
        expect(getImageRes.body.private).toBe(true);

    });

    it("Logout and try to retrieve the image", async () => {
        const logoutRes = await request
            .post(`${API_AUTH_URL}/logout`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(logoutRes.status).toBe(HTTP_STATUS.NO_CONTENT);

        const getWithoutAuthRes = await request
            .get(`${API_GALLERY_URL}/${imageId}`)
            .send();

        expect(getWithoutAuthRes.status).toBe(HTTP_STATUS.NOT_FOUND);
    });

    it("Try to delete the image after being logged off (invalid token)", async () => {
        const deleteWithoutProperAuthRes = await request
            .delete(`${API_GALLERY_URL}/${imageId}`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(deleteWithoutProperAuthRes.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    });

});