const { GalleryManager } = require("../managers/galleryManager");
const { MockWriter } = require("./mockWriter");

describe("GalleryManager unit tests", () => {
    let manager;
    let fileReader;
    let MOCK_IMAGES;
    const spies = {};

    beforeEach(() => {
        MOCK_IMAGES = [
            { id: "a", name: "Image1", url: "image1.jpg", private: true },
            { id: "b", name: "Image2", url: "image2.jpg" },
            { id: "c", name: "Image3", url: "image3.jpg" },
        ];

        fileReader = new MockWriter();
        fileReader.readFile = jest.fn().mockResolvedValue(JSON.stringify(MOCK_IMAGES));
        manager = new GalleryManager(fileReader);
        spies.writeSpy = jest.spyOn(fileReader, "writeData");
        spies.saveSpy = jest.spyOn(fileReader, "saveFile");
        spies.deleteSpy = jest.spyOn(fileReader, "deleteFile");
    });

    it("getImages should return a list of all images", async () => {
        const images = await manager.getImages();

        expect(images).toEqual(MOCK_IMAGES);
    });

    it("getImages should return a list of all public images if parameter is true", async () => {
        const images = await manager.getImages(true);

        expect(images).toEqual([MOCK_IMAGES[1], MOCK_IMAGES[2]]);
    });

    it("getImageById should return an image if it exists", async () => {
        const image = await manager.getImageById(MOCK_IMAGES[0].id);

        expect(image).toEqual(MOCK_IMAGES[0]);
    });

    it("getImageById should return undefined if id is invalid", async () => {
        const image = await manager.getImageById('abcd');

        expect(image).toBeUndefined();
    });

    it("getImageById should return undefined if image was private", async () => {
        const image = await manager.getImageById(MOCK_IMAGES[0].id, true);

        expect(image).toBeUndefined();
    });

    it("saveImage should save an image to disk", async () => {
        const imageInfo = { name: "Image4" };
        const imageFile = { mimetype: "image/jpeg", data: Buffer.from("test") };

        await manager.saveImage(imageInfo, imageFile);

        expect(spies.writeSpy).toHaveBeenCalled();
        expect(spies.saveSpy).toHaveBeenCalled();
    });

    it("deleteImage should remove an image from disk", async () => {
        const res = await manager.deleteImage(MOCK_IMAGES[0].id);

        expect(res).toEqual(true);
        expect(spies.writeSpy).toHaveBeenCalled();
        expect(spies.deleteSpy).toHaveBeenCalled();
    });

    it("deleteImage should return false if id is invalid", async () => {
        const res = await manager.deleteImage('abcd');

        expect(res).toEqual(false);
        expect(spies.writeSpy).not.toHaveBeenCalled();
        expect(spies.deleteSpy).not.toHaveBeenCalled();
    });

    it("deleteImage should not write to disk if deletion fails", async () => {
        spies.deleteSpy.mockRejectedValueOnce(new Error("Error"));
        jest.spyOn(console, "error").mockImplementation(() => {});

        const res = await manager.deleteImage(MOCK_IMAGES[0].id);

        expect(res).toEqual(false);
        expect(spies.writeSpy).not.toHaveBeenCalled();
    });

    it("changeImagePrivacy should change the privacy of an image", async () => {
        const image = await manager.changeImagePrivacy(MOCK_IMAGES[1].id);

        expect(image.private).toEqual(true);
        expect(spies.writeSpy).toHaveBeenCalled();
    });

    it("changeImagePrivacy should return false if id is invalid", async () => {
        const image = await manager.changeImagePrivacy('abcd');

        expect(image).toEqual(false);
        expect(spies.writeSpy).not.toHaveBeenCalled();
    });

});