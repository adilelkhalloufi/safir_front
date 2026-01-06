import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import http from '@/utils/http'
import { apiRoutes } from '@/routes/api'
import { webRoutes } from '@/routes/web'
import {
  IconArrowLeft,
  IconEdit,
  IconClock,
  IconCurrencyEuro,
  IconPackage,
} from '@tabler/icons-react'
import ViewLoading from '@/components/skeleton/ViewLoading'

export default function ViewService() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const currentLang = i18n.language as 'fr' | 'en'

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () =>
      http
        .get(apiRoutes.adminServiceById(Number(id)))
        .then((res) => res.data?.data),
    enabled: !!id,
  })

  return (
    <div>
      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate(webRoutes.services.index)}
          >
            <IconArrowLeft className='h-5 w-5' />
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {isLoading
                ? t('common.loading', 'Loading...')
                : service?.name?.[currentLang] || 'N/A'}
            </h1>
            <p className='text-muted-foreground'>
              {t('services.subtitle', 'Service Details')}
            </p>
          </div>
        </div>
        {!isLoading && (
          <Button
            onClick={() =>
              navigate(webRoutes.services.edit.replace(':id', id!))
            }
          >
            <IconEdit className='mr-2 h-4 w-4' />
            {t('common.edit', 'Edit')}
          </Button>
        )}
      </div>
      {isLoading ? (
        <ViewLoading />
      ) : (
        <div className='grid gap-6'>
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t('services.title', 'Service Information')}
              </CardTitle>
              <CardDescription>
                {t('common.view', 'View')} {service?.name?.[currentLang]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-6 md:grid-cols-2'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    {t('services.serviceName', 'Service Name')}
                  </p>
                  <p className='mt-1 text-base'>{service?.name?.[currentLang]}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    ID
                  </p>
                  <p className='mt-1 text-base'>{service?.id}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    {t('services.serviceType', 'Service Type')}
                  </p>
                  <div className='mt-1 flex items-center gap-2'>
                    <Badge
                      variant='outline'
                      style={{
                        borderColor: service?.type?.color,
                        color: service?.type?.color,
                      }}
                    >
                      {service?.type?.name?.[currentLang]}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    {t('services.status', 'Status')}
                  </p>
                  <div className='mt-1'>
                    <Badge
                      variant={service?.is_active ? 'default' : 'secondary'}
                    >
                      {service?.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    {t('services.duration', 'Duration')}
                  </p>
                  <div className='mt-1 flex items-center gap-2'>
                    <IconClock className='h-4 w-4 text-muted-foreground' />
                    <p className='text-base'>
                      {service?.duration_minutes}{' '}
                      {t('common.minutes', 'minutes')}
                    </p>
                  </div>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    {t('services.price', 'Price')}
                  </p>
                  <div className='mt-1 flex items-center gap-2'>
                    <IconCurrencyEuro className='h-4 w-4 text-muted-foreground' />
                    <p className='text-base font-semibold'>{service?.price}</p>
                  </div>
                </div>
                <div className='md:col-span-2'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    {t('services.description', 'Description')}
                  </p>
                  <p className='mt-1 text-base'>
                    {service?.description?.[currentLang]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements Card */}
          {service?.requirements && service?.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <IconPackage className='h-5 w-5' />
                  Requirements
                </CardTitle>
                <CardDescription>
                  Resources required for this service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {service.requirements.map((req: any, index: number) => (
                    <div
                      key={req.id || index}
                      className='rounded-lg border p-4'
                    >
                      <div className='grid gap-4 md:grid-cols-3'>
                        <div>
                          <p className='text-sm font-medium text-muted-foreground'>
                            Resource
                          </p>
                          <p className='mt-1 text-base'>
                            {req.resource?.name?.fr || req.resource?.name?.en}
                          </p>
                        </div>
                        <div>
                          <p className='text-sm font-medium text-muted-foreground'>
                            Quantity
                          </p>
                          <p className='mt-1 text-base'>{req.quantity}</p>
                        </div>
                        <div>
                          <p className='text-sm font-medium text-muted-foreground'>
                            Required
                          </p>
                          <div className='mt-1'>
                            <Badge
                              variant={
                                req.is_required ? 'default' : 'secondary'
                              }
                            >
                              {req.is_required ? 'Required' : 'Optional'}
                            </Badge>
                          </div>
                        </div>
                        {req.type_resource?.description &&
                          (req.type_resource.description.fr ||
                            req.type_resource.description.en) && (
                            <div className='md:col-span-3'>
                              <p className='text-sm font-medium text-muted-foreground'>
                                Description
                              </p>
                              <p className='mt-1 text-sm text-muted-foreground'>
                                {req.type_resource.description.fr ||
                                  req.type_resource.description.en}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Type Details Card */}
          {service?.type && (
            <Card>
              <CardHeader>
                <CardTitle>Service Type Details</CardTitle>
                <CardDescription>
                  Additional information about the service type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6 md:grid-cols-2'>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Type Name
                    </p>
                    <p className='mt-1 text-base'>
                      {service?.type?.name?.[currentLang]}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Type ID
                    </p>
                    <p className='mt-1 text-base'>{service?.type?.id}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Color
                    </p>
                    <div className='mt-1 flex items-center gap-2'>
                      <div
                        className='h-6 w-6 rounded border'
                        style={{ backgroundColor: service?.type?.color }}
                      />
                      <p className='text-base'>{service?.type?.color}</p>
                    </div>
                  </div>

                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Display Order
                    </p>
                    <p className='mt-1 text-base'>
                      {service?.type?.display_order}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Type Status
                    </p>
                    <div className='mt-1'>
                      <Badge
                        variant={
                          service?.type?.is_active ? 'default' : 'secondary'
                        }
                      >
                        {service?.type?.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
