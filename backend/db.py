import duckdb
from contextlib import contextmanager

DB_PATH = "data/compliance.db"

@contextmanager
def get_db_connection():
    conn = duckdb.connect(DB_PATH, read_only=True)
    conn.execute("INSTALL spatial; LOAD spatial;")
    try:
        yield conn
    finally:
        conn.close()
