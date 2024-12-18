const { MockWriter } = require("./mockWriter");
const supertest = require("supertest");
const { HTTP_STATUS } = require("../utils/http");

const server = require("../server");
server.launch();
const request = supertest(server.server);

const API_URL = '/api/auth';

describe('Auth API integration tests', () => {
    let MOCK_USERS;
    const mockFileManager = new MockWriter();

    beforeEach(() => {
        MOCK_USERS = [
            { username: "test", password: "test", token: "abc" },
            { username: "test2", password: "test2", token: "def" }
        ];

        mockFileManager.readFile = jest.fn().mockResolvedValue(JSON.stringify(MOCK_USERS));

        server.authRouter.authManager.fileManager = mockFileManager;
    });

    afterEach(() => {
        server.server.close();
    });

    // Tests fourni à titre d'exemple
    describe("Account Creation", () => {

        it("Should return a token and 201 for a new user", async () => {
            const response = await request
                .post(`${API_URL}/`)
                .send({ username: "test3", password: "test3" });

            expect(response.status).toBe(HTTP_STATUS.CREATED);
            expect(response.header['x-auth-token']).toBeDefined();
        });

        it("Should return 400 if no password is provided", async () => {
            const response = await request
                .post(`${API_URL}/`)
                .send({ username: "test3" });

            expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
            expect(response.header['x-auth-token']).not.toBeDefined();
        });

        it("Should return 401 if the user already exists", async () => {
            const response = await request
                .post(`${API_URL}/`)
                .send({ username: MOCK_USERS[0].username, password: MOCK_USERS[0].password });

            expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
            expect(response.header['x-auth-token']).not.toBeDefined();
        });
    });

    // TODO : Compléter les tests unitaires.
    describe("Account login", () => {

        it("Login should return a token and 200 for a valid user", async () => {
            const response = await request
                .post(`${API_URL}/login`)
                .send({ username: MOCK_USERS[0].username, password: MOCK_USERS[0].password });

            expect(response.status).toBe(HTTP_STATUS.SUCCESS);
            expect(response.header['x-auth-token']).toBeDefined();
            console.log(response.header['x-auth-token']); // debug
        });

        it("Login should return 400 if no password is provided", async () => {
            const response = await request
                .post(`${API_URL}/login`)
                .send({ username: MOCK_USERS[0].username });

            expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        it("Login should return 401 if user info is incorrect", async () => {
            const response = await request
                .post(`${API_URL}/login`)
                .send({ username: "wrongUser", password: "wrongPass" });

            expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
        });
    });

    // TODO : Compléter les tests unitaires.
    describe("Account logout", () => {

        it("Logout should return 204 for a valid token", async () => {
            const response = await request
                .post(`${API_URL}/logout`)
                .set('Authorization', `Bearer ${MOCK_USERS[0].token}`);

            expect(response.status).toBe(HTTP_STATUS.NO_CONTENT);
        });

        it("Logout should return 400 if no token is provided", async () => {
            const response = await request
                .post(`${API_URL}/logout`);

            expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        it("Logout should return 401 if token is invalid", async () => {
            const response = await request
                .post(`${API_URL}/logout`)
                .set('Authorization', 'Bearer invalidToken');

            expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
        });
    });

});