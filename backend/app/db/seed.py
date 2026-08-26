import sys
import os
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.database import SessionLocal, engine, Base
from app.models.models import Scheme, CitizenProfile, Application
from app.services.vector_service import generate_text_embedding

def seed_database():
    print("Initializing Database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        db.query(Application).delete()
        db.query(CitizenProfile).delete()
        db.query(Scheme).delete()
        db.commit()

        print("Seeding 50+ Government Welfare Schemes with Vector Embeddings...")

        categorized_schemes = [
            # ─── FARMERS (किसान) ──────────────────────────────────────────────
            {
                "title": "PM-KISAN Samman Nidhi Yojana",
                "department": "Ministry of Agriculture and Farmers Welfare",
                "summary": "Direct income support of ₹6,000 per year in 3 equal installments of ₹2,000 to small and marginal farmer families across India.",
                "category_tag": "Farmers",
                "benefits": "₹6,000 annually credited directly into bank accounts via DBT in three installments.",
                "eligibility_rules": {"max_income": 300000, "min_age": 18, "occupation": "Farmer"},
                "application_link": "https://pmkisan.gov.in"
            },
            {
                "title": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                "department": "Ministry of Agriculture",
                "summary": "Comprehensive crop insurance scheme protecting farmers against financial losses due to natural calamities, pests, and diseases.",
                "category_tag": "Farmers",
                "benefits": "Full insured sum for complete crop loss; proportional for partial loss. Premium: Kharif 2%, Rabi 1.5%.",
                "eligibility_rules": {"max_income": 400000, "min_age": 18, "occupation": "Farmer"},
                "application_link": "https://pmfby.gov.in"
            },
            {
                "title": "Kisan Credit Card (KCC) Scheme",
                "department": "Ministry of Agriculture and Farmers Welfare",
                "summary": "Provides farmers with short-term formal credit for agricultural operations, allied activities, and non-farm expenses.",
                "category_tag": "Farmers",
                "benefits": "Revolving credit up to ₹3 Lakh at 4% interest rate (after government subsidy) for crop production needs.",
                "eligibility_rules": {"max_income": 500000, "min_age": 18, "occupation": "Farmer"},
                "application_link": "https://www.nabard.org/content1.aspx?id=572"
            },
            {
                "title": "PM Krishi Sinchai Yojana (PMKSY)",
                "department": "Ministry of Jal Shakti",
                "summary": "Ensures irrigation access to every agricultural field — Har Khet Ko Pani — and improved water use efficiency — More Crop Per Drop.",
                "category_tag": "Farmers",
                "benefits": "Subsidy up to 55% for small/marginal farmers on micro-irrigation equipment (drip/sprinkler systems).",
                "eligibility_rules": {"max_income": 500000, "min_age": 18, "occupation": "Farmer"},
                "application_link": "https://pmksy.gov.in"
            },
            {
                "title": "Soil Health Card Scheme",
                "department": "Ministry of Agriculture and Farmers Welfare",
                "summary": "Provides farmers with a Soil Health Card containing crop-wise nutrient recommendations for their farm land.",
                "category_tag": "Farmers",
                "benefits": "Free soil testing every 2 years; personalized fertilizer recommendations to reduce input costs and increase yields.",
                "eligibility_rules": {"min_age": 18, "occupation": "Farmer"},
                "application_link": "https://soilhealth.dac.gov.in"
            },
            {
                "title": "National Agriculture Market (e-NAM)",
                "department": "Ministry of Agriculture and Farmers Welfare",
                "summary": "Pan-India electronic trading portal for agricultural commodities enabling farmers to get better prices for their produce.",
                "category_tag": "Farmers",
                "benefits": "Online price discovery and trading across 1000+ mandis. Eliminates middlemen and ensures fair market prices.",
                "eligibility_rules": {"min_age": 18, "occupation": "Farmer"},
                "application_link": "https://enam.gov.in"
            },
            {
                "title": "PM Annadata Aay Sanrakshan Abhiyan (PM-AASHA)",
                "department": "Ministry of Agriculture",
                "summary": "Ensures remunerative prices to farmers for their produce by guaranteeing MSP for oilseeds, pulses, and copra.",
                "category_tag": "Farmers",
                "benefits": "Price support at Minimum Support Price (MSP) through procurement by government agencies.",
                "eligibility_rules": {"min_age": 18, "occupation": "Farmer"},
                "application_link": "https://agriculture.gov.in"
            },
            {
                "title": "Rashtriya Krishi Vikas Yojana (RKVY)",
                "department": "Ministry of Agriculture and Farmers Welfare",
                "summary": "Incentivizes state governments to increase investment in agriculture and allied sectors for holistic agricultural development.",
                "category_tag": "Farmers",
                "benefits": "Grants for farm infrastructure, agri-business incubation, and farmer entrepreneurship programs.",
                "eligibility_rules": {"min_age": 18, "occupation": "Farmer"},
                "application_link": "https://rkvy.nic.in"
            },

            # ─── ELDERS (वरिष्ठ नागरिक) ──────────────────────────────────────
            {
                "title": "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
                "department": "Ministry of Rural Development",
                "summary": "Monthly pension assistance for senior citizens aged 60 and above living below the poverty line (BPL).",
                "category_tag": "Elders",
                "benefits": "Monthly cash pension: ₹1,000 (age 60-79), ₹1,500 (age 80+) credited directly into bank accounts.",
                "eligibility_rules": {"max_income": 120000, "min_age": 60, "category": "BPL"},
                "application_link": "https://nsap.nic.in"
            },
            {
                "title": "Vayoshri Yojana — Senior Citizen Assistive Devices",
                "department": "Ministry of Social Justice and Empowerment",
                "summary": "Provides physical aids and assisted-living devices free of cost to senior citizens of BPL category.",
                "category_tag": "Elders",
                "benefits": "Free spectacles, hearing aids, walking sticks, wheelchairs, dentures, and other assistive devices.",
                "eligibility_rules": {"max_income": 150000, "min_age": 60, "category": "BPL"},
                "application_link": "https://socialjustice.gov.in"
            },
            {
                "title": "Indira Gandhi National Widow Pension Scheme (IGNWPS)",
                "department": "Ministry of Rural Development",
                "summary": "Monthly financial assistance to widows aged 40-79 years who are BPL category beneficiaries.",
                "category_tag": "Elders",
                "benefits": "Monthly pension of ₹1,500 per month under the National Social Assistance Programme.",
                "eligibility_rules": {"max_income": 120000, "min_age": 40, "max_age": 79, "gender": "Female", "category": "BPL"},
                "application_link": "https://nsap.nic.in"
            },
            {
                "title": "Senior Citizens Savings Scheme (SCSS)",
                "department": "Ministry of Finance",
                "summary": "Government-backed savings scheme exclusively for senior citizens offering highest guaranteed returns among small savings schemes.",
                "category_tag": "Elders",
                "benefits": "8.2% annual interest rate (quarterly payout), investment limit ₹30 Lakh, 5-year tenure with extension option.",
                "eligibility_rules": {"min_age": 60},
                "application_link": "https://www.indiapost.gov.in"
            },
            {
                "title": "Varishtha Pension Bima Yojana (VPBY)",
                "department": "Ministry of Finance / LIC of India",
                "summary": "Pension scheme for senior citizens providing guaranteed pension returns through LIC of India for 10 years.",
                "category_tag": "Elders",
                "benefits": "Guaranteed pension of 9.3% p.a. for 10 years. Purchase price up to ₹15 Lakh.",
                "eligibility_rules": {"min_age": 60},
                "application_link": "https://licindia.in"
            },
            {
                "title": "Rashtriya Vayoshri Yojana (RVY)",
                "department": "Ministry of Social Justice and Empowerment",
                "summary": "Distribution camps at block/gram panchayat level providing assisted-living aids for BPL senior citizens.",
                "category_tag": "Elders",
                "benefits": "Mobility aids, vision aids, hearing aids distributed through government camps at village level.",
                "eligibility_rules": {"max_income": 150000, "min_age": 60, "category": "BPL"},
                "application_link": "https://alimco.in"
            },

            # ─── CHILDREN (बच्चे एवं छात्र) ───────────────────────────────────
            {
                "title": "Sukanya Samriddhi Yojana (SSY)",
                "department": "Ministry of Finance",
                "summary": "Small deposit savings scheme for girl child with guaranteed high interest rate, tax savings, and maturity benefits for education and marriage.",
                "category_tag": "Children",
                "benefits": "8.2% annual interest rate, Section 80C tax exemption, maturity amount tax-free, investment ₹250 to ₹1.5 Lakh per year.",
                "eligibility_rules": {"max_age_girl": 10, "gender": "Female"},
                "application_link": "https://www.indiapost.gov.in"
            },
            {
                "title": "PM POSHAN / Mid-Day Meal Scheme",
                "department": "Ministry of Education",
                "summary": "Provides free balanced nutritional hot cooked meals to school children in government and government-aided schools.",
                "category_tag": "Children",
                "benefits": "Free hot cooked meal daily (700 calories, 20g protein) to primary and upper primary school students.",
                "eligibility_rules": {"min_age": 5, "max_age": 14, "school_type": "Government"},
                "application_link": "https://pmposhan.education.gov.in"
            },
            {
                "title": "National Scholarship Portal (NSP) — Pre-Matric Scholarships",
                "department": "Ministry of Education",
                "summary": "Financial assistance to students from SC/ST/OBC/Minority communities studying at pre-matric level (Class 1-10).",
                "category_tag": "Children",
                "benefits": "₹1,000 to ₹2,250 per month scholarship for day scholars; ₹3,500 per month for hostellers.",
                "eligibility_rules": {"max_income": 250000, "min_age": 5, "max_age": 16},
                "application_link": "https://scholarships.gov.in"
            },
            {
                "title": "Beti Bachao Beti Padhao (BBBP)",
                "department": "Ministry of Women and Child Development",
                "summary": "Campaign to prevent gender-biased sex selective elimination and ensure survival, protection, and education of the girl child.",
                "category_tag": "Children",
                "benefits": "Conditional cash transfer, free education for girls, awareness campaigns, and skill development programs.",
                "eligibility_rules": {"gender": "Female"},
                "application_link": "https://wcd.nic.in/bbbp-schemes"
            },
            {
                "title": "Integrated Child Development Services (ICDS)",
                "department": "Ministry of Women and Child Development",
                "summary": "Provides supplementary nutrition, pre-school education, immunization, health check-ups, and referral services to children under 6.",
                "category_tag": "Children",
                "benefits": "Free supplementary nutrition, immunization, health check-up, and anganwadi-based pre-school education.",
                "eligibility_rules": {"max_age": 6},
                "application_link": "https://icds-wcd.nic.in"
            },
            {
                "title": "PM Scholarship Scheme for Central Armed Police Forces (CAPF)",
                "department": "Ministry of Home Affairs",
                "summary": "Scholarship to wards of CAPF and Railway Protection Force for pursuing professional courses.",
                "category_tag": "Children",
                "benefits": "₹2,500 per month for boys and ₹3,000 per month for girls for professional education.",
                "eligibility_rules": {"min_age": 17, "max_age": 25},
                "application_link": "https://scholarships.gov.in"
            },

            # ─── BPL / POVERTY ALLEVIATION ────────────────────────────────────
            {
                "title": "Antyodaya Anna Yojana (AAY) — BPL Ration Scheme",
                "department": "Ministry of Consumer Affairs, Food and Public Distribution",
                "summary": "Heavily subsidized food grains provided to the poorest of poor BPL households under the National Food Security Act.",
                "category_tag": "BPL",
                "benefits": "35 kg food grains per family per month: Rice at ₹3/kg, Wheat at ₹2/kg, Coarse grains at ₹1/kg.",
                "eligibility_rules": {"max_income": 100000, "category": "BPL"},
                "application_link": "https://nfsa.gov.in"
            },
            {
                "title": "PM Garib Kalyan Anna Yojana (PMGKAY)",
                "department": "Ministry of Consumer Affairs",
                "summary": "Free food grain scheme providing 5 kg free rice/wheat per person per month to all 80 crore NFSA beneficiaries.",
                "category_tag": "BPL",
                "benefits": "5 kg free food grains per person per month — fully funded by the Central Government.",
                "eligibility_rules": {"max_income": 150000, "category": "BPL"},
                "application_link": "https://pmgkay.dfpd.gov.in"
            },
            {
                "title": "PM Awas Yojana — Gramin (PMAY-G)",
                "department": "Ministry of Rural Development",
                "summary": "Pucca house with basic amenities for rural BPL families living in kutcha/dilapidated houses by 2024.",
                "category_tag": "BPL",
                "benefits": "₹1.20 Lakh (plains) to ₹1.30 Lakh (hilly/difficult areas) for house construction. MGNREGS wages additionally.",
                "eligibility_rules": {"max_income": 180000, "category": "BPL", "area": "Rural"},
                "application_link": "https://pmayg.nic.in"
            },
            {
                "title": "PM Awas Yojana — Urban (PMAY-U)",
                "department": "Ministry of Housing and Urban Affairs",
                "summary": "Housing for All in Urban areas — providing financial assistance for construction and purchase of pucca house for EWS/LIG/MIG.",
                "category_tag": "BPL",
                "benefits": "Interest subsidy up to ₹2.67 Lakh on home loan; direct grant for EWS beneficiaries up to ₹1.5 Lakh.",
                "eligibility_rules": {"max_income": 1800000, "category": "EWS/LIG/MIG"},
                "application_link": "https://pmaymis.gov.in"
            },
            {
                "title": "PM Jan Dhan Yojana (PMJDY)",
                "department": "Ministry of Finance",
                "summary": "National mission for financial inclusion providing universal banking access with zero balance account, RuPay debit card, and insurance cover.",
                "category_tag": "BPL",
                "benefits": "Zero balance savings account, RuPay debit card, ₹2 Lakh accident insurance, ₹30,000 life insurance, OD facility up to ₹10,000.",
                "eligibility_rules": {"min_age": 10},
                "application_link": "https://pmjdy.gov.in"
            },
            {
                "title": "PM Jeevan Jyoti Bima Yojana (PMJJBY)",
                "department": "Ministry of Finance",
                "summary": "Low-cost annual renewable life insurance scheme for bank account holders covering death due to any cause.",
                "category_tag": "BPL",
                "benefits": "₹2 Lakh life insurance cover for annual premium of only ₹436. Auto-debit from bank account.",
                "eligibility_rules": {"min_age": 18, "max_age": 50},
                "application_link": "https://jansuraksha.gov.in"
            },
            {
                "title": "PM Suraksha Bima Yojana (PMSBY)",
                "department": "Ministry of Finance",
                "summary": "Accidental death and disability insurance scheme for bank account holders at an affordable annual premium.",
                "category_tag": "BPL",
                "benefits": "₹2 Lakh for accidental death/full disability, ₹1 Lakh for partial disability. Annual premium: only ₹20.",
                "eligibility_rules": {"min_age": 18, "max_age": 70},
                "application_link": "https://jansuraksha.gov.in"
            },
            {
                "title": "Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)",
                "department": "Ministry of Rural Development",
                "summary": "Guarantees 100 days of wage employment per financial year to every rural household willing to do unskilled manual work.",
                "category_tag": "BPL",
                "benefits": "100 days of guaranteed unskilled wage work at state-notified minimum wage (₹200-350/day). Job Card issued free.",
                "eligibility_rules": {"category": "Rural", "min_age": 18},
                "application_link": "https://nrega.nic.in"
            },
            {
                "title": "PM Ujjwala Yojana (PMUY)",
                "department": "Ministry of Petroleum and Natural Gas",
                "summary": "Free LPG connection to women from BPL households to replace polluting cooking fuels and protect women's health.",
                "category_tag": "BPL",
                "benefits": "Free LPG connection (with deposit waiver), free first refill, and free stove to BPL women.",
                "eligibility_rules": {"max_income": 150000, "gender": "Female", "category": "BPL"},
                "application_link": "https://pmuy.gov.in"
            },
            {
                "title": "Ayushman Bharat PM Jan Arogya Yojana (AB-PMJAY)",
                "department": "Ministry of Health and Family Welfare",
                "summary": "World's largest health assurance scheme providing ₹5 Lakh per family per year for secondary and tertiary hospitalization.",
                "category_tag": "BPL",
                "benefits": "₹5 Lakh health cover per family per year at empanelled hospitals. Covers pre and post-hospitalization expenses.",
                "eligibility_rules": {"category": "BPL/SECC"},
                "application_link": "https://pmjay.gov.in"
            },
            {
                "title": "PM SVANidhi — Street Vendor Micro Loan",
                "department": "Ministry of Housing and Urban Affairs",
                "summary": "Micro-credit facility for street vendors to resume livelihoods post COVID-19 disruption.",
                "category_tag": "BPL",
                "benefits": "Collateral-free loan: ₹10,000 (1st), ₹20,000 (2nd), ₹50,000 (3rd tranche). 7% interest subsidy.",
                "eligibility_rules": {"min_age": 18, "occupation": "Street Vendor"},
                "application_link": "https://pmsvanidhi.mohua.gov.in"
            },
            {
                "title": "National Social Assistance Programme (NSAP)",
                "department": "Ministry of Rural Development",
                "summary": "Welfare program providing social assistance to the aged, widows, disabled, and bereaved families below poverty line.",
                "category_tag": "BPL",
                "benefits": "Monthly pension ₹1,000-₹1,500. Lump sum family benefit of ₹20,000 on death of primary earner.",
                "eligibility_rules": {"max_income": 120000, "category": "BPL"},
                "application_link": "https://nsap.nic.in"
            },

            # ─── ARTISANS (कारीगर) ───────────────────────────────────────────
            {
                "title": "PM Vishwakarma Scheme",
                "department": "Ministry of Micro, Small and Medium Enterprises",
                "summary": "Holistic support for traditional artisans and craftspeople with skill training, modern toolkit incentives, and collateral-free credit.",
                "category_tag": "Artisans",
                "benefits": "₹15,000 toolkit incentive, credit up to ₹3 Lakh at 5% interest, PM Vishwakarma certificate and ID card.",
                "eligibility_rules": {"max_income": 400000, "min_age": 18, "occupation": "Artisan/Craftsperson"},
                "application_link": "https://pmvishwakarma.gov.in"
            },
            {
                "title": "Ambedkar Hastshilp Vikas Yojana",
                "department": "Ministry of Textiles / DC Handicrafts",
                "summary": "Infrastructure and skill development for artisan clusters to produce quality handicrafts and access domestic and export markets.",
                "category_tag": "Artisans",
                "benefits": "Training, infrastructure support, design intervention, and market linkage assistance for artisan clusters.",
                "eligibility_rules": {"min_age": 18, "occupation": "Handicraft Artisan"},
                "application_link": "https://handicrafts.nic.in"
            },
            {
                "title": "Mudra Yojana — Tarun Category (Artisans)",
                "department": "Ministry of Finance / MUDRA",
                "summary": "Collateral-free micro-enterprise loans to artisans and small craftspeople under Pradhan Mantri MUDRA Yojana.",
                "category_tag": "Artisans",
                "benefits": "Shishu: Up to ₹50,000 | Kishore: ₹50K-5L | Tarun: ₹5L-10L. No collateral required.",
                "eligibility_rules": {"min_age": 18, "occupation": "Artisan/Self-Employed"},
                "application_link": "https://mudra.org.in"
            },
            {
                "title": "Rajiv Gandhi Shilpi Swasthya Bima Yojana",
                "department": "Ministry of Textiles / DC Handicrafts",
                "summary": "Health insurance scheme for handicraft artisans and their family members.",
                "category_tag": "Artisans",
                "benefits": "₹30,000 annual health coverage for artisan and family (up to 5 members). Free OPD up to ₹7,500.",
                "eligibility_rules": {"min_age": 18, "max_age": 65, "occupation": "Handicraft Artisan"},
                "application_link": "https://handicrafts.nic.in"
            },
            {
                "title": "National Handloom Development Programme (NHDP)",
                "department": "Ministry of Textiles",
                "summary": "Comprehensive development of handloom sector through cluster development, weavers' credit cards, and market linkages.",
                "category_tag": "Artisans",
                "benefits": "Weavers' Credit Card (up to ₹2L), infrastructure support, design & technology upgradation, marketing assistance.",
                "eligibility_rules": {"min_age": 18, "occupation": "Handloom Weaver"},
                "application_link": "https://handlooms.nic.in"
            },
            {
                "title": "SAMARTH — Scheme for Capacity Building in Textiles",
                "department": "Ministry of Textiles",
                "summary": "Demand-driven placement-linked skill development scheme to skill 10 lakh persons in textiles and apparel sector.",
                "category_tag": "Artisans",
                "benefits": "Free skill training, stipend of ₹500-1500/month during training, placement assistance, certificate.",
                "eligibility_rules": {"min_age": 14, "max_age": 35},
                "application_link": "https://samarth-textiles.gov.in"
            },

            # ─── WOMEN (महिलाएं) ──────────────────────────────────────────────
            {
                "title": "PM Matru Vandana Yojana (PMMVY)",
                "department": "Ministry of Women and Child Development",
                "summary": "Maternity benefit cash incentive for pregnant women and lactating mothers for first and second living child.",
                "category_tag": "Women",
                "benefits": "Cash incentive of ₹5,000 (1st child) and ₹6,000 (2nd child if girl) in multiple installments.",
                "eligibility_rules": {"gender": "Female", "min_age": 19},
                "application_link": "https://pmmvy.wcd.gov.in"
            },
            {
                "title": "PM Ujjwala Yojana (PMUY) — Women",
                "department": "Ministry of Petroleum and Natural Gas",
                "summary": "Free LPG gas connection to women from BPL and SC/ST/PMAY-G beneficiary households.",
                "category_tag": "Women",
                "benefits": "Free LPG connection, free first refill cylinder, and free gas stove for BPL women.",
                "eligibility_rules": {"max_income": 150000, "gender": "Female", "category": "BPL"},
                "application_link": "https://pmuy.gov.in"
            },
            {
                "title": "Mahila Shakti Kendra (MSK)",
                "department": "Ministry of Women and Child Development",
                "summary": "Empowers rural women through community participation and enables them to utilize government schemes and services.",
                "category_tag": "Women",
                "benefits": "Skill development, digital literacy, nutrition awareness, health guidance and legal awareness for rural women.",
                "eligibility_rules": {"gender": "Female", "area": "Rural"},
                "application_link": "https://wcd.nic.in"
            },
            {
                "title": "Pradhan Mantri Rozgar Protsahan Yojana (PMRPY) — Women Entrepreneurs",
                "department": "Ministry of Labour and Employment",
                "summary": "Incentivizes employers to recruit women by contributing 8.33% of employer EPF contribution for 3 years.",
                "category_tag": "Women",
                "benefits": "Government pays 8.33% EPS contribution for new women employees earning up to ₹15,000/month for 3 years.",
                "eligibility_rules": {"gender": "Female", "min_age": 18},
                "application_link": "https://pmrpy.gov.in"
            },
            {
                "title": "Stree Shakti Package — SBI Women Entrepreneurship",
                "department": "Ministry of Finance / State Bank of India",
                "summary": "Special loan package for women entrepreneurs with interest rate concession and extended repayment period.",
                "category_tag": "Women",
                "benefits": "0.5% interest rate concession on loans above ₹2 Lakh for women entrepreneurs. Higher credit limit.",
                "eligibility_rules": {"gender": "Female", "min_age": 18},
                "application_link": "https://sbi.co.in"
            },
            {
                "title": "Janani Suraksha Yojana (JSY)",
                "department": "Ministry of Health and Family Welfare",
                "summary": "Safe motherhood intervention under National Health Mission promoting institutional delivery among poor pregnant women.",
                "category_tag": "Women",
                "benefits": "Cash assistance: ₹1,400 (rural) / ₹1,000 (urban) to BPL women for institutional delivery.",
                "eligibility_rules": {"gender": "Female", "min_age": 19, "category": "BPL"},
                "application_link": "https://nhm.gov.in"
            },
            {
                "title": "PM Kaushal Vikas Yojana (PMKVY) — Women",
                "department": "Ministry of Skill Development and Entrepreneurship",
                "summary": "Short-term skill training aligned to industry demand with government-funded certification for women.",
                "category_tag": "Women",
                "benefits": "Free skill training, ₹8,000 reward on certification, placement assistance for women in priority sectors.",
                "eligibility_rules": {"gender": "Female", "min_age": 15},
                "application_link": "https://pmkvyofficial.org"
            },
            {
                "title": "Rashtriya Mahila Kosh (RMK) — Women Micro Finance",
                "department": "Ministry of Women and Child Development",
                "summary": "Micro-credit facility for poor women for income-generating activities through Self Help Groups (SHGs).",
                "category_tag": "Women",
                "benefits": "Loans up to ₹5 Lakh at 8% interest through SHGs for livelihood and income-generating activities.",
                "eligibility_rules": {"gender": "Female", "max_income": 200000},
                "application_link": "https://rmk.nic.in"
            },
            {
                "title": "One Stop Centre (Sakhi) Scheme",
                "department": "Ministry of Women and Child Development",
                "summary": "Integrated support services for women affected by violence including police, legal, medical, and psychological help.",
                "category_tag": "Women",
                "benefits": "Free legal aid, medical assistance, police help, counselling, and temporary shelter for women in distress.",
                "eligibility_rules": {"gender": "Female"},
                "application_link": "https://wcd.nic.in/schemes/one-stop-centre-scheme-osc"
            },
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
        print(f"[OK] {len(schemes_to_add)} schemes seeded successfully!")

        print("Seeding Demo Citizen Profiles...")
        citizens = [
            CitizenProfile(phone_number="9876543210", name="Ramesh Kumar", age=42, gender="Male",
                           state="Uttar Pradesh", annual_income=140000, occupation="Farmer",
                           category="BPL", language_preference="hi"),
            CitizenProfile(phone_number="9876543211", name="Priya Sharma", age=28, gender="Female",
                           state="Maharashtra", annual_income=120000, occupation="Self-Employed",
                           category="BPL", language_preference="mr"),
            CitizenProfile(phone_number="9876543212", name="Suresh Nair", age=65, gender="Male",
                           state="Kerala", annual_income=80000, occupation="Retired",
                           category="BPL", language_preference="ml"),
        ]
        db.add_all(citizens)
        db.commit()
        for c in citizens:
            db.refresh(c)

        app1 = Application(
            tracking_code="GOV-SIH-998822A",
            citizen_id=citizens[0].id,
            scheme_id=schemes_to_add[0].id,
            status="DBT Processed",
            documents_url="https://storage.gov.in/docs/ramesh_aadhaar.pdf",
            verification_score=98.5,
            ocr_extracted_data={"name": "Ramesh Kumar", "aadhaar_last4": "4402", "state": "Uttar Pradesh"},
            remarks="₹2,000 installment credited to SBI A/C ending 4402"
        )
        db.add(app1)
        db.commit()
        print(f"✅ Database seed complete! {len(schemes_to_add)} schemes, {len(citizens)} citizens seeded.")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
