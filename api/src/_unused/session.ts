import session, { MemoryStore } from "express-session";
import {
  getSessionBySessionId,
  createSessionInDb,
  deleteSessionBySessionId,
  getAllSessions,
  SQLiteSessionTable,
  updateExpireAt,
  clearAllSessions,
  sessionLength,
} from "./sqlite";

export class CustomSQLiteStorage extends MemoryStore {
  async all(
    callback: (err: any, obj?: { [sid: string]: session.SessionData }) => void
  ): Promise<SQLiteSessionTable[]> {
    return getAllSessions();
  }

  async destroy(sid: string, callback?: (err?: any) => void): Promise<boolean> {
    return deleteSessionBySessionId(sid);
  }

  async get(
    sid: string,
    callback: (err: any, session?: session.SessionData) => void
  ): Promise<SQLiteSessionTable> {
    return await getSessionBySessionId(sid);
  }

  async set(
    sid: string,
    session: session.SessionData,
    callback?: (err?: any) => void
  ): Promise<SQLiteSessionTable> {
    if (!session.public_user_id || !session.cookie.expires) {
      throw new Error("public_user_id is required");
    }
    return await createSessionInDb(
      sid,
      session.public_user_id,
      session.cookie.expires
    );
  }

  async touch(
    sid: string,
    session: session.SessionData,
    callback?: (err?: any) => void
  ): Promise<SQLiteSessionTable> {
    if (!session.public_user_id || !session.cookie.expires) {
      throw new Error("public_user_id is required");
    }
    return await updateExpireAt(sid, session.cookie.expires);
  }

  async length(callback: (err: any, length: number) => void): Promise<number> {
    return await sessionLength();
  }

  async clear(callback: (err?: any) => void): Promise<boolean> {
    return await clearAllSessions();
  }
}
