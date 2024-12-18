const { FileManager } = require("../managers/fileManager");
const fs = require("fs/promises");

describe("FileManager unit tests", () => {
    let manager;
    let MOCK_USERS;
    const spies = {}

    beforeEach(() => {
        MOCK_USERS = [
            { username: "test", password: "test", token: "abc" },
            { username: "test2", password: "test2", token: "def" }
        ];
        manager = new FileManager();

        spies.readSpy = jest.spyOn(fs, "readFile").mockImplementation(() => JSON.stringify(MOCK_USERS));
        spies.writeSpy = jest.spyOn(fs, "writeFile").mockImplementation(() => {});
        spies.deleteSpy = jest.spyOn(fs, "unlink").mockImplementation(() => { });
    });

    it("readFile should return a string", async () => {
        const users = await manager.readFile();

        expect(users).toEqual(JSON.stringify(MOCK_USERS));
        expect(spies.readSpy).toHaveBeenCalled();
    });

    it("writeData should write data to a file", async () => {
        await manager.writeData(MOCK_USERS);

        expect(spies.writeSpy).toHaveBeenCalled();
    });

    it("saveFile should save a file", async () => {
        await manager.saveFile(Buffer.from("test"), "test.txt");

        expect(spies.writeSpy).toHaveBeenCalled();
        expect(spies.writeSpy).toHaveBeenCalledWith("test.txt", Buffer.from("test"));
    });

    it("deleteFile should delete a file", async () => {
        await manager.deleteFile("test.txt");

        expect(spies.deleteSpy).toHaveBeenCalled();
        expect(spies.deleteSpy).toHaveBeenCalledWith("test.txt");
    });
});