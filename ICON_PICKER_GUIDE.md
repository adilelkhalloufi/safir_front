# Icon Picker Implementation Guide

## Overview
This implementation allows you to:
1. Select Tabler icons visually in forms
2. Store only the icon name as a string in the database (e.g., "IconHeart")
3. Dynamically render icons from their name when displaying data

## Files Created

### 1. `/src/components/custom/IconPicker.tsx`
A searchable icon picker component that displays Tabler icons in a popover grid.

### 2. `/src/utils/iconRenderer.tsx`
Utility functions to dynamically render Tabler icons from their string names.

### 3. `/src/components/custom/IconDisplay.tsx`
Example component showing how to display icons from the backend.

## Usage

### In Forms (MagicForm)

```tsx
const fields: MagicFormGroupProps[] = [
    {
        group: 'Service Type Details',
        card: true,
        fields: [
            {
                name: 'icon',
                label: 'Icon',
                type: 'iconpicker',  // Use 'iconpicker' type
                placeholder: 'Select an icon',
            },
        ],
    },
];
```

### Displaying Icons from Backend

#### Method 1: Using IconDisplay Component

```tsx
import IconDisplay from '@/components/custom/IconDisplay';

// In your component
<IconDisplay iconName={serviceType.icon} size={24} color="blue" />
```

#### Method 2: Using renderIcon Utility

```tsx
import { renderIcon } from '@/utils/iconRenderer';

// In your component
<div>
    {renderIcon(serviceType.icon, { size: 24, stroke: 2 })}
</div>
```

#### Method 3: In Table Columns

```tsx
import { renderIcon } from '@/utils/iconRenderer';

export const columns: ColumnDef<ServiceType>[] = [
    {
        accessorKey: "icon",
        header: "Icon",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                {renderIcon(row.original.icon, { size: 20 })}
                <span className="text-sm text-muted-foreground">
                    {row.original.icon}
                </span>
            </div>
        ),
    },
];
```

#### Method 4: With Cards

```tsx
import { renderIcon } from '@/utils/iconRenderer';

{serviceTypes.map(service => (
    <Card key={service.id}>
        <CardHeader>
            <div className="flex items-center gap-3">
                {renderIcon(service.icon, { size: 32, stroke: 1.5 })}
                <h3>{service.name}</h3>
            </div>
        </CardHeader>
    </Card>
))}
```

## Database Storage

The icon field stores only the icon name as a string:

```json
{
    "id": 1,
    "name": "Massage Services",
    "icon": "IconMassage",  // Just the string name
    "color": "#3b82f6"
}
```

## Available Icon Props

When rendering icons, you can pass these props:
- `size`: number (default: 24)
- `color`: string (CSS color)
- `stroke`: number (stroke width, default: 2)
- `className`: string (Tailwind classes)

## Utility Functions

### `renderIcon(iconName, props)`
Renders an icon component from its name.

```tsx
renderIcon("IconHeart", { size: 24, color: "red" })
```

### `getIconComponent(iconName)`
Returns the icon component class without rendering.

```tsx
const HeartIcon = getIconComponent("IconHeart");
if (HeartIcon) {
    return <HeartIcon size={24} />;
}
```

### `iconExists(iconName)`
Checks if an icon name is valid.

```tsx
if (iconExists("IconHeart")) {
    // Icon exists
}
```

## Features

✅ Visual icon picker with search
✅ Stores only icon name (string) in database
✅ Dynamic icon rendering from name
✅ Type-safe implementation
✅ Fully integrated with MagicForm
✅ Searchable with 100+ Tabler icons
✅ Fallback handling for missing icons

## Example: Complete CRUD Flow

```tsx
// 1. CREATE - Using IconPicker in form
<MagicForm
    fields={[{
        group: 'Details',
        fields: [
            { name: 'icon', type: 'iconpicker', label: 'Icon' }
        ]
    }]}
    onSubmit={handleSubmit}
/>

// 2. STORE - Backend receives
{
    "name": "Spa Services",
    "icon": "IconMassage"  // Just the string
}

// 3. RETRIEVE & DISPLAY - Show icon from name
import { renderIcon } from '@/utils/iconRenderer';

function ServiceCard({ service }) {
    return (
        <div>
            {renderIcon(service.icon, { size: 32 })}
            <h3>{service.name}</h3>
        </div>
    );
}
```

## Notes

- All Tabler icons starting with "Icon" are available
- Icon picker shows 100 results at a time for performance
- Search is case-insensitive
- Invalid icon names are handled gracefully (returns null)
- Console warnings for missing icons in development
