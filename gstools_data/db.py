import psycopg2
from decouple import config

try:
    conn = psycopg2.connect(
        dbname=config("DB_NAME", cast=str),
        user=config("DB_USER", cast=str),
        password=config("DB_PASSWORD", cast=str),
        host=config("DB_HOST", cast=str),  # e.g., 'localhost' or an IP address
        port=config("DB_PORT", cast=str)    # default is 5432
    )
    print("Connection to PostgreSQL successful!")

except psycopg2.Error as e:
    print(f"Error connecting to PostgreSQL: {e}")
