# Project: Spotmet Compliance 3D Visualization

## Overview
This project visualizes building compliance data in 3D using a vector tile server built with FastAPI, DuckDB (Spatial), and MapLibre GL JS.

## Configuration Details
- **Extrusion Column**: `niv_const` (Representing construction levels, multiplied by 3m for height).
- **Coloring Column**: `rev_normat` (Compliance status).
- **Color Mappings**:
  - `respeta la normatividad`: Green (`#2ecc71`)
  - `igual a la normatividad`: Yellow (`#f1c40f`)
  - `fuera de la normatividad`: Red (`#e74c3c`)
  - `sin información normativa`: Gray (`#95a5a6`)
- **Initial Map View**: Centered at `[-99.18832, 19.40754]` (Centroid of dataset) with a 45° pitch.

## Steps Taken

1.  **Environment Setup**: Created a Python virtual environment (`venv`) and installed dependencies: `geopandas`, `fiona`, `pyogrio`, `pyarrow`, `duckdb`, `fastapi`, and `uvicorn`.
2.  **Data Inspection**: Analyzed `Cumplimiento normativo.gpkg` to identify relevant columns and unique values for styling.
3.  **Data Preparation**: 
    *   Created `scripts/prepare_data.py` to reproject data to EPSG:3857 (Web Mercator).
    *   Ingested data into DuckDB (`data/compliance.db`) using the `spatial` extension.
    *   Created an RTREE spatial index for optimized tile serving.
4.  **Backend Implementation**:
    *   FastAPI application in `backend/main.py`.
    *   Dynamic MVT generation using DuckDB's `ST_AsMVT`, `ST_AsMVTGeom`, and `ST_MakeBox2D`.
5.  **Frontend Implementation**:
    *   MapLibre GL JS interface in `frontend/`.
    *   **Dynamic 3-Step Visualization**: Implemented a state machine to transition between:
        *   **Paso 1: Zonificación Máxima**: Extrusion by `niv_norm`, colored by neighborhood (`colonia`).
        *   **Paso 2: Realidad Actual**: Extrusion by `niv_const`, colored by compliance status (`rev_normat`).
        *   **Paso 3: Potencial Disponible**: Extrusion by the difference (`niv_norm - niv_const`), highlighting overbuilt lots in red.
    *   **Interactive Controls**: Added a top-left control panel with a dark-gray semi-transparent background (`rgba(45, 45, 45, 0.9)`) and navigation buttons.
    *   **Cache-Busting**: Implemented asset versioning (e.g., `?v=1.1`) in `index.html` to force browser updates for CSS and JS.

## Execution
The server is run in the background using the following method to ensure persistence:
```bash
nohup ./venv/bin/python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 > uvicorn.log 2>&1 &
```

### Troubleshooting
- **Port 8000 in use**: If the server fails to start, check if another process is using the port:
  ```bash
  lsof -t -i :8000 | xargs kill -9
  ```

## Status
- Fully functional prototype with dynamic 3D transitions.
- Multi-state visualization controlled via a top-left panel.
- Optimized for performance with pre-projected data.
