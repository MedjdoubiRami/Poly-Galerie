const { AuthManager } = require("../managers/authManager");
const { MockWriter } = require("./mockWriter");

describe("AuthManager unit tests", () => {
    let manager;
    let fileReader;
    let MOCK_USERS;
    let spy;

    beforeEach(() => {
        MOCK_USERS = [
            { username: "test", password: "test", token: "abc" },
            { username: "test2", password: "test2", token: "def" }
        ];

        fileReader = new MockWriter();
        fileReader.readFile = jest.fn().mockResolvedValue(JSON.stringify(MOCK_USERS));
        manager = new AuthManager(fileReader);
        spy = jest.spyOn(fileReader, "writeData");

    });

    it('getUsers should return a list of users', async () => {
        const users = await manager.getUsers();

        expect(users).toEqual(MOCK_USERS);
    });

    it("createUser should create a new user and return its token", async () => {
        const testUser = { username: "test3", password: "test3" };

        const token = await manager.createUser(testUser);

        expect(token).not.toBeNull();
        expect(spy).toHaveBeenCalled();
    });

    it("createUser should not create a user if they already exist", async () => {
        const token = await manager.createUser(MOCK_USERS[0]);

        expect(token).toBeNull();
        expect(spy).not.toHaveBeenCalled();
    });

    it("logInUser should return a token if the user exists", async () => {
        const token = await manager.logInUser(MOCK_USERS[0].username, MOCK_USERS[0].password);

        expect(token).not.toBeNull();
        expect(token).not.toEqual(MOCK_USERS[0].token);
        expect(spy).toHaveBeenCalled();
    });

    it("logInUser should return null if data is invalid", async () => {
        const token = await manager.logInUser(MOCK_USERS[0].username, 'bad_password');

        expect(token).toBeNull();
        expect(spy).not.toHaveBeenCalled();
    });

    it("logOffUser should remove the token from the user", async () => {
        const res = await manager.logOffUser(MOCK_USERS[0].token);

        expect(res).toEqual(true);
        expect(spy).toHaveBeenCalled();

        const modifiedUsers = structuredClone(MOCK_USERS);
        delete modifiedUsers[0].token;
        expect(spy).toHaveBeenCalledWith(modifiedUsers);
    });

    it("logOffUser should return false if the user does not exist", async () => {
        const res = await manager.logOffUser("invalid_token");

        expect(res).toEqual(false);
        expect(spy).not.toHaveBeenCalled();
    });

    it("validateToken should return the user if the token is valid", async () => {
        const user = await manager.validateToken(MOCK_USERS[0].token);

        expect(user).toEqual(MOCK_USERS[0]);
    });

    it("validateToken should return undefined if the token is invalid", async () => {
        const user = await manager.validateToken("invalid_token");

        expect(user).toBeUndefined();
    });
});