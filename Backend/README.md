# Drcloan Backend

This backend provides loan request workflows for users, checkers, and approvers.

## Overview

- Node.js + Express API
- Sequelize ORM with MySQL
- JWT authentication
- Role-based authorization for `user`, `checker`, and `approver`
- Loan request lifecycle with checker review, approval stages, reroute, and return-to-user actions.

## Project Structure

- `app.js` — application setup, middleware, routes, and database startup.
- `routes/v1/` — API route definitions.
- `controllers/v1/` — request handlers that call service logic.
- `service/v1/` — business logic and database transactions.
- `models/` — Sequelize models.
- `middleware/` — auth, dispatch, error handling, and logging.

## Key Routes

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Requests
- `POST /api/v1/requests/` — submit a loan request.
- `GET /api/v1/requests/` — get current user's requests.
- `GET /api/v1/requests/:id/status` — get request status.

### Checker
- `GET /api/v1/checker/queue` — list pending checker approvals.
- `POST /api/v1/checker/:id/forward` — approve and advance.
- `POST /api/v1/checker/:id/return` — return to user.

### Approver
- `GET /api/v1/approver/queue` — list pending approver approvals.
- `POST /api/v1/approver/:id/approve` — approve and advance.
- `POST /api/v1/approver/:id/reroute` — send request to another department.
- `POST /api/v1/approver/:id/return` — return to user.

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set environment variables in `.env`:
   - `PORT`
   - `JWT_SECRET`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_HOST`
3. Start the server:
   ```bash
   node app.js
   ```
4. Health check:
   ```bash
   curl http://localhost:3000/health
   ```

## Notes

- Follow the naming convention: service names should match domain behavior and API semantics.
- Controllers should remain thin, while services handle transactions and workflow logic.
- Document new logic in `service.md`, and keep API/architecture notes in `agent.md`.
- Use `guidline.md` for naming and routing conventions.
