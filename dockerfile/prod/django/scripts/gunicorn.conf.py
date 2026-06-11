# gunicorn.conf.py
import multiprocessing

bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "gthread"
threads = 4

# Logging
loglevel = "error"
errorlog = "-"

timeout = 30
keepalive = 5 # Keep connections alive for 1s after 1s unlock thread
graceful_timeout = 30 #  Graceful shutdown for workers

# Worker Restart Settings
max_requests = 1000  # Restart workers after processing 1000 requests
max_requests_jitter = 150  # Add randomness to avoid mass restarts

# Process naming
proc_name = "django_shop_tools"

preload_app = True # Fast start of workers

# server machine
reuse_port = True

def post_fork(server, worker):
    from django.db.backends.postgresql.base import DatabaseWrapper

    # clear connection pool where preload_app equal true and inheritance worker
    DatabaseWrapper._connection_pools.clear()
