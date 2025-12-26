import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import http from '@/utils/http'
import { apiRoutes } from '@/routes/api'
import { Product, OrderPurchase, OrderSale, Store } from '@/interfaces/models/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Package, ShoppingCart, Store as StoreIcon, Calendar, User, TrendingUp, TrendingDown } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'

interface ProductStock {
  id: number
  store_id: number
  product_id: number
  price: string
  cost: string | null
  stock: number
  store: Store
}

interface ProductDetailData {
  product: Product
  purchases: OrderPurchase[]
  sales: OrderSale[]
  stores: ProductStock[]
}

export default function details() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<ProductDetailData | null>(null)

  useEffect(() => {
    if (id) {
      fetchProductDetails()
    }
  }, [id])

  const fetchProductDetails = async () => {
    
      setLoading(true)
      http.get(`${apiRoutes.storeProducts}/${id}`)
      .then((res) => {
        const payload = res.data || {}

        // Normalize response shapes: support { product, purchases, sales, stores }
        // and { store_product: { product, store, ... }, purchases, sales, stores }
        const product = payload.product ?? payload.store_product?.product ?? payload.store_product ?? {}
        const purchases = payload.purchases ?? []
        const sales = payload.sales ?? []
        const stores = payload.stores ?? (payload.store_product ? [
          {
            id: payload.store_product.id,
            store_id: payload.store_product.store_id,
            product_id: payload.store_product.product_id,
            price: payload.store_product.price,
            cost: payload.store_product.cost,
            stock: payload.store_product.stock,
            created_at: payload.store_product.created_at,
            updated_at: payload.store_product.updated_at,
            store: payload.store_product.store,
          }
        ] : [])

        setData({ product, purchases, sales, stores })
        console.log("Product details data:", payload);
        setLoading(false)
      }).catch(() => {
        toast({
          variant: 'destructive',
            title: 'Erreur',
            description: 'Erreur lors du chargement des détails du produit',
        })
        setLoading(false)
      })
 
  }

  const formatDate = (date: string | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatPrice = (price: number | undefined) => {
    if (!price) return '0.00'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Package className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-lg text-gray-600">Produit non trouvé</p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { product, purchases, sales, stores } = data
  const totalStock = stores.reduce((acc, curr) => acc + curr.stock, 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">Détails du produit</p>
          </div>
        </div>
        {product.archive && (
          <Badge variant="destructive">Archivé</Badge>
        )}
      </div>

      {/* Product Information */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Product Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Informations du Produit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-6">
              {product.image && (
                <div className="flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name || 'Product'}
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Référence</p>
                    <p className="font-medium">{product.reference || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Code-barres</p>
                    <p className="font-medium">{product.codebar || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prix</p>
                    <p className="font-semibold text-lg">{formatPrice(product.price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stock Total</p>
                    <p className="font-semibold text-lg">{totalStock}</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Stock Min</p>
                    <p className="font-medium">{product.stock_min || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stock Max</p>
                    <p className="font-medium">{product.stock_max || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Marque</p>
                    <p className="font-medium">{product.brand?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Catégorie</p>
                    <p className="font-medium">{product.category?.name || product.category?.name || 'N/A'}</p>
                  </div>
                </div>
                {product.description && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p className="text-sm">{product.description}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock by Store Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StoreIcon className="h-5 w-5" />
              Stock par Magasin
            </CardTitle>
            <CardDescription>Disponibilité dans chaque magasin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stores.length > 0 ? (
                stores.map((stockItem, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{stockItem.store.name}</p>
                      {stockItem.store.address && (
                        <p className="text-xs text-muted-foreground">{stockItem.store.address}</p>
                      )}
                    </div>
                    <Badge
                      variant={stockItem.stock > 0 ? 'default' : 'destructive'}
                      className="ml-2"
                    >
                      {stockItem.stock}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun stock disponible
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

 
    </div>
  )
}
