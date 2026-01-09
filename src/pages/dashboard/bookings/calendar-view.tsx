import { useMemo } from 'react';
import { Calendar, momentLocalizer, Views, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Booking } from './columns';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { webRoutes } from '@/routes/web';

const localizer = momentLocalizer(moment);

interface BookingCalendarViewProps {
  bookings: Booking[];
}

interface BookingEvent extends Event {
  booking: Booking;
  status: string;
}

const statusColors: Record<string, string> = {
  draft: '#9CA3AF',
  confirmed: '#10B981',
  completed: '#3B82F6',
  cancelled: '#EF4444',
  'no-show': '#F97316',
};

export default function BookingCalendarView({ bookings }: BookingCalendarViewProps) {
  const navigate = useNavigate();

  const events: BookingEvent[] = useMemo(() => {
    return bookings.map((booking) => {
      // Get unique services from booking items
      const uniqueServices = Array.from(
        new Map(
          booking.booking_items.map((item) => [item.service.id, item.service])
        ).values()
      );

      // Get all staff names
      const staffNames = booking.booking_items
        .filter((item) => item.staff)
        .map((item) => {
          const staff = item.staff!;
          const name = staff.user?.name || staff.user?.email || `Staff #${staff.id}`;
          return name;
        })
        .filter((name, index, self) => self.indexOf(name) === index); // unique names

      // Get client name
      const clientName = [booking.client.first_name, booking.client.last_name]
        .filter(Boolean)
        .join(' ') || booking.client.email;

      // Build title with all info
      const servicesText = uniqueServices.map((s) => s.name.en).join(', ');
      const title = `#${booking.id} - ${clientName} (${booking.group_size}p) - ${servicesText}`;

      const firstItem = booking.booking_items[0];
      
      return {
        title,
        start: new Date(firstItem.start_datetime),
        end: new Date(firstItem.end_datetime),
        booking,
        status: booking.status,
        resource: {
          id: booking.id,
          client: booking.client,
          groupSize: booking.group_size,
          services: uniqueServices,
          staffNames,
        },
      };
    });
  }, [bookings]);

  const eventStyleGetter = (event: BookingEvent) => {
    const backgroundColor = statusColors[event.status] || '#9CA3AF';
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.9,
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
          const { client, groupSize, services, staffNames } = event.resource;
          const clientName = [client.first_name, client.last_name]
            .filter(Boolean)
            .join(' ') || client.email;
          const servicesText = services.map((s: any) => s.name.en).join(', ');
          const staffText = staffNames.length > 0 ? ` | Staff: ${staffNames.join(', ')}` : '';
          return `#${event.booking.id} | ${clientName} | ${client.phone} | Group: ${groupSize} | ${servicesText}${staffText}`;
        }}
      />
      
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="text-sm font-medium">Status Legend:</div>
        {Object.entries(statusColors).map(([status, color]) => (
          <Badge
            key={status}
            style={{ backgroundColor: color }}
            className="text-white capitalize"
          >
            {status.replace('-', ' ')}
          </Badge>
        ))}
      </div>
    </div>
  );
}
