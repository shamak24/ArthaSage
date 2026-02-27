from typing import List
import numpy as np
try:
    from sentence_transformers import SentenceTransformer
    from faiss import IndexFlatL2
except ImportError:
    SentenceTransformer = None
    IndexFlatL2 = None

# Predefined categories with example descriptions for few-shot matching
CATEGORY_EXAMPLES = {
    "Food & Dining": ["McDonalds", "Starbucks", "Dinner at Italian place", "Groceries", "Lunch"],
    "Transportation": ["Uber", "Shell Gas Station", "Train Ticket", "Flight to NY", "Parking"],
    "Utilities": ["Electric Bill", "Water Bill", "Internet Subscription", "Phone Bill"],
    "Shopping": ["Amazon", "Target", "Clothes", "Electronics", "Gifts"],
    "Entertainment": ["Netflix", "Cinema", "Spotify", "Concert Tickets", "Video Games"],
    "Income": ["Salary", "Deposit", "Refund", "Dividends"],
    "Health": ["Pharmacy", "Doctor", "Gym", "Dentist"],
    "Housing": ["Rent", "Mortgage", "Repairs", "Furniture"],
}

class Categorizer:
    def __init__(self):
        self.model = None
        self.index = None
        self.categories = []
        self.initialized = False

    def initialize(self):
        if not SentenceTransformer:
            print("SentenceTransformer not installed, using fallback.")
            return

        print("Loading SentenceTransformer model...")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Build index
        self.categories = []
        examples = []
        for cat, texts in CATEGORY_EXAMPLES.items():
            for text in texts:
                self.categories.append(cat)
                examples.append(text)
        
        embeddings = self.model.encode(examples)
        
        # FAISS index
        dimension = embeddings.shape[1]
        self.index = IndexFlatL2(dimension)
        self.index.add(np.array(embeddings).astype('float32'))
        self.initialized = True
        print("Categorizer initialized.")

    def predict(self, description: str) -> str:
        if not self.initialized:
            # Fallback to simple keyword matching if ML fails or not ready
            desc_lower = description.lower()
            if "food" in desc_lower or "restaurant" in desc_lower: return "Food & Dining"
            if "uber" in desc_lower or "gas" in desc_lower: return "Transportation"
            return "Uncategorized"

        embedding = self.model.encode([description])
        D, I = self.index.search(np.array(embedding).astype('float32'), k=1)
        
        best_match_idx = I[0][0]
        return self.categories[best_match_idx]

# Global instance
categorizer = Categorizer()

def categorize_transactions(transactions: List[dict]) -> List[dict]:
    if not categorizer.initialized and SentenceTransformer:
        categorizer.initialize()

    for tx in transactions:
        if not tx.get("category"):
            tx["category"] = categorizer.predict(tx.get("description", ""))
    return transactions
