import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import http from '@/utils/http'
import { apiRoutes } from '@/routes/api'
import { webRoutes } from '@/routes/web'
import HealthQuestionsForm from '@/components/custom/HealthQuestionsForm'
import {
  IconArrowLeft,
  IconEdit,
  IconClock,
  IconCurrencyEuro,
  IconPackage,
  IconUsers,
  IconMail,
  IconPhone,
  IconUsersGroup,
  IconGenderFemale,
  IconEye,
} from '@tabler/icons-react'
import ViewLoading from '@/components/skeleton/ViewLoading'

export default function ViewService() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const currentLang = i18n.language as 'fr' | 'en'
  const [previewOpen, setPreviewOpen] = useState(false)

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
                    {t('services.bufferMinutes', 'Buffer Minutes')}
                  </p>
                  <div className='mt-1 flex items-center gap-2'>
                    <IconClock className='h-4 w-4 text-muted-foreground' />
                    <p className='text-base'>
                      {service?.buffer_minutes || 0}{' '}
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
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    {t('services.requiresHealthForm', 'Requires Health Form')}
                  </p>
                  <div className='mt-1'>
                    <Badge
                      variant={service?.requires_health_form ? 'default' : 'secondary'}
                    >
                      {service?.requires_health_form ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    {t('services.hasSessions', 'Has Sessions')}
                  </p>
                  <div className='mt-1'>
                    <Badge
                      variant={service?.has_sessions ? 'default' : 'secondary'}
                    >
                      {service?.has_sessions ? 'Yes' : 'No'}
                    </Badge>
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



          {/* Staff Members Card */}
          {service?.staffs && service?.staffs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <IconUsers className='h-5 w-5' />
                  {t('services.staffMembers', 'Staff Members')}
                </CardTitle>
                <CardDescription>
                  {t('services.staffMembersDescription', 'Staff members who can provide this service')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {service.staffs.map((staff: any) => (
                    <div
                      key={staff.id}
                      className='rounded-lg border p-4 hover:bg-accent/50 transition-colors hover:cursor-pointer'
                      onClick={() => {
                        // send it to view detail staff
                        navigate(webRoutes.staff.view.replace(':id', staff.id.toString()));

                      }}
                    >
                      <div className='grid gap-4 md:grid-cols-4'>
                        <div>
                          <p className='text-sm font-medium text-muted-foreground'>
                            {t('common.name', 'Name')}
                          </p>
                          <p className='mt-1 text-base font-medium'>
                            {staff.name}
                          </p>
                        </div>
                        <div>
                          <p className='text-sm font-medium text-muted-foreground'>
                            {t('common.email', 'Email')}
                          </p>
                          <div className='mt-1 flex items-center gap-2'>
                            <IconMail className='h-4 w-4 text-muted-foreground' />
                            <p className='text-base'>{staff.email}</p>
                          </div>
                        </div>
                        <div>
                          <p className='text-sm font-medium text-muted-foreground'>
                            {t('common.phone', 'Phone')}
                          </p>
                          <div className='mt-1 flex items-center gap-2'>
                            <IconPhone className='h-4 w-4 text-muted-foreground' />
                            <p className='text-base'>{staff.phone}</p>
                          </div>
                        </div>
                        <div>
                          <p className='text-sm font-medium text-muted-foreground'>
                            {t('common.status', 'Status')}
                          </p>
                          <div className='mt-1'>
                            <Badge
                              variant={staff.status === 1 ? 'default' : 'secondary'}
                            >
                              {staff.status === 1 ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {/* Slots Card */}
          {service?.has_sessions && service?.slots && service?.slots.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <IconClock className='h-5 w-5' />
                  {t('services.slots', 'Service Slots')}
                </CardTitle>
                <CardDescription>
                  {t('services.slotsDescription', 'Available time slots for this service')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='  flex flex-row gap-4 w-full'>
                  {(() => {
                    const days = [
                      { label: 'Sunday', icon: <span title='Sunday'>S</span> },
                      { label: 'Monday', icon: <span title='Monday'>M</span> },
                      { label: 'Tuesday', icon: <span title='Tuesday'>T</span> },
                      { label: 'Wednesday', icon: <span title='Wednesday'>W</span> },
                      { label: 'Thursday', icon: <span title='Thursday'>T</span> },
                      { label: 'Friday', icon: <span title='Friday'>F</span> },
                      { label: 'Saturday', icon: <span title='Saturday'>S</span> },
                    ];
                    // Group slots by day
                    const groupedSlots: { [key: number]: any[] } = {};
                    service.slots.forEach((slot: any) => {
                      if (slot.days_of_week && Array.isArray(slot.days_of_week)) {
                        slot.days_of_week.forEach((day: number) => {
                          if (!groupedSlots[day]) groupedSlots[day] = [];
                          groupedSlots[day].push(slot);
                        });
                      }
                    });
                    return Object.keys(groupedSlots)
                      .sort((a, b) => parseInt(a) - parseInt(b))
                      .map((dayKey) => {
                        const dayIndex = parseInt(dayKey);
                        const daySlots = groupedSlots[dayIndex];
                        return (
                          <div key={dayIndex} className='flex flex-col  space-y-2'>
                            <div className='flex items-center gap-2 mb-2'>
                              {days[dayIndex]?.icon}
                              <span className='text-xs text-muted-foreground'>{t(`services.${days[dayIndex]?.label.toLowerCase()}`, days[dayIndex]?.label)}</span>
                            </div>
                            <div className='flex flex-col flex-wrap gap-2'>
                              {daySlots.map((slot: any, index: number) => {
                                const getGenderColor = (gender: string) => {
                                  switch (gender?.toLowerCase()) {
                                    case 'male':
                                      return 'bg-blue-100 border-blue-300 text-blue-800'
                                    case 'female':
                                      return 'bg-pink-100 border-pink-300 text-pink-800'
                                    case 'mixed':
                                      return 'bg-orange-100 border-orange-300 text-orange-800'
                                    default:
                                      return 'bg-gray-100 border-gray-300 text-gray-800'
                                  }
                                }

                                return (
                                  <div
                                    key={slot.id || index}
                                    className={`rounded-lg border p-2 flex flex-col min-w-[90px] ${getGenderColor(slot.gender)}`}
                                  >
                                    <span className='font-semibold flex items-center gap-1'>
                                      <IconClock className='h-4 w-4' />
                                      {slot.slot_time}
                                    </span>
                                    <span className='text-xs flex items-center gap-1'>
                                      <IconGenderFemale className='h-4 w-4' />
                                      {slot.gender || 'Any'}
                                    </span>
                                    <span className='text-xs flex items-center gap-1'>
                                      <IconUsersGroup className='h-4 w-4' />
                                      {slot.default_capacity}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        );
                      });
                  })()}
                </div>
              </CardContent>
            </Card>
          )}
          {/* Health Questions Card */}
          {service?.requires_health_form && service?.health_questions && service?.health_questions.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className='flex items-center gap-2'>
                      <IconPackage className='h-5 w-5' />
                      {t('services.healthQuestions', 'Health Questions')}
                    </CardTitle>
                    <CardDescription>
                      {t('services.healthQuestionsDescription', 'Questions asked to clients for health information')}
                    </CardDescription>
                  </div>
                  <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <IconEye className="mr-2 h-4 w-4" />
                        {t('services.previewForm', 'Preview Form')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{t('services.healthQuestions', 'Health Questions')} - {t('services.previewForm', 'Preview Form')}</DialogTitle>
                      </DialogHeader>
                      <HealthQuestionsForm
                        healthQuestions={service.health_questions}
                        onSubmit={() => { }}
                        title={t('health.formTitle', 'Health Information')}
                        buttonText={t('health.submit', 'Submit Health Information')}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {service.health_questions
                    .sort((a: any, b: any) => a.order - b.order)
                    .map((question: any, index: number) => (
                      <div
                        key={question.id || index}
                        className='rounded-lg border p-4'
                      >
                        <div className='grid gap-4 md:grid-cols-2'>
                          <div className='md:col-span-2'>
                            <p className='text-sm font-medium text-muted-foreground'>
                              {t('services.question', 'Question')}
                            </p>
                            <div className='mt-1 space-y-1'>
                              <p className='text-base font-medium'>
                                EN: {question.question?.en}
                              </p>
                              <p className='text-base text-muted-foreground'>
                                FR: {question.question?.fr}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className='text-sm font-medium text-muted-foreground'>
                              {t('services.fieldType', 'Field Type')}
                            </p>
                            <div className='mt-1'>
                              <Badge variant='outline'>
                                {question.type}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <p className='text-sm font-medium text-muted-foreground'>
                              {t('services.isRequired', 'Required')}
                            </p>
                            <div className='mt-1'>
                              <Badge
                                variant={question.required ? 'default' : 'secondary'}
                              >
                                {question.required ? t('common.yes', 'Yes') : t('common.no', 'No')}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <p className='text-sm font-medium text-muted-foreground'>
                              {t('services.questionOrder', 'Order')}
                            </p>
                            <p className='mt-1 text-base'>{question.order}</p>
                          </div>
                          {(question.placeholder?.en || question.placeholder?.fr) && (
                            <div className='md:col-span-2'>
                              <p className='text-sm font-medium text-muted-foreground'>
                                {t('services.placeholder', 'Placeholder')}
                              </p>
                              <div className='mt-1 space-y-1'>
                                {question.placeholder?.en && (
                                  <p className='text-sm'>
                                    EN: {question.placeholder.en}
                                  </p>
                                )}
                                {question.placeholder?.fr && (
                                  <p className='text-sm text-muted-foreground'>
                                    FR: {question.placeholder.fr}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                          {question.type === 'select' || question.type === 'radio' ? (
                            <div className='md:col-span-2'>
                              <p className='text-sm font-medium text-muted-foreground'>
                                {t('services.options', 'Options')}
                              </p>
                              <div className='mt-1 space-y-1'>
                                {question.options?.map((option: any, optionIndex: number) => (
                                  <div key={optionIndex} className='text-sm'>
                                    <span className='font-medium'>{option.value}:</span>
                                    <span className='ml-2'>EN: {option.label?.en}</span>
                                    <span className='ml-4 text-muted-foreground'>FR: {option.label?.fr}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}
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
