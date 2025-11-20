import { openDB } from 'idb';

const DB_NAME = 'engine-log';
const STORE_NAME = 'logs';

export async function getDB() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
  return db;
}

export async function saveLogOffline(log) {
  const db = await getDB();
  await db.put(STORE_NAME, log);
}

export async function getUnsyncedLogs() {
  const db = await getDB();
  const allLogs = await db.getAll(STORE_NAME);
  return allLogs.filter(log => !log.synced);
}

export async function markLogAsSynced(id) {
  const db = await getDB();
  const log = await db.get(STORE_NAME, id);
  if (log) {
    log.synced = true;
    await db.put(STORE_NAME, log);
  }
}
