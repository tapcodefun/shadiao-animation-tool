import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'video-tool.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initTables(db);
  }
  return db;
}

function initTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL CHECK(platform IN ('wanxiang','cogview','openai','siliconflow','custom')),
      name TEXT NOT NULL,
      api_key_encrypted TEXT NOT NULL,
      base_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_used_at TEXT
    );

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK(type IN ('background','character','sticker','text','effect')),
      category TEXT NOT NULL CHECK(category IN ('shadiao-classic','moe-cute')),
      name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      thumbnail_path TEXT,
      width INTEGER NOT NULL,
      height INTEGER NOT NULL,
      prompt TEXT NOT NULL,
      model_used TEXT NOT NULL,
      tags TEXT DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      style TEXT NOT NULL CHECK(style IN ('shadiao-classic','moe-cute')),
      resolution_width INTEGER NOT NULL DEFAULT 1920,
      resolution_height INTEGER NOT NULL DEFAULT 1080,
      fps INTEGER NOT NULL DEFAULT 30,
      duration_in_frames INTEGER NOT NULL DEFAULT 150,
      scenes_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS export_history (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','rendering','completed','failed')),
      output_path TEXT,
      resolution_width INTEGER NOT NULL,
      resolution_height INTEGER NOT NULL,
      fps INTEGER NOT NULL,
      progress REAL DEFAULT 0,
      error_message TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
