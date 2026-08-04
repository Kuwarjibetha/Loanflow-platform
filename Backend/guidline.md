# Naming & Folder Guidelines

This project uses a **domain-driven sub-folder pattern** across all backend layers.

---

## Core Rule — Domain Sub-folder Pattern

Every file lives inside a folder named after its domain:

```
<layer>/
├── <domain>/
│   └── <domain>.<layer-suffix>.js
└── index.js      ← barrel exporter for the whole layer
```

### Examples

| Layer | Domain | File Path |
|-------|--------|-----------|
| service | approver | `service/v1/approver/approver.service.js` |
| controller | checker | `controllers/v1/checker/checker.controller.js` |
| route | notification | `routes/v1/notification/notification.routes.js` |
| middleware | auth | `middleware/auth/auth.middleware.js` |
| model | LoanRequest | `models/LoanRequest/LoanRequest.js` |
| config | db | `config/db/db.js` |
| util | response | `utils/response/response.util.js` |

---

## File Naming Rules

| Type | Suffix | Example |
|------|--------|---------|
| Service | `.service.js` | `workflow.service.js` |
| Controller | `.controller.js` | `approver.controller.js` |
| Route | `.routes.js` | `checker.routes.js` |
| Middleware | `.middleware.js` | `auth.middleware.js` |
| Utility | `.util.js` | `response.util.js` |
| Model | Capitalized | `LoanRequest.js` |

---

## Barrel Exporters (`index.js`)

Every directory has an `index.js` that re-exports all its domain modules.

```
// Example: service/v1/index.js
const approverService = require('./approver/approver.service');
const requestService  = require('./request/request.service');
// ...
module.exports = { ...approverService, ...requestService, ... };
```

Imports across layers always use the barrel:
```js
// ✅ Correct
const { createRequest } = require('../service/v1');
const { authenticate }  = require('../middleware');

// ❌ Wrong (direct path, bypasses barrel)
const { createRequest } = require('../service/v1/request/request.service');
```

---

## API Route Naming

- Use **plural resource names** for RESTful collections: `/requests`, `/notifications`.
- Use **role prefixes** for role-specific actions: `/checker/*`, `/approver/*`, `/admin/*`.
- Nested sub-actions use `:id/action` format:
  - `/checker/:id/forward`, `/approver/:id/reroute`.

---

## Controller Rules

- **Thin controllers** only: validate input → call service → return JSON.
- No Sequelize queries inside controllers.
- All errors forwarded with `next(err)`.

---

## Service Rules

- All business logic, Sequelize queries, and transactions live here.
- Services import models directly (`require('../models')`).
- Cross-domain services call each other by importing from the barrel:
  - e.g., `workflow.service.js` imports `createNotification` from `notification.service.js`.
- Transactions are passed as the last argument `(t)` or `(transaction)`.

---

## Model Rules

- One model per sub-folder: `models/<ModelName>/<ModelName>.js`.
- Models import Sequelize from `../../config/db/db`.
- All associations are defined in `models/index.js`, not in individual model files.

---

## General Rules

- Never use generic names like `handler.js`, `helper.js`, or `util.js` without a domain prefix.
- Prefer explicit over implicit: names must communicate what domain and what layer.
- When adding a new domain, replicate the sub-folder pattern in every affected layer.
