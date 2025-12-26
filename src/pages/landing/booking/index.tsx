import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

import { showNotification, NotificationType } from '../../../utils'
import { defaultHttp } from '../../../utils/http'
import { apiRoutes } from '../../../routes/api'
import type { RootState, AppDispatch } from '../../../store'
import {
    nextStep,
    prevStep,
    toggleService,
    setPersonCount,
    setSelectedGender,
    setSelectedDate,
    setSelectedScenario,
    setSelectedTimeSlot,
    updateCustomerInfo,
    resetBooking
} from '../../../store/slices/bookingSlice'
import type {
    Service,
    Staff,
    AvailabilityScenario,
    Gender as APIGender,
    CreateGuestBookingRequest,
    ConfirmBookingRequest,
    GuestBookingResponse,
    AvailabilitySlotsRequest,
    AvailabilitySlot
} from '../../../interfaces/models/booking'
import type { Step, CustomerInfo } from './types'
import { Progress } from './Progress'
import { SelectServices } from './SelectServices'
import { SelectPersonCount } from './SelectPersonCount'
import { SelectOptions } from './SelectOptions'
import { SelectDateTime } from './SelectDateTime'
import { CustomerDetails } from './CustomerDetails'
import { Guarantee } from './Guarantee'
import { Review } from './Review'

export default function BookingWizard() {
    const { i18n, t } = useTranslation()
    const currentLang = (i18n.language || 'fr') as 'en' | 'fr'
    
    const dispatch = useDispatch<AppDispatch>()
    const {
        step,
        selectedServices,
        selectedServiceDetails,
        selectedStaff,
        personCount,
        selectedGender,
        selectedDate,
        selectedScenario,
        selectedTimeSlots,
        customerInfo
    } = useSelector((state: RootState) => state.booking)

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
        queryKey: ['availability', selectedServices, selectedDate, personCount, selectedGender],
        queryFn: async () => {
            if (!selectedDate || selectedServices.length === 0) return null

            const endDate = new Date(selectedDate)
            endDate.setDate(endDate.getDate() + 7) // Check next 7 days

            const requestData: AvailabilitySlotsRequest = {
                service_ids: selectedServices,
                start_date: format(selectedDate, 'yyyy-MM-dd'),
                end_date: format(endDate, 'yyyy-MM-dd'),
                group_size: personCount,
                ...(selectedGender && { gender_preference: selectedGender as 'female' | 'male' | 'mixed' })
            }

            const response = await defaultHttp.post(apiRoutes.availabilitySlots, requestData)
            return response.data.data.slots as AvailabilitySlot[]
        },
        enabled: selectedDate !== undefined && selectedServices.length > 0
    })

    // Create guest booking mutation
    const createBookingMutation = useMutation({
        mutationFn: async (bookingData: CreateGuestBookingRequest) => {
            const response = await defaultHttp.post(apiRoutes.guestBookings, bookingData)
            return response.data as GuestBookingResponse
        },
        onSuccess: (data) => {
            // Store booking ID for confirmation
            const bookingId = data.data.id
            showNotification(t('bookingWizard.bookingCreated'), NotificationType.SUCCESS)
            
            // Automatically confirm booking (in real app, this would happen after payment)
            confirmBookingMutation.mutate({
                bookingId,
                confirmData: {
                    payment_method: 'card',
                    cardholder_name: customerInfo.name,
                    card_last4: '4242' // TODO: Get from actual payment form
                }
            })
        },
        onError: (error: any) => {
            showNotification(
                error?.response?.data?.message || t('bookingWizard.bookingCreateError'),
                NotificationType.ERROR
            )
        }
    })

    // Confirm booking mutation
    const confirmBookingMutation = useMutation({
        mutationFn: async ({ bookingId, confirmData }: { bookingId: number, confirmData: ConfirmBookingRequest }) => {
            const response = await defaultHttp.post(apiRoutes.confirmGuestBooking(bookingId), confirmData)
            return response.data as GuestBookingResponse
        },
        onSuccess: (data) => {
            showNotification(
                `${t('bookingWizard.bookingConfirmed')} ${data.data.booking_reference}`,
                NotificationType.SUCCESS
            )
            // Reset wizard after a delay to show success
            setTimeout(() => {
                dispatch(resetBooking())
            }, 3000)
        },
        onError: (error: any) => {
            showNotification(
                error?.response?.data?.message || t('bookingWizard.bookingConfirmError'),
                NotificationType.ERROR
            )
        }
    })

    // Navigation handlers
    const handleNext = () => dispatch(nextStep())
    const handlePrev = () => dispatch(prevStep())

    // Refetch availability when params change
    useEffect(() => {
        if (selectedDate && selectedServices.length > 0) {
            refetchAvailability()
        }
    }, [selectedDate, selectedServices, personCount, selectedGender, refetchAvailability])

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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8 px-4">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#020F44] to-[#E09900] bg-clip-text text-transparent mb-2">
                        {t('bookingWizard.title')}
                    </h1>
                    <p className="text-muted-foreground">{t('bookingWizard.subtitle')}</p>
                </div>

                {/* Progress Indicator */}
                <Progress step={step} />

                {/* Step 0: Select Services */}
                {step === 0 && (
                    <SelectServices
                        services={services}
                        selected={selectedServices}
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

                {/* Step 1: Select Person Count */}
                {step === 1 && (
                    <SelectPersonCount
                        count={personCount}
                        onSelect={(count) => dispatch(setPersonCount(count))}
                        onNext={handleNext}
                        onPrev={handlePrev}
                    />
                )}

                {/* Step 2: Select Gender Preference (for Hammam services) */}
                {step === 2 && (
                    <SelectOptions
                        selectedServices={selectedServiceDetails}
                        staff={[]} // Empty - staff is auto-assigned by API
                        staffSelections={{}} // Empty - no manual staff selection
                        onSelectStaff={() => {}} // No-op - staff auto-assigned
                        gender={selectedGender || ''}
                        onSelectGender={(gender) => dispatch(setSelectedGender(gender as APIGender))}
                        onNext={handleNext}
                        onPrev={handlePrev}
                    />
                )}

                {/* Step 3: Select Date & Time */}
                {step === 3 && (
                    <SelectDateTime
                        selectedDate={selectedDate}
                        onSelectDate={(date) => dispatch(setSelectedDate(date))}
                        availability={availability}
                        isLoading={availabilityLoading}
                        selectedScenario={selectedScenario}
                        onSelectScenario={(slot: any) => {
                            // Convert AvailabilitySlot to AvailabilityScenario format
                            if (slot) {
                                const service = selectedServiceDetails[0] // For now, single service
                                const price = typeof service?.price === 'string' ? parseFloat(service.price) : (service?.price || 0)
                                dispatch(setSelectedScenario({
                                    scenario_id: `slot-${slot.datetime}`,
                                    start_datetime: slot.datetime,
                                    end_datetime: slot.datetime, // Will be calculated by backend
                                    total_duration: service?.duration_minutes || service?.duration || 60,
                                    total_price: price * personCount,
                                    services: [{
                                        service_id: service?.id,
                                        service_name: typeof service?.name === 'string' ? service.name : service?.name?.[currentLang] || service?.name?.fr || '',
                                        order_index: 0,
                                        start_datetime: slot.datetime,
                                        staff_id: slot.staff_id,
                                        staff_name: slot.staff_name
                                    }]
                                }))
                            } else {
                                dispatch(setSelectedScenario(null))
                            }
                        }}
                        selectedTimeSlots={selectedTimeSlots}
                        onSelectTimeSlot={(serviceId, scenario) => {
                            dispatch(setSelectedTimeSlot({ serviceId, scenario }))
                        }}
                        selectedServices={selectedServiceDetails}
                        onNext={() => {
                            if (selectedDate && selectedScenario) {
                                handleNext()
                            }
                        }}
                        onPrev={handlePrev}
                    />
                )}

                {/* Step 4: Customer Details */}
                {step === 4 && (
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

                {/* Step 5: Guarantee Payment */}
                {step === 5 && selectedScenario && (
                    <Guarantee
                        totalPrice={selectedScenario.total_price}
                        onNext={handleNext}
                        onPrev={handlePrev}
                    />
                )}

                {/* Step 6: Review & Confirm */}
                {step === 6 && selectedScenario && (
                    <Review
                        selectedServices={selectedServiceDetails}
                        selectedStaff={selectedStaff}
                        personCount={personCount}
                        selectedScenario={selectedScenario}
                        selectedDate={selectedDate}
                        customerInfo={customerInfo}
                        selectedGender={selectedGender}
                        isSubmitting={createBookingMutation.isPending || confirmBookingMutation.isPending}
                        onConfirm={() => {
                            // Parse customer name into first and last name
                            const nameParts = customerInfo.name.trim().split(' ')
                            const firstName = nameParts[0] || customerInfo.name
                            const lastName = nameParts.slice(1).join(' ') || firstName

                            // Build guest booking request
                            const bookingData: CreateGuestBookingRequest = {
                                guest_info: {
                                    first_name: firstName,
                                    last_name: lastName,
                                    email: customerInfo.email,
                                    phone: customerInfo.phone
                                },
                                service_ids: selectedServices,
                                start_datetime: selectedScenario.start_datetime || '',
                                group_size: personCount,
                                ...(selectedGender && { 
                                    gender_preference: selectedGender as 'female' | 'male' | 'mixed' 
                                }),
                                ...(customerInfo.notes && { notes: customerInfo.notes }),
                                language: currentLang
                            }
                            createBookingMutation.mutate(bookingData)
                        }}
                        onPrev={handlePrev}
                    />
                )}
            </div>
        </div>
    )
}
