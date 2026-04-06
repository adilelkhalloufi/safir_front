import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar, Clock, Loader2, User, Info, Briefcase } from 'lucide-react'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { apiRoutes } from '@/routes/api'
import http from '@/utils/http'

interface SubscriptionDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    subscriptionId: number
    subscriptionName: string
}

export default function SubscriptionDetailsDialog({
    open,
    onOpenChange,
    subscriptionId,
    subscriptionName,
}: SubscriptionDetailsDialogProps) {
    const { t, i18n } = useTranslation()
    const locale = i18n.language === 'fr' ? fr : undefined

    const { data: bookings = [], isLoading } = useQuery<any[]>({
        queryKey: ['subscription-bookings', subscriptionId],
        queryFn: async () => {
            const res = await http.get(apiRoutes.subscriptionBookings(subscriptionId))
            const payload = res?.data?.data ?? res?.data
            return Array.isArray(payload) ? payload : []
        },
        enabled: open && subscriptionId > 0,
    })

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'confirmed': return 'default'
            case 'pending': return 'outline'
            case 'cancelled': return 'destructive'
            case 'completed': return 'secondary'
            default: return 'outline'
        }
    }

    const getStatusLabel = (status: string) => {
        return t(`subscriptionDetails.status.${status}`, status)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-lg'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <Info className='h-5 w-5' />
                        {t('subscriptionDetails.title', 'Booking history')}
                    </DialogTitle>
                    <p className='text-sm text-muted-foreground'>
                        {subscriptionName}
                    </p>
                </DialogHeader>

                <div className='space-y-3 pt-2'>
                    {isLoading ? (
                        <div className='flex items-center justify-center py-8'>
                            <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
                        </div>
                    ) : bookings.length === 0 ? (
                        <p className='py-6 text-center text-sm text-muted-foreground'>
                            {t('subscriptionDetails.noBookings', 'No bookings yet for this subscription.')}
                        </p>
                    ) : (
                        bookings.map((booking: any, index: number) => (
                            <div
                                key={booking.id || index}
                                className='rounded-lg border p-3 space-y-2'
                            >
                                <div className='flex items-center justify-between'>
                                    {/* <Badge variant={getStatusVariant(booking.status)}>
                                        {getStatusLabel(booking.status)}
                                    </Badge> */}
                                    {booking.reference && (
                                        <span className='text-xs text-muted-foreground/70'>
                                            Ref: {booking.reference.substring(0, 8)}...
                                        </span>
                                    )}
                                </div>

                                {booking.booking_items?.map((item: any) => {
                                    const lang = i18n.language as 'en' | 'fr'
                                    const serviceName = item.service?.name?.[lang] || item.service?.name?.en || ''
                                    const staffName = item.staff?.user?.name || ''

                                    return (
                                        <div key={item.id} className='space-y-1.5 rounded-md bg-muted/40 p-2'>
                                            {serviceName && (
                                                <div className='flex items-center gap-2 text-sm font-medium'>
                                                    <Briefcase className='h-4 w-4 text-muted-foreground' />
                                                    <span>{serviceName}</span>
                                                </div>
                                            )}
                                            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                                                <Calendar className='h-4 w-4' />
                                                <span>
                                                    {item.start_datetime
                                                        ? format(new Date(item.start_datetime), 'EEEE d MMMM yyyy', { locale })
                                                        : '-'}
                                                </span>
                                            </div>
                                            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                                                <Clock className='h-4 w-4' />
                                                <span>
                                                    {item.start_datetime && item.end_datetime
                                                        ? `${format(new Date(item.start_datetime), 'HH:mm')} - ${format(new Date(item.end_datetime), 'HH:mm')}`
                                                        : '-'}
                                                </span>
                                                {item.duration_minutes && (
                                                    <span className='text-xs'>({item.duration_minutes} min)</span>
                                                )}
                                            </div>
                                            {staffName && (
                                                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                                                    <User className='h-4 w-4' />
                                                    <span>{staffName}</span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
