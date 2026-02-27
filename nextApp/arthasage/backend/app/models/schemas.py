from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Transaction(BaseModel):
    id: str
    amount: float
    date: datetime
    category: Optional[str] = None
    type: str  # "income" or "expense"

class Holding(BaseModel):
    symbol: str
    quantity: int
    avgPrice: float


class AnalyzeRequest(BaseModel):
    transactions: List[Transaction]
    holdings: List[Holding] = []
