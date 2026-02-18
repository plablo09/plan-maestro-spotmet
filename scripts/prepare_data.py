import geopandas as gpd
import duckdb
import os

INPUT_FILE = "data/data.gpkg"
PARQUET_FILE = "data/data.parquet"
DB_FILE = "data/compliance.db"
TABLE_NAME = "buildings"

def prepare_data():
    print(f"Reading {INPUT_FILE}...")
    if not os.path.exists(INPUT_FILE):
        print(f"Error: {INPUT_FILE} not found!")
        return
        
    gdf = gpd.read_file(INPUT_FILE)
    
    print(f"Original CRS: {gdf.crs}")
    
    # Calculate accurate area (GeoPandas will handle this)
    if gdf.crs == "EPSG:4326":
        gdf_proj = gdf.to_crs("EPSG:6372") # ITRF2008 / Mexico LCC
        gdf['area_m2'] = gdf_proj.area
    else:
        gdf['area_m2'] = gdf.area
        
    print("Reprojecting to EPSG:3857 (Web Mercator)...")
    gdf = gdf.to_crs("EPSG:3857")
    
    gdf = gdf[gdf.geometry.notnull()]
    gdf['area_m2'] = gdf['area_m2'].astype(float)
    
    print(f"Saving to {PARQUET_FILE}...")
    gdf.to_parquet(PARQUET_FILE)
    
    print(f"Creating DuckDB database {DB_FILE}...")
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)
        
    con = duckdb.connect(DB_FILE)
    con.install_extension("spatial")
    con.load_extension("spatial")
    
    print(f"Loading {PARQUET_FILE} into DuckDB...")
    con.execute(f"CREATE TABLE {TABLE_NAME} AS SELECT * FROM read_parquet('{PARQUET_FILE}')")
    
    con.execute(f"CREATE INDEX geom_idx ON {TABLE_NAME} USING RTREE (geometry)")
    
    print("Data preparation complete (EPSG:3857) with persistent area_m2.")
    con.close()

if __name__ == "__main__":
    prepare_data()
