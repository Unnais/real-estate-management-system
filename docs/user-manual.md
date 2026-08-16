# User Manual — Real Estate Management System

Live application: https://real-estate-management-system-one-green.vercel.app

This guide walks through using the platform as each type of user.

---

## Getting started

### Creating an account

1. Go to the live site and click **Register** (top right)
2. Fill in your name, email, and a password (must be at least 8 characters with one number and one symbol)
3. Choose your account type:
   - **Customer** — browse listings and book property visits
   - **Property Owner** — list your own properties
   - **Agent** — manage listings on behalf of owners
4. Click **Register** — you'll be redirected to the login page

### Logging in

1. Click **Log in**, enter your email and password
2. You'll be taken to your **Dashboard**, which shows your name and account role

Note: for security, your session expires after 15 minutes of the access token being issued. If you see yourself unexpectedly returned to the login page, this is why — just log in again.

---

## For customers

### Browsing properties

1. Click **Browse** in the navigation bar
2. Use the search bar to filter by keyword, property type, or price range
3. Click **Search** to apply filters, or **Clear** to reset

### Viewing a property

Click any property card to see full details: price, area, amenities, and images.

### Booking a site visit

1. On a property's details page, click **Book a Visit**
2. Choose a date and time (must be in the future)
3. Optionally add a note for the owner/agent
4. Click **Confirm** — you'll see a confirmation message

### Checking your bookings

Click **My Bookings** in the navbar to see all your requested visits and their current status:
- **Pending** — awaiting confirmation from the owner/agent
- **Confirmed** — the visit is scheduled
- **Completed** — the visit has taken place
- **Cancelled** — the visit was cancelled

---

## For property owners and agents

### Creating a listing

1. Log in with an owner or agent account
2. Click **Create Listing** in the navbar
3. Fill in the property details: title, type, price, area, location (latitude/longitude), amenities, and an image URL
4. Click **Create Listing**

Your listing is submitted with **pending** status and won't appear in public search results until an administrator approves it.

---

## For administrators

### Approving or rejecting listings

1. Log in with an admin account
2. Click **Approvals** in the navbar
3. You'll see all pending listings with their basic details
4. Click **Approve** to make a listing publicly visible, or **Reject** to decline it

Approved listings immediately appear in the public Browse page; rejected ones do not.

---

## Frequently asked questions

**Why can't I create a listing?**
Only accounts registered as Owner or Agent can create listings. If you registered as a Customer, you won't see the "Create Listing" option.

**Why isn't my new listing showing up in search?**
New listings start as "pending" and require admin approval before they appear publicly. This is a deliberate quality-control step.

**Why was I logged out unexpectedly?**
Access tokens expire 15 minutes after login for security. Simply log back in to continue.

**The site feels slow to load the first time — is something wrong?**
The backend is hosted on a free-tier server that "sleeps" after periods of inactivity and takes 30-50 seconds to wake up on the first request. This is expected behavior for the current hosting tier, not a bug.