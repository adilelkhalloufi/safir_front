import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { RecentSales } from './components/recent-sales'
import { Overview } from './components/overview'
import { useEffect, useState } from 'react'
import { setPageTitle } from '@/utils'
import { IconUsersGroup, IconZoomMoney } from '@tabler/icons-react'
import http from '@/utils/http'
import { apiRoutes } from '@/routes/api'
import { OrderSale } from '@/interfaces/models/admin'
import { GenderOrder } from './components/gender-order'

interface DashboardData {
  monthly_order_count: number;
  daily_order_count: number;
  daily_sales: number;
  monthly_sales: number;
  monthly_revenue: number[];
  recent_orders: Array<OrderSale>;
  orders_by_gender: Array<any>;
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    monthly_order_count: 0,
    daily_order_count: 0,
    daily_sales: 0,
    monthly_sales: 0,
    monthly_revenue: [],
    recent_orders: [],
    orders_by_gender: []
  });

  useEffect(() => {
    setPageTitle("Dashboard");
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {

    http.get(apiRoutes.dashboard).then((response) => {
      setDashboardData(response.data);
    }
    );

  };

  return (
    <>

      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        <div className='flex items-center space-x-2'>
          {/* <Button>Download</Button> */}
        </div>
      </div>
      <Tabs
        orientation='vertical'
        defaultValue='overview'
        className='space-y-4'
      >
        <div className='w-full overflow-x-auto pb-2'>
          {/* <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
             
            </TabsList> */}
        </div>
        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total de chiffre d'affaire
                </CardTitle>
                <IconZoomMoney />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{dashboardData.daily_sales} DH</div>
                <p className='text-xs text-muted-foreground'>
                  Par jour
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Viste
                </CardTitle>
                <IconUsersGroup />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{dashboardData.daily_order_count}</div>
                <p className='text-xs text-muted-foreground'>
                  Par jour
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total de chiffre d'affaires
                </CardTitle>
                <IconZoomMoney />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{dashboardData.monthly_sales} DH</div>
                <p className='text-xs text-muted-foreground'>
                  Par Mois
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Viste
                </CardTitle>
                <IconUsersGroup />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{dashboardData.monthly_order_count}</div>
                <p className='text-xs text-muted-foreground'>
                  Par Mois
                </p>
              </CardContent>
            </Card>
          </div>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
            <Card className='col-span-1 lg:col-span-4'>
              <CardHeader>
                <CardTitle>Aperçu</CardTitle>
              </CardHeader>
              <CardContent className='pl-2'>
                <Overview monthly_revenue={dashboardData.monthly_revenue} />
              </CardContent>
            </Card>
            <Card className='col-span-1 lg:col-span-3'>
              <CardHeader>
                <CardTitle>Ventes récentes</CardTitle>

              </CardHeader>
              <CardContent>
                <RecentSales recent_orders={dashboardData.recent_orders} />
              </CardContent>
            </Card>
          </div>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
            <Card className='col-span-1 lg:col-span-4'>
              <CardHeader>
                <CardTitle>Sexe</CardTitle>
              </CardHeader>
              <CardContent className='pl-2'>
                <GenderOrder chartData={dashboardData.orders_by_gender} />
              </CardContent>
            </Card>

          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

