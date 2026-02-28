import pandas as pd
from typing import List
from ..models.schemas import Transaction

def detect_anomalies(transactions: List[dict], threshold: float = 2.5) -> List[dict]:
    if not transactions:
        return []

    df = pd.DataFrame(transactions)
    
    # Simple Z-score usage
    if 'amount' not in df.columns:
        return transactions

    # Calculate Z-score for amounts
    mean = df['amount'].mean()
    std = df['amount'].std()
    
    if std == 0:
        return transactions

    df['z_score'] = (df['amount'] - mean) / std
    
    # Mark anomalies
    df['is_anomaly'] = df['z_score'].abs() > threshold
    df['anomaly_score'] = df['z_score'].abs()
    
    return df.to_dict(orient='records')
