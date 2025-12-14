import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
  CommandSeparator,
} from "@/components/ui/command"; // Adjust based on your components' paths
 
 import { Separator } from "@/components/ui/separator";
 import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { IconCheck } from "@tabler/icons-react";

type AutocompletePopoverProps = {
  data: { value: any; name: any; [key: string]: any }[]; // Allow additional properties
  title?: string;
  emptyMessage?:string;
  clearMessage?:string;
  onSelectionChange?: (selectedValues: string[] | any[]) => void; // Callback with either values or full objects
  multiSelect?: boolean; // Whether multiple selections are allowed (default is true)
  returnFullObject?: boolean; // Whether to return the full object or just the value
  isLoading?: boolean;  
  defaultValue?: any[] | any; // Default value can be a single object or an array
  disabled?: boolean;

};

const AutocompletePopover: React.FC<AutocompletePopoverProps> = ({
  data,
  title = "sélectionner des éléments",
  emptyMessage = "Aucun élément trouvé",
  clearMessage = "Effacer la sélection",
  onSelectionChange,
  multiSelect = false, // Default to true for multi-selection
  returnFullObject = true, // Default to false for returning values
  isLoading = false, // Default to false for returning values
  defaultValue = [], // Default value for selected items
  disabled = false,
}) => {
  const [query, setQuery] = useState("");
  const [selectedObjects, setSelectedObjects] = useState<Set<any>>(new Set());

    // Normalize defaultValue to always be an array
    useEffect(() => {
      const normalizedDefaultValue = Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue]; // If it's not an array, wrap it in an array
      if (normalizedDefaultValue.length > 0) {
        setSelectedObjects(new Set(normalizedDefaultValue));
      }
    }, [defaultValue]);
  // Filter data based on the query
  const filteredData = query === ""
    ? data
    : data.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );

 
  const toggleSelection = (item: any) => {
    if (multiSelect) {
      // Multi-selection logic
      const updatedSelection = new Set(selectedObjects);
      if (Array.from(updatedSelection).some((obj) => obj.value === item.value)) {
        updatedSelection.forEach((obj) => {
          if (obj.value === item.value) updatedSelection.delete(obj);
        });
      } else {
        updatedSelection.add(item);
      }
      setSelectedObjects(updatedSelection);
  
      // Return full objects or just values depending on returnFullObject
      const selectionToReturn = Array.from(updatedSelection).map((obj) =>
        returnFullObject ? obj : obj.value
      );
  
      // If multiSelect is enabled, pass an array of selected items (full objects or just values)
      onSelectionChange?.(selectionToReturn);
    } else {
      // Single-selection logic
      setSelectedObjects(new Set([item]));
  
      // If returnFullObject is true, pass the full object, otherwise, pass just the value
      onSelectionChange?.(returnFullObject ? item : item.value);
    }
  };

  return (
    <Popover >
      {/* Trigger */}
      <PopoverTrigger asChild disabled={disabled}>
        <Button variant="outline" size="sm" className="h-8 border-dashed" loading={isLoading}>
          {title}
          {selectedObjects.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {Array.from(selectedObjects).map((item,index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {item.name}
                    </Badge>
                  ))
                }
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedObjects.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedObjects.size} sélectionné
                  </Badge>
                ) : (
                  Array.from(selectedObjects).map((item,index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {item.name}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>

      {/* Content */}
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder={`Recherche ${title.toLowerCase()}...`}
            value={query}
            onValueChange={(value) => setQuery(value)}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {filteredData.map((item) => {
                const isSelected = Array.from(selectedObjects).some(
                  (obj) => obj.value === item.value
                );
                return (
                  <CommandItem
                    key={item.value}
                    onSelect={() => toggleSelection(item)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <IconCheck className="h-4 w-4" />
                    </div>
                    <span>{item.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedObjects.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setSelectedObjects(new Set());
                      onSelectionChange?.([]); // Notify parent of cleared selections
                    }}
                    className="justify-center text-center"
                  >
                    {clearMessage}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AutocompletePopover;
