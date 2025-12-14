import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "./badge"

interface ComboBoxProps {
  data: { value: any; name: string; [key: string]: any }[] | any;	 
  title?: string;
  emptyMessage?: string;
  clearMessage?: string;
  onSelectionChange?: (selectedValues: any[] | any) => void;
  multiSelect?: boolean;
  returnFullObject?: boolean;
  isLoading?: boolean;
  defaultValue?: any[] | any;
  disabled?: boolean;
  placeholder?: string;
  autocomplete?: boolean;
}

export function Combobox({
  data,
  title = "",
  emptyMessage = "No items found",
   onSelectionChange,
  multiSelect = false,
  returnFullObject = false,
  isLoading = false,
  defaultValue = multiSelect ? [] : "",
  disabled = false,
  placeholder = "Search...",
 
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false)
  // Use a ref to track if this is the initial render
   // Track the previous defaultValue to detect actual changes
  const prevDefaultValueRef = React.useRef<any>(defaultValue)
  
  // Initialize selectedValues state, but only once
  const [selectedValues, setSelectedValues] = React.useState<any[]>(() => {
    return Array.isArray(defaultValue) 
      ? defaultValue 
      : defaultValue ? [defaultValue] : [];
  });

  // Separate effect to handle defaultValue changes
  React.useEffect(() => {
    // Check if defaultValue has actually changed
    const defaultValueChanged = JSON.stringify(prevDefaultValueRef.current) !== JSON.stringify(defaultValue);
    
    if (defaultValueChanged) {
      prevDefaultValueRef.current = defaultValue;
      
      const currentValues = Array.isArray(defaultValue) 
        ? defaultValue 
        : defaultValue ? [defaultValue] : [];
      
      setSelectedValues(currentValues);
    }
  }, [defaultValue]);

  // Make sure we properly track selection changes
  const handleSelectionChange = React.useCallback((newValues: any[]) => {
    if (!onSelectionChange) return;
    
    const returnValue = multiSelect
      ? returnFullObject 
        ? newValues.map(v => data.find((item : any) => item.value === v)).filter(Boolean)
        : newValues
      : returnFullObject
        ? data.find((item : any) => item.value === newValues[0]) || null
        : newValues[0] || "";
        
    onSelectionChange(returnValue);
  }, [data, multiSelect, returnFullObject, onSelectionChange]);

  // Call handleSelect directly without debouncing to ensure immediate updates
  const handleSelect = React.useCallback((currentValue: string) => {
    let newValues: any[];
    
    if (multiSelect) {
      newValues = selectedValues.includes(currentValue)
        ? selectedValues.filter(v => v !== currentValue)
        : [...selectedValues, currentValue];
      
      setSelectedValues(newValues);
    } else {
      newValues = [currentValue];
      setSelectedValues(newValues);
      setOpen(false);
    }
    
    // Call the selection change handler immediately
    handleSelectionChange(newValues);
  }, [selectedValues, multiSelect, handleSelectionChange]);

  // Memoize display value calculation for performance
  const displayValue = React.useMemo(() => {
    if (selectedValues.length === 0) return "";
    
    if (multiSelect) {
      return selectedValues.map(v => {
        const item = data.find((item : any) => item.value === v);
        return item ? item.name : "";
      }).filter(Boolean).join(", ");
    }
    
    const selectedItem = data.find((item : any) => item.value === selectedValues[0]);
    return selectedItem ? selectedItem.name : "";
  }, [selectedValues, data, multiSelect]);

  // Don't render the component if data is not yet available
  if (!data || data.length === 0) {
    return (
      <Button
        variant="outline"
        className="w-full justify-between"
        disabled={true}
      >
        <span className="text-muted-foreground">Loading...</span>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 items-center">
            {multiSelect && selectedValues.length > 0 ? (
              selectedValues.map(value => {
                const item = data.find((item : any) => item.value === value);
                return item ? (
                  <Badge key={value} variant="secondary">
                    {item.name}
                  </Badge>
                ) : null;
              })
            ) : (
              <span className="text-muted-foreground">
                {displayValue || placeholder || title}
              </span>
            )}
          </div>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {data.map((item : any) => (
                <CommandItem
                  key={item.value}
                  value={item.name}
                  onSelect={() => handleSelect(item.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(item.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

