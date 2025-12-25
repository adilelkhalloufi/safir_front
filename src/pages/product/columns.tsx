import { ColumnDef } from "@tanstack/react-table"
import { ImageIcon, MoreHorizontal, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { EnityColumnsProps, Product } from "@/interfaces/models/admin"

interface ProductColumnsProps extends EnityColumnsProps {
  onView?: (model: Product) => void
}

// Accept any row shape (product or store-stock with nested `product`)
export const GetModelcolumns = ({ onEdit, onDelete, onView }: ProductColumnsProps): ColumnDef<any>[] =>
  [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const original = row?.original || {}
        const item = original.product ?? original

        // If no image URL or error loading image, show default icon
        if (!item?.image) {
          return (
            <div className="flex items-center justify-center w-[50px] h-[50px] bg-gray-100 rounded">
              <ImageIcon size={24} className="text-gray-400" />
            </div>
          )
        }

        return (
          <img
            src={item.image}
            alt={item.name || "Product"}
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          />
        )
      }
    }
    ,
    {
      id: "name",
      accessorFn: (row) => {
        const item = row.product ?? row
        return item.name
      },
      header: "Nom",
    },
    {
      id: "reference",
      header: "Reference",
      cell: ({ row }) => {
        const original = row?.original || {}
        const item = original.product ?? original
        return item?.reference || '-'
      }
    },
    {
      id: "codebar",
      header: "Codebar",
      cell: ({ row }) => {
        const original = row?.original || {}
        const item = original.product ?? original
        return item?.codebar || '-'
      }
    },
    {
      header: "Slug",
      cell: ({ row }) => {
        const original = row?.original || {}
        const item = original.product ?? original
        return item?.slug || '-'
      }
    },
    {
      id: "description",
      header: "Description",
      cell: ({ row }) => {
        const original = row?.original || {}
        const item = original.product ?? original
        return item?.description || '-'
      }
    },
    {
      header: "Prix",
      cell: ({ row }) => {
        const original = row?.original || {}
        const item = original.product ?? original
        return item?.price ?? original.price ?? '-'
      }
    },
    {
      header: "Stock Min",
      cell: ({ row }) => {
        const original = row?.original || {}
        const item = original.product ?? original
        return item?.stock_min ?? '-'
      }
    },
    {
      header: "Stock Max",
      cell: ({ row }) => {
        const original = row?.original || {}
        const item = original.product ?? original
        return item?.stock_max ?? '-'
      }
    },
    {
      header: "Catégorie",
      cell: ({ row }) => {
        const original = row?.original || {}
        const item = original.product ?? original
        return item?.category?.name || '-'
      }
    },
    // {
    //   accessorKey: "archive",
    //   header: "Archive",
    //   cell: ({ row }) => {
    //     return (
    //       <Checkbox
    //         checked={row.original.archive}
    //       />
    //     );
    //   }
    // },
    {
      header: "Quantité",
      cell: ({ row }) => {
        const original = row?.original || {}
        // If row is a store-stock object, prefer `stock`, otherwise fall back to `quantity` or product `qte`
        return original.stock ?? original.quantity ?? (original.product && original.product.qte) ?? 0
      }

    },

    {
      id: "actions",
      cell: ({ row }) => {

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => {
                onView?.(row.original);
              }}>
                <Eye className="mr-2 h-4 w-4" />
                Voir Détails
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                onEdit?.(row.original);
              }}>Modifier</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  onDelete?.(row.original);
                }}
              >Supprimer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },



  ]
