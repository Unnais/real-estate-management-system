# PRD Updates — Scope Changes During Implementation

This document tracks where the implemented system differs from the original PRD, and why.

---

## 1. Payments — mocked, no live gateway

**Original PRD:** Full payment initiation/webhook flow with a real payment gateway, signature verification, and idempotent webhook handling.

**What was built:** `POST /payments/initiate` and `GET /payments/history` are implemented and fully functional, but the actual gateway call is mocked — a transaction is created with `status: "success"` and a synthetic `gatewayRef` instead of calling a real provider (Stripe/Razorpay).

**Why:** The PRD itself lists "Integrated payment gateway with escrow-style booking deposits" under Future Scope, not core MVP scope. A real gateway integration also requires a live merchant account and webhook signature verification, which wasn't practical within the internship's 4-week window. The data model and API contract are built to match a real integration, so swapping in a real gateway later only requires replacing the mocked logic inside `initiatePayment`, not redesigning the schema or routes.

---

## 2. Cloudinary — not integrated

**Original PRD:** Property images uploaded directly to Cloudinary, returning hosted URLs.

**What was built:** The `images` field on a property accepts an array of image URLs directly (via the create/edit listing form or API). No file upload or Cloudinary integration exists yet — users supply a URL rather than uploading a file.

**Why:** Time-prioritization decision — core CRUD, auth, and the booking/approval workflow were prioritized as higher-value for demonstrating full-stack competency within the timeline. The schema (`images: [String]`) is unchanged, so adding real upload support later is additive, not a breaking change.

---

## 3. Admin account creation — manual, no seed script

**Original PRD:** Implies an admin-capable system without specifying how the first admin account is created.

**What was built:** The register endpoint explicitly blocks self-registration as `admin` (matching the PRD's own note that "admin creation restricted to seed/admin-only route"). In the current build, promoting a user to `admin` is done manually via direct database edit in MongoDB Atlas, since no seed script or admin-invite flow was built.

**Why:** Lower priority than the core approval/booking/search workflows given the timeline. A seed script or a `POST /auth/admin-invite` route (admin-only) would be a natural addition post-MVP.

---

## 4. Refresh tokens — not implemented

**Original PRD:** "Refresh Token: Stored hashed in the database, rotated on every use, revocable on logout."

**What was built:** Only a short-lived access token (15 minutes) is issued at login. There is no refresh token, so a session expires after 15 minutes and the user must log in again. A response interceptor auto-redirects to `/login` when a token expires, so the failure mode is a clean re-login rather than a broken UI state.

**Why:** Refresh token rotation adds meaningful complexity (secure storage, rotation-on-use, replay detection) for a feature whose absence doesn't block any core user flow — it's a UX polish item, not a functional gap. Flagged as a known follow-up.

---

## 5. Booking status confirmation — no dedicated UI

**Original PRD:** Owners/agents confirm or decline booking requests.

**What was built:** The backend fully supports this (`PATCH /bookings/:id/status`, restricted to the property's owner/agent/admin), and it's covered in the Postman collection, but no dedicated frontend page was built for an owner/agent to view and act on incoming booking requests — only the customer-facing "My Bookings" list view exists.

**Why:** Time-prioritization; this is the most likely next frontend page to add post-MVP, since the backend logic is already complete and tested.

---

## 6. Search & Filters — scope met as specified

No changes here — implemented per the original PRD: keyword, type, price range, amenities filtering, with pagination and min/max price validation.

---

## Summary

The core user journey — register/login → browse/search properties → owner/agent creates listing → admin approves → customer books a visit → lead is tracked → mocked payment — is fully functional end-to-end, backend and frontend, and deployed live. The changes above represent deliberate scope trims to fit a 4-week internship timeline, prioritizing a complete, working core loop over full breadth of every PRD feature.