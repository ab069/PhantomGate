# PhantomGate

> AI-powered cyber deception platform with autonomous threat detection, LangGraph agent pipeline, and real-time monitoring dashboard.

PhantomGate is a production-grade cyber deception platform that deploys honey tokens across environments, detects unauthorized access, and autonomously responds via a multi-node AI reasoning pipeline.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PhantomGate System                        │
├───────────┬───────────┬───────────┬───────────┬─────────────┤
│  Token    │ Detection │  LangGraph │ Incident  │  WebSocket  │
│  Engine   │  Engine   │ AI Agent  │ Reporter  │  Dashboard  │
├───────────┴───────────┴───────────┴───────────┴─────────────┤
│              FastAPI + async SQLAlchemy + Redis               │
├─────────────────────────────────────────────────────────────┤
│              PostgreSQL + Redis + Docker Compose              │
└─────────────────────────────────────────────────────────────┘
```

## Key Features

- **Honey Token Engine** — Deploy fake AWS keys, DB URLs, JWT secrets, and API tokens across environments
- **Detection Engine** — Monitors token access and triggers alerts on unauthorized usage
- **LangGraph AI Agent** — 5-node autonomous pipeline for threat enrichment, classification, severity scoring, report generation, and response recommendation
- **Real-Time Dashboard** — React 18 + TypeScript + Zustand with WebSocket streaming (zero polling)
- **Incident Reporting** — Auto-generated natural language reports with full threat context
- **Hardened Security** — JWT auth, bcrypt hashing, security headers, rate limiting, OWASP Top 10 compliance

## Tech Stack

| Layer        | Technology                                  |
|-------------|---------------------------------------------|
| Backend     | FastAPI + Python 3.12 + async SQLAlchemy    |
| Frontend    | React 18 + TypeScript + Zustand             |
| AI/Agent    | LangGraph + LangChain + GPT-4o              |
| Database    | PostgreSQL + Redis                          |
| Infra       | Docker Compose                              |
| Auth        | JWT + bcrypt                                |
| Realtime    | WebSockets                                  |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/ab069/PhantomGate.git
cd PhantomGate

# Start all services
docker compose up -d

# Access the dashboard
open http://localhost:3000
```

## Project Structure

```
PhantomGate/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI routes
│   │   ├── core/         # Config, security, dependencies
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   └── agents/       # LangGraph agent pipeline
│   ├── alembic/          # DB migrations
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── store/        # Zustand stores
│   │   ├── hooks/        # Custom hooks
│   │   └── pages/        # Route pages
│   └── tests/
├── docker-compose.yml
└── README.md
```

## License

MIT
