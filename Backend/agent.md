# Agent Documentation

This document describes the technical architecture and working flow of the backend service.

## Tech Stack
- Node.js with Express
- Sequelize ORM
- MySQL / MariaDB via `mysql2`
- JWT-based authentication using `jsonwebtoken`
- Password hashing using `bcryptjs`
- Request logging with `morgan`
- CORS enabled with `cors`
- Environment variables loaded via `dotenv`

## Application Flow

### Startup
- `app.js` loads environment variables.
- Express middleware is registered: `cors`, `express.json()`, and `morgan('dev')`.
- Health check endpoint: `GET /health`
- API base route: `/api/v1`
- Database connection is established with Sequelize before the server starts.

### Routing
- All API routes are defined under `routes/v1`.
- `routes/v1/index.js` mounts module-specific routers for `/auth`, `/requests`, `/checker`, and `/approver`.
- Each route file applies authentication and authorization middleware where required.

### Authentication and Authorization
- `middleware/auth.js` checks JWT tokens and identifies the logged-in user.
- Role-based access is enforced with `authorize(role)`.
- Public routes: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`.
- Protected user routes: `/api/v1/requests/*`.
- Protected checker routes: `/api/v1/checker/*`.
- Protected approver routes: `/api/v1/approver/*`.

### Controllers
- Controllers are in `controllers/v1` and map route actions to service calls.
- Controller functions handle request data extraction, service invocation, and JSON responses.
- Errors are forwarded to error middleware using `next(err)`.

### Services
- Services live under `service/v1`.
- Business logic and database transactions are centralized here.
- Workflow operations and request queue retrieval are handled by separate service modules.

## Key Concepts

### Loan Request Workflow
- A loan request starts at the checker stage.
- `ApprovalStage` records represent current and next review states.
- `service/v1/workflow.service.js` advances the request through stages or returns it to the user.
- Approver stages are scoped to departments.

### Queue Logic
- `checkerQueue()` returns requests awaiting checker review.
- `approverQueue(departmentId)` returns requests awaiting approval for a department.

## Maintenance Notes
- Keep query and transaction logic inside service modules.
- Keep controllers focused on request/response handling.
- Use consistent folder naming and route naming conventions to avoid confusion between resources.
