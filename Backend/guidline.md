# Naming and Folder Guidelines

This project uses a clear folder and naming convention for controllers, services, and API routes.

## Folder Structure
- `controllers/v1/`: contains controller modules for API endpoints.
- `routes/v1/`: contains route definitions and middleware wiring.
- `service/v1/`: contains service modules with business logic.
- `models/`: contains Sequelize model definitions.
- `middleware/`: contains reusable middleware like authentication and dispatching.

## Naming Rules
- Service file names should describe the main domain or action set.
  - Example: `request.service.js`, `workflow.service.js`
- Controller file names should match the route group.
  - Example: `request.controller.js`, `checker.controller.js`, `approver.controller.js`
- Route file names should match their route prefix.
  - Example: `request.routes.js`, `checker.routes.js`, `approver.routes.js`
- API endpoints should follow the service/controller purpose.
  - Example: `POST /api/v1/requests/` maps to request service logic.
  - Example: `GET /api/v1/approver/queue` maps to approver queue workflow.

## Service and API Naming
- Use service names that directly reflect API behavior.
  - Example: `request.service.js` exposes `createRequest`, `getStatus`, `listForUser`, `checkerQueue`, `approverQueue`.
- Keep controller names aligned with route names and HTTP actions.
  - Example: `approver.controller.js` exports `queue`, `approve`, `reroute`, `returnRequest`.
- Avoid generic names like `handler.js`; prefer resource-specific names.

## Route Design
- Use plural resource names for RESTful collections.
  - Example: `/requests` for loan request operations.
- Use route prefixes for role-specific actions.
  - Example: `/checker` and `/approver`.
- Use nested route actions only for stage-specific commands.
  - Example: `/checker/:id/forward`, `/approver/:id/reroute`.

## General Guidelines
- Controllers should be thin: validate request, call service, return response.
- Services should encapsulate business logic and database transactions.
- Keep naming consistent across folders so the service name, controller name, and route name are easy to follow.
- Document new service files in `service.md` when adding new domain logic.
