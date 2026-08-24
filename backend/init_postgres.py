import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
import sys

# Add backend root to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def setup_postgres():
    db_user = os.getenv("DB_USER", "postgres")
    db_pass = os.getenv("DB_PASSWORD", "prince")
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = os.getenv("DB_PORT", "5432")
    db_name = os.getenv("DB_NAME", "digital_citizen_db")

    print(f"Connecting to PostgreSQL server at {db_host}:{db_port} as user '{db_user}'...")
    try:
        conn = psycopg2.connect(
            dbname="postgres",
            user=db_user,
            password=db_pass,
            host=db_host,
            port=db_port
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()

        cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (db_name,))
        exists = cursor.fetchone()

        if not exists:
            print(f"Creating database '{db_name}' in PostgreSQL...")
            cursor.execute(f'CREATE DATABASE "{db_name}"')
            print(f"Database '{db_name}' created successfully!")
        else:
            print(f"Database '{db_name}' verified in PostgreSQL 15.")

        cursor.close()
        conn.close()

        pg_url = f"postgresql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"
        env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
        
        if os.path.exists(env_path):
            with open(env_path, "r") as f:
                lines = f.readlines()
            with open(env_path, "w") as f:
                for line in lines:
                    if line.startswith("DATABASE_URL="):
                        f.write(f"DATABASE_URL={pg_url}\n")
                    else:
                        f.write(line)
            print(f"Updated DATABASE_URL in backend/.env to PostgreSQL 15.")

        os.environ["DATABASE_URL"] = pg_url
        from app.db.seed import seed_database
        seed_database()
        print("PostgreSQL 15 tables and scheme vector embeddings seeded successfully!")

    except Exception as e:
        print(f"PostgreSQL Setup Error: {e}")

if __name__ == "__main__":
    setup_postgres()
