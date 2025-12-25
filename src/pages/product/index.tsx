import { GetModelcolumns } from './columns'
import { DataTable } from './data-table'
import { useEffect, useMemo, useState } from 'react'
import http from '@/utils/http'
import { apiRoutes } from '@/routes/api'
 import { Customer, Product } from '@/interfaces/models/admin'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { useDispatch } from 'react-redux'
import { setProduct } from '@/store/slices/settingSlice'
import { useNavigate } from 'react-router-dom'
import { webRoutes } from '@/routes/web'

export default function index() {
  const [data, setData] = useState<Customer[]>([])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const GetAll = () => {
    http.get(apiRoutes.storeProducts).then((res) => {
      setData(res.data)
      setLoading(false)
    })
  }
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    GetAll()
  }, [])

  const onDelete = (model: Product) => {
    http
      .delete(apiRoutes.products + '/' + model.id)
      .then(() => {
        toast({
          description: 'Produit supprimée avec succès',
          title: 'Succès',
        })
        GetAll()
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Erreur lors de la suppression de la produit',
        })
      })
  }

  const onEdit = (model: Product) => {
    dispatch(setProduct(model))
    navigate(webRoutes.ProduitEdit)
  }

  const onView = (model: Product) => {
    navigate(webRoutes.ProduitDetail.replace(':id', model.id))
  }

  const columns = useMemo(() => GetModelcolumns({ onEdit, onDelete, onView }), [])

  return (
    <>

      <div className='mb-4 flex w-full items-center justify-between'>
        <h1 className='m-2 text-3xl font-bold'>Produit</h1>
        <Button
          onClick={() => {
            navigate(webRoutes.ProduitAdd)
          }}
        >
          Nouveau
        </Button>
      </div>

      <DataTable columns={columns} data={data} loading={loading} />
    </>
  )
}
