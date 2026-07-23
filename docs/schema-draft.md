# Database Schema Draft — Day 1

Draft reference for MongoDB collections. This becomes the actual Mongoose models in Week 2.

---

# 1. users

| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Primary key (auto) |
| name | String | Required, 2–80 chars |
| email | String | Required, unique, lowercase |
| passwordHash | String | bcrypt hash, never returned in API responses |
| role | String (enum) | owner \| agent \| customer \| admin |
| phone | String | Optional, E.164 format |
| isVerified | Boolean | Default false until email verification |
| status | String (enum) | active \| suspended |
| createdAt / updatedAt | Date | Mongoose timestamps |

**Indexes:** email (unique), role

---

## 2. properties

| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Primary key |
| title | String | Required, 5–120 chars |
| ownerId | ObjectId (ref: users) | Required |
| agentId | ObjectId (ref: users) | Optional |
| type | String (enum) | apartment \| villa \| plot \| commercial |
| price | Number | Required, > 0 |
| areaSqft | Number | Required, > 0 |
| location | GeoJSON Point | 2dsphere indexed |
| amenities | [String] | e.g. parking, gym, lift |
| images | [String] | Cloudinary URLs, max 20 |
| status | String (enum) | pending \| approved \| rejected \| inactive |

**Indexes:** location (2dsphere), ownerId, status, price

---

## 3. bookings

| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Primary key |
| propertyId | ObjectId (ref: properties) | Required |
| customerId | ObjectId (ref: users) | Required |
| scheduledAt | Date | Required, must be future |
| status | String (enum) | pending \| confirmed \| completed \| cancelled |
| notes | String | Optional |

**Indexes:** propertyId, customerId, scheduledAt

---

# 4. leads

| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Primary key |
| propertyId | ObjectId (ref: properties) | Required |
| customerId | ObjectId (ref: users) | Required |
| assignedTo | ObjectId (ref: users) | Agent/owner handling the lead |
| status | String (enum) | new \| contacted \| qualified \| converted \| lost |
| source | String | e.g. contact-form, visit-request |

**Indexes:** assignedTo, status, propertyId

---

# Relationships summary

- One owner/agent → many properties
- One property → many bookings, many leads
- One customer → many bookings, many leads

# Notes for Week 2 implementation

- All models will live in `server/models/`
- Use Mongoose `timestamps: true` on every schema
- Password hashing happens in a pre-save hook on the User model, not in controllers
- Geo queries on `properties.location` require the 2dsphere index to be created explicitly