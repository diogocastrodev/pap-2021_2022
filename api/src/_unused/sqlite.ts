import path from "path";
import sqlite from "sqlite3";
import { consoleLogColors } from "../beauty";

/* -------------------------------------------------------------------------- */
/*                                  SQL Lite                                  */
/* -------------------------------------------------------------------------- */

const dbFile = "./sqlite/db.sqlite";
var db_path = path.resolve(__dirname, ".", dbFile);
const sqLite = sqlite.verbose();

export const sqLiteDB: sqlite.Database = new sqLite.Database(db_path, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("\nSQLITE:");
    console.log(
      `\t${consoleLogColors.fg.green}[x]${consoleLogColors.reset} Connected to ${dbFile}`
    );
  }
});

sqLiteDB.on("open", () => {
  sqLiteDB.run(
    "CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT, public_user_id TEXT, created_at TEXT)"
  );
});

/* -------------------------------------------------------------------------- */
/*                                   Methods                                  */
/* -------------------------------------------------------------------------- */

export const createSessionInDb = async (
  sessionId: string,
  publicUserId: string,
  expire: Date
): Promise<SQLiteSessionTable> => {
  return new Promise((resolve, reject) => {
    const createdAt = new Date().toISOString();
    const expireAt = expire.toISOString();
    const stmt = sqLiteDB.prepare(
      "INSERT INTO sessions (session_id, public_user_id, created_at) VALUES (?, ?, ?)"
    );
    const data = stmt
      .run([sessionId, publicUserId, createdAt])
      .all((err, row: SQLiteSessionTable) => {
        if (!data) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    stmt.finalize();
  });
};

export const updateExpireAt = async (
  session_id: string,
  expire_at: Date
): Promise<SQLiteSessionTable> => {
  return new Promise((resolve, reject) => {
    const expireAt = expire_at.toISOString();
    const stmt = sqLiteDB.prepare(
      "UPDATE sessions SET expire_at = ? WHERE session_id = ?"
    );
    const data = stmt
      .run([expireAt, session_id])
      .all((err, row: SQLiteSessionTable) => {
        if (!data) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    stmt.finalize();
  });
};

export const getSessionBySessionId = async (
  sessionId: string
): Promise<SQLiteSessionTable> => {
  return new Promise((resolve, reject) => {
    const stmt = sqLiteDB.prepare(
      "SELECT * FROM sessions WHERE session_id = ?"
    );
    stmt.run(sessionId).all((err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows[0]);
      }
    });
    stmt.finalize();
  });
};

export const getSessionByPublicUserId = async (publicUserId: string) => {
  return new Promise((resolve, reject) => {
    const stmt = sqLiteDB.prepare(
      "SELECT * FROM sessions WHERE public_user_id = ?"
    );
    const session = stmt.get(publicUserId);
    stmt.finalize();
    resolve(session);
  });
};

export const getAllSessions = async (): Promise<SQLiteSessionTable[]> => {
  return new Promise((resolve, reject) => {
    sqLiteDB.all(
      "SELECT * FROM sessions",
      (err, rows: SQLiteSessionTable[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

export const deleteSessionBySessionId = async (
  sessionId: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    sqLiteDB.run(
      "DELETE FROM sessions WHERE session_id = ?",
      [sessionId],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      }
    );
  });
};

export const clearAllSessions = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    sqLiteDB.run("DELETE FROM sessions", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

export const sessionLength = async (): Promise<number> => {
  return new Promise((resolve, reject) => {
    sqLiteDB.get("SELECT COUNT(*) AS count FROM sessions", (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.count);
      }
    });
  });
};

export interface SQLiteSessionTable {
  id: number;
  session_id: string;
  public_user_id: string;
  created_at: string;
}
