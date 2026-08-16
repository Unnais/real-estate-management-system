# API Documentation — Real Estate Management System

Base URL (local): `http://localhost:5000/api`
Base URL (production): `https://real-estate-management-system-1x5i.onrender.com/api`

All responses follow this envelope:
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "message" }
```

Protected routes require a header: `Authorization: Bearer <accessToken>`

---

## Authentication

### POST /auth/register
Public. Creates a new user account.

**Body:**
```json
{ "name": "string", "email": "string", "password": "string", "role": "owner | agent | customer" }
```
Password requires 8+ characters, at least one number and one symbol. `admin` role cannot self-register.

**Response (201):**
```json
{ "success": true, "data": { "id": "...", "name": "...", "email": "...", "role": "..." } }
```

### POST /auth/login
Public. Authenticates a user and returns a JWT access token.

**Body:**
```json
{ "email": "string", "password": "string" }
```

**Response (200):**
```json
{ "success": true, "data": { "accessToken": "...", "user": { "id": "...", "name": "...", "role": "..." } } }
```
Access token expires in 15 minutes.

### GET /auth/me
Protected. Returns the currently authenticated user's profile.

**Response (200):**
```json
{ "success": true, "data": { "id": "...", "name": "...", "email": "...", "role": "..." } }
```

---

## Properties

### GET /properties
Public. Returns all `approved` property listings.

### GET /properties/search
Public. Query params: `keyword`, `type`, `minPrice`, `maxPrice`, `amenities`, `page`, `limit`.
Returns approved listings matching filters, paginated.

**Response includes:**
```json
{ "success": true, "data": [...], "pagination": { "page": 1, "limit": 20, "total": 0, "pages": 0 } }
```

### GET /properties/:id
Public. Returns a single property by ID.

### POST /properties
Protected — `owner` or `agent` role only. Creates a new listing (defaults to `pending` status).

**Body:**
```json
{
  "title": "string (5-120 chars)",
  "type": "apartment | villa | plot | commercial",
  "price": "number > 0",
  "areaSqft": "number > 0",
  "location": { "lat": "number", "lng": "number" },
  "amenities": ["string"],
  "images": ["url (1-20 required)"]
}
```

### PUT /properties/:id
Protected — owner, assigned agent, or admin only. Updates a listing.

### DELETE /properties/:id
Protected — owner or admin only. Deletes a listing.

### PATCH /properties/:id/status
Protected — `admin` role only. Approves, rejects, or deactivates a listing.

**Body:**
```json
{ "status": "approved | rejected | inactive | pending" }
```

### GET /properties/admin/all
Protected — `admin` role only. Returns all properties regardless of status. Optional `?status=` query param to filter.

---

## Bookings

### POST /bookings
Protected. Requests a site visit for a property.

**Body:**
```json
{ "propertyId": "string", "scheduledAt": "ISO date (must be future)", "notes": "string (optional)" }
```
Blocks creation if the same time slot is already `confirmed` for that property.

### GET /bookings/user/me
Protected. Returns the current user's own bookings, with property info populated.

### GET /bookings/:id
Protected — the booking's customer, the property's owner/agent, or admin only.

### PATCH /bookings/:id/status
Protected — property owner, agent, or admin only.

**Body:**
```json
{ "status": "pending | confirmed | completed | cancelled" }
```
Re-checks for a conflicting confirmed booking before allowing a status change to `confirmed`.

---

## Leads

### POST /leads
Protected. Creates a lead for a property (or updates an existing recent one).

**Body:**
```json
{ "propertyId": "string", "source": "string (default: contact-form)" }
```
If a lead from the same customer for the same property exists within the last 24 hours, it's updated instead of duplicated. New leads auto-assign to the property's agent (or owner if no agent).

### GET /leads
Protected. Admins see all leads; agents/owners see only leads assigned to them. Optional `?status=` filter.

### PATCH /leads/:id/status
Protected — the assigned agent/owner or admin only.

**Body:**
```json
{ "status": "new | contacted | qualified | converted | lost" }
```

### GET /leads/analytics
Protected — `admin` or `agent` role only. Returns a count of leads grouped by status.

---

## Payments

### POST /payments/initiate
Protected. Initiates a payment for a booking. **Mocked** — no live payment gateway is integrated; simulates an instant successful transaction.

**Body:**
```json
{ "bookingId": "string", "amount": "number > 0" }
```

### GET /payments/history
Protected. Returns the current user's payment transactions.

---

## Standard Error Codes

| Status | Meaning |
|---|---|
| 400 | Validation failure |
| 401 | Missing, invalid, or expired token |
| 403 | Valid token, insufficient role/ownership |
| 404 | Resource not found |
| 409 | Conflict (duplicate booking, duplicate email) |
| 500 | Unhandled server error |