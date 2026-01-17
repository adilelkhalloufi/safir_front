import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { CheckCircle2, Clock, ChevronRight, X, Search, DollarSign, Minus, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Service } from '@/interfaces/models/booking'
import { getLocalizedValue } from '@/interfaces/models/booking'
import IconDisplay from '@/components/custom/IconDisplay'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'
import { setServicePersonCount } from '@/store/slices/bookingSlice'

interface SelectServicesProps {
    services: Service[]
    selected: number[]
    onToggle: (id: number, service: Service) => void
    onNext: () => void | null
}

export function SelectServices({ services, selected, onToggle, onNext }: SelectServicesProps) {
    const { i18n, t } = useTranslation()
    const currentLang = (i18n.language || 'fr') as 'fr' | 'en' | 'ar'
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<string>('all')

    const dispatch = useDispatch<AppDispatch>()
    const personCounts = useSelector((state: RootState) => state.booking.personCounts)

    // Group services by type considering language and sort by display order
    const groupedServices = services.reduce((acc, service: any) => {
        const typeId = service.type?.id || 'other'
        const typeName = getLocalizedValue(service.type?.name, currentLang) || t('bookingWizard.selectServices.serviceTypes.other', 'Other')

        if (!acc[typeId]) {
            acc[typeId] = {
                name: typeName,
                color: service.type?.color || '#E09900',
                displayOrder: service.type?.display_order || 999,
                icon: service.type?.icon || null,
                services: []
            }
        }
        acc[typeId].services.push(service)
        return acc
    }, {} as Record<string, { name: string, color: string, displayOrder: number, icon: string | null, services: Service[] }>)

    // Sort types by display order
    const sortedGroupedServices = Object.entries(groupedServices)
        .sort(([, a], [, b]) => a.displayOrder - b.displayOrder)
        .reduce((acc, [key, value]) => {
            // Sort services within each type by name
            value.services.sort((a: any, b: any) => {
                const nameA = getLocalizedValue(a.name, currentLang) || ''
                const nameB = getLocalizedValue(b.name, currentLang) || ''
                return nameA.localeCompare(nameB)
            })
            acc[key] = value
            return acc
        }, {} as Record<string, { name: string, color: string, displayOrder: number, services: Service[] }>)

    // Get selected service details
    const selectedServices = services.filter((s: any) => selected.includes(s.id))
    const totalPrice = selectedServices.reduce((sum, s: any) => {
        const count = personCounts?.[s.id] || 1
        return sum + (s.price || 0) * count
    }, 0)
    const totalDuration = selectedServices.reduce((sum, s: any) => {
        const count = personCounts?.[s.id] || 1
        return sum + (s.duration_minutes || s.duration || 0) * count
    }, 0)

    // Filter services based on search
    const filterServices = (servicesList: any[]) => {
        if (!searchQuery) return servicesList
        return servicesList.filter((svc: any) => {
            const name = getLocalizedValue(svc.name, currentLang) || ''
            const description = getLocalizedValue(svc.description, currentLang) || ''
            return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                description.toLowerCase().includes(searchQuery.toLowerCase())
        })
    }

    // Get all services or filtered by type
    const getDisplayServices = () => {
        if (activeTab === 'all') {
            return filterServices(services)
        }
        return filterServices(sortedGroupedServices[activeTab]?.services || [])
    }

    const displayServices = getDisplayServices()

    return (
        <div className="flex  flex-col-reverse md:flex-row gap-6">


            {/* Main Content */}
            <div className="flex-1 space-y-4">
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-2xl">{t('bookingWizard.selectServices.title')}</CardTitle>
                        <p className="text-sm text-muted-foreground">{t('bookingWizard.selectServices.subtitle')}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t('bookingWizard.selectServices.search', 'Search services...')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Tabs for Service Types */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <ScrollArea className="w-full">
                                <TabsList className="inline-flex w-max">
                                    {Object.entries(sortedGroupedServices).map(([typeId, typeData]: any) => (
                                        <TabsTrigger key={typeId} value={typeId} className="flex items-center gap-2">
                                            {typeData?.icon && <IconDisplay iconName={typeData.icon} size={20} stroke={1.5} />}

                                            {typeData.name}
                                            <Badge variant="secondary" className="ml-1">{typeData.services.length}</Badge>
                                        </TabsTrigger>
                                    ))}
                                    <TabsTrigger value="all" className="flex items-center gap-2">
                                        {t('bookingWizard.selectServices.allServices', 'All Services')}
                                        <Badge variant="secondary" className="ml-1">{services.length}</Badge>
                                    </TabsTrigger>
                                </TabsList>
                            </ScrollArea>

                            {/* Services List */}
                            <div className="mt-4">
                                <ScrollArea className="h-[400px] pr-4">
                                    <div className="space-y-2">
                                        {displayServices.length === 0 ? (
                                            <div className="text-center py-12 text-muted-foreground">
                                                {t('bookingWizard.selectServices.noResults', 'No services found')}
                                            </div>
                                        ) : (
                                            displayServices.map((svc: any) => {
                                                const isSelected = selected.includes(svc.id)
                                                const typeColor = svc.type?.color || '#E09900'
                                                const typeIcon = svc.type?.icon

                                                return (
                                                    <button
                                                        key={svc.id}
                                                        className={cn(
                                                            'w-full group relative rounded-lg border-2 p-4 text-left transition-all duration-200',
                                                            'hover:shadow-md hover:-translate-y-0.5',
                                                            isSelected
                                                                ? 'border-[#E09900] bg-gradient-to-r from-orange-50 to-blue-50 shadow-md'
                                                                : 'border-gray-200 bg-white hover:border-[#E09900]/30'
                                                        )}
                                                        onClick={() => onToggle(svc.id, svc)}
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            {/* Type Indicator */}
                                                            <div
                                                                className="w-1 h-full absolute left-0 top-0 bottom-0 rounded-l-lg"
                                                                style={{ backgroundColor: typeColor }}
                                                            />

                                                            {/* Type Icon - Big and Nice */}
                                                            {typeIcon && (
                                                                <div
                                                                    className="shrink-0 rounded-lg p-3 ml-3 flex items-center justify-center"
                                                                    style={{
                                                                        backgroundColor: `${typeColor}15`,
                                                                    }}
                                                                >
                                                                    <IconDisplay
                                                                        iconName={typeIcon}
                                                                        size={40}
                                                                        stroke={1.5}
                                                                        color={typeColor}
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* Service Info */}
                                                            <div className={cn("flex-1", !typeIcon && "ml-3")}>
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div>
                                                                        <h4 className="font-semibold text-base mb-1">
                                                                            {getLocalizedValue(svc.name, currentLang)}
                                                                        </h4>
                                                                        {svc.description && getLocalizedValue(svc.description, currentLang) && (
                                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                                {getLocalizedValue(svc.description, currentLang)}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    {isSelected && (
                                                                        <CheckCircle2 className="h-6 w-6 text-[#E09900] shrink-0" />
                                                                    )}
                                                                </div>

                                                                <div className="flex items-center gap-4 mt-3">
                                                                    <div className="flex items-center gap-1.5 text-sm">
                                                                        <Clock className="h-3.5 w-3.5 text-green-600" />
                                                                        <span className="text-green-600 font-medium">
                                                                            {svc.duration_minutes || svc.duration} min
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 text-sm font-semibold text-[#E09900]">
                                                                        <DollarSign className="h-3.5 w-3.5" />
                                                                        {svc.price}
                                                                    </div>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-xs"
                                                                        style={{
                                                                            borderColor: typeColor,
                                                                            color: typeColor
                                                                        }}
                                                                    >
                                                                        {getLocalizedValue(svc.type?.name, currentLang)}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                )
                                            })
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        </Tabs>

                        {/* Footer with Continue Button */}
                        <div className="flex justify-between items-center pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                {t('bookingWizard.selectServices.selected', { count: selected.length })}
                            </p>
                            <Button
                                disabled={!selected.length}
                                onClick={() => onNext() as any}
                                className="bg-gradient-to-r from-[#020F44] to-[#E09900] hover:from-[#020F44]/90 hover:to-[#E09900]/90"
                                size="lg"
                            >
                                {t('bookingWizard.selectServices.continue')} <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Selected Services Basket - Left Sidebar */}
            {selected.length > 0 && (
                <div className="w-full md:w-80 block  md:sticky top-4 h-fit">
                    <Card className="border-2 border-[#E09900]/30 shadow-xl bg-white/95 backdrop-blur">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-[#E09900]" />
                                {t('bookingWizard.selectServices.selectedServices', 'Selected Services')} ({selected.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {selectedServices.map((svc: any) => (
                                    <div key={svc.id} className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg p-3 border">
                                        <div className="flex-1">
                                            <span className="text-sm font-medium">{getLocalizedValue(svc.name, currentLang)}</span>
                                            <div className="flex flex-col  gap-2 mt-1">
                                                <div className='flex flex-row items-center gap-4'>
                                                    <Clock className="h-3 w-3 text-green-600" />
                                                    <span className="text-xs text-green-600">{(svc.duration_minutes || svc.duration || 0) * (personCounts?.[svc.id] || 1)} min</span>
                                                </div>
                                                <div className='flex flex-row items-center gap-4'>

                                                    <DollarSign className="h-3 w-3 text-[#E09900]" />
                                                    <span className="text-xs font-semibold text-[#E09900]">{(svc.price || 0) * (personCounts?.[svc.id] || 1)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Person Count Controls */}
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-6 w-6 p-0"
                                                disabled={(personCounts?.[svc.id] || 1) <= 1}
                                                onClick={() => {
                                                    const currentCount = personCounts?.[svc.id] || 1
                                                    if (currentCount > 1) {
                                                        dispatch(setServicePersonCount({ serviceId: svc.id, count: currentCount - 1 }))
                                                    }
                                                }}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="text-sm font-medium min-w-[20px] text-center">
                                                {personCounts?.[svc.id] || 1}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-6 w-6 p-0"
                                                disabled={(personCounts?.[svc.id] || 1) >= 4}
                                                onClick={() => {
                                                    const currentCount = personCounts?.[svc.id] || 1
                                                    if (currentCount < 4) {
                                                        dispatch(setServicePersonCount({ serviceId: svc.id, count: currentCount + 1 }))
                                                    }
                                                }}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>

                                        <button
                                            onClick={() => onToggle(svc.id, svc)}
                                            className="rounded-full hover:bg-red-100 p-1"
                                        >
                                            <X className="h-3 w-3 text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Total Summary */}
                            <div className="border-t pt-3">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4 text-green-600" />
                                        <span className="font-medium">{totalDuration} min</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="h-4 w-4 text-[#E09900]" />
                                        <span className="font-semibold text-[#E09900]">{totalPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
