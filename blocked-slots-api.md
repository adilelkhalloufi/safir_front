# Blocked Time Slots API Documentation

## Overview
The Blocked Time Slots API allows admins to block unavailable time periods for staff members or services, preventing clients from booking during those times.

---

## Base URL
```
/api/admin/blocked-time-slots
```

---

## Endpoints

### 1. **List All Blocked Slots**
```
GET /api/admin/blocked-time-slots
```

**Query Parameters:**
| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `type` | string | `staff` | Filter by type: `staff`, `service`, `facility` |
| `staff_profile_id` | integer | `1` | Filter by specific staff member |
| `service_id` | integer | `5` | Filter by specific service |
| `reason` | string | `sick_leave` | Filter by reason |
| `start_date` | string | `2026-06-10` | Filter from date (Y-m-d) |
| `end_date` | string | `2026-06-20` | Filter to date (Y-m-d) |
| `page` | integer | `1` | Pagination page |

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "type": "staff",
      "staff_profile_id": 3,
      "staff_profile": {
        "id": 3,
        "name": "Ahmed",
        "specialization": "Deep Tissue Massage"
      },
      "service_id": null,
      "start_datetime": "2026-06-15T14:00:00Z",
      "end_datetime": "2026-06-15T17:00:00Z",
      "reason": "sick_leave",
      "description": "Flu - unable to work",
      "created_by": {
        "id": 1,
        "name": "Admin"
      },
      "is_active": true,
      "created_at": "2026-06-09T10:30:00Z",
      "updated_at": "2026-06-09T10:30:00Z"
    }
  ],
  "links": {...},
  "meta": {"total": 1, "per_page": 50}
}
```

---

### 2. **Create a Blocked Slot**
```
POST /api/admin/blocked-time-slots
```

**Request Body:**
```json
{
  "type": "staff",
  "staff_profile_id": 3,
  "start_datetime": "2026-06-15 14:00:00",
  "end_datetime": "2026-06-15 17:00:00",
  "reason": "sick_leave",
  "description": "Flu - unable to work",
  "is_active": true
}
```

**Required Fields:**
- `type`: `staff` | `service` | `facility`
- `start_datetime`: Format `Y-m-d H:i:s`
- `end_datetime`: Must be after start_datetime, format `Y-m-d H:i:s`

**Required based on type:**
- If `type = "staff"`: `staff_profile_id` is required
- If `type = "service"`: `service_id` is required

**Response (201 Created):**
```json
{
  "message": "Blocked slot created successfully",
  "data": {
    "id": 5,
    "type": "staff",
    "staff_profile_id": 3,
    "start_datetime": "2026-06-15T14:00:00Z",
    "end_datetime": "2026-06-15T17:00:00Z",
    "reason": "sick_leave",
    "description": "Flu - unable to work",
    "is_active": true,
    "created_at": "2026-06-09T10:45:00Z"
  }
}
```

---

### 3. **Get Single Blocked Slot**
```
GET /api/admin/blocked-time-slots/{id}
```

**Response:**
```json
{
  "data": {
    "id": 5,
    "type": "staff",
    "staff_profile_id": 3,
    "staff_profile": {
      "id": 3,
      "name": "Ahmed",
      "specialization": "Deep Tissue Massage"
    },
    "start_datetime": "2026-06-15T14:00:00Z",
    "end_datetime": "2026-06-15T17:00:00Z",
    "reason": "sick_leave",
    "description": "Flu - unable to work",
    "is_active": true
  }
}
```

---

### 4. **Update a Blocked Slot**
```
PUT /api/admin/blocked-time-slots/{id}
```

**Request Body (all fields optional):**
```json
{
  "reason": "updated_reason",
  "description": "Updated description",
  "is_active": false
}
```

**Response:**
```json
{
  "message": "Blocked slot updated successfully",
  "data": {
    "id": 5,
    "type": "staff",
    "reason": "updated_reason",
    "description": "Updated description",
    "is_active": false
  }
}
```

---

### 5. **Delete a Blocked Slot**
```
DELETE /api/admin/blocked-time-slots/{id}
```

**Response:**
```json
{
  "message": "Blocked slot deleted successfully"
}
```

---

### 6. **Get Blocks for Specific Staff on Date**
```
GET /api/admin/blocked-time-slots/staff/{staffId}/date/{date}
```

**Parameters:**
- `staffId`: Staff profile ID
- `date`: Format `Y-m-d`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "type": "staff",
      "staff_profile_id": 3,
      "start_datetime": "2026-06-15T14:00:00Z",
      "end_datetime": "2026-06-15T17:00:00Z",
      "reason": "sick_leave"
    }
  ],
  "count": 1
}
```

---

### 7. **Get Blocks for Specific Service on Date**
```
GET /api/admin/blocked-time-slots/service/{serviceId}/date/{date}
```

**Parameters:**
- `serviceId`: Service ID
- `date`: Format `Y-m-d`

**Response:**
```json
{
  "data": [...],
  "count": 1
}
```

---

### 8. **Get Blocks Between Dates**
```
GET /api/admin/blocked-time-slots/range/between?start_date=2026-06-10&end_date=2026-06-20&type=staff
```

**Query Parameters:**
- `start_date`: Required, format `Y-m-d`
- `end_date`: Required, format `Y-m-d`
- `type`: Optional filter (`staff`, `service`, `facility`)

**Response:**
```json
{
  "data": [...],
  "count": 3
}
```

---

## Validation Rules

| Field | Rules |
|-------|-------|
| `type` | Required, must be in: `staff`, `service`, `facility` |
| `staff_profile_id` | Required if `type="staff"`, must exist in database |
| `service_id` | Required if `type="service"`, must exist in database |
| `start_datetime` | Required, format `Y-m-d H:i:s` |
| `end_datetime` | Required, format `Y-m-d H:i:s`, must be after start_datetime |
| `reason` | Optional, max 255 characters |
| `description` | Optional, max 1000 characters |
| `is_active` | Optional, boolean |

---

## Reasons (Recommended Values)

```
- sick_leave          (Employee is sick)
- maintenance         (Service maintenance/closure)
- reserved_event      (Reserved for internal use)
- holiday             (Business holiday)
- training            (Staff training)
- urgent_closure      (Emergency closure)
```

---

## Frontend Examples

### Block Staff Member (Sick Leave)
```javascript
const blockStaff = async () => {
  const response = await fetch('/api/admin/blocked-time-slots', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'staff',
      staff_profile_id: 3,
      start_datetime: '2026-06-15 09:00:00',
      end_datetime: '2026-06-15 17:00:00',
      reason: 'sick_leave',
      description: 'Therapist is sick - unable to work'
    })
  });
  
  const result = await response.json();
  console.log(result);
};
```

### Block Service (Maintenance)
```javascript
const blockService = async () => {
  const response = await fetch('/api/admin/blocked-time-slots', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'service',
      service_id: 5,
      start_datetime: '2026-06-20 00:00:00',
      end_datetime: '2026-06-20 23:59:59',
      reason: 'maintenance',
      description: 'Hammam equipment maintenance'
    })
  });
  
  const result = await response.json();
  console.log(result);
};
```

### Get Staff Blocks for Date
```javascript
const getStaffBlocks = async (staffId, date) => {
  const response = await fetch(
    `/api/admin/blocked-time-slots/staff/${staffId}/date/${date}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  const result = await response.json();
  // result.data contains array of blocks
  // result.count is total blocks
  return result;
};
```

### List All Blocks with Filters
```javascript
const listBlocks = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.type) params.append('type', filters.type);
  if (filters.staffId) params.append('staff_profile_id', filters.staffId);
  if (filters.serviceId) params.append('service_id', filters.serviceId);
  if (filters.startDate) params.append('start_date', filters.startDate);
  if (filters.endDate) params.append('end_date', filters.endDate);
  
  const response = await fetch(
    `/api/admin/blocked-time-slots?${params}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  return await response.json();
};
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation failed",
  "errors": {
    "start_datetime": ["The start date and time must be in format: Y-m-d H:i:s"],
    "end_datetime": ["The end date and time must be after the start date and time"]
  }
}
```

### 404 Not Found
```json
{
  "message": "Blocked slot not found"
}
```

### 500 Server Error
```json
{
  "message": "Failed to create blocked slot",
  "error": "Exception message"
}
```

---

## UI Components Needed

1. **Block Management Table**
   - Display list of blocks with filters
   - Show staff/service name, dates, reason
   - Edit/Delete actions

2. **Create Block Form**
   - Type selector (staff/service/facility)
   - Staff/Service dropdown (based on type)
   - Date/Time pickers (start & end)
   - Reason dropdown
   - Description textarea
   - Submit button

3. **Calendar View**
   - Show blocked periods on staff/service calendar
   - Click to block/unblock time slots
   - Color coding (red for blocked)

4. **Quick Actions**
   - Block entire day
   - Block week
   - Block recurring (daily, weekly, etc.)
