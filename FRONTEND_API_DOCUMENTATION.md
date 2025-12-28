# SAFIR Frontend Developer API Documentation

**Version:** 1.0  
**Base URL:** `http://localhost:8000/api`  
**Last Updated:** December 28, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [Code Examples](#code-examples)
7. [Best Practices](#best-practices)

---

## Overview

This document provides comprehensive API documentation for frontend developers integrating with the SAFIR booking system backend. The API follows RESTful conventions and uses JSON for request/response payloads.

### Base Information

-   **Protocol:** HTTPS recommended in production
-   **Content-Type:** `application/json`
-   **Authentication:** Laravel Sanctum (Bearer Token)
-   **Supported Languages:** English (`en`), French (`fr`)

### Response Format

All API responses follow this standardized format:

**Success Response:**

```json
{
    "success": true,
    "message": "Operation successful message",
    "data": {
        /* response data */
    }
}
```

**Error Response:**

```json
{
    "success": false,
    "message": "Error message",
    "errors": {
        /* validation errors (optional) */
    }
}
```

---

## Authentication

### Overview

SAFIR uses **Laravel Sanctum** for token-based authentication. After logging in, store the token and include it in the `Authorization` header for protected endpoints.

### Public Endpoints (No Auth Required)

-   `POST /api/login`
-   `POST /api/register`
-   `POST /api/forget-password`
-   `GET /api/services`
-   `GET /api/services/{id}`
-   `GET /api/services/type/{type}`
-   `POST /api/availability/slots`
-   `POST /api/guest-bookings`
-   `GET /api/guest-bookings/{id}`

### Protected Endpoints

Include the Bearer token in the Authorization header:

```
Authorization: Bearer {your_token_here}
```

---

## API Endpoints

### 1. Authentication Endpoints

#### 1.1 Login

**Endpoint:** `POST /api/login`  
**Auth Required:** No

**Request Body:**

```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Success Response (200):**

```json
{
    "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "user@example.com",
        "phone": "+1234567890",
        "address": "123 Main St",
        "city": "Paris",
        "postal_code": "75001",
        "country": "France",
        "role": "client",
        "status": "active"
    },
    "favoris": [],
    "token": "1|abcdef123456..."
}
```

**Error Response (401):**

```json
{
    "message": "Invalid credentials"
}
```

---

#### 1.2 Register

**Endpoint:** `POST /api/register`  
**Auth Required:** No

**Request Body:**

```json
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "user@example.com",
    "phone": "+1234567890",
    "password": "SecurePassword123!",
    "address": "123 Main St",
    "city_id": 1,
    "agreement": true
}
```

**Success Response (200):**

```json
{
    "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "user@example.com",
        "role": "client",
        "status": "active"
    },
    "token": "1|abcdef123456..."
}
```

**Error Response (409):**

```json
{
    "message": "Email already exists"
}
```

---

#### 1.3 Logout

**Endpoint:** `POST /api/logout`  
**Auth Required:** Yes

**Success Response (200):**

```json
{
    "message": "Logged out"
}
```

---

#### 1.4 Get Current User

**Endpoint:** `GET /api/me`  
**Auth Required:** Yes

**Success Response (200):**

```json
{
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "user@example.com",
    "phone": "+1234567890",
    "role": "client",
    "status": "active"
}
```

---

#### 1.5 Update Profile

**Endpoint:** `PUT /api/profile`  
**Auth Required:** Yes

**Request Body:**

```json
{
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "address": "456 New Street"
}
```

**Success Response (200):**

```json
{
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "user@example.com",
    "phone": "+1234567890",
    "address": "456 New Street"
}
```

---

#### 1.6 Update Password

**Endpoint:** `PUT /api/password`  
**Auth Required:** Yes

**Request Body:**

```json
{
    "password": "NewSecurePassword123!"
}
```

**Success Response (200):**

```json
{
    "id": 1,
    "message": "Password updated successfully"
}
```

---

#### 1.7 Forget Password

**Endpoint:** `POST /api/forget-password`  
**Auth Required:** No

**Request Body:**

```json
{
    "email": "user@example.com"
}
```

**Success Response (200):**

```json
{
    "message": "Code sent to your email"
}
```

**Error Response (404):**

```json
{
    "message": "User not found"
}
```

---

### 2. Service Endpoints

#### 2.1 Get All Services

**Endpoint:** `GET /api/services`  
**Auth Required:** No

**Success Response (200):**

```json
{
    "success": true,
    "message": "Services retrieved successfully",
    "data": [
        {
            "id": 1,
            "type_service": "massage",
            "name": {
                "fr": "Massage Relaxant",
                "en": "Relaxing Massage"
            },
            "description": {
                "fr": "Un massage pour se détendre complètement",
                "en": "A massage to completely relax"
            },
            "duration_minutes": 60,
            "price": 50.0,
            "requires_room": true,
            "requires_chair": false,
            "requires_wash_station": false,
            "requires_hammam_session": false,
            "is_active": true
        }
    ]
}
```

---

#### 2.2 Get Service by ID

**Endpoint:** `GET /api/services/{id}`  
**Auth Required:** No

**Success Response (200):**

```json
{
    "success": true,
    "message": "Service retrieved successfully",
    "data": {
        "id": 1,
        "type_service": "massage",
        "name": {
            "fr": "Massage Relaxant",
            "en": "Relaxing Massage"
        },
        "description": {
            "fr": "Un massage pour se détendre complètement",
            "en": "A massage to completely relax"
        },
        "duration_minutes": 60,
        "price": 50.0,
        "requires_room": true,
        "requires_chair": false,
        "requires_wash_station": false,
        "requires_hammam_session": false,
        "is_active": true
    }
}
```

**Error Response (404):**

```json
{
    "success": false,
    "message": "Service not found"
}
```

---

#### 2.3 Get Services by Type

**Endpoint:** `GET /api/services/type/{type}`  
**Auth Required:** No

**Supported Types:**

-   `massage` or `masso` - Massage services
-   `hair` or `coiffure` - Hair services
-   `hammam` - Hammam services

**Example:** `GET /api/services/type/massage`

**Success Response (200):**

```json
{
    "success": true,
    "message": "Services retrieved successfully",
    "data": [
        {
            "id": 1,
            "type_service": "massage",
            "name": {
                "fr": "Massage Relaxant",
                "en": "Relaxing Massage"
            },
            "duration_minutes": 60,
            "price": 50.0
        }
    ]
}
```

---

### 3. Availability Endpoints

#### 3.1 Get Available Time Slots

**Endpoint:** `POST /api/availability/slots`  
**Auth Required:** No

**Request Body:**

```json
{
    "service_ids": [1, 2],
    "start_date": "2025-01-15",
    "end_date": "2025-01-20",
    "group_size": 1,
    "staff_preferences": [3]
}
```

**Success Response (200):**

```json
{
    "success": true,
    "message": "Available slots retrieved successfully",
    "data": {
        "2025-01-15": [
            {
                "time": "09:00",
                "available": true,
                "staff_id": 3
            },
            {
                "time": "10:30",
                "available": true,
                "staff_id": 3
            }
        ],
        "2025-01-16": [
            {
                "time": "14:00",
                "available": true,
                "staff_id": 3
            }
        ]
    }
}
```

---

### 4. Booking Endpoints

#### 4.1 Get User Bookings

**Endpoint:** `GET /api/bookings`  
**Auth Required:** Yes

**Success Response (200):**

```json
{
    "success": true,
    "message": "Bookings retrieved successfully",
    "data": [
        {
            "id": 1,
            "client": {
                "id": 5,
                "first_name": "John",
                "last_name": "Doe",
                "email": "john@example.com",
                "phone": "+1234567890"
            },
            "status": "confirmed",
            "language": "en",
            "group_size": 1,
            "total_duration_minutes": 90,
            "total_price": 75.0,
            "notes": "Please use lavender oil",
            "cancellation_reason": null,
            "cancelled_at": null,
            "booking_items": [
                {
                    "id": 1,
                    "service": {
                        "id": 1,
                        "type_service": "massage",
                        "name": {
                            "fr": "Massage Relaxant",
                            "en": "Relaxing Massage"
                        },
                        "duration_minutes": 60,
                        "price": 50.0
                    },
                    "staff": {
                        "id": 3,
                        "user_id": 10,
                        "specialties": ["massage", "aromatherapy"]
                    },
                    "room": {
                        "id": 2,
                        "name": "Room A"
                    },
                    "start_datetime": "2025-01-15 10:00:00",
                    "end_datetime": "2025-01-15 11:00:00",
                    "duration_minutes": 60,
                    "price": 50.0,
                    "order_index": 0
                }
            ],
            "created_at": "2025-01-10 14:30:00",
            "updated_at": "2025-01-10 14:30:00"
        }
    ]
}
```

---

#### 4.2 Get Upcoming Bookings

**Endpoint:** `GET /api/bookings/upcoming`  
**Auth Required:** Yes

**Success Response (200):**

```json
{
    "success": true,
    "message": "Upcoming bookings retrieved successfully",
    "data": [
        {
            "id": 1,
            "status": "confirmed",
            "total_price": 75.0,
            "booking_items": [
                {
                    "start_datetime": "2025-01-15 10:00:00",
                    "service": {
                        "name": {
                            "en": "Relaxing Massage"
                        }
                    }
                }
            ]
        }
    ]
}
```

---

#### 4.3 Create Booking

**Endpoint:** `POST /api/bookings`  
**Auth Required:** Yes

**Request Body:**

```json
{
    "service_ids": [1, 2],
    "start_datetime": "2025-01-15 10:00:00",
    "group_size": 1,
    "language": "en",
    "staff_preferences": [3],
    "use_subscription": false,
    "notes": "Please use lavender oil"
}
```

**Field Descriptions:**

-   `service_ids` (required): Array of service IDs to book
-   `start_datetime` (required): ISO datetime string, must be in the future
-   `group_size` (optional): Number of people (1-4), default: 1
-   `language` (optional): Preferred language (en/fr), default: en
-   `staff_preferences` (optional): Array of preferred staff profile IDs
-   `use_subscription` (optional): Use subscription sessions if available, default: false
-   `notes` (optional): Special requests or notes, max 500 characters

**Success Response (201):**

```json
{
    "success": true,
    "message": "Booking created successfully",
    "data": {
        "id": 1,
        "status": "draft",
        "total_price": 75.0,
        "booking_items": [
            {
                "service": {
                    "name": {
                        "en": "Relaxing Massage"
                    }
                },
                "start_datetime": "2025-01-15 10:00:00"
            }
        ]
    }
}
```

**Error Response (422):**

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "service_ids": ["The service ids field is required."],
        "start_datetime": ["The start datetime must be a date after now."]
    }
}
```

---

#### 4.4 Get Booking by ID

**Endpoint:** `GET /api/bookings/{id}`  
**Auth Required:** Yes

**Success Response (200):**

```json
{
  "success": true,
  "message": "Booking retrieved successfully",
  "data": {
    "id": 1,
    "status": "confirmed",
    "total_price": 75.00,
    "booking_items": [...]
  }
}
```

---

#### 4.5 Confirm Booking

**Endpoint:** `POST /api/bookings/{id}/confirm`  
**Auth Required:** Yes

**Success Response (200):**

```json
{
    "success": true,
    "message": "Booking confirmed successfully",
    "data": {
        "id": 1,
        "status": "confirmed"
    }
}
```

**Error Response (400):**

```json
{
    "success": false,
    "message": "Booking cannot be confirmed in current state"
}
```

---

#### 4.6 Cancel Booking

**Endpoint:** `POST /api/bookings/{id}/cancel`  
**Auth Required:** Yes

**Request Body (Optional):**

```json
{
    "reason": "Personal emergency"
}
```

**Success Response (200):**

```json
{
    "success": true,
    "message": "Booking cancelled successfully",
    "data": {
        "id": 1,
        "status": "cancelled",
        "cancellation_reason": "Personal emergency",
        "cancelled_at": "2025-01-10 15:30:00"
    }
}
```

**Error Response (400):**

```json
{
    "success": false,
    "message": "Booking cannot be cancelled"
}
```

---

### 5. Guest Booking Endpoints

Guest bookings allow non-authenticated users to make bookings.

#### 5.1 Create Guest Booking

**Endpoint:** `POST /api/guest-bookings`  
**Auth Required:** No

**Request Body:**

```json
{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com",
    "phone": "+9876543210",
    "service_ids": [1],
    "start_datetime": "2025-01-15 14:00:00",
    "group_size": 1,
    "language": "fr",
    "notes": "First time customer"
}
```

**Success Response (201):**

```json
{
    "success": true,
    "message": "Guest booking created successfully",
    "data": {
        "id": 5,
        "status": "draft",
        "confirmation_token": "abc123def456",
        "guest_info": {
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane@example.com",
            "phone": "+9876543210"
        }
    }
}
```

---

#### 5.2 Get Guest Booking

**Endpoint:** `GET /api/guest-bookings/{id}`  
**Auth Required:** No

**Query Parameters:**

-   `token` (required): Confirmation token received when booking was created

**Example:** `GET /api/guest-bookings/5?token=abc123def456`

**Success Response (200):**

```json
{
    "success": true,
    "data": {
        "id": 5,
        "status": "confirmed",
        "total_price": 50.0
    }
}
```

---

#### 5.3 Confirm Guest Booking

**Endpoint:** `POST /api/guest-bookings/{id}/confirm`  
**Auth Required:** No

**Request Body:**

```json
{
    "token": "abc123def456"
}
```

**Success Response (200):**

```json
{
    "success": true,
    "message": "Booking confirmed successfully"
}
```

---

#### 5.4 Cancel Guest Booking

**Endpoint:** `POST /api/guest-bookings/{id}/cancel`  
**Auth Required:** No

**Request Body:**

```json
{
    "token": "abc123def456",
    "reason": "Change of plans"
}
```

**Success Response (200):**

```json
{
    "success": true,
    "message": "Booking cancelled successfully"
}
```

---

### 6. Subscription Endpoints

#### 6.1 Get User Subscriptions

**Endpoint:** `GET /api/subscriptions`  
**Auth Required:** Yes

**Success Response (200):**

```json
{
    "success": true,
    "message": "Subscriptions retrieved successfully",
    "data": [
        {
            "id": 1,
            "client_profile_id": 2,
            "name": "Monthly Wellness Package",
            "description": "10 massage sessions per month",
            "total_sessions": 10,
            "used_sessions": 3,
            "remaining_sessions": 7,
            "price_paid": 400.0,
            "start_date": "2025-01-01",
            "end_date": "2025-01-31",
            "is_active": true,
            "is_valid": true,
            "services": [
                {
                    "id": 1,
                    "type_service": "massage",
                    "name": {
                        "en": "Relaxing Massage",
                        "fr": "Massage Relaxant"
                    },
                    "price": 50.0
                }
            ],
            "created_at": "2025-01-01T10:00:00.000000Z",
            "updated_at": "2025-01-10T14:30:00.000000Z"
        }
    ]
}
```

---

#### 6.2 Get Valid Subscriptions

**Endpoint:** `GET /api/subscriptions/valid`  
**Auth Required:** Yes

Returns only active and non-expired subscriptions.

**Success Response (200):**

```json
{
    "success": true,
    "message": "Valid subscriptions retrieved successfully",
    "data": [
        {
            "id": 1,
            "remaining_sessions": 7,
            "is_valid": true
        }
    ]
}
```

---

#### 6.3 Get Remaining Sessions

**Endpoint:** `GET /api/subscriptions/remaining-sessions`  
**Auth Required:** Yes

**Success Response (200):**

```json
{
    "success": true,
    "data": {
        "total_remaining_sessions": 15,
        "subscriptions": [
            {
                "id": 1,
                "name": "Monthly Wellness Package",
                "remaining_sessions": 7
            },
            {
                "id": 2,
                "name": "Quarterly Plan",
                "remaining_sessions": 8
            }
        ]
    }
}
```

---

#### 6.4 Create Subscription

**Endpoint:** `POST /api/subscriptions`  
**Auth Required:** Yes

**Request Body:**

```json
{
    "name": "Custom Wellness Plan",
    "description": "5 massage sessions",
    "total_sessions": 5,
    "price_paid": 200.0,
    "start_date": "2025-02-01",
    "end_date": "2025-02-28",
    "service_ids": [1, 2]
}
```

**Success Response (201):**

```json
{
    "success": true,
    "message": "Subscription created successfully",
    "data": {
        "id": 3,
        "name": "Custom Wellness Plan",
        "total_sessions": 5,
        "remaining_sessions": 5
    }
}
```

---

#### 6.5 Get Subscription by ID

**Endpoint:** `GET /api/subscriptions/{id}`  
**Auth Required:** Yes

**Success Response (200):**

```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Monthly Wellness Package",
        "remaining_sessions": 7
    }
}
```

---

#### 6.6 Update Subscription

**Endpoint:** `PUT /api/subscriptions/{id}`  
**Auth Required:** Yes

**Request Body:**

```json
{
    "name": "Updated Package Name",
    "description": "Updated description"
}
```

**Success Response (200):**

```json
{
    "success": true,
    "message": "Subscription updated successfully",
    "data": {
        "id": 1,
        "name": "Updated Package Name"
    }
}
```

---

#### 6.7 Attach Services to Subscription

**Endpoint:** `POST /api/subscriptions/{id}/attach-services`  
**Auth Required:** Yes

**Request Body:**

```json
{
    "service_ids": [3, 4],
    "sessions_allocated": {
        "3": 2,
        "4": 3
    }
}
```

**Success Response (200):**

```json
{
    "success": true,
    "message": "Services attached successfully"
}
```

---

#### 6.8 Detach Services from Subscription

**Endpoint:** `POST /api/subscriptions/{id}/detach-services`  
**Auth Required:** Yes

**Request Body:**

```json
{
    "service_ids": [3]
}
```

**Success Response (200):**

```json
{
    "success": true,
    "message": "Services detached successfully"
}
```

---

#### 6.9 Deactivate Subscription

**Endpoint:** `POST /api/subscriptions/{id}/deactivate`  
**Auth Required:** Yes

**Success Response (200):**

```json
{
    "success": true,
    "message": "Subscription deactivated successfully",
    "data": {
        "id": 1,
        "is_active": false
    }
}
```

---

### 7. Payment Endpoints

#### 7.1 Create Payment

**Endpoint:** `POST /api/payments`  
**Auth Required:** Yes

**Request Body:**

```json
{
    "amount": 75.0,
    "booking_id": 1,
    "payment_method": "card"
}
```

**Success Response (200):**

```json
{
    "success": true,
    "message": "Payment created successfully",
    "data": {
        "payment_id": "pay_abc123",
        "status": "pending",
        "amount": 75.0
    }
}
```

---

#### 7.2 Authorize Card

**Endpoint:** `POST /api/payments/authorize`  
**Auth Required:** Yes

**Request Body:**

```json
{
    "card_number": "4242424242424242",
    "exp_month": "12",
    "exp_year": "2026",
    "cvc": "123",
    "amount": 75.0
}
```

**Success Response (200):**

```json
{
    "success": true,
    "message": "Card authorized successfully",
    "data": {
        "authorization_id": "auth_xyz789"
    }
}
```

---

#### 7.3 Capture Payment

**Endpoint:** `POST /api/payments/{paymentId}/capture`  
**Auth Required:** Yes

**Success Response (200):**

```json
{
    "success": true,
    "message": "Payment captured successfully",
    "data": {
        "payment_id": "pay_abc123",
        "status": "completed"
    }
}
```

---

#### 7.4 Cancel Payment

**Endpoint:** `POST /api/payments/{paymentId}/cancel`  
**Auth Required:** Yes

**Success Response (200):**

```json
{
    "success": true,
    "message": "Payment cancelled successfully"
}
```

---

#### 7.5 Refund Payment

**Endpoint:** `POST /api/payments/{paymentId}/refund`  
**Auth Required:** Yes

**Request Body:**

```json
{
    "amount": 75.0,
    "reason": "Customer request"
}
```

**Success Response (200):**

```json
{
    "success": true,
    "message": "Payment refunded successfully",
    "data": {
        "refund_id": "ref_def456",
        "amount": 75.0
    }
}
```

---

### 8. Staff Endpoints

#### 8.1 Get Staff Schedule

**Endpoint:** `GET /api/staff/schedule`  
**Auth Required:** Yes (Staff/Admin only)

**Query Parameters:**

-   `start_date`: Start date (YYYY-MM-DD)
-   `end_date`: End date (YYYY-MM-DD)

**Success Response (200):**

```json
{
    "success": true,
    "data": {
        "2025-01-15": [
            {
                "start_time": "09:00",
                "end_time": "12:00",
                "available": true
            }
        ]
    }
}
```

---

#### 8.2 Get Staff Bookings

**Endpoint:** `GET /api/staff/bookings`  
**Auth Required:** Yes (Staff/Admin only)

**Success Response (200):**

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "client": {
                "first_name": "John",
                "last_name": "Doe"
            },
            "service": {
                "name": {
                    "en": "Relaxing Massage"
                }
            },
            "start_datetime": "2025-01-15 10:00:00"
        }
    ]
}
```

---

### 9. Admin Endpoints

#### 9.1 Admin - Get All Bookings

**Endpoint:** `GET /api/admin/bookings`  
**Auth Required:** Yes (Admin only)

**Query Parameters:**

-   `status`: Filter by status (draft, confirmed, cancelled, no_show, completed)
-   `start_date`: Filter by start date
-   `end_date`: Filter by end date

**Success Response (200):**

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "client": {
                "first_name": "John",
                "last_name": "Doe"
            },
            "status": "confirmed",
            "total_price": 75.0
        }
    ]
}
```

---

#### 9.2 Admin - Cancel Booking

**Endpoint:** `POST /api/admin/bookings/{id}/cancel`  
**Auth Required:** Yes (Admin only)

**Request Body:**

```json
{
    "reason": "Staff unavailable"
}
```

**Success Response (200):**

```json
{
    "success": true,
    "message": "Booking cancelled successfully"
}
```

---

#### 9.3 Admin - Mark No Show

**Endpoint:** `POST /api/admin/bookings/{id}/no-show`  
**Auth Required:** Yes (Admin only)

**Success Response (200):**

```json
{
    "success": true,
    "message": "Booking marked as no-show"
}
```

---

#### 9.4 Admin - Mark Completed

**Endpoint:** `POST /api/admin/bookings/{id}/complete`  
**Auth Required:** Yes (Admin only)

**Success Response (200):**

```json
{
    "success": true,
    "message": "Booking marked as completed"
}
```

---

#### 9.5 Admin - Get Statistics

**Endpoint:** `GET /api/admin/statistics`  
**Auth Required:** Yes (Admin only)

**Success Response (200):**

```json
{
    "success": true,
    "data": {
        "total_bookings": 150,
        "total_revenue": 7500.0,
        "active_subscriptions": 25,
        "pending_bookings": 10
    }
}
```

---

#### 9.6 Admin - Get Revenue Statistics

**Endpoint:** `GET /api/admin/statistics/revenue`  
**Auth Required:** Yes (Admin only)

**Query Parameters:**

-   `period`: Period type (day, week, month, year)
-   `start_date`: Start date
-   `end_date`: End date

**Success Response (200):**

```json
{
    "success": true,
    "data": {
        "total_revenue": 7500.0,
        "by_service": {
            "massage": 4500.0,
            "hair": 2000.0,
            "hammam": 1000.0
        },
        "by_period": [
            {
                "date": "2025-01-01",
                "revenue": 500.0
            }
        ]
    }
}
```

---

## Data Models

### User Model

```typescript
interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
    role: "client" | "staff" | "admin";
    status: "active" | "inactive" | "suspended";
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}
```

---

### Service Model

```typescript
interface Service {
    id: number;
    type_service: "massage" | "hair" | "hammam" | string;
    name: {
        fr: string;
        en: string;
    };
    description: {
        fr: string;
        en: string;
    };
    duration_minutes: number;
    price: number;
    requires_room: boolean;
    requires_chair: boolean;
    requires_wash_station: boolean;
    requires_hammam_session: boolean;
    is_active: boolean;
}
```

---

### Booking Model

```typescript
interface Booking {
    id: number;
    client: User;
    status: "draft" | "confirmed" | "cancelled" | "no_show" | "completed";
    language: "en" | "fr";
    group_size: number;
    total_duration_minutes: number;
    total_price: number;
    notes?: string;
    cancellation_reason?: string;
    cancelled_at?: string;
    booking_items: BookingItem[];
    created_at: string;
    updated_at: string;
}
```

---

### BookingItem Model

```typescript
interface BookingItem {
    id: number;
    service: Service;
    staff?: StaffProfile;
    room?: Room;
    chair?: Chair;
    wash_station?: WashStation;
    hammam_session?: HammamSession;
    start_datetime: string;
    end_datetime: string;
    duration_minutes: number;
    price: number;
    order_index: number;
    notes?: string;
}
```

---

### Subscription Model

```typescript
interface Subscription {
    id: number;
    client_profile_id: number;
    client_profile?: ClientProfile;
    name: string;
    description?: string;
    total_sessions: number;
    used_sessions: number;
    remaining_sessions: number;
    price_paid: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    is_valid: boolean;
    services: Service[];
    created_at: string;
    updated_at: string;
}
```

---

### BookingStatus Enum

```typescript
enum BookingStatus {
    DRAFT = "draft",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    NO_SHOW = "no_show",
    COMPLETED = "completed",
}
```

**Status Transitions:**

-   `draft` → `confirmed` (via confirm endpoint)
-   `draft` → `cancelled` (via cancel endpoint)
-   `confirmed` → `cancelled` (via cancel endpoint)
-   `confirmed` → `completed` (admin only)
-   `confirmed` → `no_show` (admin only)

---

## Error Handling

### HTTP Status Codes

| Code | Meaning               | Description                            |
| ---- | --------------------- | -------------------------------------- |
| 200  | OK                    | Request successful                     |
| 201  | Created               | Resource created successfully          |
| 400  | Bad Request           | Invalid request data                   |
| 401  | Unauthorized          | Authentication required or failed      |
| 403  | Forbidden             | Insufficient permissions               |
| 404  | Not Found             | Resource not found                     |
| 409  | Conflict              | Resource conflict (e.g., email exists) |
| 422  | Unprocessable Entity  | Validation failed                      |
| 500  | Internal Server Error | Server error                           |

---

### Error Response Format

```json
{
    "success": false,
    "message": "Error description",
    "errors": {
        "field_name": ["Error message 1", "Error message 2"]
    }
}
```

---

### Common Errors

#### Validation Error (422)

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password must be at least 8 characters."]
    }
}
```

#### Authentication Error (401)

```json
{
    "success": false,
    "message": "Unauthenticated"
}
```

#### Not Found Error (404)

```json
{
    "success": false,
    "message": "Resource not found"
}
```

#### Server Error (500)

```json
{
    "success": false,
    "message": "An error occurred while processing your request"
}
```

---

## Code Examples

### JavaScript/TypeScript with Fetch

#### Login Example

```javascript
async function login(email, password) {
    try {
        const response = await fetch("http://localhost:8000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        const data = await response.json();

        // Store the token
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        return data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}
```

---

#### Authenticated Request Example

```javascript
async function getBookings() {
    const token = localStorage.getItem("auth_token");

    try {
        const response = await fetch("http://localhost:8000/api/bookings", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            // Token expired or invalid
            // Redirect to login
            window.location.href = "/login";
            return;
        }

        if (!response.ok) {
            throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        return data.data; // Return the bookings array
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error;
    }
}
```

---

#### Create Booking Example

```javascript
async function createBooking(bookingData) {
    const token = localStorage.getItem("auth_token");

    try {
        const response = await fetch("http://localhost:8000/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                service_ids: bookingData.serviceIds,
                start_datetime: bookingData.startDateTime,
                group_size: bookingData.groupSize || 1,
                language: bookingData.language || "en",
                notes: bookingData.notes,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 422) {
                // Validation errors
                console.error("Validation errors:", data.errors);
            }
            throw new Error(data.message || "Failed to create booking");
        }

        return data.data;
    } catch (error) {
        console.error("Error creating booking:", error);
        throw error;
    }
}
```

---

### Axios Example

#### Setup Axios Instance

```javascript
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Add token to requests automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and redirect to login
            localStorage.removeItem("auth_token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
```

---

#### Using Axios Instance

```javascript
import api from "./api";

// Login
async function login(email, password) {
    const { data } = await api.post("/login", { email, password });
    localStorage.setItem("auth_token", data.token);
    return data;
}

// Get services
async function getServices() {
    const { data } = await api.get("/services");
    return data.data;
}

// Create booking
async function createBooking(bookingData) {
    const { data } = await api.post("/bookings", bookingData);
    return data.data;
}

// Get user bookings
async function getUserBookings() {
    const { data } = await api.get("/bookings");
    return data.data;
}

// Cancel booking
async function cancelBooking(bookingId, reason) {
    const { data } = await api.post(`/bookings/${bookingId}/cancel`, {
        reason,
    });
    return data;
}
```

---

### React Hooks Example

```javascript
import { useState, useEffect } from "react";
import api from "./api";

// Custom hook for fetching services
function useServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchServices() {
            try {
                const { data } = await api.get("/services");
                setServices(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchServices();
    }, []);

    return { services, loading, error };
}

// Custom hook for bookings
function useBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBookings() {
            try {
                const { data } = await api.get("/bookings");
                setBookings(data.data);
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchBookings();
    }, []);

    const createBooking = async (bookingData) => {
        const { data } = await api.post("/bookings", bookingData);
        setBookings([...bookings, data.data]);
        return data.data;
    };

    const cancelBooking = async (bookingId, reason) => {
        await api.post(`/bookings/${bookingId}/cancel`, { reason });
        setBookings(
            bookings.map((b) =>
                b.id === bookingId ? { ...b, status: "cancelled" } : b
            )
        );
    };

    return { bookings, loading, createBooking, cancelBooking };
}
```

---

### Vue.js Composable Example

```javascript
import { ref, onMounted } from "vue";
import api from "./api";

// Composable for services
export function useServices() {
    const services = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const fetchServices = async () => {
        try {
            loading.value = true;
            const { data } = await api.get("/services");
            services.value = data.data;
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        fetchServices();
    });

    return {
        services,
        loading,
        error,
        refetch: fetchServices,
    };
}

// Composable for bookings
export function useBookings() {
    const bookings = ref([]);
    const loading = ref(false);

    const fetchBookings = async () => {
        loading.value = true;
        try {
            const { data } = await api.get("/bookings");
            bookings.value = data.data;
        } finally {
            loading.value = false;
        }
    };

    const createBooking = async (bookingData) => {
        const { data } = await api.post("/bookings", bookingData);
        bookings.value.push(data.data);
        return data.data;
    };

    const cancelBooking = async (bookingId, reason) => {
        await api.post(`/bookings/${bookingId}/cancel`, { reason });
        await fetchBookings(); // Refresh list
    };

    onMounted(() => {
        fetchBookings();
    });

    return {
        bookings,
        loading,
        createBooking,
        cancelBooking,
        refetch: fetchBookings,
    };
}
```

---

## Best Practices

### 1. Token Management

-   **Store tokens securely:** Use `localStorage` or `sessionStorage` for web apps
-   **Refresh tokens:** Check token expiration and prompt re-login when needed
-   **Clear tokens on logout:** Always remove tokens when user logs out

```javascript
// Good practice
function logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    window.location.href = "/login";
}
```

---

### 2. Error Handling

-   **Always handle errors:** Use try-catch blocks or .catch() promises
-   **Display user-friendly messages:** Don't show raw error messages to users
-   **Log errors for debugging:** Send errors to monitoring service

```javascript
try {
    const booking = await createBooking(data);
    showSuccessMessage("Booking created successfully!");
} catch (error) {
    if (error.response?.status === 422) {
        showValidationErrors(error.response.data.errors);
    } else {
        showErrorMessage("Something went wrong. Please try again.");
    }
    logError(error); // Send to monitoring service
}
```

---

### 3. Request Optimization

-   **Cache static data:** Services list rarely changes, cache it
-   **Debounce search inputs:** Don't make requests on every keystroke
-   **Cancel pending requests:** Use AbortController when navigating away

```javascript
// Debounce example
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

const searchServices = debounce(async (query) => {
    const results = await api.get(`/services?search=${query}`);
    updateResults(results);
}, 300);
```

---

### 4. Date and Time Handling

-   **Always use ISO 8601 format:** `YYYY-MM-DDTHH:mm:ss`
-   **Handle timezones properly:** Be aware of server timezone
-   **Validate dates on client:** Check dates are in the future before sending

```javascript
// Format date for API
function formatDateForAPI(date) {
    return date.toISOString().slice(0, 19).replace("T", " ");
}

// Example
const bookingDate = new Date("2025-01-15T10:00:00");
const formatted = formatDateForAPI(bookingDate); // "2025-01-15 10:00:00"
```

---

### 5. Internationalization

-   **Respect user language preference:** Send language in requests
-   **Display localized content:** Use the appropriate language from response

```javascript
// Get service name in user's language
function getServiceName(service, language = "en") {
    return service.name[language] || service.name.en;
}

// Usage
const serviceName = getServiceName(service, userLanguage);
```

---

### 6. Loading States

-   **Show loading indicators:** Always indicate when data is being fetched
-   **Disable buttons during submission:** Prevent double submissions
-   **Show skeleton loaders:** Better UX than blank screens

```javascript
function BookingForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await createBooking(data);
            showSuccess();
        } catch (error) {
            showError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Booking"}
        </button>
    );
}
```

---

### 7. Validation

-   **Validate on client before sending:** Reduce unnecessary API calls
-   **Display validation errors clearly:** Show field-specific errors
-   **Follow API validation rules:** Match backend validation requirements

```javascript
function validateBookingForm(data) {
    const errors = {};

    if (!data.service_ids || data.service_ids.length === 0) {
        errors.service_ids = "Please select at least one service";
    }

    if (!data.start_datetime) {
        errors.start_datetime = "Please select a date and time";
    } else if (new Date(data.start_datetime) <= new Date()) {
        errors.start_datetime = "Date must be in the future";
    }

    if (data.group_size && (data.group_size < 1 || data.group_size > 4)) {
        errors.group_size = "Group size must be between 1 and 4";
    }

    return errors;
}
```

---

### 8. Security

-   **Never expose tokens in URLs:** Always use headers
-   **Use HTTPS in production:** Never send tokens over HTTP
-   **Validate user permissions:** Check roles on sensitive actions
-   **Sanitize user inputs:** Always validate and escape user data

---

### 9. Testing API Integration

```javascript
// Example API test
describe("Booking API", () => {
    it("should create a booking", async () => {
        const bookingData = {
            service_ids: [1],
            start_datetime: "2025-01-15 10:00:00",
            group_size: 1,
            language: "en",
        };

        const response = await api.post("/bookings", bookingData);

        expect(response.status).toBe(201);
        expect(response.data.success).toBe(true);
        expect(response.data.data).toHaveProperty("id");
        expect(response.data.data.status).toBe("draft");
    });

    it("should handle validation errors", async () => {
        try {
            await api.post("/bookings", {});
        } catch (error) {
            expect(error.response.status).toBe(422);
            expect(error.response.data.success).toBe(false);
            expect(error.response.data.errors).toBeDefined();
        }
    });
});
```

---

## Support & Contact

For questions or issues with the API:

-   **Technical Support:** support@safir.com
-   **API Documentation:** Review this document
-   **Bug Reports:** Submit via project issue tracker

---

**Document Version:** 1.0  
**Last Updated:** December 28, 2025
