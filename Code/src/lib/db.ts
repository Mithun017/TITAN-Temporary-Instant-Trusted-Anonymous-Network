/**
 * Local IndexedDB Storage for TITAN
 * Stores local drafts, UI preferences, and session shortcuts.
 * Does not store plaintext credentials or remote chat history.
 */

const DB_NAME = "titan_local_store";
const DB_VERSION = 1;
const STORE_PREFS = "preferences";
const STORE_DRAFTS = "drafts";

export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB not available in this environment"));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_PREFS)) {
        db.createObjectStore(STORE_PREFS, { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains(STORE_DRAFTS)) {
        db.createObjectStore(STORE_DRAFTS, { keyPath: "roomId" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePreference<T>(key: string, value: T): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_PREFS, "readwrite");
    const store = tx.objectStore(STORE_PREFS);
    store.put({ key, value, updatedAt: Date.now() });
  } catch (err) {
    console.warn("Could not save preference to IndexedDB", err);
  }
}

export async function getPreference<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PREFS, "readonly");
      const store = tx.objectStore(STORE_PREFS);
      const request = store.get(key);
      request.onsuccess = () => {
        if (request.result && request.result.value !== undefined) {
          resolve(request.result.value as T);
        } else {
          resolve(defaultValue);
        }
      };
      request.onerror = () => resolve(defaultValue);
    });
  } catch {
    return defaultValue;
  }
}

export async function saveDraft(roomId: string, draftText: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_DRAFTS, "readwrite");
    const store = tx.objectStore(STORE_DRAFTS);
    store.put({ roomId, draftText, updatedAt: Date.now() });
  } catch (err) {
    console.warn("Could not save draft to IndexedDB", err);
  }
}

export async function getDraft(roomId: string): Promise<string> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_DRAFTS, "readonly");
      const store = tx.objectStore(STORE_DRAFTS);
      const request = store.get(roomId);
      request.onsuccess = () => {
        resolve(request.result ? (request.result.draftText as string) : "");
      };
      request.onerror = () => resolve("");
    });
  } catch {
    return "";
  }
}

export async function clearAllLocalData(): Promise<void> {
  if (typeof window === "undefined" || !window.indexedDB) return;
  try {
    const db = await openDB();
    const tx1 = db.transaction(STORE_PREFS, "readwrite");
    tx1.objectStore(STORE_PREFS).clear();

    const tx2 = db.transaction(STORE_DRAFTS, "readwrite");
    tx2.objectStore(STORE_DRAFTS).clear();
  } catch (err) {
    console.warn("Error clearing IndexedDB", err);
  }
}

