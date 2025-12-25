# gunicorn.conf.py
import multiprocessing

bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "eventlet"
# worker_connections = 1000

# Logging
loglevel = "error"
errorlog = "-"
accesslog = "-"

# Timeouts
timeout = 30 # Automatically restart workers if they take too long
keepalive = 3 # Keep connections alive for 3s
graceful_timeout = 30 #  Graceful shutdown for workers

# Worker Restart Settings
max_requests = 1000  # Restart workers after processing 1000 requests
max_requests_jitter = 50  # Add randomness to avoid mass restarts

# Process naming
proc_name = "django_asgi"

# Gunicorn Configuration for Nginx
proxy_protocol = True  # Enable proxy support
