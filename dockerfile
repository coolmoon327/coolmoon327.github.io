FROM python:3.8-slim-buster

WORKDIR /app

COPY "requirements.txt" /app
COPY autoUpdateIP.py /app

RUN pip install --no-cache-dir -r requirements.txt || echo "No requirements.txt"

CMD ["python", "autoUpdateIP.py"]