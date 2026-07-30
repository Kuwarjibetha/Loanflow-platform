# Drcloan

This repository contains a loan workflow application with separate frontend and backend projects.

## Repository Structure

- `Backend/` — Node.js backend API built with Express and Sequelize.
- `frontend/` — Static frontend pages and client-side JavaScript.

## Backend

The backend handles:
- User registration and login
- Loan request submission
- Checker and approver review workflows
- JWT authentication and role-based access

See `Backend/readme.md` for detailed backend documentation.

## Frontend

The frontend contains:
- Static HTML pages for user, checker, approver, and admin flows
- JS services for API calls and authentication
- Reusable components for layout and status display

## Getting Started

### Backend
1. Navigate to `Backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add environment variables in `Backend/.env`
4. Start the backend:
   ```bash
   node app.js
   ```

### Frontend
1. Open `frontend/index.html` in a browser, or serve the `frontend/` folder with a static server.
2. Ensure the frontend is configured to call the backend API at the correct URL.

## Development Notes

- Backend documentation files:
  - `Backend/service.md`
  - `Backend/agent.md`
  - `Backend/guidline.md`
  - `Backend/readme.md`
- Frontend documentation should be added to `frontend/README.md` as needed.

## Naming Convention

Use consistent names for API resources, controllers, and services:
- `service/v1/*` for business logic
- `controllers/v1/*` for request handling
- `routes/v1/*` for route definitions

## Contact

This repository is the Drcloan workflow project for loan approval lifecycles and should be updated with backend and frontend integration notes as the UI and API evolve.
