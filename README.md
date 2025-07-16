# Retail Sales Dashboard - Microservices

A containerized microservices application with React frontend, Flask backend, and dual database setup (PostgreSQL + MySQL).

## Summary

This project demonstrates deploying a microservices-based application where each component runs as a separate process within its own Docker container. The application includes a frontend web server, backend API server, and database servers that are containerized using Docker and communicate effectively with each other.

## Requirements Fulfilled

**Dockerized Frontend Web Server** - React app with Dockerfile, dependencies, and port exposure  
**Dockerized Backend API Server** - Flask API with Dockerfile, dependencies, and port exposure  
**Dockerized Database Servers** - PostgreSQL and MySQL using official Docker images  
**Docker Networking** - Custom bridge network for inter-container communication  
**Docker Compose Configuration** - Orchestrates services, networks, and volumes  
**Service Communication** - Frontend ↔ Backend ↔ Databases communication verified  
**Deployment & Testing** - Complete stack deployment with end-to-end testing capability

## What's Inside

- **Frontend**: React.js app on port 3000
- **Backend**: Flask API on port 5000  
- **Databases**: PostgreSQL (sales data) + MySQL (summaries)
- **Networking**: Docker Compose with custom network
- **Storage**: Persistent volumes for data

## Tech Stack

| Service | Tech | Port |
|---------|------|------|
| Frontend | React + Axios | 3000 |
| Backend | Flask + Python | 5000 |
| Database 1 | PostgreSQL | 5432 |
| Database 2 | MySQL | 3307 |

## Quick Start

**Prerequisites**: Docker & Docker Compose

```bash
# Clone and run
git clone <your-repo>
docker-compose up --build
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Security Note

**Important**: Before deploying to production, change the default database passwords in:
- `docker-compose.yml` (lines with `PASSWORD`)
- `backend/db_utils.py` (default fallback values)

Current passwords are set to `password` for development purposes only.

## Development Commands

```bash
# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f
docker-compose logs -f backend  # specific service

# Stop everything
docker-compose down

# Clean reset (removes data)
docker-compose down -v
```

## Project Structure

```
├── docker-compose.yml      # Orchestrates all services
├── frontend/              # React app
│   ├── Dockerfile
│   └── src/components/SalesDashboard.js
├── backend/               # Flask API
│   ├── Dockerfile
│   ├── app.py            # Main API routes
│   └── db_utils.py       # Database connections
└── db/                   # Database init scripts
    ├── postgres-init.sql
    └── mysql-init.sql
```

## API Endpoints

```bash
# Test the API
curl http://localhost:5000/api/sales     # PostgreSQL data
curl http://localhost:5000/api/summary   # MySQL data  
curl http://localhost:5000/health        # Health check
```

## How It Works

1. React frontend fetches data from Flask API
2. Backend connects to PostgreSQL (sales) and MySQL (summaries)  
3. All services run in Docker containers with shared network
4. Data persists in Docker volumes

## What This Demonstrates

Microservices architecture  
Multi-container Docker setup  
Service-to-service communication  
Dual database integration  
Frontend-backend separation  
Docker Compose orchestration 