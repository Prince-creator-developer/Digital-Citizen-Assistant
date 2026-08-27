"""
Bilingual Vector Semantic Search Service
Provides multilingual (Hindi/English) semantic matching across all 47 Indian welfare schemes.
Combines semantic keyword expansion, character n-gram hashing, and token overlap scoring.
"""
import math
import time
import re
import numpy as np

# Comprehensive Hindi to English Welfare Dictionary
HINDI_TO_ENG_WELFARE = {
    'सुकन्या': 'sukanya',
    'समृद्धि': 'samriddhi',
    'योजना': 'yojana',
    'किसान': 'kisan farmer agriculture',
    'कृषि': 'krishi agriculture crop',
    'फसल': 'fasal crop',
    'बीमा': 'bima insurance',
    'पेंशन': 'pension elder senior',
    'वृद्धावस्था': 'old age pension vridha',
    'राशन': 'ration food bpl pmgkay',
    'आवास': 'awas housing pmay',
    'आयुष्मान': 'ayushman pmjay health arogya',
    'स्वास्थ्य': 'health medical hospital',
    'उज्ज्वला': 'ujjwala lpg gas cylinder',
    'मातृ': 'matru maternity mother',
    'वंदना': 'vandana pmmvy',
    'मुद्रा': 'mudra loan credit',
    'स्वनिधि': 'svanidhi street vendor',
    'विश्वकर्मा': 'vishwakarma artisan craft',
    'कारीगर': 'artisan weaver craft',
    'छात्रवृत्ति': 'scholarship nsp student',
    'छात्र': 'student scholarship school',
    'विद्यार्थी': 'student education',
    'बेटी': 'beti girl child bbbp',
    'बालिका': 'girl child sukanya',
    'बचाओ': 'bachao',
    'पढ़ाओ': 'padhao',
    'अटल': 'atal apy pension',
    'स्वामित्व': 'svamitva land property',
    'वरिष्ठ': 'senior elder citizen',
    'वृद्ध': 'elder senior',
    'गरीब': 'bpl poor garib',
    'अन्न': 'anna food ration pmgkay',
    'कल्याण': 'kalyan welfare',
    'सिंचाई': 'sinchai irrigation water',
    'खाता': 'khata account dbt bank',
    'जनधन': 'jan dhan bank account pmjdy',
    'सुरक्षा': 'suraksha security insurance',
    'जीवन': 'jeevan life insurance pmjjby',
    'स्वच्छ': 'swachh bharat sanitation toilet',
    'शौचालय': 'toilet sanitation',
}

# Concept Groups
BILINGUAL_CONCEPTS = {
    "sukanya": ["सुकन्या", "sukanya", "samriddhi", "ssy", "girl", "बालिका", "बेटी", "daughter", "saving"],
    "kisan": ["किसान", "kisan", "farmer", "krishi", "कृषि", "fasal", "फसल", "crop", "agriculture", "land", "खेती", "dbt", "pm-kisan", "pmfby"],
    "pension": ["पेंशन", "pension", "elder", "senior", "वृद्धावस्था", "old age", "vridha", "vayoshri", "retirement", "atal", "apy", "ignops"],
    "ration": ["राशन", "ration", "bpl", "pds", "food", "अन्न", "garib", "कल्याण", "खाद्यान्न", "nfsa", "pmgkay", "antyodaya", "aay"],
    "women": ["महिला", "women", "स्त्री", "mother", "मातृ", "matru", "vandana", "pmmvy", "maternity", "shakti", "mahila"],
    "artisan": ["कारीगर", "artisan", "vishwakarma", "विश्वकर्मा", "weaver", "बुनकर", "shilpkar", "handicraft", "craft", "toolkit"],
    "awas": ["आवास", "awas", "housing", "pmay", "house", "मकान", "घर", "shelter"],
    "ayushman": ["आयुष्मान", "ayushman", "pmjay", "health", "स्वास्थ्य", "arogya", "आरोग्य", "hospital", "card", "golden card", "medical"],
    "ujjwala": ["उज्ज्वला", "ujjwala", "pmuy", "lpg", "gas", "गैस", "cylinder", "सिलेंडर"],
    "mudra": ["मुद्रा", "mudra", "loan", "ऋण", "svanidhi", "स्वनिधि", "vendor", "street vendor", "credit", "business"],
    "student": ["छात्र", "विद्यार्थी", "student", "scholarship", "छात्रवृत्ति", "education", "school", "college", "nsp", "poshan"],
    "bima": ["बीमा", "insurance", "suraksha", "सुरक्षा", "jeevan", "life insurance", "accident", "pmjjby", "pmsby"],
}


def expand_query_semantics(query: str) -> str:
    """Expand query with cross-lingual synonyms and English translations."""
    clean_q = query.lower()
    words = re.findall(r'[\w\u0900-\u097F]+', clean_q)
    expanded = list(words)

    for w in words:
        if w in HINDI_TO_ENG_WELFARE:
            expanded.extend(HINDI_TO_ENG_WELFARE[w].split())

    for concept, keywords in BILINGUAL_CONCEPTS.items():
        if any(k in clean_q for k in keywords):
            expanded.append(concept)
            expanded.extend(keywords[:3])

    return " ".join(expanded)


def generate_text_embedding(text: str, dim: int = 64) -> list:
    """
    Generates a normalized semantic vector embedding for text using bilingual token hashing.
    """
    expanded = expand_query_semantics(text)
    words = re.findall(r'[\w\u0900-\u097F]+', expanded.lower())
    vector = np.zeros(dim, dtype=float)

    for idx, word in enumerate(words):
        hash_val = sum((idx_c + 1) * ord(c) for idx_c, c in enumerate(word)) % dim
        vector[hash_val] += 1.0 + (0.2 * (idx % 4))

    norm = np.linalg.norm(vector)
    if norm > 0:
        vector = vector / norm
    return vector.tolist()


def cosine_similarity(vec_a: list, vec_b: list) -> float:
    """Calculates Cosine Similarity between two vectors."""
    if not vec_a or not vec_b:
        return 0.0
    a = np.array(vec_a)
    b = np.array(vec_b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))


def compute_semantic_relevance_score(query: str, scheme) -> tuple:
    """
    Computes a hybrid relevance score combining:
    1. Bilingual English & Hindi Title token match (High priority)
    2. Concept overlap (Bilingual)
    3. Cosine vector similarity
    """
    q_expanded = expand_query_semantics(query).lower()
    title_lower = scheme.title.lower()
    summary_lower = (scheme.summary or "").lower()
    benefits_lower = (scheme.benefits or "").lower()
    category_lower = (scheme.category_tag or "").lower()

    scheme_full_text = f"{title_lower} {summary_lower} {benefits_lower} {category_lower}"

    bonus = 0.0

    # 1. Exact Concept / Scheme Name Matching
    query_tokens = re.findall(r'[a-zA-Z]{3,}', q_expanded)

    # Check for direct title words in English
    title_matches = 0
    for token in query_tokens:
        if token in title_lower:
            title_matches += 1
            bonus += 35.0
        elif token in summary_lower or token in benefits_lower:
            bonus += 15.0

    # Strong boost if multiple title tokens match (e.g. Sukanya + Samriddhi)
    if title_matches >= 2:
        bonus += 30.0

    # Check for concept group match
    for concept, keywords in BILINGUAL_CONCEPTS.items():
        q_has_concept = any(k in q_expanded for k in keywords)
        scheme_has_concept = any(k in scheme_full_text for k in keywords)
        if q_has_concept and scheme_has_concept:
            bonus += 20.0
            break

    # 2. Vector Cosine Similarity
    query_vec = generate_text_embedding(query)
    scheme_vec = scheme.vector_embedding
    if not scheme_vec:
        scheme_vec = generate_text_embedding(scheme_full_text)

    cos_sim = cosine_similarity(query_vec, scheme_vec)

    # Combine into 0 - 100 percentage score
    base_score = cos_sim * 40.0
    total_score = min(99.4, max(45.0, base_score + bonus + 20.0))

    return round(total_score, 1), cos_sim


def perform_vector_semantic_search(query: str, schemes: list) -> tuple:
    """
    Performs bilingual semantic vector search across schemes.
    Returns ranked scheme list with relevance scores and latency.
    """
    start_time = time.time()

    ranked_schemes = []
    for scheme in schemes:
        score_percent, raw_cos = compute_semantic_relevance_score(query, scheme)

        ranked_schemes.append({
            "scheme": scheme,
            "similarity_score": score_percent,
            "raw_cosine": round(raw_cos, 4)
        })

    # Sort descending by relevance score
    ranked_schemes.sort(key=lambda x: x["similarity_score"], reverse=True)
    latency_ms = round((time.time() - start_time) * 1000, 2)

    return ranked_schemes, latency_ms
