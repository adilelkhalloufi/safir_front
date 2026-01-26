import { useDispatch, useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

import {
    nextStep,
    prevStep,
    toggleService,
    setSelectedDate,
    updateCustomerInfo,
    resetBooking,
    setServiceAnyPreference,
} from '../../../store/slices/bookingSlice' 
import type {
    Service,
} from '../../../interfaces/models/service'
import type {
    CreateGuestBookingRequest,
    GuestBookingResponse,
    AvailabilitySlotsRequest,
} from '../../../interfaces/models/booking'
import { Progress } from './Progress'

import { Review } from './Review'
import { AppDispatch, RootState } from '@/store'
import { defaultHttp } from '@/utils/http'
import { apiRoutes } from '@/routes/api'
import { handleErrorResponse, NotificationType, showNotification } from '@/utils'
import { SelectServices } from './SelectServices'
import { SelectOptions } from './SelectOptions'
import { SelectDateTime } from './SelectDateTime'
import { CustomerDetails } from './CustomerDetails'
import { SelectedServicesBasket } from './SelectedServicesBasket'

export default function BookingWizard() {
    const {  t } = useTranslation()
 
    const dispatch = useDispatch<AppDispatch>()
    const {
        step,
        selectedServices,
        selectedDate,
        customerInfo
    } = useSelector((state: RootState) => state.booking)

    // Compute derived values
    const selectedServiceIds = selectedServices.map(s => s.id)
    const anyPreferences = selectedServices.reduce((acc, s) => {
        if (s.preferred_gender) {
             acc[s.id] = s.preferred_gender
        }
        return acc
    }, {} as Record<number, 'female' | 'male' | 'mixed'>)

    // Fetch services from API
    const { data: servicesData, isLoading: servicesLoading } = useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const response = await defaultHttp.get(apiRoutes.services)
            return response.data.data as Service[]
        }
    })
    
    // Fetch availability slots from API (fetch when moving to step 2)
    const { data: availabilityData, isLoading: availabilityLoading } = useQuery({
        // Include step in queryKey to refetch when moving to step 2
        queryKey: ['availability', step, selectedDate ? format(typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate, 'yyyy-MM-dd') : 'today'],
        queryFn: async () => {
            // If no services selected, nothing to request — return empty array
            if (selectedServices.length === 0) return []

            // Use selected date or default to today
            const dateObj = selectedDate 
                ? (typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate)
                : new Date()
            
            const requestData: AvailabilitySlotsRequest = {
                services: selectedServices.map(service => ({
                    service_id: service.id,
                    group_size: service.quantity || 1,
                    ...(service.preferred_gender && { any_preference: service.preferred_gender })
                })),
                date: format(dateObj, 'yyyy-MM-dd'),
            }

            try {
                const res = await defaultHttp.post(apiRoutes.availability, requestData)
                return res.data.data
            } catch (error) {
                handleErrorResponse(error)
                return []
            }
        },
        // Enabled when on step 2 and services are selected
        enabled: step === 2 && selectedServices.length > 0,
        retry: false
    })
    // Create guest booking mutation
    const createBookingMutation = useMutation({
        mutationFn: async (bookingData: CreateGuestBookingRequest) => {
            const response = await defaultHttp.post(apiRoutes.guestBookings, bookingData)
            return response.data as GuestBookingResponse
        },
        onSuccess: () => {

            showNotification(t('bookingWizard.bookingCreated'), NotificationType.SUCCESS)
            dispatch(resetBooking())



        },
        onError: (error: any) => {
            showNotification(
                error?.response?.data?.message || t('bookingWizard.bookingCreateError'),
                NotificationType.ERROR
            )
        }
    })

   

    // Navigation handlers
    const handleNext = () => dispatch(nextStep())
    const handlePrev = () => dispatch(prevStep())

    // Only fetch availability when `selectedDate` changes. React Query triggers refetch when the date in the query key changes.
    // We avoid refetching when other local state (like `selectedServices`) changes.

    // Loading state
    if (servicesLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
                <Loader2 className="h-8 w-8 animate-spin text-[#E09900]" />
            </div>
        )
    }

    const services = servicesData || []
    const availability = availabilityData || []

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8 px-4 mt-20">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#020F44] to-[#E09900] bg-clip-text text-transparent mb-2">
                        {t('bookingWizard.title')}
                    </h1>
                    <p className="text-muted-foreground">{t('bookingWizard.subtitle')}</p>
                </div>

                {/* Progress Indicator */}
                <Progress step={step} />

                {/* Main Content with Basket */}
                <div className="flex  flex-col-reverse md:flex-row gap-6">
                    <div className="flex-1 space-y-6">

                        {/* Step 0: Select Services */}
                        {step === 0 && (
                            <SelectServices
                                services={services}
                                selected={selectedServiceIds}
                                onToggle={(serviceId, service) => {
                                    dispatch(toggleService({ serviceId, service }))
                                }}
                                onNext={() => {
                                    if (selectedServices.length > 0) {
                                        handleNext()
                                    }
                                }}
                            />
                        )}

                        {/* Step 1: Select Options */}
                        {step === 1 && (
                            <SelectOptions
                                selectedServices={selectedServices}
                                staff={[]} // Empty - staff is auto-assigned by API
                                staffSelections={{}} // Empty - no manual staff selection
                                onSelectStaff={() => { }} // No-op - staff auto-assigned
                                anyPreferences={anyPreferences}
                                onSelectGender={(serviceId, preference) => dispatch(setServiceAnyPreference({ serviceId, preference }))}
                                onNext={() => {
                                    // Set today's date if no date is selected
                                    if (!selectedDate) {
                                        dispatch(setSelectedDate(new Date()))
                                    }
                                    handleNext()
                                }}
                                onPrev={handlePrev}
                            />
                        )}

                        {/* Step 2: Select Date & Time */}
                        {step === 2 && (
                            <SelectDateTime
                                selectedDate={selectedDate ? (typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate) : undefined}
                                onSelectDate={(date) => dispatch(setSelectedDate(date))}
                                availability={availability}
                                isLoading={availabilityLoading}
                                selectedServices={selectedServices}
                                onNext={() => {
                                    if (selectedDate && selectedServices.every(s => !!(s as any).slot)) {
                                        handleNext()
                                    }
                                }}
                                onPrev={handlePrev}
                            />
                        )}

                        {/* Step 3: Customer Details */}
                        {step === 3 && (
                            <CustomerDetails
                                customerInfo={customerInfo}
                                onUpdateCustomer={(field, value) => {
                                    dispatch(updateCustomerInfo({ field, value }))
                                }}
                                onNext={() => {
                                    if (customerInfo.name && customerInfo.email && customerInfo.phone) {
                                        handleNext()
                                    }
                                }}
                                onPrev={handlePrev}
                            />
                        )}

                        {/* Step 4: Review & Confirm */}
                        {step === 4 && (
                            <Review
                                selectedServices={selectedServices}
                                serviceQuantity={Math.max(...selectedServices.map(s => s.quantity || 1), 1)} // Use max for display
                                selectedDate={selectedDate}
                                customerInfo={customerInfo}
                                isSubmitting={createBookingMutation.isPending}
                                onConfirm={(bookingSummary) => {

                                    createBookingMutation.mutate(bookingSummary)
                                }}
                                onPrev={handlePrev}
                            />
                        )}

                        {/* Selected Services Basket - Shows in all steps */}

                    </div>
                    <SelectedServicesBasket
                        selectedServices={selectedServices}
                        selected={selectedServiceIds}
                        step={step}
                    />
                </div>
            </div>
        </div>
    )
}
