# Staff Calendar API Documentation

## Overview
The Calendar API provides endpoints to view staff work schedules organized by days of the week. This is useful for displaying which staff members are available on each day and their working hours.

## Endpoints

### 1. Get Weekly Staff Calendar

**Endpoint:** `GET /api/calendar/weekly`

**Description:** Returns a complete weekly calendar showing all staff members who work on each day of the week (Sunday through Saturday).

**Authentication:** None (Public endpoint)

**Response:**
```json
{
  "success": true,
  "message": "Weekly staff calendar retrieved successfully",
  "data": [
    {
      "day_number": 0,
      "day_name": "Sunday",
      "staff_count": 2,
      "staff": [
        {
          "staff_id": 5,
          "staff_name": "Ahmed",
          "specialization": "Traditional Hammam Experience",
          "type_staff": {
            "id": 3,
            "name_en": "Hammam",
            "name_fr": "Hammam"
          },
          "start_time": "09:00:00",
          "end_time": "21:00:00"
        },
        {
          "staff_id": 6,
          "staff_name": "Karima",
          "specialization": "Hammam and Black Soap Treatment",
          "type_staff": {
            "id": 3,
            "name_en": "Hammam",
            "name_fr": "Hammam"
          },
          "start_time": "10:00:00",
          "end_time": "22:00:00"
        }
      ]
    },
    {
      "day_number": 1,
      "day_name": "Monday",
      "staff_count": 4,
      "staff": [...]
    },
    ...
  ]
}
```

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api/calendar/weekly" \
  -H "Accept: application/json"
```

---

### 2. Get Day Schedule

**Endpoint:** `GET /api/calendar/day`

**Description:** Returns detailed staff schedule for a specific day of the week, including staff contact info and services they can perform.

**Authentication:** None (Public endpoint)

**Query Parameters:**
- `day` (optional, default: 1) - Day of week number (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

**Response:**
```json
{
  "success": true,
  "message": "Day schedule retrieved successfully",
  "data": {
    "day_number": 1,
    "day_name": "Monday",
    "staff_count": 4,
    "staff": [
      {
        "staff_id": 1,
        "staff_name": "Michael",
        "email": "michael.chen@safir.com",
        "phone": "+15145550010",
        "specialization": "Swedish and Deep Tissue Massage",
        "type_staff": {
          "id": 1,
          "name_en": "Massage",
          "name_fr": "Massage"
        },
        "services": [
          {
            "id": 1,
            "name_en": "Swedish Massage",
            "name_fr": "Massage Suédois",
            "duration_minutes": 60
          },
          {
            "id": 2,
            "name_en": "Deep Tissue Massage",
            "name_fr": "Massage en Profondeur",
            "duration_minutes": 90
          }
        ],
        "start_time": "09:00:00",
        "end_time": "18:00:00",
        "break_minutes": 30
      },
      ...
    ]
  }
}
```

**Example Requests:**

Get Monday schedule:
```bash
curl -X GET "http://localhost:8000/api/calendar/day?day=1" \
  -H "Accept: application/json"
```

Get Sunday schedule:
```bash
curl -X GET "http://localhost:8000/api/calendar/day?day=0" \
  -H "Accept: application/json"
```

Get Friday schedule:
```bash
curl -X GET "http://localhost:8000/api/calendar/day?day=5" \
  -H "Accept: application/json"
```

---

## Day of Week Reference

| Number | Day       |
|--------|-----------|
| 0      | Sunday    |
| 1      | Monday    |
| 2      | Tuesday   |
| 3      | Wednesday |
| 4      | Thursday  |
| 5      | Friday    |
| 6      | Saturday  |

---

## Use Cases

### 1. Display Weekly Calendar View
Use the `/calendar/weekly` endpoint to show a full week view with staff working each day.

### 2. Day Detail View
Use the `/calendar/day?day=X` endpoint to show detailed information about staff working on a specific day, including what services they can perform.

### 3. Staff Availability Overview
Combine this with the availability API to show both regular schedules and real-time availability for booking.

---

## Implementation Notes

- Only **active** staff members are returned
- Only days where staff have `is_available = true` are included
- Times are returned in 24-hour format (HH:MM:SS)
- Staff with no availability records won't appear in the calendar
- The calendar reflects the staff's recurring weekly schedule (not specific dates)

---

## Error Responses

**Invalid Day Number:**
```json
{
  "success": false,
  "message": "Day of week must be between 0 (Sunday) and 6 (Saturday)"
}
```

**Server Error:**
```json
{
  "success": false,
  "message": "Failed to retrieve weekly calendar"
}
```

---

## Frontend Integration Example

### React/JavaScript Example:

```javascript
// Fetch weekly calendar
const fetchWeeklyCalendar = async () => {
  const response = await fetch('http://localhost:8000/api/calendar/weekly');
  const data = await response.json();
  
  if (data.success) {
    const calendar = data.data;
    calendar.forEach(day => {
      console.log(`${day.day_name}: ${day.staff_count} staff members`);
      day.staff.forEach(staff => {
        console.log(`  - ${staff.staff_name} (${staff.start_time} - ${staff.end_time})`);
      });
    });
  }
};

// Fetch specific day
const fetchDaySchedule = async (dayNumber) => {
  const response = await fetch(`http://localhost:8000/api/calendar/day?day=${dayNumber}`);
  const data = await response.json();
  
  if (data.success) {
    const schedule = data.data;
    console.log(`${schedule.day_name} Schedule:`);
    schedule.staff.forEach(staff => {
      console.log(`${staff.staff_name} - ${staff.specialization}`);
      console.log(`Services: ${staff.services.map(s => s.name_en).join(', ')}`);
    });
  }
};
```

---

## Related APIs

- **Availability API:** `/api/availability/service` - Check real-time slot availability
- **Staff API:** `/api/admin/staff` - Manage staff profiles (admin only)
- **Booking API:** `/api/bookings` - Create bookings with available staff
