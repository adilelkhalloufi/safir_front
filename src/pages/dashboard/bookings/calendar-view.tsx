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

const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function BookingCalendarView({ bookings }: BookingCalendarViewProps) {
  const navigate = useNavigate();

  const events: BookingEvent[] = useMemo(() => {
    return bookings.flatMap((booking) =>
      booking.booking_items.map((item) => {
        const serviceName = item.service?.name?.en || 'Unknown Service';
        const staffName = item.staff
          ? item.staff.user?.name || item.staff.user?.email || `Staff #${item.staff.id}`
          : 'No Staff';
        const clientName = booking.client?.name || booking.client?.email || 'Unknown Client';
        const time = format(new Date(item.start_datetime), 'HH:mm');
        const reference = booking.reference ? ` (${booking.reference})` : '';

        const title = `#${booking.id}${reference}\n${serviceName}\n${staffName} - ${clientName}\n${time}`;

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
          },
        };
      })
    );
  }, [bookings]);

  const eventStyleGetter = (_event: BookingEvent) => {
    const backgroundColor = generateRandomColor();
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
          const { service, staff, client, time } = event.resource;
          const serviceName = service?.name?.en || 'Unknown Service';
          const staffName = staff
            ? staff.user?.name || staff.user?.email || `Staff #${staff.id}`
            : 'No Staff';
          const clientName = client?.name || client?.email || 'Unknown Client';
          const reference = event.booking.reference ? ` (${event.booking.reference})` : '';
          return `Booking #${event.booking.id}${reference} | ${serviceName} | ${staffName} | ${clientName} | ${time}`;
        }}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <div className="text-sm font-medium">Events are colored randomly for distinction.</div>
      </div>
    </div>
  );
}
