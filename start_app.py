import os
import sys
import subprocess
import time
import shutil

def clean_next_cache(frontend_dir):
    """Clean corrupted Next.js build cache on Windows/OneDrive to prevent EINVAL readlink errors."""
    next_cache = os.path.join(frontend_dir, ".next")
    if os.path.exists(next_cache):
        try:
            shutil.rmtree(next_cache)
            print("🧹 Cleared .next cache to prevent Windows EINVAL readlink errors.")
        except Exception as e:
            pass

def main():
    print("=" * 65)
    print("🚀 DIGITAL CITIZEN ASSISTANT - FULL-STACK LAUNCHER")
    print("=" * 65)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "backend")
    frontend_dir = os.path.join(base_dir, "frontend")

    # Clean old next build cache
    clean_next_cache(frontend_dir)

    print("\n1️⃣ Starting FastAPI Backend Server on http://localhost:8000...")
    backend_cmd = [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
    backend_proc = subprocess.Popen(backend_cmd, cwd=backend_dir)

    time.sleep(2)

    print("\n2️⃣ Starting Next.js 14 Frontend Dev Server on http://localhost:3000...")
    frontend_cmd = ["npm.cmd" if os.name == "nt" else "npm", "run", "dev"]
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=frontend_dir)

    print("\n" + "=" * 65)
    print("✅ Full-Stack App Starting!")
    print("👉 Frontend: http://localhost:3000")
    print("👉 Backend Docs: http://localhost:8000/docs")
    print("=" * 65)
    print("Press Ctrl+C in terminal to stop both servers.")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping servers...")
        try:
            backend_proc.terminate()
            frontend_proc.terminate()
        except Exception:
            pass

if __name__ == "__main__":
    main()
