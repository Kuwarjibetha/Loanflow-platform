# Agent Documentation

Technical reference for the LoanFlow backend — architecture, flow, and maintenance notes.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Node.js + Express | HTTP server and routing |
| Sequelize | ORM for MySQL |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT generation & verification |
| `morgan` | HTTP request logging |
| `cors` | Cross-origin resource sharing |
| `multer` + `cloudinary` | File/document upload |
| `dotenvx` | Environment variable loading |

---

## Application Startup (`app.js`)

1. Load `.env` with `dotenvx`.
2. Register Express middleware: `cors`, `express.json()`, `morgan('dev')`.
3. Serve frontend static files from `../frontend` at `/`.
4. Mount API router: `app.use('/api/v1', require('./routes/v1'))`.
5. Authenticate database, then `app.listen()`.

---

## Domain Sub-folder Architecture

All backend layers follow the same **domain-driven sub-folder pattern**:

```
<layer>/
├── <domain>/
│   └── <domain>.<layer>.js
└── index.js      ← barrel exporter
```

**Layers and their barrel exporters:**

| Layer | Path | Barrel Import |
|-------|------|---------------|
| Config | `config/index.js` | `require('./config')` |
| Models | `models/index.js` | `require('./models')` |
| Services | `service/v1/index.js` | `require('./service/v1')` |
| Controllers | `controllers/v1/index.js` | `require('./controllers/v1')` |
| Routes | `routes/v1/index.js` | `require('./routes/v1')` |
| Middleware | `middleware/index.js` | `require('./middleware')` |
| Utils | `utils/index.js` | `require('./utils')` |

---

## Routing Architecture

```
routes/v1/index.js
├── /auth          → auth/auth.routes.js
├── /requests      → request/request.routes.js
├── /checker       → checker/checker.routes.js
├── /approver      → approver/approver.routes.js
├── /admin         → admin/admin.routes.js
└── /notifications → notification/notification.routes.js
```

---

## Authentication & Authorization

- JWT is verified by `middleware/auth/auth.middleware.js`.
- Token payload: `{ id, role, departmentId, departmentName }`.
- `authenticate` attaches decoded user to `req.user`.
- `authorize(...roles)` restricts access to specific roles.
- The `dispatchToStage` middleware (`middleware/dispatcher/`) validates:
  - The loan request exists and has an active stage.
  - The requesting user's role and departmentId match the current stage.

---

## Loan Request Workflow

```
[User Submits] → [Checker Review] → [Approver (DPO)] → [Approver (Finance)] → [Approved]
                      ↓                    ↓
                [Return to User]     [Reroute to Dept]
                      ↓
                [User Resubmits]
```

- `initStages()` — builds one checker stage + one approver stage per department.
- `advanceStage()` — marks current stage approved, activates next, or marks request fully approved.
- `rerouteToDepartment()` — skips current stage, activates target department's approver stage.
- `returnToUser()` — returns request with remarks; status → `returned_to_user`.
- `resubmit()` — reactivates the returned stage; status → `checker_review` or `approver_review`.

---

## Notifications & Audit Logs

Every workflow action in `workflow.service.js` creates:
1. A `Notification` for the request owner (`createNotification(userId, message, t)`).
2. An `AuditLog` entry for the action (`logAction(requestId, userId, action, details, t)`).

Both are created inside the same Sequelize transaction as the stage update.

---

## Roles Summary

| Role | Access |
|------|--------|
| `user` | Submit, track, resubmit own requests |
| `checker` | View checker queue, forward/return + verify documents |
| `approver` | View dept queue, approve/reroute/return requests |
| `admin` | Full CRUD on departments, users, requests, audit logs |

---

## Maintenance Notes

- All business logic lives in `service/v1/<domain>/<domain>.service.js`.
- Controllers stay thin: extract input → call service → send JSON response.
- All cross-service imports go through `require('../service/v1')` (barrel exporter).
- New features should follow the same domain sub-folder pattern.
- Multi-tab department isolation uses `sessionStorage` per browser tab in the frontend.
