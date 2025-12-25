import http from '@/utils/http'
import { apiRoutes } from '@/routes/api'
import { handleErrorResponse } from '@/utils'
import { toast } from '@/components/ui/use-toast'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm'
import { useQuery } from '@tanstack/react-query'
import { Brand, Categorie } from '@/interfaces/models/admin'
import { useNavigate } from 'react-router-dom'
import { webRoutes } from '@/routes/web'
import { useState } from 'react'

interface FormProps {
  mode: 'create' | 'edit'
}

export default function Form({ mode }: FormProps) {
  const model = useSelector((state: RootState) => state.setting.product)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const CreateModel = (values: any) => {
    http
      .post(apiRoutes.products, values)
      .then(() => {
        toast({
          description: 'Product crée avec succès',
          title: 'Succès',
        })
        navigate(webRoutes.Produit)
      })
      .catch((e) => {
        handleErrorResponse(e)
      })
  }

  const UpdateModel = (values: any) => {
    http
      .put(apiRoutes.products + '/' + model?.id, {
        ...Object.fromEntries(values),
      })
      .then(() => {
        toast({
          description: 'Produit modifée avec succès',
          title: 'Succès',
        })
        navigate(webRoutes.Produit)
      })
      .catch((e) => {
        handleErrorResponse(e)
      })
  }

  const handleSubmit = (values: any) => {
    setLoading(true)

    if (mode === 'create') {
      CreateModel(values)
    } else {
      UpdateModel(values)
    }
  }

  const { data: categories = [] } = useQuery<Categorie[]>({
    queryKey: ['categories'],
    queryFn: () =>
      http
        .get<Categorie[]>(apiRoutes.categories)
        .then((res) => res.data)
        .catch((e) => {
          handleErrorResponse(e)
          return []
        }),
  })

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: () =>
      http
        .get<Brand[]>(apiRoutes.brands)
        .then((res) => res.data)
        .catch((e) => {
          handleErrorResponse(e)
          return []
        }),
  })
  const ProductFields: MagicFormGroupProps[] = [
    {
      group: 'Information Générale',
      card: true,

      fields: [
        {
          name: 'image',
          label: 'Image',
          type: 'image',
          width: 'full',
        },
        {
          name: 'codebar',
          label: 'Codebar',
          type: 'text',
        },
        {
          name: 'name',
          label: 'Nom',
          required: true,
          error: 'Le nom est obligatoire',
          type: 'text',
        },
        {
          name: 'reference',
          label: 'Référence',
          type: 'text',
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
        },
      ],
    },
    {
      group: 'Prix et Stock',
      card: true,
      fields: [
        {
          name: 'price',
          label: 'Prix',
          required: true,
          type: 'number',
          error: 'Le prix est obligatoire',
        },
        {
          name: 'stock_min',
          label: 'Stock Min',
          type: 'number',
        },
        {
          name: 'stock_max',
          label: 'Stock Max',
          type: 'number',
        },
        // {
        //   name: 'quantity',
        //   label: 'Quantité',
        //   type: 'number',
        //   disabled: mode === 'edit' ? true : false,
        // },
      ],
    },
    {
      group: 'Relations',
      card: true,

      fields: [
        {
          name: 'brand_id',
          label: 'Marque',
          type: 'select',
          options: brands?.map((brand: Brand) => ({
            value: brand.id,
            name: brand.name,
          })),
        },
        {
          name: 'category_id',
          label: 'Catégorie',
          type: 'select',
          options: categories?.map((category: Categorie) => ({
            value: category.id,
            name: category.name,
          })),
        },
      ],
    },
    {
      group: 'Options',
      card: true,

      fields: [
        {
          name: 'is_active',
          label: 'Afficher pour ecommerce',
          type: 'checkbox',
        },
        {
          name: 'archive',
          label: 'Archiver',
          type: 'checkbox',
        },
      ],
    },
  ]

  return (
    <>
      <MagicForm
        title='Fiche produit'
        onSubmit={handleSubmit}
        fields={ProductFields}
        button={mode === 'create' ? 'Créer' : 'Modifier'}
        initialValues={mode === 'create' ? {} : (model || {})}
        loading={loading}
        returnType='formdata'

      />
    </>
  )
}
