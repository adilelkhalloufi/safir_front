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
    setSelectedStaffMembers,
    resetBooking,
     
} from '../../../store/slices/bookingSlice'
import type {
    Service,
 
     CreateGuestBookingRequest,
 
    GuestBookingResponse,
    AvailabilitySlotsRequest,
 
} from '../../../interfaces/models/booking'
 import { Progress } from './Progress'
import { SelectServices } from './SelectServices'
import { SelectPersonCount } from './SelectPersonCount'
import { SelectOptions } from './SelectOptions'
import { SelectDateTime } from './SelectDateTime'
import { CustomerDetails } from './CustomerDetails'
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
        selectedStaffMembers,
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
        queryKey: ['availability', selectedServices, selectedDate ? format(typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate, 'yyyy-MM-dd') : null, personCount, selectedGender],
        queryFn: async () => {
            if (!selectedDate || selectedServices.length === 0) return null

            const dateObj = typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate
            const requestData: AvailabilitySlotsRequest = {
                service_ids: selectedServices,
                date: format(dateObj, 'yyyy-MM-dd'),
                group_size: personCount,
                ...(selectedGender && { gender_preference: selectedGender as 'female' | 'male' | 'mixed' })
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
                        onSelectGender={(gender) => dispatch(setSelectedGender(gender ))}
                        onNext={handleNext}
                        onPrev={handlePrev}
                    />
                )}

                {/* Step 3: Select Date & Time */}
                {step === 3 && (
                    <SelectDateTime
                        selectedDate={selectedDate }
                        onSelectDate={(date) => dispatch(setSelectedDate(date))}
                        availability={availability}
                        isLoading={availabilityLoading}
                        selectedScenario={selectedScenario}
                        personCount={personCount}
                        onSelectScenario={(selection: any) => {
                            if (selection?.slot && selection?.serviceId) {
                                const { slot, serviceId } = selection
                                
                                // Find the selected service details
                                const selectedService = selectedServiceDetails.find(s => s.id === serviceId)
                                 
                                // Automatically assign staff based on personCount
                                let assignedStaff: any[] = []
                                if (slot.available_staff && slot.available_staff.length > 0) {
                                    // Select the required number of staff (up to personCount)
                                    const numberOfStaffNeeded = Math.min(personCount, slot.available_staff.length)
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
                                    const svc = selectedServiceDetails.find(s => s.id === service.service_id)
                                    if (svc) {
                                        const svcPrice = typeof svc.price === 'string' ? parseFloat(svc.price) : (svc.price || 0)
                                        totalPrice += svcPrice * personCount
                                        totalDuration += svc.duration_minutes || svc.duration || 60
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
                        selectedTimeSlots={selectedTimeSlots}
                        onSelectTimeSlot={(serviceId :any, scenario:any) => {
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
                {/* {step === 5 && selectedScenario && (
                    <Guarantee
                        totalPrice={selectedScenario.total_price}
                        onNext={handleNext}
                        onPrev={handlePrev}
                    />
                )} */}

                {/* Step 5 (6): Review & Confirm */}
                {step === 5 && selectedScenario && (
                    <Review
                        selectedServices={selectedServiceDetails}
                        selectedStaff={selectedStaff}
                        personCount={personCount}
                        selectedScenario={selectedScenario}
                        selectedDate={selectedDate}
                        customerInfo={customerInfo}
                        selectedGender={selectedGender}
                        isSubmitting={createBookingMutation.isPending}
                        onConfirm={(bookingSummary) => {
                            
                            createBookingMutation.mutate(bookingSummary)
                        }}
                        onPrev={handlePrev}
                    />
                )}
            </div>
        </div>
    )
}
