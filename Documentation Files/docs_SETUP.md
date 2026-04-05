# Setup Guide

## Development Setup

### 1. Database Setup

```bash
# Install PostgreSQL 14+
# Create database
createdb rag_assistant

# Install pgvector extension
psql rag_assistant -c "CREATE EXTENSION IF NOT EXISTS vector"
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Add your API keys:
# - ANTHROPIC_API_KEY
# - OPENAI_API_KEY
# - JWT_SECRET

npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Production Deployment

### Backend (Heroku Example)

```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:standard-0

# Set environment variables
heroku config:set ANTHROPIC_API_KEY=xxx
heroku config:set OPENAI_API_KEY=xxx

git push heroku main
```

### Frontend (GitHub Pages)

```bash
npm run build
npm run deploy
```

## Database Migrations

Use the initialization script in `backend/src/services/database.js` to set up the schema automatically on first run.