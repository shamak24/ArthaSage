from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import pandas as pd
import io
import uuid
from ..models.schemas import Transaction, TransactionCreate
from ..services.categorization import categorize_transactions
from ..services.anomaly import detect_anomalies

router = APIRouter()

# In-memory storage for hackathon demo
# In production, use a database
TRANSACTIONS_DB = []

# Column name aliases for flexible CSV parsing
COLUMN_ALIASES = {
    "date": ["date", "transaction date", "posted date", "timestamp", "trans date", "posting date", "txn date"],
    "description": ["description", "memo", "payee", "merchant", "name", "details", "transaction description", "narration", "original description"],
    "amount": ["amount", "value", "transaction amount", "debit", "sum", "total"],
    "credit": ["credit", "credit amount"],
    "debit": ["debit", "debit amount"],
}

def _map_columns(df: pd.DataFrame) -> dict:
    """Map CSV columns to standard names using flexible, case-insensitive matching."""
    col_map = {}
    normalized = {col: col.strip().lower() for col in df.columns}

    for standard_name, aliases in COLUMN_ALIASES.items():
        for orig_col, norm_col in normalized.items():
            if norm_col in aliases:
                col_map[standard_name] = orig_col
                break
    return col_map

def _clean_amount(val) -> float:
    """Safely convert currency string or float to a float number."""
    if pd.isna(val):
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    # Strip symbols and commas: "$ -1,234.56" -> "-1234.56"
    val_str = str(val).replace('$', '').replace('€', '').replace('£', '').replace(',', '').strip()
    if not val_str or val_str in ['-', '+']:
        return 0.0
    # Handle accounting format: "(12.34)" -> "-12.34"
    if val_str.startswith('(') and val_str.endswith(')'):
        val_str = '-' + val_str[1:-1]
    try:
        return float(val_str)
    except ValueError:
        return 0.0

@router.post("/upload", response_model=List[dict])
async def upload_transactions(file: UploadFile = File(...)):
    global TRANSACTIONS_DB
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    contents = await file.read()
    try:
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")

    col_map = _map_columns(df)

    has_amount = "amount" in col_map
    has_split = "credit" in col_map or "debit" in col_map

    missing = [k for k in ["date", "description"] if k not in col_map]
    if missing or (not has_amount and not has_split):
        found_cols = [c.strip() for c in df.columns.tolist()]
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns (Date, Description, and either Amount OR Credit/Debit). Found: {found_cols}"
        )

    parsed_txs = []
    for _, row in df.iterrows():
        # Handle Amount calculation
        amount_val = 0.0
        if has_amount:
            amount_val = _clean_amount(row[col_map["amount"]])
        else:
            credit = _clean_amount(row[col_map["credit"]]) if "credit" in col_map else 0.0
            debit = _clean_amount(row[col_map["debit"]]) if "debit" in col_map else 0.0
            amount_val = credit - debit if pd.notna(credit) or pd.notna(debit) else 0.0

        tx = {
            "id": str(uuid.uuid4()),
            "date": str(row[col_map["date"]]).strip() if pd.notna(row[col_map["date"]]) else "",
            "description": str(row[col_map["description"]]).strip() if pd.notna(row[col_map["description"]]) else "Unknown",
            "amount": amount_val,
            "currency": "USD"
        }
        parsed_txs.append(tx)

    # Run AI services
    categorized = categorize_transactions(parsed_txs)

    combined = TRANSACTIONS_DB + categorized
    analyzed_history = detect_anomalies(combined)

    TRANSACTIONS_DB = analyzed_history

    return analyzed_history[-len(categorized):]

@router.get("/", response_model=List[dict])
def get_transactions():
    return TRANSACTIONS_DB

@router.patch("/{transaction_id}", response_model=dict)
def update_transaction(transaction_id: str, update_data: dict):
    # In a real app, use Pydantic model for update_data
    for tx in TRANSACTIONS_DB:
        if tx["id"] == transaction_id:
            if "category" in update_data:
                tx["category"] = update_data["category"]
            if "is_anomaly" in update_data:
                tx["is_anomaly"] = update_data["is_anomaly"]
            return tx
    raise HTTPException(status_code=404, detail="Transaction not found")

@router.delete("/")
def clear_transactions():
    global TRANSACTIONS_DB
    TRANSACTIONS_DB = []
@router.post("/seed", response_model=List[dict])
def seed_transactions():
    global TRANSACTIONS_DB
    
    # Pre-defined interesting data
    demo_data = [
        {"id": str(uuid.uuid4()), "date": "2023-10-01", "description": "Starbucks Coffee", "amount": 5.50},
        {"id": str(uuid.uuid4()), "date": "2023-10-01", "description": "Uber Ride", "amount": 24.00},
        {"id": str(uuid.uuid4()), "date": "2023-10-02", "description": "Whole Foods Market", "amount": 145.20},
        {"id": str(uuid.uuid4()), "date": "2023-10-05", "description": "Netflix Subscription", "amount": 15.99},
        {"id": str(uuid.uuid4()), "date": "2023-10-10", "description": "Salary Deposit", "amount": 4000.00},
        {"id": str(uuid.uuid4()), "date": "2023-10-15", "description": "Rent Payment", "amount": 2000.00},
        {"id": str(uuid.uuid4()), "date": "2023-10-18", "description": "Unknown Large Transfer", "amount": 5000.00}, # Anomaly
        {"id": str(uuid.uuid4()), "date": "2023-10-25", "description": "Dinner at Nobu", "amount": 350.00},
    ]
    
    # Run AI services on demo data
    categorized = categorize_transactions(demo_data)
    analyzed = detect_anomalies(categorized)
    
    TRANSACTIONS_DB = analyzed
    return TRANSACTIONS_DB
