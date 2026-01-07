# Service Availability API Documentation

## Overview

This system provides **two main endpoints** for checking service availability:

1. **Single Service**: Check availability for one service
2. **Multiple Services**: Check availability for multiple services performed sequentially

The system considers:
- **Staff availability**: Checks which staff members can perform the service and their working hours
- **Staff schedules**: Verifies staff aren't already booked during requested times
- **Resource requirements**: Ensures required resources (rooms, chairs, equipment) are available
- **Working hours**: Respects business hours (configurable, default 8 AM - 8 PM)

---

## API Endpoints

### 1. Single Service Availability

```
GET /api/availability/service
```

### Parameters

| Parameter   | Type    | Required | Description                                      |
|-------------|---------|----------|--------------------------------------------------|
| service_id  | integer | Yes      | The ID of the service to check availability for |
| date        | string  | Yes      | Date in Y-m-d format (e.g., 2026-01-15)         |

### Constraints

- Date must be today or in the future
- Service must exist in the database

## How It Works

### 1. Staff Availability Check

The system identifies staff members who:
- Can perform the requested service (linked via `staff_services` table)
- Are active (`is_active = true`)
- Have availability on the requested day of week
- Are not already booked during the time slot

### 2. Resource Availability Check

For services requiring resources (defined in `service_requirements` table):
- Checks how many resources of each type are needed
- Verifies resources aren't fully booked during the time slot
- Ensures enough quantity is available

### 3. Time Slot Generation

- Generates time slots based on service duration
- Respects business working hours (8 AM - 8 PM by default)
- Increments by service duration (e.g., 30 min service = 30 min slots)

## Example Request

```bash
curl -X GET "http://your-domain.com/api/availability/service?service_id=1&date=2026-01-15" \
  -H "Accept: application/json"
```

## Example Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "date": "2026-01-15",
    "service_id": 1,
    "service_name": "Haircut and Styling",
    "duration": 30,
    "available_slots": [
      {
        "start_time": "08:00",
        "end_time": "08:30",
        "start_datetime": "2026-01-15 08:00:00",
        "end_datetime": "2026-01-15 08:30:00",
        "staff_id": 5,
        "staff_name": "John Doe"
      },
      {
        "start_time": "08:30",
        "end_time": "09:00",
        "start_datetime": "2026-01-15 08:30:00",
        "end_datetime": "2026-01-15 09:00:00",
        "staff_id": 5,
        "staff_name": "John Doe"
      },
      {
        "start_time": "09:00",
        "end_time": "09:30",
        "start_datetime": "2026-01-15 09:00:00",
        "end_datetime": "2026-01-15 09:30:00",
        "staff_id": 7,
        "staff_name": "Jane Smith"
      }
    ]
  },
  "message": "Service availability retrieved successfully"
}
```

### No Staff Available Response (200 OK)

```json
{
  "success": true,
  "data": {
    "date": "2026-01-15",
    "service_id": 1,
    "service_name": "Haircut and Styling",
    "duration": 30,
    "available_slots": [],
    "message": "No staff available for this service on selected date"
  },
  "message": "Service availability retrieved successfully"
}
```

### Validation Error Response (422)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "date": [
      "The date must be a date after or equal to today."
    ]
  }
}
```

### Server Error Response (500)

```json
{
  "success": false,
  "message": "Failed to retrieve service availability",
  "error": "Service not found"
}
```

## Configuration

You can customize working hours in your `.env` file:

```env
# Business working hours (24-hour format)
WORK_START_HOUR=8
WORK_END_HOUR=20

# Other booking settings
DEFAULT_SLOT_DURATION=30
MINIMUM_BOOKING_LEAD_TIME=2
CANCELLATION_WINDOW=24
```

Or edit `config/booking.php` directly.

## Database Schema

### Key Tables

1. **services**: Service definitions with duration
2. **staff_profiles**: Staff members who can perform services
3. **staff_services**: Links staff to services they can perform
4. **staff_availabilities**: Staff working hours per day of week
5. **service_requirements**: Resources required by each service
6. **resources**: Available resources (rooms, chairs, equipment)
7. **booking_items**: Existing bookings to check conflicts
8. **booking_item_resources**: Resource allocations for bookings

### Staff Availability Table

```
staff_availabilities:
- staff_profile_id
- day_of_week (0=Sunday, 1=Monday, ..., 6=Saturday)
- start_time (e.g., "08:00:00")
- end_time (e.g., "17:00:00")
- is_available (boolean)
```

## Frontend Integration

### Simple Example

```javascript
async function checkAvailability(serviceId, date) {
  try {
    const response = await fetch(
      `/api/availability/service?service_id=${serviceId}&date=${date}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    const result = await response.json();
    
    if (result.success && result.data.available_slots.length > 0) {
      // Display available time slots
      result.data.available_slots.forEach(slot => {
        console.log(`${slot.start_time} - ${slot.end_time} with ${slot.staff_name}`);
      });
    } else {
      console.log('No slots available');
    }
  } catch (error) {
    console.error('Error checking availability:', error);
  }
}

// Usage
checkAvailability(1, '2026-01-15');
```

### React Example

```jsx
import { useState, useEffect } from 'react';

function AvailabilityChecker({ serviceId }) {
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const checkAvailability = async () => {
    if (!date) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `/api/availability/service?service_id=${serviceId}&date=${date}`
      );
      const result = await response.json();
      
      if (result.success) {
        setSlots(result.data.available_slots);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
      />
      <button onClick={checkAvailability} disabled={loading}>
        {loading ? 'Checking...' : 'Check Availability'}
      </button>
      
      {slots.length > 0 ? (
        <ul>
          {slots.map((slot, index) => (
            <li key={index}>
              {slot.start_time} - {slot.end_time} with {slot.staff_name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No available slots</p>
      )}
    </div>
  );
}
```

## Logging

The system logs all availability checks with structured context:

```php
// Success log
Log::info('Available slots generated', [
    'service_id' => 1,
    'date' => '2026-01-15',
    'slots_count' => 12,
]);

// No staff available
Log::info('No staff available for service', [
    'service_id' => 1,
    'date' => '2026-01-15',
]);

// Error log
Log::error('Error getting available slots', [
    'service_id' => 1,
    'date' => '2026-01-15',
    'error' => 'Exception message',
]);
```

## Testing

You can test the endpoint using:

### cURL

```bash
curl -X GET "http://localhost:8000/api/availability/service?service_id=1&date=2026-01-15"
```

---

### 2. Multiple Services Availability

```
POST /api/availability/multiple-services
```

**Purpose**: Check availability for multiple services that will be performed sequentially (one after another).

#### Request Body

```json
{
  "service_ids": [1, 2, 3],
  "date": "2026-01-20"
}
```

#### Parameters

| Parameter    | Type    | Required | Description                                  |
|-------------|---------|----------|----------------------------------------------|
| service_ids | array   | Yes      | Array of service IDs (minimum 1)            |
| date        | string  | Yes      | Date in Y-m-d format (today or future)      |

#### Response Example

```json
{
  "success": true,
  "data": {
    "date": "2026-01-20",
    "services": [
      {
        "id": 1,
        "name": "Haircut",
        "duration": 30
      },
      {
        "id": 2,
        "name": "Massage",
        "duration": 60
      }
    ],
    "total_duration": 90,
    "available_slots": [
      {
        "start_time": "09:00",
        "end_time": "10:30",
        "start_datetime": "2026-01-20 09:00:00",
        "end_datetime": "2026-01-20 10:30:00",
        "services_breakdown": [
          {
            "service_id": 1,
            "service_name": "Haircut",
            "duration": 30,
            "start_time": "09:00",
            "end_time": "09:30",
            "staff_id": 5,
            "staff_name": "John Doe"
          },
          {
            "service_id": 2,
            "service_name": "Massage",
            "duration": 60,
            "start_time": "09:30",
            "end_time": "10:30",
            "staff_id": 7,
            "staff_name": "Jane Smith"
          }
        ]
      }
    ]
  }
}
```

#### cURL Example

```bash
curl -X POST "http://localhost:8000/api/availability/multiple-services" \
  -H "Content-Type: application/json" \
  -d '{
    "service_ids": [1, 2],
    "date": "2026-01-20"
  }'
```

**Note**: See [MULTIPLE_SERVICES_API.md](MULTIPLE_SERVICES_API.md) for complete documentation on multiple services endpoint.

---

## Postman

1. Method: GET
2. URL: `http://localhost:8000/api/availability/service`
3. Params:
   - service_id: 1
   - date: 2026-01-15

### PHP/Artisan Tinker

```php
use App\Services\AvailabilityService;

$service = app(AvailabilityService::class);
$result = $service->getAvailableSlotsForService(1, '2026-01-15', 8, 20);
dd($result);
```

## Performance Considerations

- Queries are optimized using eager loading (`with()`)
- Filtered at database level before loading into memory
- For high-traffic scenarios, consider caching results
- Results can be cached per service/date combination

## Future Enhancements

Potential improvements:

1. **Caching**: Cache availability for frequently requested dates
2. **Buffer time**: Add configurable buffer between bookings
3. **Break times**: Support staff break periods
4. **Holiday handling**: Skip holidays/closed days
5. **Recurring availability**: Handle recurring time off
6. **Multiple staff**: Allow booking with preferred staff member
7. **Wait list**: Queue users when no slots available
