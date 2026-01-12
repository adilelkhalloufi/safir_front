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
    personCount: number;
    selectedGender: any | undefined;
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
    personCount: 1,
    selectedGender: undefined,
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
            } else {
                state.selectedServices.push(serviceId);
                state.selectedServiceDetails.push(service);
            }
        },
        setPersonCount: (state, action: PayloadAction<number>) => {
            state.personCount = action.payload;
        },
        setSelectedGender: (state, action: PayloadAction<any | undefined>) => {
            state.selectedGender = action.payload;
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
    setPersonCount,
    setSelectedGender,
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
