# Multi-Domain Knowledge Assistant: Agentic RAG System

An enterprise-grade conversational AI system that leverages Retrieval-Augmented Generation (RAG) with an agentic architecture to provide intelligent, domain-specific knowledge assistance.

## Features

- **Multi-Domain Support**: Organize and query knowledge across different departments/topics
- **Agentic RAG**: Intelligent agent orchestration for complex query resolution
- **Vector Search**: Fast similarity-based document retrieval using PostgreSQL pgvector
- **Anthropic Claude Integration**: State-of-the-art LLM for high-quality responses
- **Real-time Chat**: Interactive Q&A interface with source attribution
- **Document Management**: Upload and process enterprise documentation
- **Confidence Scoring**: Understand result reliability through similarity metrics

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL with pgvector
- **LLM**: Anthropic Claude 3
- **Embeddings**: OpenAI (text-embedding-3-small)
- **Deployment**: GitHub Pages (frontend) + Custom hosting (backend)

## Architecture

```
User Interface (React)
        ↓
    API Gateway (Express)
        ↓
    ┌───────────────────────┐
    │ Agent Orchestrator    │
    └───┬──────────┬────────┘
        ↓          ↓
   RAG Engine   LLM (Claude)
        ↓
Vector Database (PostgreSQL pgvector)
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- OpenAI API Key (for embeddings)
- Anthropic API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd multi-domain-rag-assistant
   ```

2. **Setup environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your keys
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Initialize database**
   ```bash
   npm run db:init
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:3001
   - Backend: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Documents
- `POST /api/documents/upload` - Upload document to domain
- `GET /api/documents/domain/:domainId` - Get domain documents
- `DELETE /api/documents/:documentId` - Delete document

### Chat
- `POST /api/chat/query` - Send query and get response
- `GET /api/chat/history/:domainId` - Get query history

## Deployment

### GitHub Pages (Frontend)
```bash
npm run build
npm run deploy
```

### Backend Deployment
- Deploy to Heroku, Railway, or custom VPS
- Ensure PostgreSQL instance is running
- Set environment variables in deployment platform

## Development Guide

### Adding a New Domain
1. Frontend: Add domain to domain selector
2. Backend: Create domain in database
3. Upload documents to that domain

### Customizing RAG Behavior
- Edit `backend/src/services/ragEngine.js` for retrieval logic
- Modify `backend/src/services/agent.js` for agent behavior
- Adjust chunking strategy in `backend/src/routes/documents.js`

## Performance Metrics

- **Query Response Time**: ~2-5 seconds
- **Embedding Generation**: ~500ms per chunk
- **Document Search**: ~100-500ms (depends on database size)
- **Supported Document Size**: Up to 50MB per upload

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a PR

## License

MIT

## Support

For issues and questions, create a GitHub issue.