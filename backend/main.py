from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .db import get_db_connection
import math

app = FastAPI(title="Spotmet Compliance 3D API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MVT tile serving logic
@app.get("/tiles/{z}/{x}/{y}.mvt")
async def get_tile(z: int, x: int, y: int):
    with get_db_connection() as conn:
        # Calculate bounds for the tile in Web Mercator (EPSG:3857)
        EXTENT = 20037508.342789244
        tile_size = (2 * EXTENT) / (2**z)
        x_min = x * tile_size - EXTENT
        y_max = EXTENT - y * tile_size
        x_max = x_min + tile_size
        y_min = y_max - tile_size

        # SQL to generate MVT
        # Using ST_MakeBox2D with ST_Point
        query = f"""
        SELECT ST_AsMVT(t, 'buildings', 4096, 'geom')
        FROM (
            SELECT 
                colonia,
                cta_catast,
                zonif,
                niv_norm,
                niv_const,
                rev_normat,
                edad_const,
                ST_AsMVTGeom(geometry, ST_MakeBox2D(ST_Point({x_min}, {y_min}), ST_Point({x_max}, {y_max})), 4096, 0, false) as geom
            FROM buildings
            WHERE ST_Intersects(geometry, ST_MakeEnvelope({x_min}, {y_min}, {x_max}, {y_max}))
        ) AS t;
        """
        try:
            result = conn.execute(query).fetchone()
            if result and result[0]:
                return Response(content=result[0], media_type="application/x-protobuf")
            else:
                return Response(status_code=204)
        except Exception as e:
            print(f"Error generating tile: {e}")
            raise HTTPException(status_code=500, detail=str(e))

# Serve static files for the frontend
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
