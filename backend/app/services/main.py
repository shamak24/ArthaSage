from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import transactions, insights

app = FastAPI(title="AI Finance Manager API")

# Configure CORS
origins = [
    "http://localhost:3000",  # Next.js frontend
    "*",                      # React Native mobile app (any origin)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])
app.include_router(insights.router, prefix="/api/insights", tags=["insights"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "AI Finance Manager Backend is running"}
