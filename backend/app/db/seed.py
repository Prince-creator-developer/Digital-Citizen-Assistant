import sys
import os

# Add backend root to python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.database import SessionLocal, engine, Base
from app.models.models import Scheme, CitizenProfile, Application
from app.services.vector_service import generate_text_embedding

def seed_database():
    print("Initializing Database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Re-seed to update database with all new scheme categories
        db.query(Application).delete()
        db.query(CitizenProfile).delete()
        db.query(Scheme).delete()
        db.commit()

        print("Seeding Categorized Government Welfare Schemes with Vector Embeddings...")
        
        categorized_schemes = [
            {
                "title": "PM-KISAN Samman Nidhi Yojana",
                "department": "Ministry of Agriculture and Farmers Welfare",
                "summary": "Direct income support of ₹6,000 per year in 3 equal installments to farmer families across India.",
                "category_tag": "Farmers",
                "benefits": "₹6,000 annually credited directly into bank accounts via DBT.",
                "eligibility_rules": {"max_income": 300000, "min_age": 18, "occupation": "Farmer"},
                "application_link": "https://pmkisan.gov.in"
            },
            {
                "title": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                "department": "Ministry of Agriculture",
                "summary": "Crop insurance scheme supporting sustainable production in agriculture sector against natural calamities.",
                "category_tag": "Farmers",
                "benefits": "Financial support to farmers suffering crop loss/damage arising out of unforeseen events.",
                "eligibility_rules": {"max_income": 400000, "min_age": 18, "occupation": "Farmer"},
                "application_link": "https://pmfby.gov.in"
            },
            {
                "title": "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
                "department": "Ministry of Rural Development",
                "summary": "Monthly pension assistance for senior citizens living below the poverty line (BPL).",
                "category_tag": "Elders",
                "benefits": "Monthly cash pension of ₹1,000 to ₹1,500 directly into beneficiary account.",
                "eligibility_rules": {"max_income": 120000, "min_age": 60, "category": "BPL"},
                "application_link": "https://nsap.nic.in"
            },
            {
                "title": "Vayoshri Yojana - Senior Citizen Assistive Devices",
                "department": "Ministry of Social Justice and Empowerment",
                "summary": "Provides physical aids and assisted-living devices for senior citizens belonging to BPL category.",
                "category_tag": "Elders",
                "benefits": "Free spectacles, hearing aids, walking sticks, and wheelchairs.",
                "eligibility_rules": {"max_income": 150000, "min_age": 60, "category": "BPL"},
                "application_link": "https://socialjustice.gov.in"
            },
            {
                "title": "Sukanya Samriddhi Yojana (SSY)",
                "department": "Ministry of Finance",
                "summary": "Small deposit savings scheme for girl child with guaranteed high interest rate and tax savings.",
                "category_tag": "Children",
                "benefits": "8.2% annual interest rate, Section 80C tax exemption for girl child education & marriage.",
                "eligibility_rules": {"max_age_girl": 10, "gender": "Female"},
                "application_link": "https://www.indiapost.gov.in"
            },
            {
                "title": "PM POSHAN / Mid-Day Meal Scheme",
                "department": "Ministry of Education",
                "summary": "Provides free balanced nutritional meals to school children in government & aided schools.",
                "category_tag": "Children",
                "benefits": "Free hot cooked meal daily to improve nutritional status of primary & upper primary students.",
                "eligibility_rules": {"min_age": 5, "max_age": 14, "school_type": "Government"},
                "application_link": "https://pmposhan.education.gov.in"
            },
            {
                "title": "Antyodaya Anna Yojana (AAY) - BPL Ration Scheme",
                "department": "Ministry of Consumer Affairs, Food and Public Distribution",
                "summary": "Provides heavily subsidized food grains to the poorest of poor BPL households in India.",
                "category_tag": "BPL",
                "benefits": "35 kg food grains per family per month (Rice at ₹3/kg, Wheat at ₹2/kg).",
                "eligibility_rules": {"max_income": 100000, "category": "BPL"},
                "application_link": "https://nfsa.gov.in"
            },
            {
                "title": "PM Garib Kalyan Anna Yojana (PMGKAY)",
                "department": "Ministry of Consumer Affairs",
                "summary": "Free food grain distribution scheme for all eligible BPL & NFSA ration card holders.",
                "category_tag": "BPL",
                "benefits": "5 kg free food grains per person per month.",
                "eligibility_rules": {"max_income": 150000, "category": "BPL"},
                "application_link": "https://pmgkay.dfpd.gov.in"
            },
            {
                "title": "PM Vishwakarma Scheme",
                "department": "Ministry of Micro, Small and Medium Enterprises",
                "summary": "Holistic support scheme for traditional artisans and craftspeople providing skill training, toolkit incentives, and low-interest loans.",
                "category_tag": "Artisans",
                "benefits": "Toolkit incentive of ₹15,000, credit support up to ₹3 Lakh at 5% interest rate.",
                "eligibility_rules": {"max_income": 400000, "min_age": 18, "occupation": "Artisan/Craftsperson"},
                "application_link": "https://pmvishwakarma.gov.in"
            },
            {
                "title": "PM Matru Vandana Yojana (PMMVY)",
                "department": "Ministry of Women and Child Development",
                "summary": "Maternity benefit cash incentive for pregnant women and lactating mothers.",
                "category_tag": "Women",
                "benefits": "Direct cash incentive of ₹5,000 in three installments for first living child.",
                "eligibility_rules": {"gender": "Female", "min_age": 19},
                "application_link": "https://pmmvy.wcd.gov.in"
            }
        ]

        schemes_to_add = []
        for item in categorized_schemes:
            text_for_embedding = f"{item['title']} {item['summary']} {item['category_tag']} {item['benefits']}"
            vec = generate_text_embedding(text_for_embedding)
            
            sch = Scheme(
                title=item["title"],
                department=item["department"],
                summary=item["summary"],
                category_tag=item["category_tag"],
                benefits=item["benefits"],
                eligibility_rules=item["eligibility_rules"],
                vector_embedding=vec,
                application_link=item["application_link"]
            )
            schemes_to_add.append(sch)

        db.add_all(schemes_to_add)
        db.commit()

        print("Seeding Demo Citizen Profile...")
        citizen = CitizenProfile(
            phone_number="9876543210",
            name="रामेश कुमार (Ramesh Kumar)",
            age=42,
            gender="Male",
            state="Uttar Pradesh",
            annual_income=140000,
            occupation="Farmer",
            category="BPL",
            language_preference="hi"
        )
        db.add(citizen)
        db.commit()
        db.refresh(citizen)

        print("Seeding Demo Application...")
        app1 = Application(
            tracking_code="GOV-SIH-998822A",
            citizen_id=citizen.id,
            scheme_id=schemes_to_add[0].id,
            status="DBT Processed",
            documents_url="https://storage.gov.in/docs/ramesh_aadhaar.pdf",
            verification_score=98.5,
            ocr_extracted_data={"name": "Ramesh Kumar", "aadhaar_last4": "4402", "state": "Uttar Pradesh"},
            remarks="₹2,000 installment credited to SBI A/C ending 4402"
        )
        db.add(app1)
        db.commit()

        print("Database Seed Completed Successfully! Categories: Farmers, Elders, Children, BPL, Artisans, Women.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
