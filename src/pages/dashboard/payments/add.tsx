import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { toast } from '@/components/ui/use-toast';
import { setPageTitle, handleErrorResponse } from '@/utils';
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm';

export default function PaymentsAdd() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPageTitle(t('payments.addTitle', 'Add New Payment'));
    }, [t]);

    // Fetch clients for dropdown
    const { data: clientsResponse } = useQuery({
        queryKey: ['clients'],
        queryFn: () => http.get(apiRoutes.adminClients),
    });
    const clients = clientsResponse?.data || [];

    // Fetch bookings for dropdown
    const { data: bookingsResponse } = useQuery({
        queryKey: ['bookings'],
        queryFn: () => http.get(apiRoutes.adminBookings),
    });
    const bookings = bookingsResponse?.data || [];

    const handleSubmit = (values: any) => {
        setLoading(true);
        http
            .post(apiRoutes.adminPayments, values)
            .then(() => {
                toast({
                    title: t('common.success', 'Success'),
                    description: t('payments.createSuccess', 'Payment created successfully'),
                });
                navigate(webRoutes.payments.index);
            })
            .catch((e) => {
                handleErrorResponse(e);
                setLoading(false);
            });
    };

    const paymentFields: MagicFormGroupProps[] = [
        {
            group: t('payments.paymentDetails', 'Payment Details'),
            card: true,
            fields: [
                {
                    name: 'client_id',
                    label: t('payments.client', 'Client'),
                    type: 'select',
                    required: true,
                    error: t('payments.clientRequired', 'Client is required'),
                    placeholder: t('payments.selectClient', 'Select a client'),
                    options: clients.map((client: any) => ({
                        value: client.id.toString(),
                        name: `${client.name} (${client.email})`,
                    })),
                    width: 'half',
                },
                {
                    name: 'booking_id',
                    label: t('payments.booking', 'Booking'),
                    type: 'select',
                    placeholder: t('payments.selectBooking', 'Select a booking (optional)'),
                    options: bookings.map((booking: any) => ({
                        value: booking.id.toString(),
                        name: `Booking #${booking.id} - ${booking.client?.name || 'N/A'}`,
                    })),
                    width: 'half',
                },
                {
                    name: 'currency',
                    label: t('payments.currency', 'Currency'),
                    type: 'select',
                    defaultValue: 'CAD',
                    options: [
                        { value: 'CAD', name: 'CAD - Canadian Dollar' },
                        { value: 'USD', name: 'USD - US Dollar' },
                        { value: 'EUR', name: 'EUR - Euro' },
                    ],
                    width: 'half',
                },
                {
                    name: 'payment_type',
                    label: t('payments.paymentType', 'Payment Type'),
                    type: 'select',
                    defaultValue: 'in_person',
                    options: [
                        { value: 'in_person', name: t('payments.inPerson', 'In Person') },
                        { value: 'online', name: t('payments.online', 'Online') },
                    ],
                    width: 'half',
                },
                {
                    name: 'amount',
                    label: t('payments.amount', 'Amount (€)'),
                    type: 'number',
                    required: true,
                    error: t('payments.amountRequired', 'Amount is required'),
                    placeholder: t('payments.amountPlaceholder', 'e.g., 50.00'),
                    width: 'half',
                },
                {
                    name: 'payment_method',
                    label: t('payments.paymentMethod', 'Payment Method'),
                    type: 'select',
                    required: true,
                    error: t('payments.paymentMethodRequired', 'Payment method is required'),
                    placeholder: t('payments.selectPaymentMethod', 'Select payment method'),
                    options: [
                        { value: 'cash', name: t('payments.cash', 'Cash') },
                        { value: 'card', name: t('payments.card', 'Credit/Debit Card') },
                        { value: 'bank_transfer', name: t('payments.bankTransfer', 'Bank Transfer') },
                        { value: 'check', name: t('payments.check', 'Check') },
                        { value: 'other', name: t('payments.other', 'Other') },
                    ],
                    width: 'half',
                },
                {
                    name: 'status',
                    label: t('payments.status', 'Status'),
                    type: 'select',
                    required: true,
                    error: t('payments.statusRequired', 'Status is required'),
                    defaultValue: 'pending',
                    options: [
                        { value: 'pending', name: t('payments.pending', 'Pending') },
                        { value: 'completed', name: t('payments.completed', 'Completed') },
                        { value: 'failed', name: t('payments.failed', 'Failed') },
                        { value: 'refunded', name: t('payments.refunded', 'Refunded') },
                    ],
                    width: 'half',
                },
                {
                    name: 'paid_at',
                    label: t('payments.paidAt', 'Paid At'),
                    type: 'date',
                    placeholder: t('payments.selectPaidAt', 'Select payment date'),
                    width: 'half',
                },
                {
                    name: 'notes',
                    label: t('payments.notes', 'Notes'),
                    type: 'textarea',
                    placeholder: t('payments.notesPlaceholder', 'Add any additional notes...'),
                },
            ],
        },
    ];

    return (
        <MagicForm
            title={t('payments.addTitle', 'Add New Payment')}
            onSubmit={handleSubmit}
            fields={paymentFields}
            button={t('payments.create', 'Create Payment')}
            initialValues={{
                client_id: '',
                booking_id: '',
                amount: 0,
                currency: 'CAD',
                payment_method: '',
                payment_type: 'in_person',
                status: 'pending',
                paid_at: '',
                notes: '',
            }}
            loading={loading}
        />
    );
}
