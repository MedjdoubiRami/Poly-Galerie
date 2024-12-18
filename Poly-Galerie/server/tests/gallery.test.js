const { MockWriter } = require("./mockWriter");
const supertest = require("supertest");
const { HTTP_STATUS } = require("../utils/http");

const server = require("../server");
server.launch();
const request = supertest(server.server);

const API_URL = '/api/images';

describe('Gallery API integration tests', () => {
    let MOCK_IMAGES;
    let MOCK_USERS
    const mockFileManager = new MockWriter();

    beforeEach(() => {
        MOCK_IMAGES = [
            { id: "a", name: "Image1", url: "image1.jpg", private: true },
            { id: "b", name: "Image2", url: "image2.jpg" },
            { id: "c", name: "Image3", url: "image3.jpg" },
        ];
        MOCK_USERS = [
            { username: "test", password: "test", token: "abc" },
            { username: "test2", password: "test2" },
        ];

        // Retirer la dépendance à la lecture/écriture sur le disque
        mockFileManager.readFile = jest.fn().mockResolvedValue(JSON.stringify(MOCK_IMAGES));

        // Éviter d'écrire sur le disque
        server.galleryManager.fileManager = mockFileManager;
        server.authManager.fileManager.readFile = jest.fn().mockResolvedValue(JSON.stringify(MOCK_USERS));
    });

    afterEach(() => {
        server.server.close();
    });

    describe("Authentication validation", () => {
        it("Should block access to images if not authenticated", async () => {
            const response = await request
                .post(API_URL);

            expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
        });

        it("should block access to images if Bearer is missing on token", async () => {
            const response = await request
                .post(API_URL)
                .set('Authorization', 'invalidToken');

            expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
        });

        it("should allow access to reading public images only without token ", async () => {
            const response = await request
                .get(API_URL);

            expect(response.status).toBe(HTTP_STATUS.SUCCESS);
            expect(response.body).toEqual([MOCK_IMAGES[1], MOCK_IMAGES[2]]);
        });

        it("should allow access to reading all images with token ", async () => {
            const response = await request
                .get(API_URL)
                .set('Authorization', `Bearer ${MOCK_USERS[0].token}`);

            expect(response.status).toBe(HTTP_STATUS.SUCCESS);
            expect(response.body).toEqual(MOCK_IMAGES);
        });

    });

    describe("Image retrieval", () => {

        it("Should return an image by id", async () => {
            const response = await request
                .get(`${API_URL}/${MOCK_IMAGES[0].id}`)
                .set('Authorization', `Bearer ${MOCK_USERS[0].token}`);

            expect(response.status).toBe(HTTP_STATUS.SUCCESS);
            expect(response.body).toEqual(MOCK_IMAGES[0]);
        });

        it("Should return 404 if image does not exist", async () => {
            const response = await request
                .get(`${API_URL}/abcd`)
                .set('Authorization', `Bearer ${MOCK_USERS[0].token}`);

            expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
        });

        it("Should return 404 if image is private without authentication", async () => {
            const response = await request
                .get(`${API_URL}/${MOCK_IMAGES[0].id}`);

            expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
        });

    });

    describe("Image creation", () => {

        it("Should return 400 if no file is uploaded", async () => {
            const response = await request
                .put(API_URL)
                .set('Authorization', `Bearer ${MOCK_USERS[0].token}`);

            expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        it("Should return 201 if image is uploaded", async () => {
            const response = await request
                .put(API_URL)
                .set('Authorization', `Bearer ${MOCK_USERS[0].token}`)
                .attach('file', Buffer.from("test"), 'image.jpg');

            expect(response.status).toBe(HTTP_STATUS.CREATED);
        });


        it("Should return 500 if an error occurs while saving the image", async () => {
            mockFileManager.saveFile = jest.fn().mockImplementation(() => {
                throw new Error('Error saving file');
            });
            jest.spyOn(console, 'error').mockImplementation(() => { });
            
            const response = await request
                .put(API_URL)
                .set('Authorization', `Bearer ${MOCK_USERS[0].token}`)
                .attach('file', Buffer.from("test"), 'image.jpg');

            expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);
        });

    });

    describe("Image deletion", () => {

        it("Should delete an image by id", async () => {
            const response = await request
                .delete(`${API_URL}/${MOCK_IMAGES[0].id}`)
                .set('Authorization', `Bearer ${MOCK_USERS[0].token}`);

            expect(response.status).toBe(HTTP_STATUS.SUCCESS);
        });

        it("Should return 404 if image does not exist", async () => {
            const response = await request
                .delete(`${API_URL}/abcd`)
                .set('Authorization', `Bearer ${MOCK_USERS[0].token}`);

            expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
        });
    });

    describe("Image modification", () => {

        it("Should return new privacy status on success", async () => {
            const imageId = MOCK_IMAGES[0].id; 
            const response = await request
                .patch(`${API_URL}/privacy/${imageId}`)
                .set('Authorization', `Bearer ${MOCK_USERS[0].token}`);
    
            expect(response.status).toBe(HTTP_STATUS.SUCCESS);
    
            const updatedImage = response.body;
            expect(updatedImage.private).toBe(false); 
        });
        
        it("Should return 404 if image does not exist", async () => {
            const response = await request
                .patch(`${API_URL}/privacy/abcd`)
                .set('Authorization', `Bearer ${MOCK_USERS[0].token}`);

            expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
        });

    });

});