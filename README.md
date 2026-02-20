# Alturas y Zonificación: Polígono del Bando 1

Herramienta de visualización 3D para el análisis del cumplimiento normativo y potencial de desarrollo urbano en la Ciudad de México.

## 🌟 Visión
Esta aplicación es una herramienta de comunicación y abogacía diseñada para evidenciar las discrepancias entre la planificación urbana (lo permitido), los registros oficiales (lo registrado) y la realidad física. Su objetivo es fomentar políticas públicas basadas en datos y la adopción de herramientas tecnológicas para el monitoreo continuo del desarrollo urbano.

## 🛠️ Tecnologías

### Backend
- **Python (FastAPI):** API de alto rendimiento para servir mosaicos vectoriales (MVT).
- **DuckDB + Spatial:** Base de datos analítica con capacidades geoespaciales avanzadas.
- **Gunicorn/Uvicorn:** Servidor de producción robusto.

### Frontend
- **MapLibre GL JS:** Motor de renderizado 3D de mapas de alto desempeño.
- **Vanilla JS (ESM):** Lógica modular sin dependencias pesadas.
- **CSS3:** Interfaz moderna con efectos de desenfoque (`backdrop-filter`) y diseño responsivo.

### Calidad e Infraestructura
- **Pytest:** Pruebas unitarias e integración para el backend.
- **Vitest:** Pruebas unitarias para la lógica del frontend.
- **Playwright:** Pruebas de extremo a extremo (E2E) para asegurar la estabilidad del navegador.
- **Docker:** Contenedores para desarrollo y despliegue consistente.
- **GitHub Actions:** Pipeline de Integración Continua (CI).

## 🚀 Despliegue con Docker

Para poner en marcha la aplicación en cualquier entorno con Docker:

```bash
# Construir e iniciar los contenedores
docker compose up --build -d
```

La aplicación estará disponible en [http://localhost:8000](http://localhost:8000).

## 💻 Desarrollo Local

1. **Requisitos:** Python 3.11+ y Node.js 20+.
2. **Instalar dependencias:**
   ```bash
   pip install -r backend/requirements.txt
   npm install
   ```
3. **Preparar datos:**
   ```bash
   python scripts/prepare_data.py
   ```
4. **Iniciar servidor:**
   ```bash
   PYTHONPATH=. uvicorn backend.main:app --reload
   ```

## 🧪 Pruebas

Puedes correr la suite completa de pruebas usando Docker:

```bash
docker compose -f docker-compose.test.yml run backend-test
docker compose -f docker-compose.test.yml run frontend-test
docker compose -f docker-compose.test.yml run e2e-test
```
