from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TransactionBase(BaseModel):
    date: str
    description: str
    amount: float
    currency: str = "USD"

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    category: Optional[str] = None
    is_anomaly: Optional[bool] = None


class Transaction(TransactionBase):
    id: str
    category: Optional[str] = None
    is_anomaly: bool = False
    anomaly_score: float = 0.0

    class Config:
        from_attributes = True

class Insight(BaseModel):
    type: str  # 'alert', 'tip', 'success'
    message: str
    related_transactions: List[str] = []

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    suggestions: List[str] = []
