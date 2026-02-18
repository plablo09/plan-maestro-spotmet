import pytest
import duckdb
import os
from backend.main import app
from backend.db import get_db_connection
import backend.db as db_module
from httpx import ASGITransport, AsyncClient

@pytest.fixture(autouse=True)
def setup_test_db(tmp_path):
    # Create a dummy database for tests
    test_db = tmp_path / "test_compliance.db"
    conn = duckdb.connect(str(test_db))
    conn.execute("INSTALL spatial; LOAD spatial;")
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
    # Insert a dummy building in CDMX area (approx)
    # EPSG:3857 coordinates
    conn.execute("""
        INSERT INTO buildings VALUES (
            'TestColonia', '12345', 'Z1', 5, 3, 'respeta la normatividad', 100.0, 
            ST_GeomFromText('POLYGON((-11039000 2202000, -11039000 2202100, -11039100 2202100, -11039100 2202000, -11039000 2202000))')
        )
    """)
    conn.close()
    
    # Override the DB_PATH in the db module
    old_path = db_module.DB_PATH
    db_module.DB_PATH = str(test_db)
    yield
    db_module.DB_PATH = old_path

def test_db_connection():
    with get_db_connection() as conn:
        res = conn.execute('SELECT 1').fetchone()
        assert res[0] == 1

@pytest.mark.asyncio
async def test_get_tile_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url='http://test') as ac:
        # Request a tile that roughly corresponds to the dummy data coordinates
        # Zoom 13, some tile in Mexico City
        response = await ac.get('/tiles/13/1839/3645.mvt')
    assert response.status_code in [200, 204]
