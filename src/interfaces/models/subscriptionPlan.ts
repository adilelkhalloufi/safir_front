 
 
 
 
export  interface SubscriptionPlan {
    id: number;
    service: PlanService;
    name: { fr: string; en: string; ar?: string };
    description: { fr: string | null; en: string | null; ar?: string | null };
    total_sessions: number;
    price: string;
    duration_days: number;
    max_members: number;
    is_active: boolean;
    display_order: number;
}

export interface PlanService {
    id: number;
    name: { fr: string; en: string; ar?: string };
}