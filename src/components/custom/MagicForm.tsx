import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "../ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { IconTrash } from "@tabler/icons-react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { Combobox } from "../ui/combobox";
import { Loader2 } from "lucide-react";
import IconPicker from "./IconPicker";

export interface MagicFormOptionProps {
  value: any;
  name: string;
}

export interface MagicFormFieldProps {
  name: string;
  label?: string;
  error?: string;
  value?: any;
  defaultValue?: any;
  type: "checkbox" | "select" | "text" | "textarea" | "radio" | "image" | "number" | "date" | "time" | "table" | "label" | "color" | "iconpicker";
  required?: boolean;
  order?: number;
  options?: MagicFormOptionProps[] | any[]; // Updated to any[]
  placeholder?: string; // Add this line
  group?: string; // Updated to string
  groupTitle?: string;
  autocomplete?: boolean;
  multiSelect?: boolean;
  width?: "full" | "half" | "third" | "auto";
  columns?: MagicFormFieldProps[]; // For table type
  disabled?: boolean; // Add this line
  returnFullObject?: boolean; // Add this line
  showIf?: (data: any) => boolean; // Conditional rendering
}

export interface MagicFormGroupProps {
  group: string;
  hideGroupTitle?: boolean;
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
  returnType?: "json" | "formdata" | "object"; // Add return type option
}

const MagicForm = memo(({
  fields,
  onSubmit,
  title = "Form",
  button = "Submit",
  initialValues,
  loading = false,
  modal = false,
  onClose,
  returnType = "object"
}: MagicFormProps) => {
  const defaultFormData = useMemo(() =>
    fields.reduce((acc: Record<string, any>, group) => {
      group.fields.forEach(field => {
        acc[field.name] = field.defaultValue !== undefined
          ? field.defaultValue
          : field.type === "image"
            ? null
            : field.type === "table"
              ? []
              : field.type === "checkbox"
                ? 0
                : "";
      });
      return acc;
    }, {}),
    [fields]
  );

  const [formData, setFormData] = useState<any>(initialValues || defaultFormData);
  const [imagePreviews, setImagePreviews] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (initialValues && JSON.stringify(initialValues) !== JSON.stringify(formData)) {
      setFormData(initialValues);

      // Set image previews
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
  }, [initialValues]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, field: string) => {
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
  }, []);

  const handleTableChange = useCallback((field: string, rowIndex: number, column: string, value: any) => {
    setFormData((prev: any) => {
      const updatedTable = [...(prev[field] || [])];
      if (!updatedTable[rowIndex]) {
        updatedTable[rowIndex] = {};
      }
      updatedTable[rowIndex] = { ...updatedTable[rowIndex], [column]: value };
      return { ...prev, [field]: updatedTable };
    });
  }, []);

  const addTableRow = useCallback((field: string, columns: MagicFormFieldProps[]) => {
    setFormData((prev: any) => {
      const currentTable = Array.isArray(prev[field]) ? prev[field] : [];
      const newRow = columns.reduce((acc: Record<string, any>, col) => {
        acc[col.name] = col.type === "checkbox" ? 0 : "";
        return acc;
      }, {});
      return { ...prev, [field]: [...currentTable, newRow] };
    });
  }, []);

  const removeTableRow = useCallback((field: string, rowIndex: number) => {
    setFormData((prev: any) => {
      const updatedTable = [...prev[field]];
      updatedTable.splice(rowIndex, 1);
      return { ...prev, [field]: updatedTable };
    });
  }, []);

  const validate = useCallback(() => {
    let newErrors: any = {};
    fields.forEach(group => {
      group.fields.forEach(({ name, required, type, columns }) => {
        if (required) {
          // Special handling for table type - check if at least one row exists
          if (type === 'table') {
            if (!Array.isArray(formData[name]) || formData[name].length === 0) {
              newErrors[name] = "At least one entry is required";
            }
          }
          // Special handling for select/combobox
          else if (type === 'select') {
            if (formData[name] === undefined || formData[name] === null || formData[name] === '') {
              newErrors[name] = "This field is required";
            }
          } else if (!formData[name] && formData[name] !== 0) {
            newErrors[name] = "This field is required";
          }
        }

        // Validate table columns
        if (type === 'table' && columns && Array.isArray(formData[name])) {
          formData[name].forEach((row: any, rowIndex: number) => {
            columns.forEach(column => {
              if (column.required) {
                const cellValue = row[column.name];
                const isEmpty = cellValue === undefined || cellValue === null || cellValue === '';

                if (isEmpty) {
                  if (!newErrors[name]) {
                    newErrors[name] = {};
                  }
                  if (!newErrors[name][rowIndex]) {
                    newErrors[name][rowIndex] = {};
                  }
                  newErrors[name][rowIndex][column.name] = `${column.label || column.name} is required`;
                }
              }
            });
          });
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fields, formData]);

  const handleSubmit = useCallback(() => {
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
      let dataToSubmit: any;

      if (returnType === "formdata") {
        // Convert to FormData
        const formDataObj = new FormData();
        Object.entries(completeFormData).forEach(([key, value]) => {
          if (value instanceof File) {
            formDataObj.append(key, value);
          } else if (Array.isArray(value)) {
            formDataObj.append(key, JSON.stringify(value));
          } else if (value !== null && value !== undefined) {
            formDataObj.append(key, String(value));
          }
        });
        dataToSubmit = formDataObj;
      } else if (returnType === "json") {
        // Convert to JSON string
        dataToSubmit = JSON.stringify(completeFormData);
      } else {
        // Return as object (default)
        dataToSubmit = completeFormData;
      }

      onSubmit(dataToSubmit);
    }
  }, [fields, formData, validate, onSubmit, returnType]);

  const renderTableCell = useCallback((col: MagicFormFieldProps, rowIndex: number, name: string, row: any, cellError?: string) => {
    const cellKey = `${name}-${rowIndex}-${col.name}`;
    const hasError = !!cellError;

    if (col.type === "select") {
      return (
        <div className="flex flex-col gap-1">
          <Combobox
            key={cellKey}
            disabled={col.disabled}
            data={col.options || []}
            returnFullObject={false}
            defaultValue={row[col.name]}
            placeholder={col.placeholder || "Select"}
            autocomplete={col.autocomplete}
            multiSelect={col.multiSelect}
            onSelectionChange={(value) => {
              // Pass the value directly to handleTableChange
              handleTableChange(name, rowIndex, col.name, value);
            }}
          />
          {hasError && <p className="text-red-500 text-xs">{cellError}</p>}
        </div>
      );
    }

    if (col.type === "checkbox") {
      return (
        <div className="flex flex-col gap-1">
          <Switch
            key={cellKey}
            disabled={col.disabled}
            checked={row[col.name] === 1 || row[col.name] === true}
            onCheckedChange={(checked) => handleTableChange(name, rowIndex, col.name, checked ? 1 : 0)}
          />
          {hasError && <p className="text-red-500 text-xs">{cellError}</p>}
        </div>
      );
    }

    if (col.type === "radio") {
      return (
        <div className="flex flex-col gap-1">
          {col.options?.map((option: any) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                disabled={col.disabled}
                name={`${name}-${rowIndex}-${col.name}`}
                value={option.value}
                checked={row[col.name] === option.value}
                onChange={(e) => handleTableChange(name, rowIndex, col.name, e.target.value)}
                className="text-primary focus:ring-primary"
              />
              <span className="text-sm">{option.name}</span>
            </label>
          ))}
          {hasError && <p className="text-red-500 text-xs">{cellError}</p>}
        </div>
      );
    }

    // For color and time types, use specific input types
    const inputType = col.type === "color" ? "color" :
      col.type === "time" ? "time" :
        col.type === "date" ? "date" :
          col.type === "number" ? "number" :
            "text";

    return (
      <div className="flex flex-col gap-1">
        <Input
          key={cellKey}
          disabled={col.disabled}
          type={inputType}
          value={row[col.name] || ""}
          onChange={(e) => handleTableChange(name, rowIndex, col.name, e.target.value)}
          className={hasError ? "border-red-500" : ""}
          placeholder={col.placeholder}
        />
        {hasError && <p className="text-red-500 text-xs">{cellError}</p>}
      </div>
    );
  }, [handleTableChange]);
  const renderField = useCallback(({ name, label, type, options, placeholder, autocomplete = false, error, width = "auto", columns, disabled = false, returnFullObject = false, multiSelect = false, showIf, required = false }: MagicFormFieldProps) => {
    if (showIf && !showIf(formData)) return null;
    const widthClass = width === "full" ? "w-full" : width === "half" ? "w-1/2" : width === "third" ? "w-1/3" : "";
    return (
      <div key={name} className={`mb-4 flex flex-col gap-2 ${widthClass}`}>
        <Label className="w-full">{label}{required && <span className="text-red-500 ml-1">*</span>}</Label>
        {type === "label" ? (
          <></>
        ) : type === "textarea" ? (
          <Textarea
            disabled={disabled}
            value={formData[name] ?? ""}
            onChange={(e: any) => handleChange(e, name)}
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
            multiSelect={multiSelect}
            onSelectionChange={(value) => {
              // Update formData immediately when selection changes
              const newValue = value || (multiSelect ? [] : null);
              setFormData((prev: any) => ({ ...prev, [name]: newValue }));
              // Clear error when valid value is selected
              if (multiSelect ? (newValue && newValue.length > 0) : newValue) {
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
          <Switch
            disabled={disabled}
            checked={formData[name] === 1}
            onCheckedChange={(checked) => handleChange({ target: { checked, type: 'checkbox' } } as any, name)}
            className={errors[name] ? "border-red-500" : ""} />
        ) : type === "radio" ? (
          <div className="flex flex-col gap-2">
            {options?.map((option: any) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  disabled={disabled}
                  name={name}
                  value={option.value}
                  checked={formData[name] === option.value}
                  onChange={(e) => handleChange(e, name)}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm">{option.name}</span>
              </label>
            ))}
          </div>
        ) : type === "date" ? (
          <Input
            disabled={disabled}
            type="date"
            value={formData[name] ?? ""}
            onChange={(e) => handleChange(e, name)}
            className={errors[name] ? "border-red-500" : ""}
          />
        ) : type === "time" ? (
          <Input
            disabled={disabled}
            type="time"
            value={formData[name] ?? ""}
            onChange={(e) => handleChange(e, name)}
            placeholder={placeholder || "HH:MM"}
            className={errors[name] ? "border-red-500" : ""}
          />
        ) : type === "color" ? (
          <Input
            disabled={disabled}
            type="color"
            value={formData[name] ?? "#000000"}
            onChange={(e) => handleChange(e, name)}
            className={errors[name] ? "border-red-500" : ""}
          />
        ) : type === "iconpicker" ? (
          <IconPicker
            disabled={disabled}
            value={formData[name] ?? ""}
            placeholder={placeholder || `Select ${label || name}`}
            onChange={(iconName) => {
              setFormData((prev: any) => ({ ...prev, [name]: iconName }));
              // Clear error when icon is selected
              if (iconName) {
                setErrors((prev: any) => ({ ...prev, [name]: undefined }));
              }
            }}
          />
        ) : type === "table" ? (
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns?.map(col => (
                    <TableCell key={col.name}>{col.label}{col.required && <span className="text-red-500 ml-1">*</span>}</TableCell>
                  ))}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData[name]?.map((row: any, rowIndex: number) => (
                  <TableRow key={rowIndex}>
                    {columns?.map(col => {
                      const cellError = errors[name]?.[rowIndex]?.[col.name];
                      return (
                        <TableCell key={col.name}>
                          {renderTableCell({ ...col, disabled }, rowIndex, name, row, cellError)}
                        </TableCell>
                      );
                    })}
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
            {errors[name] && typeof errors[name] === 'string' && (
              <p className="text-red-500 text-sm mt-2">{errors[name]}</p>
            )}
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
        {(errors[name] || error) && typeof errors[name] === 'string' && <p className="text-red-500 text-sm">{errors[name]}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }, [formData, errors, imagePreviews, handleChange, handleTableChange, addTableRow, removeTableRow, renderTableCell]);

  const formContent = useMemo(() => {
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
                  {group.hideGroupTitle !== false && (
                    <h3 className="text-lg font-bold mb-2">{group.group}</h3>
                  )}
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
  }, [fields, renderField]);

  return (
    <div className="w-full">
      {modal ? (
        <Dialog open={true} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            {formContent}
            <div className="mb-4 flex justify-end">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Loading..." : button}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <>
          <h1 className='m-2 text-3xl font-bold'>{title}</h1>
          {formContent}
          <div className="mb-4 flex justify-end mt-5">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Loading..." : button}
            </Button>
          </div>
        </>
      )}
    </div>
  );
});

MagicForm.displayName = 'MagicForm';

export default MagicForm;