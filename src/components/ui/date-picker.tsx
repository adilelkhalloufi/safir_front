import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  defaultValue?: Date
  onChange?: (date: Date | undefined) => void
  label?: string
  disabled?: React.ComponentProps<typeof Calendar>['disabled']
  bookedDates?: Date[]
  minDate?: Date
}
export function DatePicker({ defaultValue, onChange, label = "Pick a date", disabled, bookedDates = [], minDate }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(defaultValue)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (onChange) {
      onChange(selectedDate)
    }
  }

  // Check if date is valid before formatting
  const isValidDate = (d: Date | undefined): d is Date => {
    return d instanceof Date && !isNaN(d.getTime())
  }

  // Combine disabled logic
  const isDateDisabled = (date: Date) => {
    // Check min date
    if (minDate && date < minDate) return true
    
    // Check booked dates
    if (bookedDates.some(bookedDate => 
      bookedDate.toDateString() === date.toDateString()
    )) return true
    
    // Check custom disabled function
    if (disabled && typeof disabled === 'function') return disabled(date)
    
    return false
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {isValidDate(date) ? format(date, "dd/MM/yyyy") : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          className="w-full"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          disabled={isDateDisabled}
          modifiers={{
            booked: bookedDates,
          }}
          modifiersClassNames={{
            booked: "[&>button]:line-through opacity-100",
          }}
        />
      </PopoverContent>
    </Popover>
  )
}