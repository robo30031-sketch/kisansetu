// KisanSetu Database & Domain Types

export type AreaUnit = 'acres' | 'hectares' | 'bigha' | 'guntha';

export type CropStatus = 'planned' | 'growing' | 'harvested' | 'cancelled';

export type EntryType = 'expense' | 'income';

export type ExpenseCategory =
  | 'seeds'
  | 'fertilizer'
  | 'labour'
  | 'irrigation'
  | 'equipment'
  | 'fuel'
  | 'transport'
  | 'land_rent'
  | 'maintenance'
  | 'other';

export type IncomeCategory =
  | 'crop_sale'
  | 'other_income';

export type TaskStatus = 'pending' | 'completed' | 'cancelled';

export type InventoryCategory =
  | 'seeds'
  | 'fertilizer'
  | 'irrigation_supplies'
  | 'tools'
  | 'fuel'
  | 'other';

export type StockMovementType = 'purchase' | 'usage' | 'adjustment' | 'return';

export interface Profile {
  id: string;
  full_name: string;
  preferred_language: string;
  state_code?: string | null;
  district_name?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Farm {
  id: string;
  owner_id: string;
  name: string;
  state_code?: string | null;
  district_name?: string | null;
  village?: string | null;
  area: number;
  area_unit: AreaUnit | string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Field {
  id: string;
  owner_id: string;
  farm_id: string;
  name: string;
  area: number;
  area_unit: AreaUnit | string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CropCycle {
  id: string;
  owner_id: string;
  farm_id: string;
  field_id?: string | null;
  crop_name: string;
  variety?: string | null;
  season?: string | null;
  sowing_date?: string | null;
  expected_harvest_date?: string | null;
  actual_harvest_date?: string | null;
  actual_yield?: number | null;
  yield_unit?: string | null;
  status: CropStatus;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface FinancialEntry {
  id: string;
  owner_id: string;
  farm_id: string;
  field_id?: string | null;
  crop_cycle_id?: string | null;
  entry_type: EntryType;
  category: ExpenseCategory | IncomeCategory | string;
  amount: number;
  entry_date: string;
  description?: string | null;
  payment_method?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface FarmTask {
  id: string;
  owner_id: string;
  farm_id: string;
  field_id?: string | null;
  crop_cycle_id?: string | null;
  title: string;
  notes?: string | null;
  due_date?: string | null;
  status: TaskStatus;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryItem {
  id: string;
  owner_id: string;
  farm_id: string;
  name: string;
  category: InventoryCategory | string;
  quantity: number;
  unit: string;
  low_stock_threshold: number;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface StockMovement {
  id: string;
  owner_id: string;
  inventory_item_id: string;
  movement_type: StockMovementType;
  quantity_delta: number;
  movement_date: string;
  notes?: string | null;
  created_at?: string;
}

export interface UserSession {
  user: {
    id: string;
    email?: string;
  } | null;
  profile: Profile | null;
}
