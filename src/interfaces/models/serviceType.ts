export interface ServiceType {
    id: number;
    name: {
        fr: string;
        en: string;
    };
    code?: string;
    description?: string;
    is_active: boolean;
    services_count?: number;
}