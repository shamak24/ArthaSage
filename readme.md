# 💸 ArthaSage — Finance Manager with AI Insights

> An AI-powered financial intelligence platform that analyzes spending behavior, detects anomalies, and provides personalized financial guidance through a conversational AI assistant.

---

## 🚀 Overview

**ArthaSage** is an AI Financial Copilot designed to help users understand and improve their financial decisions using intelligent analytics and Retrieval-Augmented Generation (RAG).

Instead of manually tracking expenses, users link simulated bank and demat accounts to instantly receive:

- Financial health insights
- Spending analytics
- Anomaly detection
- Portfolio understanding
- Conversational financial guidance

The system combines **statistical analysis + AI reasoning + knowledge retrieval** to generate grounded financial advice.

---

## 🧠 Core Features

### 📊 AI Financial Dashboard
- Income, expense, and savings analysis
- Category-wise spending insights
- Financial health scoring
- Real-time analytics overview

### ⚠️ Anomaly Detection
- Detects unusual spending patterns
- Statistical deviation analysis
- Highlights risky financial behavior

### 🤖 AI Financial Copilot
- Ask finance-related questions naturally
- Personalized answers using user financial context
- Supports both personal and general financial advice

### 📚 Knowledge-Based RAG System
- Financial knowledge scraped from educational sources
- Embedded into vector database
- Semantic search retrieves relevant knowledge for AI responses

### 🔗 Smart Account Linking Simulation
- Simulated bank & demat account linking
- Preloaded realistic datasets
- Instant onboarding experience

---

## 🔧 Tech Stack
- **Backend**: Python, FastAPI, Next.js
- **Frontend**: Next.js, React Native (for demo )
- **Database**: Supabase (PostgreSQL)
- **AI/ML**: Gemini 3 flash, FAISS for vector search, embedder for knowledge retrieval

---

## Setup Instructions for Web App
1. Clone the repository
```bash
git clone https://github.com/shamak24/ArthaSage.git
cd ArthaSage/nextApp/arthasage
```
2. Install dependencies
```bash
bun install

cd backend
pip install -r requirements.txt
```
3. Setup environment variables
```bash
# Create .env.local file in with the following content .env.local:
SUPABASE_DB_URL=''
DB_URL=''
BETTER_AUTH_URL='http://localhost:3000'
BETTER_AUTH_BASE_URL='http://localhost:3000'

#create .env file in the backend directory of webapp
GEMINI_API_KEY=

```
4. Run the application
```bash
# Start the backend server
cd nextApp/arthasage/backend
uvicorn main:app --reload

# Start the frontend
cd nextApp/arthasage
bun dev
```
5. Access the web app at `http://localhost:3000`

