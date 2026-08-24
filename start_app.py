import os
import sys
import subprocess
import time

def main():
    print("=" * 65)
    print("🚀 DIGITAL CITIZEN ASSISTANT - VS CODE LAUNCHER")
    print("=" * 65)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "backend")
    frontend_dir = os.path.join(base_dir, "frontend")

    print("\n1️⃣ Starting FastAPI Backend Server on http://localhost:8000...")
    backend_cmd = [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
    backend_proc = subprocess.Popen(backend_cmd, cwd=backend_dir)

    time.sleep(3)

    print("\n2️⃣ Starting Next.js 14 Frontend Dev Server on http://localhost:3000...")
    frontend_cmd = ["npm.cmd" if os.name == "nt" else "npm", "run", "dev"]
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=frontend_dir)

    print("\n" + "=" * 65)
    print("✅ Full-Stack App Active!")
    print("👉 Frontend: http://localhost:3000")
    print("👉 Backend Docs: http://localhost:8000/docs")
    print("=" * 65)
    print("Press Ctrl+C in terminal to stop both servers.")

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping servers...")
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    main()
