import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
    Service,
    Staff,
    AvailabilityScenario,
} from '../../interfaces/models/booking';
import type { Step, CustomerInfo } from '../../pages/landing/booking/types';

export interface BookingState {
    step: Step;
    selectedServices: number[];
    selectedServiceDetails: Service[];
    selectedStaff: Record<number, Staff>;
    personCounts: Record<number, number>; // serviceId -> person count
    genderSelections: Record<number, string>; // serviceId -> gender preference
    selectedDate: string | undefined; // Store as ISO string for Redux serialization
    selectedScenario: AvailabilityScenario | null;
    selectedTimeSlots: Record<number, AvailabilityScenario>;
    selectedStaffMembers: Record<number, any[]>; // serviceId -> array of staff members
    customerInfo: CustomerInfo;
}

const initialState: BookingState = {
    step: 0,
    selectedServices: [],
    selectedServiceDetails: [],
    selectedStaff: {},
    personCounts: {},
    genderSelections: {}, // serviceId -> gender preference
    selectedDate: undefined,
    selectedScenario: null,
    selectedTimeSlots: {},
    selectedStaffMembers: {},
    customerInfo: {
        name: '',
        email: '',
        phone: '',
        notes: ''
    }
};

export const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setStep: (state, action: PayloadAction<Step>) => {
            state.step = action.payload;
        },
        nextStep: (state) => {
            if (state.step < 6) {
                state.step = (state.step + 1) as Step;
            }
        },
        prevStep: (state) => {
            if (state.step > 0) {
                state.step = (state.step - 1) as Step;
            }
        },
        toggleService: (state, action: PayloadAction<{ serviceId: number; service: Service }>) => {
            const { serviceId, service } = action.payload;
            const index = state.selectedServices.indexOf(serviceId);

            if (index > -1) {
                state.selectedServices.splice(index, 1);
                state.selectedServiceDetails = state.selectedServiceDetails.filter(s => s.id !== serviceId);
                delete state.selectedStaff[serviceId];
                state.personCounts = { ...state.personCounts };
                delete state.personCounts[serviceId];
            } else {
                state.selectedServices.push(serviceId);
                state.selectedServiceDetails.push(service);
                state.personCounts = { ...state.personCounts, [serviceId]: 1 }; // Default to 1 person
            }
        },
        setServicePersonCount: (state, action: PayloadAction<{ serviceId: number; count: number }>) => {
            const { serviceId, count } = action.payload;
            state.personCounts = { ...state.personCounts, [serviceId]: count };
        },
        setServiceGenderSelection: (state, action: PayloadAction<{ serviceId: number; gender: string }>) => {
            const { serviceId, gender } = action.payload;
            state.genderSelections = { ...state.genderSelections, [serviceId]: gender };
        },
        setSelectedDate: (state, action: PayloadAction<Date | string | undefined>) => {
            // Convert Date to ISO string for serialization
            if (action.payload instanceof Date) {
                state.selectedDate = action.payload.toISOString();
            } else {
                state.selectedDate = action.payload;
            }
        },
        setSelectedScenario: (state, action: PayloadAction<AvailabilityScenario | null>) => {
            state.selectedScenario = action.payload;
        },
        setSelectedTimeSlot: (state, action: PayloadAction<{ serviceId: number; scenario: AvailabilityScenario }>) => {
            const { serviceId, scenario } = action.payload;
            state.selectedTimeSlots[serviceId] = scenario;
        },
        updateCustomerInfo: (state, action: PayloadAction<{ field: keyof CustomerInfo; value: string }>) => {
            const { field, value } = action.payload;
            state.customerInfo[field] = value;
        },
        setStaffSelection: (state, action: PayloadAction<{ serviceId: number; staff: Staff }>) => {
            const { serviceId, staff } = action.payload;
            state.selectedStaff[serviceId] = staff;
        },
        removeStaffSelection: (state, action: PayloadAction<number>) => {
            delete state.selectedStaff[action.payload];
        },
        setSelectedStaffMembers: (state, action: PayloadAction<{ serviceId: number; staffMembers: any[] }>) => {
            const { serviceId, staffMembers } = action.payload;
            if (!state.selectedStaffMembers) {
                state.selectedStaffMembers = {};
            }
            state.selectedStaffMembers[serviceId] = staffMembers;
        },
        resetBooking: () => {
            return initialState;
        }
    }
});

export const {
    setStep,
    nextStep,
    prevStep,
    toggleService,
    setServicePersonCount,
    setServiceGenderSelection,
    setSelectedDate,
    setSelectedScenario,
    setSelectedTimeSlot,
    updateCustomerInfo,
    setStaffSelection,
    removeStaffSelection,
    setSelectedStaffMembers,
    resetBooking
} = bookingSlice.actions;

export default bookingSlice.reducer;
