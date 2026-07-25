import { useMemo } from 'react';
import { Calendar, momentLocalizer, Views, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Booking } from './columns';
import { useNavigate } from 'react-router-dom';
import { webRoutes } from '@/routes/web';
import { format } from 'date-fns';

const localizer = momentLocalizer(moment);

interface BookingCalendarViewProps {
  bookings: Booking[];
}

interface BookingEvent extends Event {
  booking: Booking;
  item: any;
}

const normalizeHex = (hex: string) => {
  const cleaned = hex.trim().replace('#', '');
  if (cleaned.length === 3) {
    return `#${cleaned[0]}${cleaned[0]}${cleaned[1]}${cleaned[1]}${cleaned[2]}${cleaned[2]}`;
  }
  return `#${cleaned}`.slice(0, 7);
};

const hexToRgb = (hex: string) => {
  const normalized = normalizeHex(hex).slice(1);
  const bigint = parseInt(normalized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h, s, l };
};

const hslToRgb = (h: number, s: number, l: number) => {
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  if (s === 0) {
    const value = Math.round(l * 255);
    return { r: value, g: value, b: value };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
};

const variantColor = (baseColor: string, variant: number) => {
  const rgb = hexToRgb(baseColor);
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const adjustedL = Math.max(0.12, Math.min(0.88, l + variant));
  const hslRgb = hslToRgb(h, s, adjustedL);
  return rgbToHex(hslRgb.r, hslRgb.g, hslRgb.b);
};

const getEventColor = (baseColor?: string, itemIndex = 0) => {
  if (!baseColor) return '#2563eb';
  const normalized = normalizeHex(baseColor);
  const offset = ((itemIndex % 5) - 2) * 0.06;
  return variantColor(normalized, offset);
};

export default function BookingCalendarView({ bookings }: BookingCalendarViewProps) {
  const navigate = useNavigate();

  const events: BookingEvent[] = useMemo(() => {
    return bookings
      .filter((booking) => booking.status !== 'cancelled')
      .flatMap((booking) =>
        booking.booking_items.map((item, index) => {
          const serviceName = item.service?.name?.en || 'Unknown Service';
          const staffName = item.staff
            ? item.staff.user?.name || item.staff.user?.email || `Staff #${item.staff.id}`
            : 'No Staff';
          const clientName = booking.client?.name || booking.client?.email || 'Unknown Client';
          const time = format(new Date(item.start_datetime), 'HH:mm');

          const title = `\n${serviceName}\n(staff :${staffName}) - client: ${clientName}\n${time}`;
          const baseColor = item.service?.type?.color;
          const backgroundColor = getEventColor(baseColor, index);

          return {
            title,
            start: new Date(item.start_datetime),
            end: new Date(item.end_datetime),
            booking,
            item,
            resource: {
              id: booking.id,
              itemId: item.id,
              service: item.service,
              staff: item.staff,
              client: booking.client,
              time,
              backgroundColor,
            },
          };
        })
      );
  }, [bookings]);

  const eventStyleGetter = (event: BookingEvent) => {
    const backgroundColor = event.resource.backgroundColor || '#2563eb';
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.95,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '2px 5px',
      },
    };
  };

  const handleSelectEvent = (event: BookingEvent) => {
    navigate(webRoutes.bookings.view.replace(':id', event.booking.id.toString()));
  };

  return (
    <div className="h-[calc(100vh-250px)] bg-background">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        defaultView={Views.WEEK}
        popup
        selectable
        tooltipAccessor={(event: BookingEvent) => {
          const { service, staff, client, time } = event.resource;
          const serviceName = service?.name?.en || 'Unknown Service';
          const staffName = staff
            ? staff.user?.name || staff.user?.email || `Staff #${staff.id}`
            : 'No Staff';
          const clientName = client?.name || client?.email || 'Unknown Client';
          return `Booking #${event.booking.id} | ${serviceName} | ${staffName} | ${clientName} | ${time}`;
        }}
      />

      {/* <div className="mt-4 flex flex-wrap gap-2">
        <div className="text-sm font-medium">Events are colored randomly for distinction.</div>
      </div> */}
    </div>
  );
}
