# Service Documentation

This document explains how controller logic maps to service functions in the backend.

## Purpose

The backend follows a controller-service separation:
- Controllers handle HTTP request/response flow.
- Services implement business logic and database operations.

## Controllers and Services

### Auth
- Controller: `controllers/v1/auth.controller.js`
- Service: no dedicated auth service file currently; authentication logic is handled directly in the controller.
- Routes: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`

### Request
- Controller: `controllers/v1/request.controller.js`
- Service: `service/v1/request.service.js`
- Role: create loan requests, list user requests, read request status.
- Routes:
  - `POST /api/v1/requests/` → `submit`
  - `GET /api/v1/requests/` → `myRequests`
  - `GET /api/v1/requests/:id/status` → `status`

### Checker
- Controller: `controllers/v1/checker.controller.js`
- Services:
  - `service/v1/workflow.service.js` for workflow transitions.
  - `service/v1/request.service.js` for queue retrieval.
- Role: fetch checker queue, approve or return requests from checker stage.
- Routes:
  - `GET /api/v1/checker/queue` → `queue`
  - `POST /api/v1/checker/:id/forward` → `forward`
  - `POST /api/v1/checker/:id/return` → `returnRequest`

### Approver
- Controller: `controllers/v1/approver.controller.js`
- Services:
  - `service/v1/workflow.service.js` for stage advancement, rerouting, and returning.
  - `service/v1/request.service.js` for approver queue retrieval.
- Role: fetch approver queue, approve, reroute, or return approval requests.
- Routes:
  - `GET /api/v1/approver/queue` → `queue`
  - `POST /api/v1/approver/:id/approve` → `approve`
  - `POST /api/v1/approver/:id/reroute` → `reroute`
  - `POST /api/v1/approver/:id/return` → `returnRequest`

## Service Responsibilities

### `service/v1/request.service.js`
- `createRequest(userId, payload)`: create `LoanRequest`, attach `Document` records, initialize approval stages.
- `getStatus(requestId, userId)`: return a loan request with related stages and documents, ensuring user ownership.
- `listForUser(userId)`: list loan requests for a user.
- `checkerQueue()`: retrieve active checker approval stages.
- `approverQueue(departmentId)`: retrieve active approver approval stages for a department.

### `service/v1/workflow.service.js`
- `initStages(loanRequest, transaction)`: build approval stage chain and mark the first stage as `in_progress`.
- `advanceStage(loanRequest, currentStage, actingUser, remarks)`: approve current stage and progress to the next stage.
- `rerouteToDepartment(loanRequest, currentStage, targetDepartmentId, actingUser, remarks)`: skip current stage and move request to a target department stage.
- `returnToUser(loanRequest, currentStage, actingUser, remarks)`: return the request to the user with remarks.

## Notes
- Controller functions should remain thin and delegate all business logic to services.
- Common business operations belong in `service/v1/*` files, while request-specific flow and response handling belong in controllers.
