import duckdb
from contextlib import contextmanager

DB_PATH = "data/compliance.db"

@contextmanager
def get_db_connection():
    conn = duckdb.connect(DB_PATH, read_only=True)
    conn.load_extension("spatial")
    try:
        yield conn
    finally:
        conn.close()
