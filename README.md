# PhantomGate — Cyber Deception Platform

![Version](https://img.shields.io/badge/version-1.0.0-06b6d4) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-06b6d4) ![React](https://img.shields.io/badge/React-18.3-06b6d4) ![License](https://img.shields.io/badge/license-MIT-06b6d4)

AI-powered cyber deception platform with autonomous threat detection, LangGraph agent pipeline, honey tokens, and real-time monitoring dashboard. Deploy fake credentials across environments and detect attackers the moment they touch them.

## Quick Start

```bash
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000) and register a new account.

## Features

- **Honey Token Engine** — Deploy fake AWS keys, DB URLs, JWT secrets, and API tokens across environments
- **Detection Engine** — Monitors token access and triggers alerts on unauthorized usage
- **LangGraph AI Agent** — 5-node autonomous pipeline: enrichment, classification, severity scoring, report generation, response recommendation
- **Real-Time Dashboard** — React 18 + TypeScript + Zustand with WebSocket streaming (zero polling)
- **Incident Reporting** — Auto-generated natural language reports with full threat context
- **Threat Scoring** — Severity and confidence-based risk assessment (0-100)

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

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12, FastAPI, SQLAlchemy (async), asyncpg |
| Frontend | React 18, TypeScript, Vite, Zustand |
| AI/Agent | LangGraph + LangChain |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Realtime | WebSockets |
| Infra | Docker, Docker Compose, nginx |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/tokens` | Deploy a honey token |
| GET | `/api/tokens` | List honey tokens |
| GET | `/api/tokens/stats` | Token statistics |
| GET | `/api/alerts` | List detection alerts |
| GET | `/api/alerts/stats` | Alert statistics |
| PATCH | `/api/alerts/{id}/status` | Update alert status |
| WS | `/ws/{user_id}` | WebSocket real-time feed |
| GET | `/api/health` | Health check |

## Project Structure

```
PhantomGate/
├── backend/
│   ├── app/
│   │   ├── core/        # Config, security, database, deps
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic layer
│   │   ├── agents/      # LangGraph agent pipeline
│   │   ├── api/         # Route handlers
│   │   └── main.py      # FastAPI app entrypoint
│   ├── tests/           # Pytest test suite
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── store/       # Zustand state stores
│   │   ├── hooks/       # React hooks (WebSocket)
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Login, Register, Dashboard
│   │   ├── main.tsx     # Entry point
│   │   └── App.tsx      # Router
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://...` | PostgreSQL connection string |
| `REDIS_URL` | `redis://redis:6379/0` | Redis connection string |
| `SECRET_KEY` | `change-me-in-production` | JWT signing key |
| `OPENAI_API_KEY` | _(optional)_ | OpenAI key for LangGraph agent |

## Demo Credentials

Register a new account at `/register` after starting the app.

## License

MIT
