export interface Setting {
  id: number;
  key: string;
  value: string;
  type: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface SettingsResponse {
  data: Setting[];
}

 