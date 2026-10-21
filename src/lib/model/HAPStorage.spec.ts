// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import nodePersist from "node-persist";
import { HAPStorage } from "./HAPStorage";

describe(HAPStorage, () => {

  describe("storage", () => {
    it("should init storage correctly and only once", () => {
      const storage = new HAPStorage();

      // @ts-expect-error: private access
      expect(storage.localStore).toBeUndefined();
      const localStore = storage.storage(); // init first time
      expect(nodePersist.create).toHaveBeenCalledTimes(1);
      expect(localStore.initSync).toHaveBeenCalledTimes(1);

      // @ts-expect-error: private access
      expect(storage.localStore).toBeDefined();
      const localStore2 = storage.storage(); // init first time
      expect(nodePersist.create).toHaveBeenCalledTimes(1);
      expect(localStore2).toEqual(localStore);
      expect(localStore2.initSync).toHaveBeenCalledTimes(1);
    });

  });

  describe("setCustomStoragePath", () => {
    it("should init storage correctly with custom storage path", () => {
      const storage = new HAPStorage();

      storage.setCustomStoragePath("asdfPath");
      const localStore = storage.storage();
      expect(localStore.initSync).toHaveBeenCalledTimes(1);
      expect(localStore.initSync).toHaveBeenLastCalledWith({ dir: "asdfPath" });
    });

    it("should reject setCustomStoragePath after storage has already been initialized", () => {
      const storage = new HAPStorage();

      storage.storage();
      expect(() => storage.setCustomStoragePath("customPath")).toThrow(Error);
    });

    it("should accept the same custom storage path again after storage has been initialized", () => {
      const storage = new HAPStorage();

      storage.setCustomStoragePath("samePath");
      const localStore = storage.storage();
      expect(() => storage.setCustomStoragePath("samePath")).not.toThrow();
      expect(storage.storage()).toBe(localStore);
      expect(localStore.initSync).toHaveBeenCalledTimes(1);
    });

    it("should reject a different custom storage path after storage has been initialized", () => {
      const storage = new HAPStorage();

      storage.setCustomStoragePath("firstPath");
      storage.storage();
      expect(() => storage.setCustomStoragePath("otherPath")).toThrow(Error);
    });
  });

});
