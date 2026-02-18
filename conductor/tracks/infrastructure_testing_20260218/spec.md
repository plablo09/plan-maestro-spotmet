# Specification: Infrastructure, Testing, and CI

## Goal
Establish a robust testing and continuous integration (CI) foundation to ensure long-term stability and code quality. This includes setting up backend and frontend testing frameworks and a GitHub Actions workflow.

## GitHub Workflow Strategy
- **Branching Model:**
    - `main`: Production-ready code.
    - `feat/*`: New features.
    - `fix/*`: Bug fixes.
    - `chore/*`: Infrastructure/maintenance.
- **PR Requirements:**
    - All CI tests must pass before merging.
    - PR descriptions must link to corresponding GitHub Issues (`Closes #X`).

## Functional Requirements
- **Backend Testing (pytest):**
    - Unit tests for DuckDB connection logic in `backend/db.py`.
    - Integration tests for the MVT tile endpoint in `backend/main.py`.
    - Unit tests for area calculation in `scripts/prepare_data.py`.
- **Frontend Testing (vitest):**
    - Unit tests for volume calculation and formatting in `frontend/map.js`.
    - Mock MapLibre to test state transitions.
- **CI Pipeline (GitHub Actions):**
    - Automated test execution on every Push and Pull Request to `main`.

## Technical Requirements
- **Backend:** `pytest`, `pytest-asyncio`, `httpx`.
- **Frontend:** `vitest`, `jsdom`.
- **CI:** `.github/workflows/ci.yml`.
