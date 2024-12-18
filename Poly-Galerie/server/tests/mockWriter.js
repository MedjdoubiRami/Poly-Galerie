const { FileManager } = require("../managers/fileManager");

class MockWriter extends FileManager {
    async readFile() { }
    async writeData() { }
    async saveFile() { }
    async deleteFile() { }
}

module.exports = { MockWriter };
