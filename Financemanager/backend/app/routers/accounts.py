"""
Accounts Router — handles connecting bank & demat accounts
and returning portfolio / holdings data.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

router = APIRouter()

# ─── In-Memory Store ─────────────────────────────────
connected_accounts: list[dict] = []
portfolio_holdings: list[dict] = []

# ─── Models ──────────────────────────────────────────

class ConnectRequest(BaseModel):
    provider: str
    type: str  # "bank" or "demat"
    credentials: Optional[dict] = None

class AccountResponse(BaseModel):
    id: str
    provider: str
    type: str
    accountName: str
    accountNumber: str
    status: str
    lastSynced: Optional[str] = None
    balance: Optional[float] = None

# ─── Demat Providers ─────────────────────────────────

DEMAT_PROVIDERS = [
    {
        "id": "zerodha",
        "name": "Zerodha",
        "logo": "Z",
        "color": "#387ed1",
        "description": "India's largest stock broker. Connect your Kite account.",
        "supported": True,
    },
    {
        "id": "groww",
        "name": "Groww",
        "logo": "G",
        "color": "#5367ff",
        "description": "Stocks, mutual funds, and more. Link your Groww portfolio.",
        "supported": True,
    },
    {
        "id": "angelone",
        "name": "Angel One",
        "logo": "A",
        "color": "#ff6b35",
        "description": "Smart investing with Angel Broking. Sync your trades.",
        "supported": True,
    },
    {
        "id": "upstox",
        "name": "Upstox",
        "logo": "U",
        "color": "#7b2ff7",
        "description": "Next-gen trading platform. Connect your Upstox account.",
        "supported": True,
    },
]

BANK_PROVIDERS = [
    {
        "id": "hdfc",
        "name": "HDFC Bank",
        "logo": "H",
        "color": "#004b8d",
        "description": "India's leading private bank. Sync your savings & current accounts.",
        "supported": True,
    },
    {
        "id": "sbi",
        "name": "State Bank of India",
        "logo": "S",
        "color": "#0033a0",
        "description": "India's largest public sector bank.",
        "supported": True,
    },
    {
        "id": "icici",
        "name": "ICICI Bank",
        "logo": "I",
        "color": "#f58220",
        "description": "Full-service banking. Connect savings, FD, and credit cards.",
        "supported": True,
    },
    {
        "id": "axis",
        "name": "Axis Bank",
        "logo": "X",
        "color": "#97144d",
        "description": "Digital banking with Axis. Sync your accounts seamlessly.",
        "supported": True,
    },
]

# ─── Demo Holdings Data ──────────────────────────────

DEMO_HOLDINGS = [
    {
        "symbol": "RELIANCE",
        "name": "Reliance Industries Ltd",
        "quantity": 15,
        "avgPrice": 2380.50,
        "currentPrice": 2542.75,
        "change": 32.40,
        "changePercent": 1.29,
        "value": 38141.25,
        "pnl": 2433.75,
        "pnlPercent": 6.81,
        "sector": "Energy",
    },
    {
        "symbol": "TCS",
        "name": "Tata Consultancy Services",
        "quantity": 10,
        "avgPrice": 3520.00,
        "currentPrice": 3745.60,
        "change": -18.30,
        "changePercent": -0.49,
        "value": 37456.00,
        "pnl": 2256.00,
        "pnlPercent": 6.41,
        "sector": "IT",
    },
    {
        "symbol": "HDFCBANK",
        "name": "HDFC Bank Ltd",
        "quantity": 25,
        "avgPrice": 1580.00,
        "currentPrice": 1692.35,
        "change": 14.80,
        "changePercent": 0.88,
        "value": 42308.75,
        "pnl": 2808.75,
        "pnlPercent": 7.11,
        "sector": "Banking",
    },
    {
        "symbol": "INFY",
        "name": "Infosys Ltd",
        "quantity": 30,
        "avgPrice": 1420.00,
        "currentPrice": 1538.90,
        "change": 22.10,
        "changePercent": 1.46,
        "value": 46167.00,
        "pnl": 3567.00,
        "pnlPercent": 8.37,
        "sector": "IT",
    },
    {
        "symbol": "ICICIBANK",
        "name": "ICICI Bank Ltd",
        "quantity": 40,
        "avgPrice": 980.00,
        "currentPrice": 1067.45,
        "change": 8.55,
        "changePercent": 0.81,
        "value": 42698.00,
        "pnl": 3498.00,
        "pnlPercent": 8.92,
        "sector": "Banking",
    },
    {
        "symbol": "WIPRO",
        "name": "Wipro Ltd",
        "quantity": 50,
        "avgPrice": 420.00,
        "currentPrice": 462.30,
        "change": -3.20,
        "changePercent": -0.69,
        "value": 23115.00,
        "pnl": 2115.00,
        "pnlPercent": 10.07,
        "sector": "IT",
    },
    {
        "symbol": "TATAMOTORS",
        "name": "Tata Motors Ltd",
        "quantity": 20,
        "avgPrice": 625.00,
        "currentPrice": 712.80,
        "change": 9.65,
        "changePercent": 1.37,
        "value": 14256.00,
        "pnl": 1756.00,
        "pnlPercent": 14.05,
        "sector": "Automobile",
    },
    {
        "symbol": "BAJFINANCE",
        "name": "Bajaj Finance Ltd",
        "quantity": 5,
        "avgPrice": 6800.00,
        "currentPrice": 7245.50,
        "change": 45.00,
        "changePercent": 0.62,
        "value": 36227.50,
        "pnl": 2227.50,
        "pnlPercent": 6.55,
        "sector": "Finance",
    },
]


# ─── Endpoints ───────────────────────────────────────

@router.get("/providers/demat")
def list_demat_providers():
    """List available demat account providers."""
    return DEMAT_PROVIDERS


@router.get("/providers/bank")
def list_bank_providers():
    """List available bank providers."""
    return BANK_PROVIDERS


@router.post("/connect")
def connect_account(req: ConnectRequest):
    """Simulate connecting a bank or demat account."""
    # Find the provider
    all_providers = DEMAT_PROVIDERS + BANK_PROVIDERS
    provider = next((p for p in all_providers if p["id"] == req.provider), None)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")

    # Check if already connected
    existing = next(
        (a for a in connected_accounts if a["provider"] == req.provider),
        None
    )
    if existing:
        return {"message": "Account already connected", "account": existing}

    # Simulate successful connection
    account = {
        "id": str(uuid.uuid4()),
        "provider": req.provider,
        "type": req.type,
        "accountName": f"{provider['name']} Account",
        "accountNumber": f"****{str(uuid.uuid4().int)[:4]}",
        "status": "connected",
        "lastSynced": datetime.now().isoformat(),
        "balance": 150000.00 if req.type == "bank" else None,
    }
    connected_accounts.append(account)

    # If demat, also seed portfolio holdings
    if req.type == "demat" and not portfolio_holdings:
        portfolio_holdings.extend(DEMO_HOLDINGS)

    return {"message": "Account connected successfully", "account": account}


@router.get("/connected")
def get_connected_accounts():
    """Get all connected accounts."""
    return connected_accounts


@router.delete("/disconnect/{account_id}")
def disconnect_account(account_id: str):
    """Disconnect an account."""
    global connected_accounts
    connected_accounts = [a for a in connected_accounts if a["id"] != account_id]
    return {"message": "Account disconnected"}


@router.get("/portfolio")
def get_portfolio():
    """Get portfolio summary with all holdings."""
    if not portfolio_holdings:
        return {
            "totalInvested": 0,
            "currentValue": 0,
            "totalPnl": 0,
            "totalPnlPercent": 0,
            "dayChange": 0,
            "dayChangePercent": 0,
            "holdings": [],
        }

    total_invested = sum(h["avgPrice"] * h["quantity"] for h in portfolio_holdings)
    current_value = sum(h["value"] for h in portfolio_holdings)
    total_pnl = current_value - total_invested
    total_pnl_percent = (total_pnl / total_invested * 100) if total_invested > 0 else 0
    day_change = sum(h["change"] * h["quantity"] for h in portfolio_holdings)
    day_change_percent = (day_change / current_value * 100) if current_value > 0 else 0

    return {
        "totalInvested": round(total_invested, 2),
        "currentValue": round(current_value, 2),
        "totalPnl": round(total_pnl, 2),
        "totalPnlPercent": round(total_pnl_percent, 2),
        "dayChange": round(day_change, 2),
        "dayChangePercent": round(day_change_percent, 2),
        "holdings": portfolio_holdings,
    }
