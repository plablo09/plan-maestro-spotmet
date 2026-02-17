import geopandas as gpd
import duckdb
import os

INPUT_FILE = "data/Cumplimiento normativo.gpkg"
PARQUET_FILE = "data/data.parquet"
DB_FILE = "data/compliance.db"
TABLE_NAME = "buildings"

def prepare_data():
    print(f"Reading {INPUT_FILE}...")
    gdf = gpd.read_file(INPUT_FILE)
    
    # Reproject to EPSG:3857 for efficient tile generation
    print("Reprojecting to EPSG:3857 (Web Mercator)...")
    gdf = gdf.to_crs("EPSG:3857")
    
    # Drop rows with null geometry
    gdf = gdf[gdf.geometry.notnull()]
    
    print(f"Saving to {PARQUET_FILE}...")
    gdf.to_parquet(PARQUET_FILE)
    
    print(f"Creating DuckDB database {DB_FILE}...")
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)
        
    con = duckdb.connect(DB_FILE)
    con.install_extension("spatial")
    con.load_extension("spatial")
    
    # Load into DuckDB. We try to cast to GEOMETRY.
    try:
        # We use ST_GeomFromWKB if possible, but GeoPandas 3857 might be complex.
        # Let's try the direct load first as it worked before.
        con.execute(f"CREATE TABLE {TABLE_NAME} AS SELECT * FROM read_parquet('{PARQUET_FILE}')")
    except Exception as e:
        print(f"Direct load failed: {e}. Trying alternative...")
        con.execute(f"CREATE TABLE {TABLE_NAME} AS SELECT * EXCLUDE geometry, ST_GeomFromWKB(geometry::BLOB) AS geometry FROM read_parquet('{PARQUET_FILE}')")
    
    con.execute(f"CREATE INDEX geom_idx ON {TABLE_NAME} USING RTREE (geometry)")
    
    print("Data preparation complete (EPSG:3857).")
    con.close()

if __name__ == "__main__":
    prepare_data()
