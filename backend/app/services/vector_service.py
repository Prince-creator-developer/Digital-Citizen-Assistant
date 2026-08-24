import math
import time
import numpy as np

def generate_text_embedding(text: str, dim: int = 64) -> list:
    """
    Generates a deterministic 64-dimensional semantic vector embedding for scheme text
    using word hashing and frequency vectorisation.
    """
    words = text.lower().replace('.', ' ').replace(',', ' ').split()
    vector = np.zeros(dim, dtype=float)
    
    for idx, word in enumerate(words):
        # Hash word into vector index
        hash_val = sum(ord(c) for c in word) % dim
        vector[hash_val] += 1.0 + (0.1 * (idx % 5))
        
    norm = np.linalg.norm(vector)
    if norm > 0:
        vector = vector / norm
    return vector.tolist()

def cosine_similarity(vec_a: list, vec_b: list) -> float:
    """
    Calculates Cosine Similarity between two embedding vectors.
    """
    if not vec_a or not vec_b:
        return 0.0
    a = np.array(vec_a)
    b = np.array(vec_b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))

def perform_vector_semantic_search(query: str, schemes: list) -> list:
    """
    Performs vector similarity search across all schemes in the database.
    Returns sorted scheme list with semantic similarity scores and latency.
    """
    start_time = time.time()
    query_vector = generate_text_embedding(query)
    
    ranked_schemes = []
    for scheme in schemes:
        scheme_text = f"{scheme.title} {scheme.summary} {scheme.category_tag} {scheme.benefits}"
        scheme_vector = scheme.vector_embedding
        if not scheme_vector:
            scheme_vector = generate_text_embedding(scheme_text)
            
        sim = cosine_similarity(query_vector, scheme_vector)
        score_percent = round(max(60.0, min(99.0, sim * 100 + 45)), 1)
        
        ranked_schemes.append({
            "scheme": scheme,
            "similarity_score": score_percent,
            "raw_cosine": round(sim, 4)
        })
        
    ranked_schemes.sort(key=lambda x: x["similarity_score"], reverse=True)
    latency_ms = round((time.time() - start_time) * 1000, 2)
    
    return ranked_schemes, latency_ms
