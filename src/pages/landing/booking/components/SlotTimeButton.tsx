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
}

export default function SlotTimeButton({
  slot,
  isSelected = false,
  disabled = false,
  insufficient = false,
   onClick,
}: SlotTimeButtonProps) {
  const { t } = useTranslation()
  
  // Check if slot has no staff available
  const noStaff = !slot.available_staff || slot.available_staff.length === 0
  const isDisabled = disabled || noStaff

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

      {noStaff ? (
        <div className="mb-2 text-xs font-medium text-gray-400">
          Indisponible
        </div>
      ) : (
        <>
          <div className={cn('mb-2 text-[10px]', isSelected ? 'text-amber-600' : 'text-gray-500')}>
            {slot.available_staff?.slice(0, 2).map((s: any) => s.staff_name).join(', ')}
            {slot.available_staff && slot.available_staff.length > 2 ? ` +${slot.available_staff.length - 2}` : ''}
          </div>

          {(slot.available_capacity || 0) > 0 && (
            <div className={cn('text-[9px] font-medium', insufficient ? 'text-red-600' : 'text-gray-500')}>
              {slot.available_capacity} {t('bookingWizard.selectDateTime.places')}
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
