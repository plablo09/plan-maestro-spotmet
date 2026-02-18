import pytest
from backend.main import app
from backend.db import get_db_connection
from httpx import ASGITransport, AsyncClient

def test_db_connection():
    with get_db_connection() as conn:
        res = conn.execute('SELECT 1').fetchone()
        assert res[0] == 1

@pytest.mark.asyncio
async def test_get_tile_endpoint():
    # We test a tile that likely contains data or at least exists in the logic
    async with AsyncClient(transport=ASGITransport(app=app), base_url='http://test') as ac:
        response = await ac.get('/tiles/13/1839/3645.mvt')
    # Should return 200 (OK) or 204 (No Content) if no data
    assert response.status_code in [200, 204]
