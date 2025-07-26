# backend/Dockerfile
FROM python:3.11-slim

# Set workdir
WORKDIR /app

# Copy requirements (you may have one) or replicate pip install
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend folder
COPY backend/ ./

# Ensure uvicorn is installed
RUN pip install uvicorn

# Expose FastAPI port
EXPOSE 8000

# Start the app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
