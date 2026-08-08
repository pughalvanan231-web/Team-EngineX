import os
import json
import sqlite3
from typing import Optional, Dict, Any
from app.config import settings

def ensure_db_dir():
    os.makedirs(settings.DATABASE_DIR, exist_ok=True)

def get_connection():
    ensure_db_dir()
    conn = sqlite3.connect(settings.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    ensure_db_dir()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS interviews (
            interview_id TEXT PRIMARY KEY,
            candidate_id TEXT NOT NULL,
            status TEXT NOT NULL,
            state_json TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def save_interview(interview_id: str, candidate_id: str, status: str, state_data: Dict[str, Any], created_at: str, updated_at: str):
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    state_json = json.dumps(state_data)
    cursor.execute("""
        INSERT INTO interviews (interview_id, candidate_id, status, state_json, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(interview_id) DO UPDATE SET
            status=excluded.status,
            state_json=excluded.state_json,
            updated_at=excluded.updated_at
    """, (interview_id, candidate_id, status, state_json, created_at, updated_at))
    conn.commit()
    conn.close()

def load_interview(interview_id: str) -> Optional[Dict[str, Any]]:
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT state_json FROM interviews WHERE interview_id = ?", (interview_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return json.loads(row["state_json"])
    return None
