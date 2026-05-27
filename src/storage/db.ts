import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface ImcHistoryRecord {
  id: number;
  userId: number;
  weight: number;
  height: number;
  imc: number;
  classification: string;
  createdAt: string;
}

export interface PedidosHistoryRecord {
  id: number;
  userId: number;
  product: string;
  drink: string;
  total: number;
  createdAt: string;
}

const db = Platform.OS === 'web' ? null : SQLite.openDatabase('main.db');

const STORAGE_KEYS = {
  users: 'app_users_v1',
  imcHistory: 'app_imc_v1',
  pedidosHistory: 'app_pedidos_v1',
};

const memoryStore = {
  users: [] as UserRecord[],
  imcHistory: [] as ImcHistoryRecord[],
  pedidosHistory: [] as PedidosHistoryRecord[],
};

const isWeb = Platform.OS === 'web';

const loadMemoryStoreFromStorage = () => {
  if (!isWeb) return;
  try {
    const u = localStorage.getItem(STORAGE_KEYS.users);
    const i = localStorage.getItem(STORAGE_KEYS.imcHistory);
    const p = localStorage.getItem(STORAGE_KEYS.pedidosHistory);
    if (u) memoryStore.users = JSON.parse(u) as UserRecord[];
    if (i) memoryStore.imcHistory = JSON.parse(i) as ImcHistoryRecord[];
    if (p) memoryStore.pedidosHistory = JSON.parse(p) as PedidosHistoryRecord[];
  } catch (err) {
    // ignore parse errors
  }
};

const saveMemoryStoreToStorage = () => {
  if (!isWeb) return;
  try {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(memoryStore.users));
    localStorage.setItem(STORAGE_KEYS.imcHistory, JSON.stringify(memoryStore.imcHistory));
    localStorage.setItem(STORAGE_KEYS.pedidosHistory, JSON.stringify(memoryStore.pedidosHistory));
  } catch (err) {
    // ignore quota errors
  }
};

// initialize memory store from localStorage for web
if (isWeb) loadMemoryStoreFromStorage();

const runSql = (sql: string, params: (string | number | null)[] = []) => {
  return new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    if (!db) {
      reject(new Error('SQLite not available on web'));
      return;
    }
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const initDb = async () => {
  if (!db) return;
  await runSql(
    'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT)'
  );
  await runSql(
    'CREATE TABLE IF NOT EXISTS imc_history (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, weight REAL, height REAL, imc REAL, classification TEXT, createdAt TEXT)'
  );
  await runSql(
    'CREATE TABLE IF NOT EXISTS pedidos_history (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, product TEXT, drink TEXT, total REAL, createdAt TEXT)'
  );
  await runSql(
    'CREATE TABLE IF NOT EXISTS session (key TEXT PRIMARY KEY, value TEXT)'
  );
};

export const setSessionKey = async (key: string, value: string | null) => {
  if (!db) {
    // store in localStorage fallback
    try {
      const raw = localStorage.getItem('app_session_v1');
      const obj = raw ? JSON.parse(raw) : {};
      if (value === null) {
        delete obj[key];
      } else {
        obj[key] = value;
      }
      localStorage.setItem('app_session_v1', JSON.stringify(obj));
    } catch (err) {
      // ignore
    }
    return;
  }
  if (value === null) {
    await runSql('DELETE FROM session WHERE key = ?', [key]);
    return;
  }
  await runSql('INSERT OR REPLACE INTO session (key, value) VALUES (?, ?)', [key, value]);
};

export const getSessionKey = async (key: string) => {
  if (!db) {
    try {
      const raw = localStorage.getItem('app_session_v1');
      const obj = raw ? JSON.parse(raw) : {};
      return obj[key] ?? null;
    } catch (err) {
      return null;
    }
  }
  const result = await runSql('SELECT value FROM session WHERE key = ? LIMIT 1', [key]);
  if (result.rows.length === 0) return null;
  return result.rows.item(0).value as string;
};

export const clearSessionKey = async (key: string) => setSessionKey(key, null);

export const getUserByEmail = async (email: string) => {
  if (!db) {
    return memoryStore.users.find((user) => user.email === email) ?? null;
  }
  const result = await runSql('SELECT * FROM users WHERE email = ?', [email]);
  return (result.rows.item(0) as UserRecord) ?? null;
};

export const getUserById = async (id: number) => {
  if (!db) {
    return memoryStore.users.find((u) => u.id === id) ?? null;
  }
  const result = await runSql('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  if (result.rows.length === 0) return null;
  return result.rows.item(0) as UserRecord;
};

export const createUser = async (name: string, email: string, password: string) => {
  if (!db) {
    const exists = memoryStore.users.some((user) => user.email === email);
    if (exists) {
      throw new Error('EMAIL_EXISTS');
    }
    const newUser: UserRecord = {
      id: Date.now(),
      name,
      email,
      password,
    };
    memoryStore.users.push(newUser);
    saveMemoryStoreToStorage();
    return newUser;
  }
  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error('EMAIL_EXISTS');
  }
  const result = await runSql(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );
  return {
    id: result.insertId ?? 0,
    name,
    email,
    password,
  } as UserRecord;
};

export const updateUser = async (
  id: number,
  name: string,
  email: string,
  password: string
) => {
  if (!db) {
    const index = memoryStore.users.findIndex((user) => user.id === id);
    if (index === -1) return null;
    memoryStore.users[index] = { id, name, email, password };
    saveMemoryStoreToStorage();
    return memoryStore.users[index];
  }
  await runSql(
    'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
    [name, email, password, id]
  );
  return { id, name, email, password } as UserRecord;
};

export const insertImcHistory = async (record: Omit<ImcHistoryRecord, 'id'>) => {
  if (!db) {
    const newItem: ImcHistoryRecord = {
      id: Date.now(),
      ...record,
    };
    memoryStore.imcHistory.unshift(newItem);
    saveMemoryStoreToStorage();
    return newItem;
  }
  const result = await runSql(
    'INSERT INTO imc_history (userId, weight, height, imc, classification, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    [
      record.userId,
      record.weight,
      record.height,
      record.imc,
      record.classification,
      record.createdAt,
    ]
  );
  return {
    id: result.insertId ?? 0,
    ...record,
  } as ImcHistoryRecord;
};

export const listImcHistory = async (userId: number, limit = 10) => {
  if (!db) {
    return memoryStore.imcHistory
      .filter((item) => item.userId === userId)
      .slice(0, limit);
  }
  const result = await runSql(
    'SELECT * FROM imc_history WHERE userId = ? ORDER BY id DESC LIMIT ?',
    [userId, limit]
  );
  return result.rows._array as ImcHistoryRecord[];
};

export const insertPedidosHistory = async (
  record: Omit<PedidosHistoryRecord, 'id'>
) => {
  if (!db) {
    const newItem: PedidosHistoryRecord = {
      id: Date.now(),
      ...record,
    };
    memoryStore.pedidosHistory.unshift(newItem);
    saveMemoryStoreToStorage();
    return newItem;
  }
  const result = await runSql(
    'INSERT INTO pedidos_history (userId, product, drink, total, createdAt) VALUES (?, ?, ?, ?, ?)',
    [
      record.userId,
      record.product,
      record.drink,
      record.total,
      record.createdAt,
    ]
  );
  return {
    id: result.insertId ?? 0,
    ...record,
  } as PedidosHistoryRecord;
};

export const listPedidosHistory = async (userId: number, limit = 10) => {
  if (!db) {
    return memoryStore.pedidosHistory
      .filter((item) => item.userId === userId)
      .slice(0, limit);
  }
  const result = await runSql(
    'SELECT * FROM pedidos_history WHERE userId = ? ORDER BY id DESC LIMIT ?',
    [userId, limit]
  );
  return result.rows._array as PedidosHistoryRecord[];
};
