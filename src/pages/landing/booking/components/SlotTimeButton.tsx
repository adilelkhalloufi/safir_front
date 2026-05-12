import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface SlotTimeButtonProps {
  slot: any
  isSelected?: boolean
  disabled?: boolean
  insufficient?: boolean
  onClick?: (e?: React.MouseEvent) => void
  requestedQuantity?: number
}

export default function SlotTimeButton({
  slot,
  isSelected = false,
  disabled = false,
  insufficient = false,
  onClick,
  requestedQuantity = 1
}: SlotTimeButtonProps) {
  const { t } = useTranslation()
  
  // Check if slot has no staff available
  const noStaff = !slot.available_staff || slot.available_staff.length === 0
  
  // Calculate staff capacity
  const staffWithCapacity = (slot.available_staff || []).map((staff: any) => ({
    ...staff,
    remainingCapacity: (staff.max_concurrent_bookings || 0) - (staff.current_bookings || 0)
  }))
  
  // Sort by priority (descending)
  const sortedStaff = staffWithCapacity
    .filter((staff: any) => staff.remainingCapacity > 0)
    .sort((a: any, b: any) => (b.priority || 0) - (a.priority || 0))
  
  const totalStaffCapacity = sortedStaff.reduce((sum: number, staff: any) => sum + staff.remainingCapacity, 0)
  const isDisabled = disabled || noStaff || totalStaffCapacity === 0

  return (
    <button
      key={slot.slot_id}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'relative rounded-lg border p-3 text-center transition-all duration-200',
        isSelected
          ? 'border-amber-500 bg-amber-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50',
        isDisabled && 'cursor-not-allowed bg-gray-100 opacity-60 hover:border-gray-200 hover:bg-gray-100'
      )}
    >
      {isSelected && (
        <CheckCircle2 className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-white text-amber-600 shadow-sm" />
      )}

      <div className={cn('mb-1 text-sm font-bold', isSelected ? 'text-amber-600' : noStaff ? 'text-gray-400' : 'text-gray-700')}>
        {slot.start_time} - {slot.end_time}
      </div>

      {noStaff || totalStaffCapacity === 0 ? (
        <div className="mb-2 text-xs font-medium text-gray-400">
          {t('bookingWizard.selectDateTime.unavailable', 'Indisponible')}
        </div>
      ) : (
        <>
          <div className={cn('mb-2 text-[10px]', isSelected ? 'text-amber-600' : 'text-gray-500')}>
            {sortedStaff.slice(0, 2).map((s: any) => s.staff_name).join(', ')}
            {sortedStaff.length > 2 ? ` +${sortedStaff.length - 2}` : ''}
          </div>

          {/* Show total staff capacity */}
          {totalStaffCapacity > 0 && (
            <div className={cn('text-[9px] font-medium', insufficient ? 'text-red-600' : 'text-gray-500')}>
              {insufficient ? (
                <span>{t('bookingWizard.selectDateTime.capacity', 'Capacité')}: {totalStaffCapacity}/{requestedQuantity}</span>
              ) : (
                <span>{t('bookingWizard.selectDateTime.available', 'Disponible')}: {totalStaffCapacity}</span>
              )}
            </div>
          )}

          {insufficient && (
            <div className="mt-1 text-xs text-red-600">{t('bookingWizard.selectDateTime.insufficientCapacityShort')}</div>
          )}
        </>
      )}

  
    </button>
  )
}
