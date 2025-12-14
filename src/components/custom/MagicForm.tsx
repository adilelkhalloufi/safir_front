import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { IconTrash } from "@tabler/icons-react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { DatePicker } from "../ui/date-picker";
import { Combobox } from "../ui/combobox";

export interface MagicFormOptionProps {
  value: any;
  name: string;
}

export interface MagicFormFieldProps {
  name: string;
  label?: string;
  error?: string;
  value?: any;
  type: "checkbox" | "select" | "text" | "textarea" | "radio" | "image" | "number" | "date" | "table" | "label";
  required?: boolean;
  order?: number;
  options?: MagicFormOptionProps[] | any[]; // Updated to any[]
  placeholder?: string; // Add this line
  group?: string; // Updated to string
  groupTitle?: string;
  autocomplete?: boolean;
  width?: "full" | "half" | "third" | "auto";
  columns?: MagicFormFieldProps[]; // For table type
  disabled?: boolean; // Add this line
  returnFullObject?: boolean; // Add this line
}

export interface MagicFormGroupProps {
  group: string;
  fields: MagicFormFieldProps[];
  layout?: {
    type: "horizontal" | "vertical" | "grid";
    columns?: 1 | 2 | 3 | 4;
  };
  position?: {
    row: number;
    column: number;
    width?: "full" | "half" | "third" | "quarter";
  };
  card?: boolean;
}

export interface MagicFormProps {
  fields: MagicFormGroupProps[];
  onSubmit: (data: any) => void;
  title?: string;
  button?: string;
  initialValues?: { [key: string]: any };
  loading?: boolean;
  modal?: boolean;
  onClose?: () => void;
}

const MagicForm = ({
  fields,
  onSubmit,
  title = "Form",
  button = "Submit",
  initialValues,
  modal = false,
  onClose
}: MagicFormProps) => {
  const [formData, setFormData] = useState<any>(
    initialValues || fields.reduce((acc: Record<string, any>, group) => {
      group.fields.forEach(field => {
        acc[field.name] = field.type === "image"
          ? null
          : field.type === "table"
            ? []
            : "";
      });
      return acc;
    }, {})
  );
  const [imagePreviews, setImagePreviews] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (initialValues) {
      const previews: any = {};
      fields.forEach(group => {
        group.fields.forEach(field => {
          if (field.type === "image" && initialValues[field.name]) {
            previews[field.name] = initialValues[field.name];
          }
        });
      });
      setImagePreviews(previews);
    }
  }, [initialValues, fields]);

  // Update this useEffect to prevent unnecessary updates
  useEffect(() => {
    if (initialValues) {
      // Compare with current formData to avoid unnecessary updates
      const needsUpdate = Object.keys(initialValues).some(key => {
        // Skip deep comparison for table/array data to prevent unnecessary re-renders
        if (Array.isArray(initialValues[key]) && Array.isArray(formData[key])) {
          return false; // We'll handle table updates separately
        }
        return JSON.stringify(initialValues[key]) !== JSON.stringify(formData[key]);
      });
      
      if (needsUpdate) {
        // Create a new object with table data preserved from current state
        const newFormData = { ...initialValues };
        
        // Preserve table data structure to prevent unnecessary re-renders
        Object.keys(formData).forEach(key => {
          if (Array.isArray(formData[key]) && initialValues[key]) {
            // Keep table data structure but update with new values if provided
            newFormData[key] = initialValues[key];
          }
        });
        
        setFormData(newFormData);
      }
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.type === "file") {
      const file = e.target.files?.[0];
      if (file) {
        setFormData((prev: any) => ({ ...prev, [field]: file }));
        setImagePreviews((prev: any) => ({ ...prev, [field]: URL.createObjectURL(file) }));
      }
    } else if (e.target.type === "checkbox") {
      setFormData((prev: any) => ({ ...prev, [field]: e.target.checked ? 1 : 0 }));
    } else {
      setFormData((prev: any) => ({ ...prev, [field]: e.target.value || null }));
    }
  };

  // Create a memoized table change handler to prevent recreating it on each render
  const handleTableChange = useCallback((field: string, rowIndex: number, column: string, value: any) => {
    setFormData((prev: any) => {
      const updatedTable = [...(prev[field] || [])];
      if (!updatedTable[rowIndex]) {
        updatedTable[rowIndex] = {};
      }
      updatedTable[rowIndex][column] = value;
      return { ...prev, [field]: updatedTable };
    });
  }, []);

  const addTableRow = (field: string, columns: MagicFormFieldProps[]) => {
    setFormData((prev: any) => {
      const currentTable = Array.isArray(prev[field]) ? prev[field] : [];
      const newRow = columns.reduce((acc: Record<string, any>, col) => {
        acc[col.name] = "";
        return acc;
      }, {});
      return { ...prev, [field]: [...currentTable, newRow] };
    });
  };

  const removeTableRow = (field: string, rowIndex: number) => {
    setFormData((prev: any) => {
      const updatedTable = [...prev[field]];
      updatedTable.splice(rowIndex, 1);
      return { ...prev, [field]: updatedTable };
    });
  };

  const validate = () => {
    let newErrors: any = {};
    fields.forEach(group => {
      group.fields.forEach(({ name, required, type }) => {
        if (required) {
          // Special handling for select/combobox
          if (type === 'select') {
            if (formData[name] === undefined || formData[name] === null || formData[name] === '') {
              newErrors[name] = "This field is required";
            }
          } else if (!formData[name] && formData[name] !== 0) {
            newErrors[name] = "This field is required";
          }
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    // Create a complete form data object with all fields from the schema
    const completeFormData = fields.reduce((acc, group) => {
      group.fields.forEach(field => {
        // Ensure all fields exist in the form data
        if (!acc.hasOwnProperty(field.name)) {
          // Set appropriate default empty values based on field type
          if (field.type === "table") {
            acc[field.name] = formData[field.name] || [];
          } else if (field.type === "checkbox") {
            acc[field.name] = formData[field.name] === 0 ? 0 : formData[field.name] || 0;
          } else if (field.type === "number") {
            acc[field.name] = formData[field.name] === 0 ? 0 : formData[field.name] || null;
          } else {
            acc[field.name] = formData[field.name] || null;
          }
        }
      });
      return acc;
    }, { ...formData });
    
    if (validate()) {
      onSubmit(completeFormData);
    }
  };

  // Optimize renderTableCell to properly handle selection changes
  const renderTableCell = (col: MagicFormFieldProps, rowIndex: number, name: string, row: any) => {
    const cellKey = `${name}-${rowIndex}-${col.name}`;
    
    if (col.type === "select") {
      return (
        <Combobox
          key={cellKey}
          disabled={col.disabled}
          data={col.options || []}
          returnFullObject={false}
          defaultValue={row[col.name]}
          placeholder={col.placeholder || "Select"}
          autocomplete={col.autocomplete}
          onSelectionChange={(value) => {
            // Pass the value directly to handleTableChange
            handleTableChange(name, rowIndex, col.name, value);
          }}
        />
      );
    }

    return (
      <Input
        key={cellKey}
        disabled={col.disabled}
        type={col.type}
        value={row[col.name] || ""}
        onChange={(e) => handleTableChange(name, rowIndex, col.name, e.target.value)}
      />
    );
  };

  const renderField = ({ name, label, type, options, placeholder, autocomplete = false, error, width = "auto", columns, disabled = false, returnFullObject = false }: MagicFormFieldProps) => {
    const widthClass = width === "full" ? "w-full" : width === "half" ? "w-1/2" : width === "third" ? "w-1/3" : "";

    return (
      <div key={name} className={`mb-4 flex flex-col gap-2 ${widthClass}`}>
        <Label className="w-full">{label}</Label>
        {type === "label" ? (
          <div className="p-2 bg-muted/30 rounded-md border min-h-9 flex items-center">
            {formData[name] !== undefined && formData[name] !== null ? formData[name] : placeholder || "No data"}
          </div>
        ) : type === "textarea" ? (
          <Textarea
            disabled={disabled}
            value={formData[name] ?? ""}
            onChange={(e : any) => handleChange(e, name)}
            placeholder={placeholder || `Enter ${label || name}`}
            className={`min-h-[100px] ${errors[name] ? "border-red-500" : ""}`}
          />
        ) : type === "select" ? (
          <Combobox
            disabled={disabled}
            data={options || []}
            returnFullObject={returnFullObject}
            defaultValue={formData[name]}
            placeholder={placeholder || `Select ${label || name}`}
            autocomplete={autocomplete}
            onSelectionChange={(value) => {
              // Update formData immediately when selection changes
              const newValue = value || null;
              setFormData((prev: any) => ({ ...prev, [name]: newValue }));
              // Clear error when valid value is selected
              if (newValue) {
                setErrors((prev: any) => ({ ...prev, [name]: undefined }));
              }
            }}
          />
        ) : type === "image" ? (
          <div>
            <Input
              disabled={disabled}
              type="file"
              accept="image/*"
              onChange={(e) => handleChange(e, name)}
              className={errors[name] ? "border-red-500" : ""} />
            {imagePreviews[name] && (
              <img src={imagePreviews[name]} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
            )}
          </div>
        ) : type === "number" ? (
          <Input
            disabled={disabled}
            type="number"
            value={formData[name] ?? ""}
            placeholder={placeholder || `Enter ${label || name}`}
            onChange={(e) => handleChange(e, name)}
            className={errors[name] ? "border-red-500" : ""} />
        ) : type === "checkbox" ? (
          <Checkbox
            disabled={disabled}
            checked={formData[name] === 1}
            onCheckedChange={(checked) => handleChange({ target: { checked, type: 'checkbox' } } as any, name)}
            className={errors[name] ? "border-red-500" : ""} />
        ) : type === "date" ? (
          <DatePicker
            disabled={disabled}
            defaultValue={formData[name] ?? ""}
            label=""
           
            onChange={(value) => handleChange({ target: { value } } as any, name)}
          />
        ) : type === "table" ? (
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns?.map(col => (
                    <TableCell key={col.name}>{col.label}</TableCell>
                  ))}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData[name]?.map((row: any, rowIndex: number) => (
                  <TableRow key={rowIndex}>
                    {columns?.map(col => (
                      <TableCell key={col.name}>
                        {renderTableCell({ ...col, disabled }, rowIndex, name, row)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button disabled={disabled} variant="ghost" onClick={() => removeTableRow(name, rowIndex)}>
                        <IconTrash className="text-red-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button disabled={disabled} className="mt-2" onClick={() => addTableRow(name, columns || [])}>Ajouter</Button>
          </div>
        ) : (
          <Input
            disabled={disabled}
            type="text"
            value={formData[name] ?? ""}
            placeholder={placeholder || `Enter ${label || name}`}
            onChange={(e) => handleChange(e, name)}
            className={errors[name] ? "border-red-500" : ""} />
        )}
        {(errors[name] || error) && <p className="text-red-500 text-sm">{errors[name] || error}</p>}
      </div>
    );
  };
  const renderFormContent = () => {
    const groupedByRow = fields.reduce((acc: { [key: number]: MagicFormGroupProps[] }, group) => {
      const row = group.position?.row || 0;
      if (!acc[row]) acc[row] = [];
      acc[row].push(group);
      return acc;
    }, {});

    return (
      <div className="w-full flex flex-col gap-4">
        {Object.entries(groupedByRow).map(([row, rowGroups]) => (
          <div key={row} className="flex flex-wrap gap-4">
            {rowGroups.map((group) => {
              const widthClass = group.position?.width === "full"
                ? "w-full"
                : group.position?.width === "half"
                  ? "w-full md:w-[calc(50%-0.5rem)]"
                  : group.position?.width === "third"
                    ? "w-full md:w-[calc(33.33%-0.67rem)]"
                    : group.position?.width === "quarter"
                      ? "w-full md:w-[calc(25%-0.75rem)]"
                      : "w-full";

              const groupLayoutClass = group.layout?.type === "grid"
                ? `grid grid-cols-1 md:grid-cols-${group.layout.columns || 2} gap-4`
                : group.layout?.type === "horizontal"
                  ? "flex flex-col md:flex-row flex-wrap gap-4"
                  : "flex flex-col gap-4";

              const groupContent = (
                <>
                  <h3 className="text-lg font-bold mb-2">{group.group}</h3>
                  <div className={groupLayoutClass}>
                    {group.fields.map(renderField)}
                  </div>
                </>
              );

              return (
                <div key={group.group} className={`${widthClass} transition-all duration-300`}>
                  {group.card ? (
                    <Card className="p-4 w-full h-full">
                      <CardContent>
                        {groupContent}
                      </CardContent>
                    </Card>
                  ) : (
                    groupContent
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      {modal ? (
        <Dialog open={true} onOpenChange={onClose}>
          <DialogTrigger asChild>
            <Button>{button}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            {renderFormContent()}
            <div className="mb-4 flex justify-end">
              <Button onClick={handleSubmit}>{button}</Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <>
          <h1 className='m-2 text-3xl font-bold'>{title}</h1>
          {renderFormContent()}
          <div className="mb-4 flex justify-end mt-5">
            <Button onClick={handleSubmit}>{button}</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MagicForm;