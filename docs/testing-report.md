# Testing Report — Real Estate Management System

Testing method: manual end-to-end testing via curl (backend, during development) and live browser testing (frontend, against both local and deployed environments). No automated test suite was built within the timeline; all flows below were manually verified working as described.

---

## 1. Authentication

| Test | Result |
|---|---|
| Register with valid data (customer/owner/agent role) | ✅ Pass — account created, password hashed |
| Register with duplicate email | ✅ Pass — rejected with 409 Conflict |
| Register with weak password (no number/symbol) | ✅ Pass — rejected with validation error |
| Register with role = admin | ✅ Pass — rejected; admin cannot self-register |
| Login with correct credentials | ✅ Pass — returns JWT access token |
| Login with incorrect password | ✅ Pass — rejected with 401 |
| Access `/auth/me` with valid token | ✅ Pass — returns correct user profile |
| Access `/auth/me` with no token | ✅ Pass — rejected with 401, "No token provided" |
| Access `/auth/me` with expired token | ✅ Pass — rejected with 401; frontend auto-redirects to login |
| Access an admin-only route as a non-admin | ✅ Pass — rejected with 403, "insufficient permissions" |

---

## 2. Property Listings

| Test | Result |
|---|---|
| Create listing as owner/agent | ✅ Pass — created with status "pending" |
| Create listing as customer | ✅ Pass — rejected with 403 |
| Create listing with missing images | ✅ Pass — rejected, images required |
| View public listings (`GET /properties`) | ✅ Pass — only "approved" listings returned |
| View a pending listing via public endpoint | ✅ Pass — correctly excluded |
| Admin views all listings including pending | ✅ Pass — `/properties/admin/all` returns all statuses |
| Admin approves a listing | ✅ Pass — status updates to "approved", now visible publicly |
| Admin rejects a listing | ✅ Pass — status updates to "rejected" |
| Non-admin attempts to change listing status | ✅ Pass — rejected with 403 |
| Owner edits their own listing | ✅ Pass |
| Non-owner attempts to edit a listing they don't own | ✅ Pass — rejected with 403 |

---

## 3. Search & Filters

| Test | Result |
|---|---|
| Search by keyword (title match) | ✅ Pass |
| Filter by property type | ✅ Pass |
| Filter by price range | ✅ Pass |
| minPrice greater than maxPrice | ✅ Pass — rejected with validation error |
| Pagination (page/limit params) | ✅ Pass — correct `pagination` object returned |
| Search results respect approval status | ✅ Pass — only approved listings returned |

---

## 4. Bookings

| Test | Result |
|---|---|
| Create a booking with a future date | ✅ Pass |
| Create a booking with a past date | ✅ Pass — rejected by validator |
| Create a booking for an already-confirmed time slot | ✅ Pass — rejected with 409 Conflict |
| View own bookings (`/bookings/user/me`) | ✅ Pass — returns bookings with property info populated |
| Owner/agent updates booking status to confirmed | ✅ Pass |
| Confirming a booking that conflicts with another confirmed slot | ✅ Pass — rejected with 409 |
| Unauthorized user attempts to view another user's booking | ✅ Pass — rejected with 403 |

---

## 5. Leads

| Test | Result |
|---|---|
| Create a lead for a property | ✅ Pass — auto-assigned to owner/agent |
| Create a duplicate lead (same customer + property, within 24h) | ✅ Pass — existing lead updated, not duplicated |
| Agent/owner views assigned leads | ✅ Pass — only their own leads returned |
| Admin views all leads | ✅ Pass |
| Update lead status | ✅ Pass |
| Lead analytics endpoint | ✅ Pass — returns correct counts grouped by status |

---

## 6. Payments (mocked)

| Test | Result |
|---|---|
| Initiate payment for own booking | ✅ Pass — transaction created with status "success" |
| Initiate payment for another user's booking | ✅ Pass — rejected with 403 |
| View payment history | ✅ Pass — returns own transactions only |

---

## 7. Frontend Integration (live, deployed)

| Test | Result |
|---|---|
| Register → auto-redirect to login | ✅ Pass |
| Login → redirect to dashboard, token stored | ✅ Pass |
| Protected route access without login | ✅ Pass — redirected to `/login` |
| Browse properties page loads live data | ✅ Pass |
| Search/filter UI updates results | ✅ Pass |
| Property details page loads correct property | ✅ Pass |
| Book a visit via modal | ✅ Pass — booking created, confirmation shown |
| My Bookings page shows own bookings with status | ✅ Pass |
| Create Listing form (owner/agent) | ✅ Pass — listing created as pending |
| Admin Approvals page — approve/reject | ✅ Pass — listing status updates, list refreshes |
| Navbar shows role-appropriate links | ✅ Pass |
| Expired token auto-redirects to login | ✅ Pass |
| Full flow on deployed URLs (Vercel + Render) | ✅ Pass |

---

## Known Issues / Limitations

- No automated test suite (unit/integration tests) — all testing was manual
- Access tokens expire after 15 minutes with no refresh token; user must log in again
- Render free tier spins down after inactivity, causing a ~30-50s delay on the first request after idle
- Image URLs are entered manually; no file upload validation beyond URL format checking