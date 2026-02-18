# Project: Spotmet Compliance 3D Visualization

## Overview
This project visualizes building compliance data in 3D using a vector tile server built with FastAPI, DuckDB (Spatial), and MapLibre GL JS.

## Configuration Details
- **Extrusion Column**: `niv_const` (Representing construction levels, multiplied by 3m for height).
- **Coloring Column**: `rev_normat` (Compliance status).
- **Initial Map View**: Centered at `[-99.17137, 19.40198]` with a 56° pitch.

## Steps Taken

1.  **Environment Setup**: Python venv with `geopandas`, `duckdb`, `fastapi`, and `uvicorn`.
2.  **Data Preparation**: 
    *   `scripts/prepare_data.py`: Calculates accurate `area_m2` using GeoPandas (projecting to EPSG:6372 for CDMX) before reprojecting to EPSG:3857.
    *   Data is persisted in `data/data.parquet` and `data/compliance.db`.
3.  **Backend Implementation**:
    *   FastAPI (`backend/main.py`) serves MVTs from DuckDB.
    *   Query optimized to include `lot_area` (from `area_m2`) for frontend calculations.
4.  **Frontend Implementation**:
    *   **Dynamic 3-Step Visualization**:
        *   **Paso 1: Zonificación Máxima**: Extrusion by `niv_norm`, colored by neighborhood.
        *   **Paso 2: Realidad Actual**: Extrusion by `niv_const`, colored by compliance.
        *   **Paso 3: Potencial Disponible**: Extrusion by difference (`niv_norm - niv_const`).
    *   **Live Statistics**: Control panel displays aggregated volume (m³) for the current viewport using `lot_area`.
    *   **Cache Management**: Implemented asset and tile versioning (`v=1.9`) to ensure data consistency.

## Execution
```bash
nohup ./venv/bin/python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 > uvicorn.log 2>&1 &
```

## Status
- Fully functional with live volume aggregation and multi-state 3D transitions.
