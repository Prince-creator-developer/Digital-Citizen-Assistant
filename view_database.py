import sqlite3
import os
import json

db_path = os.path.join(os.path.dirname(__file__), "backend", "digital_citizen.db")

if not os.path.exists(db_path):
    print("Database not found. Run seed script first.")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("=" * 65)
print("📊 DIGITAL CITIZEN DATABASE INSPECTOR")
print("=" * 65)

print("\n--- 1. CATEGORIZED WELFARE SCHEMES & VECTOR EMBEDDINGS ---")
cursor.execute("SELECT id, title, category_tag, department FROM schemes")
for row in cursor.fetchall():
    print(f"ID: {row[0]} | Tag: [{row[2]}] | Title: {row[1]} ({row[3]})")

print("\n--- 2. DEMO CITIZEN PROFILES ---")
cursor.execute("SELECT id, name, phone_number, occupation, annual_income, category FROM citizen_profiles")
for row in cursor.fetchall():
    print(f"ID: {row[0]} | Name: {row[1]} | Phone: {row[2]} | Job: {row[3]} | Income: ₹{row[4]} | Cat: {row[5]}")

print("\n--- 3. REGISTERED APPLICATIONS ---")
cursor.execute("SELECT id, tracking_code, status, remarks FROM applications")
for row in cursor.fetchall():
    print(f"ID: {row[0]} | Code: {row[1]} | Status: {row[2]} | Remarks: {row[3]}")

conn.close()
