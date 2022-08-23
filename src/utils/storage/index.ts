export interface IStorage extends Storage {
  hasItem(key: string): boolean;
}

export class StorageDecorator implements IStorage {
  /**
   * 键值对的数量
   */
  get length() {
    return this.storage.length;
  }

  private readonly storage: Storage;
  constructor(storage: Storage) {
    this.storage = storage;
  }

  /**
   * 返回键对应的值
   * @param index
   */
  public key(index: number): string | null {
    return this.storage.key(index);
  }

  setItem(key: string, value: any): void {
    try {
      const serialized = JSON.stringify(value);
      this.storage.setItem(key, serialized);
    } catch (e) {
      this.storage.setItem(key, value);
    }
  }

  clear(): void {
    this.storage.clear();
  }

  getItem(key: string): any {
    const ret = this.storage.getItem(key);
    try {
      return JSON.parse(ret!);
    } catch (e) {
      return ret;
    }
  }

  hasItem(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }

  removeItem(key: string): void {
    this.storage.removeItem(key);
  }
}

export const LocalStorage = new StorageDecorator(window.localStorage);
export const SessionStorage = new StorageDecorator(window.sessionStorage);

export default {
  localStorage: LocalStorage,
  sessionStorage: SessionStorage,
};
