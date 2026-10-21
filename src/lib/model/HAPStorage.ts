// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import storage, { LocalStorage } from "node-persist";

/**
 * @group Model
 */
export class HAPStorage {

  private static readonly INSTANCE = new HAPStorage();

  private localStore?: LocalStorage;
  private customStoragePath?: string;

  public static storage(): LocalStorage {
    return this.INSTANCE.storage();
  }

  public static setCustomStoragePath(path: string): void {
    this.INSTANCE.setCustomStoragePath(path);
  }

  public storage(): LocalStorage {
    if (!this.localStore) {
      this.localStore = storage.create();

      if (this.customStoragePath) {
        this.localStore.initSync({
          dir: this.customStoragePath,
        });
      } else {
        this.localStore.initSync();
      }
    }

    return this.localStore;
  }

  public setCustomStoragePath(path: string): void {
    if (this.localStore) {
      // A plugin reloaded in the same process re-applies the path it already opened; that is not a change.
      if (path === this.customStoragePath) {
        return;
      }
      throw new Error("Cannot change storage path after it has already been initialized!");
    }

    this.customStoragePath = path;
  }

}
