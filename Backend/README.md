# LoanFlow Backend

A Node.js/Express REST API for the LoanFlow loan tracking platform, supporting role-based workflows for users, checkers, and approvers across multiple departments.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js + Express |
| ORM | Sequelize (MySQL) |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` |
| File Upload | Multer + Cloudinary |
| Logging | Morgan |
| CORS | `cors` |
| Config | `dotenv` / `dotenvx` |

---

## Project Structure

```
Backend/
├── app.js                        # Express app bootstrap
├── config/
│   ├── db/
│   │   └── db.js                 # Sequelize MySQL config
│   ├── cloudinary/
│   │   └── cloudinary.js         # Cloudinary storage config
│   └── index.js                  # Config barrel exporter
├── controllers/v1/
│   ├── approver/
│   │   └── approver.controller.js
│   ├── audit/
│   │   └── audit.controller.js
│   ├── auth/
│   │   └── auth.controller.js
│   ├── checker/
│   │   └── checker.controller.js
│   ├── department/
│   │   └── department.controller.js
│   ├── notification/
│   │   └── notification.controller.js
│   ├── request/
│   │   └── request.controller.js
│   ├── user/
│   │   └── user.controller.js
│   └── index.js                  # Controllers barrel exporter
├── middleware/
│   ├── auth/
│   │   └── auth.middleware.js     # JWT auth + role authorize
│   ├── dispatcher/
│   │   └── dispatcher.middleware.js # Workflow stage guard
│   ├── handle-error/
│   │   └── handle-error.middleware.js
│   ├── logger/
│   │   └── logger.middleware.js   # Morgan HTTP logger
│   ├── rate-limiter/
│   │   └── rate-limiter.middleware.js
│   ├── upload/
│   │   └── upload.middleware.js   # Multer + Cloudinary
│   ├── validator/
│   │   └── validator.middleware.js
│   └── index.js                  # Middleware barrel exporter
├── models/
│   ├── ApprovalStage/
│   │   └── ApprovalStage.js
│   ├── AuditLog/
│   │   └── AuditLog.js
│   ├── Department/
│   │   └── Department.js
│   ├── Document/
│   │   └── Document.js
│   ├── LoanRequest/
│   │   └── LoanRequest.js
│   ├── Notification/
│   │   └── Notification.js
│   ├── User/
│   │   └── User.js
│   └── index.js                  # Models barrel + Sequelize associations
├── routes/v1/
│   ├── admin/
│   │   └── admin.routes.js
│   ├── approver/
│   │   └── approver.routes.js
│   ├── auth/
│   │   └── auth.routes.js
│   ├── checker/
│   │   └── checker.routes.js
│   ├── notification/
│   │   └── notification.routes.js
│   ├── request/
│   │   └── request.routes.js
│   └── index.js                  # Master API v1 router
├── service/v1/
│   ├── approver/
│   │   └── approver.service.js
│   ├── audit/
│   │   └── audit.service.js
│   ├── checker/
│   │   └── checker.service.js
│   ├── department/
│   │   └── department.service.js
│   ├── notification/
│   │   └── notification.service.js
│   ├── request/
│   │   └── request.service.js
│   ├── user/
│   │   └── user.service.js
│   ├── workflow/
│   │   └── workflow.service.js
│   └── index.js                  # Services barrel exporter
└── utils/
    ├── response/
    │   └── response.util.js       # Success/error response helpers
    └── index.js                  # Utils barrel exporter
```

---

## API Routes

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and receive JWT |

### Requests (User)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/requests/` | Submit a loan request |
| GET | `/api/v1/requests/` | List current user's requests |
| GET | `/api/v1/requests/:id/status` | Get request status |
| POST | `/api/v1/requests/:id/documents` | Upload document |
| POST | `/api/v1/requests/:id/resubmit` | Resubmit returned request |

### Checker
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/checker/queue` | Pending checker requests |
| POST | `/api/v1/checker/:id/forward` | Approve and advance |
| POST | `/api/v1/checker/:id/return` | Return to user |
| PATCH | `/api/v1/checker/:id/documents/:docId` | Mark document valid/invalid |

### Approver
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/approver/queue` | Pending approver requests |
| GET | `/api/v1/approver/departments` | List departments (for reroute) |
| POST | `/api/v1/approver/:id/approve` | Approve and advance |
| POST | `/api/v1/approver/:id/reroute` | Reroute to another department |
| POST | `/api/v1/approver/:id/return` | Return to user |

### Admin
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/admin/requests` | All loan requests |
| GET | `/api/v1/admin/departments` | List departments |
| POST | `/api/v1/admin/departments` | Create department |
| PATCH | `/api/v1/admin/departments/:id` | Update department |
| DELETE | `/api/v1/admin/departments/:id` | Delete department |
| GET | `/api/v1/admin/users` | List all users |
| PATCH | `/api/v1/admin/users/:id` | Update user role/department |
| GET | `/api/v1/admin/audit-logs` | All audit logs (`?requestId=xxx`) |

### Notifications
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/notifications` | Current user's notifications |
| PATCH | `/api/v1/notifications/:id/read` | Mark notification as read |

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Set environment variables in .env
PORT=3000
JWT_SECRET=your_secret
DB_NAME=drcloan
DB_USER=root
DB_PASS=password
DB_HOST=localhost
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# 3. Start server
node app.js

# 4. Health check
curl http://localhost:3000/health
```

---

## Notes

- Every layer follows the **domain sub-folder pattern**: each feature (approver, checker, audit…) lives in its own folder under its parent directory.
- All imports flow through **barrel exporters** (`index.js`): `require('../service/v1')`, `require('../middleware')`, etc.
- Controllers stay thin — extract, call service, respond.
- All business logic and Sequelize transactions belong in `service/v1/<domain>/<domain>.service.js`.
- Workflow transitions (approve, reroute, return, resubmit) automatically trigger both `Notification` and `AuditLog` entries via `workflow.service.js`.
