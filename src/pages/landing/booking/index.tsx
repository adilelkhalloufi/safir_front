import { useEffect } from 'react'
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
import { NotificationType, showNotification } from '@/utils'
import { SelectServices } from './SelectServices'
import { SelectOptions } from './SelectOptions'
import { SelectDateTime } from './SelectDateTime'
import { CustomerDetails } from './CustomerDetails'
import { SelectedServicesBasket } from './SelectedServicesBasket'

export default function BookingWizard() {
    const { i18n, t } = useTranslation()
    const currentLang = (i18n.language || 'fr') as 'en' | 'fr'

    const dispatch = useDispatch<AppDispatch>()
    const {
        step,
        selectedServices,
        selectedDate,
        selectedTimeSlots,
        customerInfo
    } = useSelector((state: RootState) => state.booking)

    // Compute derived values
    const selectedServiceIds = selectedServices.map(s => s.id)
    const anyPreferences = selectedServices.reduce((acc, s) => {
        if (s.preferred_gender) {
            const pref = s.preferred_gender === 'femme' ? 'female' : s.preferred_gender === 'homme' ? 'male' : 'mixed'
            acc[s.id] = pref
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

    // Staff is auto-assigned by the API, no need to fetch

    // Fetch availability slots from API
    const { data: availabilityData, isLoading: availabilityLoading, refetch: refetchAvailability } = useQuery({
        queryKey: ['availability', selectedServices, selectedDate ? format(typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate, 'yyyy-MM-dd') : null],
        queryFn: async () => {
            if (!selectedDate || selectedServices.length === 0) return null

            const dateObj = typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate
            const requestData: AvailabilitySlotsRequest = {
                services: selectedServices.map(service => ({
                    service_id: service.id,
                    group_size: service.quntity || 1,
                    ...(service.preferred_gender && { any_preference: service.preferred_gender })
                })),
                start_date: format(dateObj, 'yyyy-MM-dd'),
                end_date: format(dateObj, 'yyyy-MM-dd')
            }

            const response = await defaultHttp.post(apiRoutes.availability, requestData)
            return response.data.data
        },
        enabled: !!selectedDate && selectedServices.length > 0,
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

    // // Confirm booking mutation
    // const confirmBookingMutation = useMutation({
    //     mutationFn: async ({ bookingId, confirmData }: { bookingId: number, confirmData: ConfirmBookingRequest }) => {
    //         const response = await defaultHttp.post(apiRoutes.confirmGuestBooking(bookingId), confirmData)
    //         return response.data as GuestBookingResponse
    //     },
    //     onSuccess: (data) => {
    //         showNotification(
    //             `${t('bookingWizard.bookingConfirmed')} ${data.data.booking_reference}`,
    //             NotificationType.SUCCESS
    //         )
    //         // Reset wizard after a delay to show success
    //         setTimeout(() => {
    //             dispatch(resetBooking())
    //         }, 3000)
    //     },
    //     onError: (error: any) => {
    //         showNotification(
    //             error?.response?.data?.message || t('bookingWizard.bookingConfirmError'),
    //             NotificationType.ERROR
    //         )
    //     }
    // })

    // Navigation handlers
    const handleNext = () => dispatch(nextStep())
    const handlePrev = () => dispatch(prevStep())

    // Refetch availability when params change
    useEffect(() => {
        if (selectedDate && selectedServices.length > 0) {
            refetchAvailability()
        }
    }, [selectedDate, selectedServices, refetchAvailability])

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
                                onNext={handleNext}
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
                                selectedScenario={selectedServices}
                                personCount={Math.max(...selectedServices.map(s => s.quntity || 1), 1)}
                                selectedServices={selectedServices}
                                onSelectScenario={(selection: any) => {
                                    if (selection?.slot && selection?.serviceId) {
                                        const { slot, serviceId } = selection

                                        // Find the selected service details
                                        const selectedService = selectedServices.find(s => s.id === serviceId)

                                        // Automatically assign staff based on personCount for this service
                                        const servicePersonCount = selectedService?.quntity || 1
                                        let assignedStaff: any[] = []
                                        if (slot.available_staff && slot.available_staff.length > 0) {
                                            // Select the required number of staff (up to servicePersonCount)
                                            const numberOfStaffNeeded = Math.min(servicePersonCount, slot.available_staff.length)
                                            assignedStaff = slot.available_staff.slice(0, numberOfStaffNeeded)

                                            // Store the selected staff members
                                            dispatch(setSelectedStaffMembers({
                                                serviceId,
                                                staffMembers: assignedStaff
                                            }))
                                        }

                                        // Get existing services array or create new one
                                        const existingServices = selectedScenario?.services || []

                                        // Remove any previous selection for this service and add new one
                                        const updatedServices = [
                                            ...existingServices.filter((s: any) => s.service_id !== serviceId),
                                            {
                                                service_id: serviceId,
                                                service_name: typeof selectedService?.name === 'string' ? selectedService.name : selectedService?.name?.[currentLang] || selectedService?.name?.fr || '',
                                                order_index: existingServices.length,
                                                start_datetime: slot.start_datetime,
                                                end_datetime: slot.end_datetime,
                                                assigned_staff: assignedStaff,
                                                staff_count: assignedStaff.length,
                                                available_staff: slot.available_staff || []
                                            }
                                        ]

                                        // Calculate total price and duration
                                        let totalPrice = 0
                                        let totalDuration = 0
                                        let earliestStart = slot.start_datetime
                                        let latestEnd = slot.end_datetime

                                        updatedServices.forEach((service: any) => {
                                            const svc = selectedServices.find(s => s.id === service.service_id)
                                            if (svc) {
                                                const svcPersonCount = svc.quntity || 1
                                                const svcPrice = typeof svc.price === 'string' ? parseFloat(svc.price) : (svc.price || 0)
                                                totalPrice += svcPrice * svcPersonCount
                                                totalDuration += (svc.duration_minutes || svc.duration || 60) * svcPersonCount
                                            }
                                        })

                                        dispatch(setSelectedScenario({
                                            scenario_id: `multi-slot-${Date.now()}`,
                                            start_datetime: earliestStart,
                                            end_datetime: latestEnd,
                                            total_duration: totalDuration,
                                            total_price: totalPrice,
                                            services: updatedServices
                                        }))
                                    } else {
                                        dispatch(setSelectedScenario(null))
                                    }
                                }}
                                onNext={() => {
                                    if (selectedDate && selectedScenario) {
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
                                personCount={Math.max(...selectedServices.map(s => s.quntity || 1), 1)} // Use max for display
                                selectedDate={selectedDate}
                                customerInfo={customerInfo}
                                anyPreferences={anyPreferences}
                                selectedTimeSlots={selectedTimeSlots}
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
                    />
                </div>
            </div>
        </div>
    )
}
