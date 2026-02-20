FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \n    libsqlite3-dev \n    libgdal-dev \n    g++ \n    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt . 
RUN pip install --no-cache-dir --upgrade pip && \n    pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port
EXPOSE 8000

# Start production server
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "backend.main:app", "--bind", "0.0.0.0:8000"]
