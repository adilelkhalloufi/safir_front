import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { format } from 'date-fns'
import { apiRoutes } from '../../../routes/api'
import http from '../../../utils/http'
import { showNotification, NotificationType } from '../../../utils'
import type {
    Service,
    Staff,
    AvailabilityScenario,
    Gender as APIGender,
    CreateBookingRequest
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
    // State management
    const [step, setStep] = useState<Step>(0)
    const [selectedServices, setSelectedServices] = useState<number[]>([])
    const [selectedServiceDetails, setSelectedServiceDetails] = useState<Service[]>([])
    const [selectedStaff, setSelectedStaff] = useState<Record<number, Staff>>({})
    const [personCount, setPersonCount] = useState<number>(1)
    const [selectedGender, setSelectedGender] = useState<APIGender | undefined>(undefined)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedScenario, setSelectedScenario] = useState<AvailabilityScenario | null>(null)
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        name: '',
        email: '',
        phone: '',
        notes: ''
    })

    // Fetch services - FAKE DATA for testing
    const { data: servicesData, isLoading: servicesLoading } = useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            return [
                {
                    id: 1,
                    name: 'Hammam Traditionnel',
                    description: 'Expérience authentique du hammam marocain',
                    type_service: 'hammam',
                    price: 150,
                    duration: 60,
                    is_active: true
                },
                {
                    id: 2,
                    name: 'Massage Relaxant',
                    description: 'Massage aux huiles essentielles',
                    type_service: 'massage',
                    price: 250,
                    duration: 45,
                    is_active: true
                },
                {
                    id: 3,
                    name: 'Gommage Oriental',
                    description: 'Gommage complet du corps',
                    type_service: 'gommage',
                    price: 100,
                    duration: 30,
                    is_active: true
                },
                {
                    id: 4,
                    name: 'Massage Thérapeutique',
                    description: 'Massage profond pour soulager les tensions',
                    type_service: 'massage',
                    price: 300,
                    duration: 60,
                    is_active: true
                }
            ] as Service[]
        }
    })

    // Fetch staff - FAKE DATA for testing
    const { data: staffData, isLoading: staffLoading } = useQuery({
        queryKey: ['staff'],
        queryFn: async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            return [
                {
                    id: 1,
                    name: 'Fatima',
                    speciality: 'Massage & Gommage',
                    gender: 'F',
                    is_active: true
                },
                {
                    id: 2,
                    name: 'Mohammed',
                    speciality: 'Massage Thérapeutique',
                    gender: 'M',
                    is_active: true
                },
                {
                    id: 3,
                    name: 'Amina',
                    speciality: 'Spa & Relaxation',
                    gender: 'F',
                    is_active: true
                },
                {
                    id: 4,
                    name: 'Hassan',
                    speciality: 'Hammam & Massage',
                    gender: 'M',
                    is_active: true
                }
            ] as Staff[]
        }
    })

    // Fetch availability when date and services are selected - FAKE DATA for testing
    const { data: availabilityData, isLoading: availabilityLoading, refetch: refetchAvailability } = useQuery({
        queryKey: ['availability', selectedServices, selectedDate, personCount, selectedGender],
        queryFn: async () => {
            if (!selectedDate || selectedServices.length === 0) return null

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Generate fake availability scenarios
            const totalPrice = selectedServiceDetails.reduce((sum, svc) => sum + svc.price, 0) * personCount
            const totalDuration = selectedServiceDetails.reduce((sum, svc) => sum + svc.duration, 0)

            return [
                {
                    scenario_id: 1,
                    start_datetime: `${format(selectedDate, 'yyyy-MM-dd')}T09:00:00`,
                    end_datetime: `${format(selectedDate, 'yyyy-MM-dd')}T${String(9 + Math.floor(totalDuration / 60)).padStart(2, '0')}:${String(totalDuration % 60).padStart(2, '0')}:00`,
                    total_duration: totalDuration,
                    total_price: totalPrice,
                    services: selectedServices.map((serviceId, index) => ({
                        service_id: serviceId,
                        order_index: index,
                        start_datetime: `${format(selectedDate, 'yyyy-MM-dd')}T${String(9 + index).padStart(2, '0')}:00:00`,
                        staff_id: Object.keys(selectedStaff).length > 0 ? selectedStaff[serviceId]?.id : undefined,
                        room_id: 1,
                        hammam_session_id: selectedServiceDetails.find(s => s.id === serviceId)?.type_service === 'hammam' ? 1 : undefined
                    }))
                },
                {
                    scenario_id: 2,
                    start_datetime: `${format(selectedDate, 'yyyy-MM-dd')}T14:00:00`,
                    end_datetime: `${format(selectedDate, 'yyyy-MM-dd')}T${String(14 + Math.floor(totalDuration / 60)).padStart(2, '0')}:${String(totalDuration % 60).padStart(2, '0')}:00`,
                    total_duration: totalDuration,
                    total_price: totalPrice,
                    services: selectedServices.map((serviceId, index) => ({
                        service_id: serviceId,
                        order_index: index,
                        start_datetime: `${format(selectedDate, 'yyyy-MM-dd')}T${String(14 + index).padStart(2, '0')}:00:00`,
                        staff_id: Object.keys(selectedStaff).length > 0 ? selectedStaff[serviceId]?.id : undefined,
                        room_id: 2,
                        hammam_session_id: selectedServiceDetails.find(s => s.id === serviceId)?.type_service === 'hammam' ? 2 : undefined
                    }))
                },
                {
                    scenario_id: 3,
                    start_datetime: `${format(selectedDate, 'yyyy-MM-dd')}T16:30:00`,
                    end_datetime: `${format(selectedDate, 'yyyy-MM-dd')}T${String(16 + Math.floor(totalDuration / 60)).padStart(2, '0')}:${String(30 + (totalDuration % 60)).padStart(2, '0')}:00`,
                    total_duration: totalDuration,
                    total_price: totalPrice,
                    services: selectedServices.map((serviceId, index) => ({
                        service_id: serviceId,
                        order_index: index,
                        start_datetime: `${format(selectedDate, 'yyyy-MM-dd')}T${String(16 + index).padStart(2, '0')}:30:00`,
                        staff_id: Object.keys(selectedStaff).length > 0 ? selectedStaff[serviceId]?.id : undefined,
                        room_id: 1,
                        hammam_session_id: selectedServiceDetails.find(s => s.id === serviceId)?.type_service === 'hammam' ? 3 : undefined
                    }))
                }
            ] as AvailabilityScenario[]
        },
        enabled: selectedDate !== undefined && selectedServices.length > 0
    })

    // Create booking mutation - FAKE DATA for testing
    const createBookingMutation = useMutation({
        mutationFn: async (bookingData: CreateBookingRequest) => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Simulate successful booking creation
            console.log('Fake booking data:', bookingData)
            return {
                success: true,
                data: {
                    booking_id: Math.floor(Math.random() * 10000),
                    confirmation_code: `SAFIR${Math.floor(Math.random() * 100000)}`,
                    ...bookingData
                }
            }
        },
        onSuccess: (data) => {
            showNotification('✅ Réservation confirmée avec succès! (Fake Data)', NotificationType.SUCCESS)
            console.log('Booking created:', data)
            // Reset wizard after a delay to show success
            setTimeout(() => {
                setStep(0)
                setSelectedServices([])
                setSelectedServiceDetails([])
                setSelectedStaff({})
                setPersonCount(1)
                setSelectedGender(undefined)
                setSelectedDate(undefined)
                setSelectedScenario(null)
                setCustomerInfo({ name: '', email: '', phone: '', notes: '' })
            }, 2000)
        },
        onError: (error: any) => {
            showNotification(
                error?.response?.data?.message || 'Erreur lors de la création de la réservation',
                NotificationType.ERROR
            )
        }
    })

    // Navigation
    const next = () => setStep((s) => (s < 6 ? ((s + 1) as Step) : s))
    const prev = () => setStep((s) => (s > 0 ? ((s - 1) as Step) : s))

    // Refetch availability when params change
    useEffect(() => {
        if (selectedDate && selectedServices.length > 0) {
            refetchAvailability()
        }
    }, [selectedDate, selectedServices, personCount, selectedGender, refetchAvailability])

    // Loading state
    if (servicesLoading || staffLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
                <Loader2 className="h-8 w-8 animate-spin text-[#E09900]" />
            </div>
        )
    }

    const services = servicesData || []
    const staff = staffData || []
    const availability = availabilityData || []

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8 px-4">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#020F44] to-[#E09900] bg-clip-text text-transparent mb-2">
                        SAFIR Hammam & Spa
                    </h1>
                    <p className="text-muted-foreground">Réservez votre moment de détente</p>
                </div>

                {/* Progress Indicator */}
                <Progress step={step} />

                {/* Step 0: Select Services */}
                {step === 0 && (
                    <SelectServices
                        services={services}
                        selected={selectedServices}
                        onToggle={(serviceId, service) => {
                            if (selectedServices.includes(serviceId)) {
                                setSelectedServices(selectedServices.filter(id => id !== serviceId))
                                setSelectedServiceDetails(selectedServiceDetails.filter(s => s.id !== serviceId))
                                // Remove staff selection for this service
                                const newStaffSelections = { ...selectedStaff }
                                delete newStaffSelections[serviceId]
                                setSelectedStaff(newStaffSelections)
                            } else {
                                setSelectedServices([...selectedServices, serviceId])
                                setSelectedServiceDetails([...selectedServiceDetails, service])
                            }
                        }}
                        onNext={() => selectedServices.length > 0 ? next() : null}
                    />
                )}

                {/* Step 1: Select Person Count */}
                {step === 1 && (
                    <SelectPersonCount
                        count={personCount}
                        onSelect={setPersonCount}
                        onNext={next}
                        onPrev={prev}
                    />
                )}

                {/* Step 2: Select Options (Staff & Gender for Hammam) */}
                {step === 2 && (
                    <SelectOptions
                        selectedServices={selectedServiceDetails}
                        staff={staff}
                        staffSelections={Object.fromEntries(
                            Object.entries(selectedStaff).map(([serviceId, staff]) => [serviceId, staff.id])
                        )}
                        onSelectStaff={(selections) => {
                            const newStaff: Record<number, Staff> = {}
                            Object.entries(selections).forEach(([serviceId, staffId]) => {
                                const foundStaff = staff.find(s => s.id === staffId)
                                if (foundStaff) {
                                    newStaff[Number(serviceId)] = foundStaff
                                }
                            })
                            setSelectedStaff(newStaff)
                        }}
                        gender={selectedGender || ''}
                        onSelectGender={setSelectedGender as any}
                        onNext={next}
                        onPrev={prev}
                    />
                )}

                {/* Step 3: Select Date & Time */}
                {step === 3 && (
                    <SelectDateTime
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                        availability={availability}
                        isLoading={availabilityLoading}
                        selectedScenario={selectedScenario}
                        onSelectScenario={setSelectedScenario}
                        onNext={() => (selectedDate && selectedScenario) ? next() : null}
                        onPrev={prev}
                    />
                )}

                {/* Step 4: Customer Details */}
                {step === 4 && (
                    <CustomerDetails
                        customerInfo={customerInfo}
                        onUpdateCustomer={(field, value) => {
                            setCustomerInfo({ ...customerInfo, [field]: value })
                        }}
                        onNext={() => {
                            if (customerInfo.name && customerInfo.email && customerInfo.phone) {
                                next()
                            }
                        }}
                        onPrev={prev}
                    />
                )}

                {/* Step 5: Guarantee Payment */}
                {step === 5 && selectedScenario && (
                    <Guarantee
                        totalPrice={selectedScenario.total_price}
                        onNext={next}
                        onPrev={prev}
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
                        isSubmitting={createBookingMutation.isPending}
                        onConfirm={() => {
                            // Build booking request
                            const bookingData: CreateBookingRequest = {
                                language: 'fr',
                                group_size: personCount,
                                notes: customerInfo.notes || `Réservation pour ${customerInfo.name}`,
                                services: selectedScenario.services.map(svc => ({
                                    service_id: svc.service_id,
                                    order_index: svc.order_index,
                                    start_datetime: svc.start_datetime,
                                    ...(svc.staff_id && { staff_id: svc.staff_id }),
                                    ...(svc.room_id && { room_id: svc.room_id }),
                                    ...(svc.hammam_session_id && { hammam_session_id: svc.hammam_session_id })
                                }))
                            }
                            createBookingMutation.mutate(bookingData)
                        }}
                        onPrev={prev}
                    />
                )}
            </div>
        </div>
    )
}
