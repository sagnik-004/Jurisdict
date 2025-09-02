import os
import re
from dotenv import load_dotenv
from pymongo import MongoClient
import math
import hashlib
import time
from collections import Counter
from bson.objectid import ObjectId

load_dotenv()
MONGO_URI = os.getenv("MONGODB_URI")
MONGO_DB = os.getenv("MONGO_DB", "test")
client = MongoClient(MONGO_URI) if MONGO_URI else MongoClient()
db = client.get_database(MONGO_DB)
case_collection = db.get_collection("cases")

LEGAL_KEYWORDS = {
    'violent_crimes': ['murder', 'assault', 'battery', 'violence', 'attack', 'homicide', 'manslaughter', 'grievous hurt', 'attempt to murder'],
    'property_crimes': ['theft', 'robbery', 'burglary', 'cheating', 'fraud', 'embezzlement', 'criminal breach of trust', 'dishonesty'],
    'drug_crimes': ['narcotics', 'drugs', 'substance', 'opium', 'cocaine', 'cannabis', 'ndps', 'psychotropic'],
    'financial_crimes': ['money laundering', 'banking', 'financial', 'economic', 'corruption', 'bribery', 'forgery'],
    'sexual_crimes': ['rape', 'molestation', 'sexual', 'outraging modesty', 'pocso', 'harassment'],
    'traffic_crimes': ['rash driving', 'negligent driving', 'motor vehicle', 'accident', 'traffic'],
    'corruption': ['corruption', 'bribery', 'public servant', 'prevention of corruption', 'abuse of office'],
    'cyber_crimes': ['cyber', 'computer', 'internet', 'digital', 'online', 'information technology']
}

BAIL_FACTORS = {
    'flight_risk': ['abscond', 'flee', 'escape', 'flight risk', 'available for trial', 'surrender'],
    'tampering': ['witness', 'evidence', 'tampering', 'influence', 'intimidation', 'coercion'],
    'repeat_offender': ['previous', 'history', 'repeat', 'habitual', 'criminal record', 'antecedents'],
    'severity': ['heinous', 'serious', 'grave', 'severity', 'punishment', 'life imprisonment', 'death'],
    'cooperation': ['cooperation', 'surrender', 'compliance', 'assistance', 'voluntary'],
    'personal_factors': ['age', 'health', 'family', 'employment', 'roots', 'community ties', 'medical']
}

STOPWORDS = {
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it', 
    'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with', 'or', 'but', 'not', 'this', 
    'have', 'had', 'what', 'when', 'where', 'who', 'which', 'why', 'how', 'all', 'any', 'both', 
    'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'only', 'own', 'same', 
    'so', 'than', 'too', 'very', 'can', 'just', 'should', 'now'
}

def _clean_and_tokenize(text):
    text = str(text or "").lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    tokens = [token for token in text.split() if token not in STOPWORDS and len(token) > 2]
    return text, tokens

def _cosine_similarity(vec1, vec2):
    if not vec1 or not vec2:
        return 0.0
    
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    magnitude1 = math.sqrt(sum(a * a for a in vec1))
    magnitude2 = math.sqrt(sum(b * b for b in vec2))
    
    if magnitude1 == 0 or magnitude2 == 0:
        return 0.0
    
    return dot_product / (magnitude1 * magnitude2)

def _create_tfidf_vector(tokens, vocabulary, idf_scores):
    tf_counter = Counter(tokens)
    total_tokens = len(tokens)
    
    vector = []
    for word in vocabulary:
        tf = tf_counter.get(word, 0) / total_tokens if total_tokens > 0 else 0
        tfidf = tf * idf_scores.get(word, 0)
        vector.append(tfidf)
    
    return vector

def _build_vocabulary_and_idf(all_documents):
    vocabulary = set()
    doc_word_counts = []
    
    for doc_tokens in all_documents:
        vocabulary.update(doc_tokens)
        doc_word_counts.append(set(doc_tokens))
    
    vocabulary = sorted(list(vocabulary))
    total_docs = len(all_documents)
    
    idf_scores = {}
    for word in vocabulary:
        docs_containing_word = sum(1 for doc_words in doc_word_counts if word in doc_words)
        idf = math.log(total_docs / (docs_containing_word + 1))
        idf_scores[word] = idf
    
    return vocabulary, idf_scores

def _extract_legal_themes(text, tokens):
    themes = {}
    text_lower = text.lower()
    
    for category, keywords in LEGAL_KEYWORDS.items():
        score = sum(text_lower.count(keyword) for keyword in keywords if keyword in text_lower)
        if score > 0:
            themes[category] = score
    
    for category, keywords in BAIL_FACTORS.items():
        score = sum(text_lower.count(keyword) for keyword in keywords if keyword in text_lower)
        if score > 0:
            themes[f"bail_{category}"] = score
    
    return themes

def _extract_entities(text):
    return {
        'sections': list(set(re.findall(r'section\s+(\d+[a-z]?)', text.lower()))),
        'amounts': list(set(re.findall(r'rs\.?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lakh|crore)?', text.lower()))),
        'years': list(set(re.findall(r'(\d+)\s*years?', text.lower()))),
        'acts': list(set(re.findall(r'([a-z\s]+(?:act|code))', text.lower())))
    }

def _compute_theme_similarity(themes1, themes2):
    if not themes1 and not themes2:
        return 0.0
    
    all_themes = set(themes1.keys()) | set(themes2.keys())
    if not all_themes:
        return 0.0
    
    similarity_sum = 0
    for theme in all_themes:
        val1 = themes1.get(theme, 0)
        val2 = themes2.get(theme, 0)
        max_val = max(val1, val2)
        if max_val > 0:
            similarity_sum += min(val1, val2) / max_val
    
    return similarity_sum / len(all_themes)

def _compute_entity_similarity(entities1, entities2):
    similarities = []
    
    for entity_type in entities1:
        set1 = set(str(e).strip() for e in entities1[entity_type])
        set2 = set(str(e).strip() for e in entities2[entity_type])
        
        if not set1 and not set2:
            similarities.append(1.0)
        elif not set1 or not set2:
            similarities.append(0.0)
        else:
            intersection = len(set1 & set2)
            union = len(set1 | set2)
            similarities.append(intersection / union if union > 0 else 0.0)
    
    return sum(similarities) / len(similarities) if similarities else 0.0

def _section_similarity_enhanced(sections1, sections2):
    if not sections1 and not sections2:
        return 0.0
    if not sections1 or not sections2:
        return 0.0
    
    set1 = set(str(s).strip().lower() for s in sections1)
    set2 = set(str(s).strip().lower() for s in sections2)
    
    exact_match = len(set1 & set2)
    total_sections = len(set1 | set2)
    
    if total_sections == 0:
        return 0.0
    
    base_sim = exact_match / total_sections
    
    partial = 0
    for s1 in set1:
        for s2 in set2:
            if s1 == s2:
                continue
            nums1 = re.findall(r'\d+', s1)
            nums2 = re.findall(r'\d+', s2)
            if nums1 and nums2:
                try:
                    if abs(int(nums1[0]) - int(nums2[0])) <= 3:
                        partial += 0.3
                except:
                    pass
                    
    partial_sim = partial / max(len(set1), len(set2)) if set1 and set2 else 0
    
    return min(1.0, base_sim + partial_sim)

def _compose_enhanced_text(case):
    components = []
    
    if title := case.get("caseTitle", ""):
        components.append(title)
    
    if summary := case.get("caseSummary", ""):
        components.append(summary)
    
    if bns := case.get("bnsSections", []):
        components.append(" ".join(f"section {s}" for s in bns))
    
    if grounds := case.get("groundsOfBail", []):
        components.append(" ".join(str(g) for g in grounds))
    
    return " ".join(components)

def _generate_case_signature(case_data):
    case_id = case_data.get("caseId", "")
    sections = sorted(str(s) for s in case_data.get("bnsSections", []))
    grounds = sorted(str(g) for g in case_data.get("groundsOfBail", []))
    
    signature_data = f"{case_id}|{','.join(sections)}|{','.join(grounds)}"
    return hashlib.md5(signature_data.encode()).hexdigest()

def _lightweight_semantic_similarity(current_tokens, case_tokens):
    if not current_tokens or not case_tokens:
        return 0.0
    
    current_set = set(current_tokens)
    case_set = set(case_tokens)
    
    intersection = len(current_set & case_set)
    union = len(current_set | case_set)
    
    jaccard_sim = intersection / union if union > 0 else 0.0
    
    current_counter = Counter(current_tokens)
    case_counter = Counter(case_tokens)
    
    common_words = current_set & case_set
    if not common_words:
        return jaccard_sim
    
    weighted_overlap = 0
    total_weight = 0
    
    for word in common_words:
        weight = min(current_counter[word], case_counter[word])
        weighted_overlap += weight
        total_weight += max(current_counter[word], case_counter[word])
    
    weighted_sim = weighted_overlap / total_weight if total_weight > 0 else 0.0
    
    return (jaccard_sim * 0.4 + weighted_sim * 0.6)

def find_similar_cases(current_case_data):
    try:
        start_time = time.time()
        current_case_id = current_case_data.get("caseId")
        current_signature = _generate_case_signature(current_case_data)
        current_text = _compose_enhanced_text(current_case_data)
        
        filter_condition = {"bailStatus": {"$in": ["Accepted", "Declined"]}}
        if current_case_id:
            filter_condition["caseId"] = {"$ne": current_case_id}
            
        cursor = case_collection.find(
            filter_condition,
            {"_id": 0, "caseId": 1, "caseTitle": 1, "caseSummary": 1, 
             "bnsSections": 1, "groundsOfBail": 1, "bailStatus": 1}
        ).limit(300)
        
        similar_candidates = list(cursor)
        
        current_clean_text, current_tokens = _clean_and_tokenize(current_text)
        current_themes = _extract_legal_themes(current_clean_text, current_tokens)
        current_entities = _extract_entities(current_clean_text)
        current_sections = current_case_data.get("bnsSections", []) or []
        current_grounds = set(str(g).lower().strip() for g in current_case_data.get("groundsOfBail", []))
        
        similarities = []
        
        for case in similar_candidates:
            case_id = case.get("caseId")
            if case_id == current_case_id:
                continue
                
            case_signature = _generate_case_signature(case)
            if case_signature == current_signature:
                continue
                
            case_text = _compose_enhanced_text(case)
            case_clean_text, case_tokens = _clean_and_tokenize(case_text)
            
            semantic_sim = _lightweight_semantic_similarity(current_tokens, case_tokens)
            
            theme_sim = _compute_theme_similarity(current_themes, 
                _extract_legal_themes(case_clean_text, case_tokens))
            
            entity_sim = _compute_entity_similarity(current_entities,
                _extract_entities(case_clean_text))
            
            section_sim = _section_similarity_enhanced(current_sections,
                case.get("bnsSections", []))
            
            case_grounds = set(str(g).lower().strip() for g in case.get("groundsOfBail", []))
            grounds_intersection = len(current_grounds & case_grounds)
            grounds_union = len(current_grounds | case_grounds)
            grounds_sim = grounds_intersection / grounds_union if grounds_union > 0 else 0.0
            
            weights = {
                'semantic': 0.40,
                'section': 0.35,
                'theme': 0.15,
                'grounds': 0.10
            }
            
            final_score = (
                semantic_sim * weights['semantic'] +
                section_sim * weights['section'] +
                theme_sim * weights['theme'] +
                grounds_sim * weights['grounds']
            )
            
            final_score = max(0, min(final_score, 1.0))
            
            if final_score > 0.1:
                similarities.append({
                    "caseId": case_id,
                    "similarityPercentage": round(final_score * 100, 2),
                    "bailStatus": case.get("bailStatus"),
                    "semantic_score": semantic_sim,
                    "section_score": section_sim,
                    "theme_score": theme_sim,
                    "grounds_score": grounds_sim
                })
        
        similarities.sort(key=lambda x: (x["similarityPercentage"], x["semantic_score"], x["section_score"]), reverse=True)
        
        unique_cases = []
        seen_ids = set()
        
        for case in similarities:
            if case["caseId"] not in seen_ids:
                seen_ids.add(case["caseId"])
                unique_cases.append({
                    "caseId": case["caseId"],
                    "similarityPercentage": case["similarityPercentage"]
                })
                if len(unique_cases) >= 5:
                    break
        
        return unique_cases
    except Exception as e:
        return []