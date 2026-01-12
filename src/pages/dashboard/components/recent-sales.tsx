import { Avatar, AvatarFallback } from '@/components/ui/avatar'



export function RecentSales({ recent_orders = [] }: { recent_orders?: any[] }) {
  // If no orders, display a message
  if (!recent_orders || recent_orders.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">Aucune commande récente disponible</div>
  }

  return (
    <div className='space-y-8'>
      {recent_orders.map((order) => (
        <div key={order.id} className='flex items-center'>
          <Avatar className='h-9 w-9'>
            <AvatarFallback>
              {order.customer?.first_name?.charAt(0) || ''}{order.customer?.last_name?.charAt(0) || ''}
            </AvatarFallback>
          </Avatar>
          <div className='ml-4 space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {order.customer?.first_name || 'Unknown'} {order.customer?.last_name || 'Customer'}
            </p>
            <p className='text-sm text-muted-foreground'>
              {order.customer?.email || order.customer?.phone || 'No contact info'}
            </p>
          </div>
          <div className='ml-auto font-medium'>
            {parseFloat(String(order.total_command || '0')) > 0 ? `+${order.total_command} DH` : '0.00 DH'}
          </div>
        </div>
      ))}
    </div>
  )
}
