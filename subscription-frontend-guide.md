# Subscription System — Frontend Integration Guide

## Overview

The subscription system allows clients to **purchase session-based plans** tied to a specific service (e.g., Hammam). Each plan defines a number of sessions, a price, a duration, and whether it can be shared between users.

---

## Client Flow

### 1. Browse Available Plans

**Before** the client is logged in, they can view available subscription plans.

```
GET /api/subscription-plans
GET /api/subscription-plans?service_id=1
```

**Response:**

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "service": { "id": 1, "name": "Hammam" },
            "name_fr": "Pack 10 séances",
            "name_en": "10 Sessions Pack",
            "description_fr": "Pack individuel de 10 séances",
            "description_en": "Individual pack of 10 sessions",
            "total_sessions": 10,
            "price": "250.00",
            "duration_days": 365,
            "max_members": 1,
            "is_active": true,
            "display_order": 1
        }
    ]
}
```

**Frontend:** Display plans as cards. Group by service if multiple services exist. Show price, session count, duration, and whether it's shared (`max_members > 1`).

---

### 2. Select Plan & Purchase

After the client selects a plan, they must be **authenticated**. The flow is:

1. Client clicks "Subscribe" on a plan
2. If not logged in → redirect to login/register
3. After login → call create subscription endpoint

```
POST /api/subscriptions
Authorization: Bearer {token}
Content-Type: application/json

{
  "subscription_plan_id": 1
}
```

**Response:**

```json
{
    "success": true,
    "data": {
        "id": 10,
        "user": { "id": 5, "name": "Client Name" },
        "subscription_plan": { "id": 1, "name_fr": "Pack 10 séances" },
        "name": "Pack 10 séances",
        "total_sessions": 10,
        "used_sessions": 0,
        "remaining_sessions": 10,
        "price_paid": "250.00",
        "start_date": "2025-01-15",
        "end_date": "2026-01-15",
        "is_active": true,
        "is_valid": true,
        "members": [{ "user_id": 5, "is_owner": true, "name": "Client Name" }]
    }
}
```

> **Payment:** Integrate payment before calling `POST /api/subscriptions`. Once payment is confirmed, create the subscription. The backend does not handle payment for subscriptions — it only records the subscription.

---

### 3. View My Subscriptions (Dashboard)

```
GET /api/subscriptions
Authorization: Bearer {token}
```

Returns all subscriptions where the user is an owner or member. Display:

- Plan name
- Remaining sessions / Total sessions (progress bar)
- Expiry date
- Status (active/expired)
- Members list (for shared plans)

---

### 4. Manage Shared Subscription Members

If a plan has `max_members > 1`, the owner can add/remove members.

**Add member:**

```
POST /api/subscriptions/{id}/members
Authorization: Bearer {token}

{ "user_id": 12 }
```

**Remove member:**

```
DELETE /api/subscriptions/{id}/members/{userId}
Authorization: Bearer {token}
```

**View members:**

```
GET /api/subscriptions/{id}/members
Authorization: Bearer {token}
```

---

### 5. Book an Appointment Using Subscription

When a client books an appointment and has a valid subscription for that service, sessions are **automatically deducted upon booking confirmation**. If a booking is cancelled, the session is **automatically refunded**.

The frontend does not need to handle session deduction manually — it happens server-side.

Just use the existing booking flow:

```
POST /api/bookings
```

The `SubscriptionResource` response always includes `remaining_sessions` and `is_valid` so the frontend can display up-to-date session counts.

---

## Admin Flow

### Admin — Subscription Plans (CRUD)

Base URL: `/api/admin/subscription-plans`

| Method   | Endpoint                                           | Description                    |
| -------- | -------------------------------------------------- | ------------------------------ |
| `GET`    | `/api/admin/subscription-plans`                    | List all plans (inc. inactive) |
| `POST`   | `/api/admin/subscription-plans`                    | Create new plan                |
| `GET`    | `/api/admin/subscription-plans/{id}`               | Get plan details               |
| `PUT`    | `/api/admin/subscription-plans/{id}`               | Update plan                    |
| `DELETE` | `/api/admin/subscription-plans/{id}`               | Delete plan                    |
| `POST`   | `/api/admin/subscription-plans/{id}/toggle-active` | Toggle active/inactive         |

**Create Plan — Request body:**

```json
{
    "service_id": 1,
    "name_fr": "Pack 30 séances",
    "name_en": "30 Sessions Pack",
    "description_fr": "Pack VIP de 30 séances",
    "description_en": "VIP pack of 30 sessions",
    "total_sessions": 30,
    "price": 650,
    "duration_days": 365,
    "max_members": 1,
    "is_active": true,
    "display_order": 4
}
```

**Update Plan:** Same fields, all optional. Send only the fields to update.

**Filter:** `GET /api/admin/subscription-plans?service_id=1&active_only=true`

---

### Admin — Subscriptions Management

Base URL: `/api/admin/subscriptions`

| Method   | Endpoint                                         | Description                    |
| -------- | ------------------------------------------------ | ------------------------------ |
| `GET`    | `/api/admin/subscriptions`                       | List all subscriptions         |
| `POST`   | `/api/admin/subscriptions`                       | Create subscription for a user |
| `GET`    | `/api/admin/subscriptions/{id}`                  | Get subscription details       |
| `PUT`    | `/api/admin/subscriptions/{id}`                  | Update subscription            |
| `POST`   | `/api/admin/subscriptions/{id}/deactivate`       | Deactivate subscription        |
| `POST`   | `/api/admin/subscriptions/{id}/activate`         | Activate subscription          |
| `POST`   | `/api/admin/subscriptions/{id}/members`          | Add member                     |
| `DELETE` | `/api/admin/subscriptions/{id}/members/{userId}` | Remove member                  |

**Create Subscription (admin):**

```json
{
    "user_id": 5,
    "subscription_plan_id": 1,
    "start_date": "2025-02-01"
}
```

**Update Subscription:**

```json
{
    "total_sessions": 15,
    "is_active": true,
    "end_date": "2026-06-01"
}
```

**Filters:** `GET /api/admin/subscriptions?user_id=5&active_only=true&service_id=1`

---

## Frontend Pages Summary

### Client Pages

| Page                      | Description                                                        |
| ------------------------- | ------------------------------------------------------------------ |
| **Plans Listing**         | Show available subscription plans (filterable by service). Public. |
| **Subscription Purchase** | Select plan → login/register → pay → create subscription.          |
| **My Subscriptions**      | Dashboard showing active/expired subscriptions with progress.      |
| **Manage Members**        | For shared plans: add/remove members.                              |

### Admin Pages

| Page                            | Description                                                                                                            |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Subscription Plans List**     | Table of all plans. Toggle active. Edit/delete buttons.                                                                |
| **Create/Edit Plan Form**       | Form with: service (dropdown), name FR/EN, description, sessions, price, duration, max members, active, display order. |
| **Subscriptions List**          | Table of all subscriptions. Filter by user, service, status. Activate/deactivate buttons.                              |
| **Subscription Detail**         | View subscription info, members, session usage.                                                                        |
| **Create Subscription (admin)** | Select user + plan + start date → create.                                                                              |

---

## Data Models Reference

### SubscriptionPlan

| Field          | Type    | Description                    |
| -------------- | ------- | ------------------------------ |
| id             | int     | —                              |
| service_id     | int     | FK to services table           |
| name_fr        | string  | French name                    |
| name_en        | string  | English name                   |
| description_fr | text    | French description             |
| description_en | text    | English description            |
| total_sessions | int     | Number of sessions in the pack |
| price          | decimal | Price of the plan              |
| duration_days  | int     | Validity period in days        |
| max_members    | int     | 1 = individual, 2+ = shared    |
| is_active      | boolean | Plan visible to clients        |
| display_order  | int     | Sort order in listing          |

### Subscription

| Field                | Type    | Description                                       |
| -------------------- | ------- | ------------------------------------------------- |
| id                   | int     | —                                                 |
| user_id              | int     | Owner (who purchased)                             |
| subscription_plan_id | int     | FK to subscription_plans (nullable)               |
| service_id           | int     | FK to services                                    |
| name                 | string  | Subscription name (from plan)                     |
| total_sessions       | int     | Total sessions purchased                          |
| used_sessions        | int     | Sessions consumed                                 |
| remaining_sessions   | int     | Computed: total - used                            |
| price_paid           | decimal | Amount paid                                       |
| start_date           | date    | When subscription starts                          |
| end_date             | date    | When subscription expires                         |
| is_active            | boolean | Manually activated/deactivated                    |
| is_valid             | boolean | Computed: active AND not expired AND has sessions |

### SubscriptionMember

| Field           | Type     | Description                      |
| --------------- | -------- | -------------------------------- |
| subscription_id | int      | FK to subscriptions              |
| user_id         | int      | FK to users                      |
| is_owner        | boolean  | true = purchaser, false = shared |
| added_at        | datetime | When added to subscription       |
