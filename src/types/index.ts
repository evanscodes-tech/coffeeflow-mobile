export interface Farmer {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  farm_name: string;
  location: {
    region: string;
    district: string;
    village: string;
  };
  farm_size?: number;  // Make optional
  coffee_varieties?: string;  // Make optional
  years_farming?: number;  // Make optional
  sms_notifications?: boolean;  // Make optional
  sms_language?: string;  // Make optional
  registered_since?: string;  // Make optional
}

export interface Delivery {
  id: number;
  batch_code: string;
  date: string;
  cherry_kg: number;
  dry_kg: number;
  quality: string;
  price_per_kg: number;
  total_amount: number;
  payment_status: string;
}

export interface DashboardData {
  farmer: Farmer;
  stats: {
    total_deliveries: number;
    total_kgs: number;
    this_year_kgs: number;
    pending_payments: number;
    paid_payments: number;
  };
  recent_deliveries: Delivery[];
}

export interface PaginatedResponse<T> {
  count: number;
  page: number;
  page_size: number;
  results: T[];
}