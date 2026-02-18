import duckdb
from contextlib import contextmanager

DB_PATH = "data/compliance.db"

@contextmanager
def get_db_connection():
    # We remove read_only=True so the connection can create/initialize 
    # if necessary (useful for CI/Tests)
    conn = duckdb.connect(DB_PATH)
    conn.execute("INSTALL spatial; LOAD spatial;")
    try:
        yield conn
    finally:
        conn.close()
