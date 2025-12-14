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
  label?: string,
  disabled?: boolean
}

export function DatePicker({ defaultValue, onChange, label = "Pick a date", disabled = false }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(defaultValue)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (onChange && selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd")
      onChange(formattedDate as any)
    }
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
          {date ? format(date, "dd/MM/yyyy") : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          disabled={disabled}
          mode="single"
          className="w-full"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}