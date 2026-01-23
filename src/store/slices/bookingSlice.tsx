import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Service, ServiceSlot  } from '../../interfaces/models/service';
import type { Step, CustomerInfo } from '../../pages/landing/booking/types';

export interface BookingState {
    step: Step;
    selectedServices: Service[];
    selectedDate: string | undefined;
    customerInfo: CustomerInfo;
}

const initialState: BookingState = {
    step: 0,
    selectedServices: [],
    selectedDate: undefined,

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
            const index = state.selectedServices.findIndex(s => s.id === serviceId);
            if (index > -1) {
                state.selectedServices.splice(index, 1);
             } else {
                const newService = { ...service };
                if (newService.has_sessions && !newService.preferred_gender) {
                    newService.preferred_gender = 'mixed';
                }
                state.selectedServices.push(newService);
            }
        },
        setServicePersonCount: (state, action: PayloadAction<{ serviceId: number; count: number }>) => {
            const { serviceId, count } = action.payload;
            const service = state.selectedServices.find(s => s.id === serviceId);
            if (service) {
                service.quantity = count;
            }
        },
        setServiceAnyPreference: (state, action: PayloadAction<{ serviceId: number; preference: 'female' | 'male' | 'mixed' }>) => {
            const { serviceId, preference } = action.payload;
            const service = state.selectedServices.find(s => s.id === serviceId);
            if (service) {
               
                service.preferred_gender = preference;
            }
        },

        setSelectedDate: (state, action: PayloadAction<Date | string | undefined>) => {
            // Convert Date to ISO string for serialization
            if (action.payload instanceof Date) {
                state.selectedDate = action.payload.toISOString();
            } else {
                state.selectedDate = action.payload;
            }
        
        },
      
       setServiceSlot: (state, action: PayloadAction<{ serviceId: number; slot: ServiceSlot | null }>) => {
            const { serviceId, slot } = action.payload;
            const service = state.selectedServices.find(s => s.id === serviceId);
            if (service) {
               
                service.slot = slot as any;
            }
        },        setServiceSelected: (state, action: PayloadAction<{ serviceId: number; selected: boolean }>) => {
            const { serviceId, selected } = action.payload;
            const service = state.selectedServices.find(s => s.id === serviceId);
            if (service) {
                (service as any).selected = selected;
            }
        },        updateCustomerInfo: (state, action: PayloadAction<{ field: keyof CustomerInfo; value: string }>) => {
            const { field, value } = action.payload;
            state.customerInfo[field] = value;
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
    setServiceAnyPreference,
    setSelectedDate,
    setServiceSlot,
    setServiceSelected,
    updateCustomerInfo,
    resetBooking
} = bookingSlice.actions;

export default bookingSlice.reducer;
