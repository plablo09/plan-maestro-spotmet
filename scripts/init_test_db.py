import duckdb
import os

DB_PATH = 'data/compliance.db'

def init_db():
    os.makedirs('data', exist_ok=True)
    if os.path.exists(DB_PATH):
        print(f'Database {DB_PATH} already exists.')
        return

    print(f'Initializing test database at {DB_PATH}...')
    conn = duckdb.connect(DB_PATH)
    conn.execute('INSTALL spatial; LOAD spatial;')
    conn.execute("""
        CREATE TABLE buildings (
            colonia VARCHAR,
            cta_catast VARCHAR,
            zonif VARCHAR,
            niv_norm DOUBLE,
            niv_const DOUBLE,
            rev_normat VARCHAR,
            area_m2 DOUBLE,
            geometry GEOMETRY
        )
    """)
    # Insert a dummy building in the center of our map view
    conn.execute("""
        INSERT INTO buildings VALUES (
            'TestColonia', '12345', 'Z1', 5, 3, 'respeta la normatividad', 100.0, 
            ST_GeomFromText('POLYGON((-11039000 2202000, -11039000 2202100, -11039100 2202100, -11039100 2202000, -11039000 2202000))')
        )
    """)
    conn.close()
    print('Initialization complete.')

if __name__ == '__main__':
    init_db()
