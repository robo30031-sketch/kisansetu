import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  Farm,
  Field,
  CropCycle,
  FinancialEntry,
  FarmTask,
  InventoryItem,
  StockMovement,
  Profile,
} from '../types';

// Sandbox Local Storage Keys
const STORAGE_PREFIX = 'kisansetu_db_';
const getKey = (table: string) => `${STORAGE_PREFIX}${table}`;

// Seed data for initial sandbox testing
const INITIAL_FARM: Farm = {
  id: 'f1111111-1111-1111-1111-111111111111',
  owner_id: '00000000-0000-0000-0000-000000000001',
  name: 'KisanSetu Adarsh Farm',
  state_code: 'MP',
  district_name: 'Hoshangabad (Narmadapuram)',
  village: 'Babai',
  area: 8.5,
  area_unit: 'acres',
  notes: 'Fertile black soil near canal irrigation network.',
  created_at: new Date('2026-06-01').toISOString(),
  updated_at: new Date('2026-06-01').toISOString(),
};

const INITIAL_FIELDS: Field[] = [
  {
    id: 'fl111111-1111-1111-1111-111111111111',
    owner_id: '00000000-0000-0000-0000-000000000001',
    farm_id: 'f1111111-1111-1111-1111-111111111111',
    name: 'North Tubewell Plot',
    area: 5.0,
    area_unit: 'acres',
    notes: 'Well-leveled with drip irrigation access.',
    created_at: new Date('2026-06-02').toISOString(),
  },
  {
    id: 'fl222222-2222-2222-2222-222222222222',
    owner_id: '00000000-0000-0000-0000-000000000001',
    farm_id: 'f1111111-1111-1111-1111-111111111111',
    name: 'Roadside Field',
    area: 3.5,
    area_unit: 'acres',
    notes: 'Direct access to main village road.',
    created_at: new Date('2026-06-02').toISOString(),
  },
];

const INITIAL_CROPS: CropCycle[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    owner_id: '00000000-0000-0000-0000-000000000001',
    farm_id: 'f1111111-1111-1111-1111-111111111111',
    field_id: 'fl111111-1111-1111-1111-111111111111',
    crop_name: 'Sharbati Wheat (गेहूं)',
    variety: 'C-306 Sharbati',
    season: 'Rabi',
    sowing_date: '2026-10-15',
    expected_harvest_date: '2027-03-25',
    status: 'growing',
    notes: 'Certified organic certified seed with bio-fertilizers.',
    created_at: new Date('2026-10-15').toISOString(),
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    owner_id: '00000000-0000-0000-0000-000000000001',
    farm_id: 'f1111111-1111-1111-1111-111111111111',
    field_id: 'fl222222-2222-2222-2222-222222222222',
    crop_name: 'Mustard (सरसों)',
    variety: 'Pusa Bold',
    season: 'Rabi',
    sowing_date: '2026-10-05',
    expected_harvest_date: '2027-02-20',
    status: 'growing',
    notes: 'Intercropped along borders.',
    created_at: new Date('2026-10-05').toISOString(),
  },
];

const INITIAL_ENTRIES: FinancialEntry[] = [
  {
    id: 'e1111111-1111-1111-1111-111111111111',
    owner_id: '00000000-0000-0000-0000-000000000001',
    farm_id: 'f1111111-1111-1111-1111-111111111111',
    crop_cycle_id: 'c1111111-1111-1111-1111-111111111111',
    entry_type: 'expense',
    category: 'seeds',
    amount: 6800,
    entry_date: '2026-10-12',
    description: '4 bags certified Sharbati seed from Kisan Kendra',
    payment_method: 'UPI',
    created_at: new Date('2026-10-12').toISOString(),
  },
  {
    id: 'e2222222-2222-2222-2222-222222222222',
    owner_id: '00000000-0000-0000-0000-000000000001',
    farm_id: 'f1111111-1111-1111-1111-111111111111',
    crop_cycle_id: 'c1111111-1111-1111-1111-111111111111',
    entry_type: 'expense',
    category: 'fertilizer',
    amount: 4200,
    entry_date: '2026-10-18',
    description: 'DAP and Neem coated Urea bags',
    payment_method: 'Cash',
    created_at: new Date('2026-10-18').toISOString(),
  },
  {
    id: 'e3333333-3333-3333-3333-333333333333',
    owner_id: '00000000-0000-0000-0000-000000000001',
    farm_id: 'f1111111-1111-1111-1111-111111111111',
    crop_cycle_id: 'c1111111-1111-1111-1111-111111111111',
    entry_type: 'expense',
    category: 'labour',
    amount: 3500,
    entry_date: '2026-10-22',
    description: 'Sowing and leveling field labour wages',
    payment_method: 'Cash',
    created_at: new Date('2026-10-22').toISOString(),
  },
  {
    id: 'e4444444-4444-4444-4444-444444444444',
    owner_id: '00000000-0000-0000-0000-000000000001',
    farm_id: 'f1111111-1111-1111-1111-111111111111',
    entry_type: 'income',
    category: 'crop_sale',
    amount: 54000,
    entry_date: '2026-10-02',
    description: 'Previous season Soybean produce sold at Mandi',
    payment_method: 'Bank Transfer',
    created_at: new Date('2026-10-02').toISOString(),
  },
];

const INITIAL_TASKS: FarmTask[] = [
  {
    id: 't1111111-1111-1111-1111-111111111111',
    owner_id: '00000000-0000-0000-0000-000000000001',
    farm_id: 'f1111111-1111-1111-1111-111111111111',
    crop_cycle_id: 'c1111111-1111-1111-1111-111111111111',
    title: 'First irrigation (Crown Root Initiation) for Wheat',
    notes: '21 days after sowing. Ensure even water distribution.',
    due_date: new Date().toISOString().split('T')[0], // Due today!
    status: 'pending',
    created_at: new Date().toISOString(),
  },
  {
    id: 't2222222-2222-2222-2222-222222222222',
    owner_id: '00000000-0000-0000-0000-000000000001',
    farm_id: 'f1111111-1111-1111-1111-111111111111',
    crop_cycle_id: 'c2222222-2222-2222-2222-222222222222',
    title: 'Weed inspection on Mustard boundary',
    notes: 'Check for early aphid or white rust signs.',
    due_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    status: 'pending',
    created_at: new Date().toISOString(),
  },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'i1111111-1111-1111-1111-111111111111',
    owner_id: '00000000-0000-0000-0000-000000000001',
    farm_id: 'f1111111-1111-1111-1111-111111111111',
    name: 'DAP Fertilizer (50 kg bags)',
    category: 'fertilizer',
    quantity: 3,
    unit: 'Bags',
    low_stock_threshold: 5, // Trigger low stock alert!
    notes: 'IFFCO brand stock in shed',
    created_at: new Date('2026-10-01').toISOString(),
  },
  {
    id: 'i2222222-2222-2222-2222-222222222222',
    owner_id: '00000000-0000-0000-0000-000000000001',
    farm_id: 'f1111111-1111-1111-1111-111111111111',
    name: 'Neem Coated Urea (45 kg bags)',
    category: 'fertilizer',
    quantity: 12,
    unit: 'Bags',
    low_stock_threshold: 4,
    notes: 'Stored on wooden pallets to prevent dampness',
    created_at: new Date('2026-10-01').toISOString(),
  },
  {
    id: 'i3333333-3333-3333-3333-333333333333',
    owner_id: '00000000-0000-0000-0000-000000000001',
    farm_id: 'f1111111-1111-1111-1111-111111111111',
    name: 'Tractor Diesel Fuel',
    category: 'fuel',
    quantity: 45,
    unit: 'Litres',
    low_stock_threshold: 20,
    notes: 'Safe fuel storage drum',
    created_at: new Date('2026-10-05').toISOString(),
  },
];

const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: 'm1111111-1111-1111-1111-111111111111',
    owner_id: '00000000-0000-0000-0000-000000000001',
    inventory_item_id: 'i1111111-1111-1111-1111-111111111111',
    movement_type: 'purchase',
    quantity_delta: 5,
    movement_date: '2026-10-05',
    notes: 'Initial procurement for Rabi season',
    created_at: new Date('2026-10-05').toISOString(),
  },
  {
    id: 'm2222222-2222-2222-2222-222222222222',
    owner_id: '00000000-0000-0000-0000-000000000001',
    inventory_item_id: 'i1111111-1111-1111-1111-111111111111',
    movement_type: 'usage',
    quantity_delta: -2,
    movement_date: '2026-10-16',
    notes: 'Applied during wheat sowing',
    created_at: new Date('2026-10-16').toISOString(),
  },
];

// Sandbox Storage Helpers
function readStorage<T>(table: string, defaults: T[]): T[] {
  try {
    const raw = localStorage.getItem(getKey(table));
    if (!raw) {
      localStorage.setItem(getKey(table), JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${table} from sandbox storage`, err);
    return defaults;
  }
}

function writeStorage<T>(table: string, items: T[]): void {
  try {
    localStorage.setItem(getKey(table), JSON.stringify(items));
  } catch (err) {
    console.error(`Error writing ${table} to sandbox storage`, err);
  }
}

export const dbService = {
  // -------------------------------------------------------------
  // PROFILES
  // -------------------------------------------------------------
  async getProfile(userId: string): Promise<Profile | null> {
    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        console.warn('Profile fetch error', error);
        return null;
      }
      return data;
    }

    const profiles = readStorage<Profile>('profiles', [
      {
        id: userId,
        full_name: 'Ramesh Patel',
        preferred_language: 'hi',
        state_code: 'MP',
        district_name: 'Hoshangabad (Narmadapuram)',
      },
    ]);
    return profiles.find((p) => p.id === userId) || null;
  },

  async updateProfile(profile: Partial<Profile> & { id: string }): Promise<Profile> {
    const updated = {
      ...profile,
      updated_at: new Date().toISOString(),
    };

    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(updated)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const profiles = readStorage<Profile>('profiles', []);
    const idx = profiles.findIndex((p) => p.id === profile.id);
    let result: Profile;
    if (idx >= 0) {
      result = { ...profiles[idx], ...updated } as Profile;
      profiles[idx] = result;
    } else {
      result = {
        full_name: 'Farmer',
        preferred_language: 'hi',
        ...updated,
      } as Profile;
      profiles.push(result);
    }
    writeStorage('profiles', profiles);
    return result;
  },

  // -------------------------------------------------------------
  // FARMS
  // -------------------------------------------------------------
  async getFarms(ownerId: string): Promise<Farm[]> {
    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('farms')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }

    const farms = readStorage<Farm>('farms', [INITIAL_FARM]);
    return farms.filter((f) => f.owner_id === ownerId);
  },

  async createFarm(farm: Omit<Farm, 'id' | 'created_at' | 'updated_at'>): Promise<Farm> {
    if (farm.area < 0) throw new Error('Farm area cannot be negative');
    if (!farm.name || farm.name.trim().length === 0) throw new Error('Farm name is required');

    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('farms')
        .insert([farm])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const newFarm: Farm = {
      ...farm,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const farms = readStorage<Farm>('farms', [INITIAL_FARM]);
    farms.unshift(newFarm);
    writeStorage('farms', farms);
    return newFarm;
  },

  async updateFarm(id: string, farm: Partial<Farm>, ownerId: string): Promise<Farm> {
    if (farm.area !== undefined && farm.area < 0) {
      throw new Error('Farm area cannot be negative');
    }

    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('farms')
        .update({ ...farm, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('owner_id', ownerId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const farms = readStorage<Farm>('farms', [INITIAL_FARM]);
    const idx = farms.findIndex((f) => f.id === id && f.owner_id === ownerId);
    if (idx === -1) throw new Error('Farm not found');
    const updated = { ...farms[idx], ...farm, updated_at: new Date().toISOString() };
    farms[idx] = updated;
    writeStorage('farms', farms);
    return updated;
  },

  async deleteFarm(id: string, ownerId: string): Promise<void> {
    if (supabase && isSupabaseConfigured()) {
      const { error } = await supabase
        .from('farms')
        .delete()
        .eq('id', id)
        .eq('owner_id', ownerId);
      if (error) throw error;
      return;
    }

    // Cascade delete in sandbox
    const farms = readStorage<Farm>('farms', [INITIAL_FARM]).filter((f) => !(f.id === id && f.owner_id === ownerId));
    writeStorage('farms', farms);

    const fields = readStorage<Field>('fields', INITIAL_FIELDS).filter((f) => f.farm_id !== id);
    writeStorage('fields', fields);

    const crops = readStorage<CropCycle>('crop_cycles', INITIAL_CROPS).filter((c) => c.farm_id !== id);
    writeStorage('crop_cycles', crops);

    const entries = readStorage<FinancialEntry>('financial_entries', INITIAL_ENTRIES).filter((e) => e.farm_id !== id);
    writeStorage('financial_entries', entries);

    const tasks = readStorage<FarmTask>('farm_tasks', INITIAL_TASKS).filter((t) => t.farm_id !== id);
    writeStorage('farm_tasks', tasks);

    const inventory = readStorage<InventoryItem>('inventory_items', INITIAL_INVENTORY).filter((i) => i.farm_id !== id);
    writeStorage('inventory_items', inventory);
  },

  // -------------------------------------------------------------
  // FIELDS
  // -------------------------------------------------------------
  async getFields(farmId: string, ownerId: string): Promise<Field[]> {
    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .eq('farm_id', farmId)
        .eq('owner_id', ownerId)
        .order('name');
      if (error) throw error;
      return data || [];
    }

    const fields = readStorage<Field>('fields', INITIAL_FIELDS);
    return fields.filter((f) => f.farm_id === farmId && f.owner_id === ownerId);
  },

  async createField(field: Omit<Field, 'id' | 'created_at' | 'updated_at'>): Promise<Field> {
    if (field.area <= 0) throw new Error('Field area must be greater than 0');
    if (!field.name?.trim()) throw new Error('Field name is required');

    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('fields')
        .insert([field])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const newField: Field = {
      ...field,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const fields = readStorage<Field>('fields', INITIAL_FIELDS);
    fields.push(newField);
    writeStorage('fields', fields);
    return newField;
  },

  async deleteField(id: string, ownerId: string): Promise<void> {
    if (supabase && isSupabaseConfigured()) {
      const { error } = await supabase
        .from('fields')
        .delete()
        .eq('id', id)
        .eq('owner_id', ownerId);
      if (error) throw error;
      return;
    }

    const fields = readStorage<Field>('fields', INITIAL_FIELDS).filter((f) => !(f.id === id && f.owner_id === ownerId));
    writeStorage('fields', fields);
  },

  // -------------------------------------------------------------
  // CROP CYCLES
  // -------------------------------------------------------------
  async getCrops(ownerId: string, farmId?: string): Promise<CropCycle[]> {
    if (supabase && isSupabaseConfigured()) {
      let query = supabase.from('crop_cycles').select('*').eq('owner_id', ownerId);
      if (farmId) query = query.eq('farm_id', farmId);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }

    const crops = readStorage<CropCycle>('crop_cycles', INITIAL_CROPS);
    return crops.filter((c) => c.owner_id === ownerId && (!farmId || c.farm_id === farmId));
  },

  async createCrop(crop: Omit<CropCycle, 'id' | 'created_at' | 'updated_at'>): Promise<CropCycle> {
    if (!crop.crop_name?.trim()) throw new Error('Crop name is required');
    if (crop.sowing_date && crop.expected_harvest_date) {
      if (new Date(crop.expected_harvest_date) < new Date(crop.sowing_date)) {
        throw new Error('Expected harvest date cannot be earlier than sowing date');
      }
    }

    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('crop_cycles')
        .insert([crop])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const newCrop: CropCycle = {
      ...crop,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const crops = readStorage<CropCycle>('crop_cycles', INITIAL_CROPS);
    crops.unshift(newCrop);
    writeStorage('crop_cycles', crops);
    return newCrop;
  },

  async updateCrop(id: string, crop: Partial<CropCycle>, ownerId: string): Promise<CropCycle> {
    if (crop.sowing_date && crop.expected_harvest_date) {
      if (new Date(crop.expected_harvest_date) < new Date(crop.sowing_date)) {
        throw new Error('Expected harvest date cannot be earlier than sowing date');
      }
    }

    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('crop_cycles')
        .update({ ...crop, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('owner_id', ownerId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const crops = readStorage<CropCycle>('crop_cycles', INITIAL_CROPS);
    const idx = crops.findIndex((c) => c.id === id && c.owner_id === ownerId);
    if (idx === -1) throw new Error('Crop cycle not found');
    const updated = { ...crops[idx], ...crop, updated_at: new Date().toISOString() };
    crops[idx] = updated;
    writeStorage('crop_cycles', crops);
    return updated;
  },

  async deleteCrop(id: string, ownerId: string): Promise<void> {
    if (supabase && isSupabaseConfigured()) {
      const { error } = await supabase
        .from('crop_cycles')
        .delete()
        .eq('id', id)
        .eq('owner_id', ownerId);
      if (error) throw error;
      return;
    }

    const crops = readStorage<CropCycle>('crop_cycles', INITIAL_CROPS).filter((c) => !(c.id === id && c.owner_id === ownerId));
    writeStorage('crop_cycles', crops);
  },

  // -------------------------------------------------------------
  // FINANCIAL ENTRIES
  // -------------------------------------------------------------
  async getFinancialEntries(
    ownerId: string,
    filters?: { farmId?: string; cropId?: string; category?: string; startDate?: string; endDate?: string }
  ): Promise<FinancialEntry[]> {
    if (supabase && isSupabaseConfigured()) {
      let query = supabase.from('financial_entries').select('*').eq('owner_id', ownerId);
      if (filters?.farmId) query = query.eq('farm_id', filters.farmId);
      if (filters?.cropId) query = query.eq('crop_cycle_id', filters.cropId);
      if (filters?.category) query = query.eq('category', filters.category);
      if (filters?.startDate) query = query.gte('entry_date', filters.startDate);
      if (filters?.endDate) query = query.lte('entry_date', filters.endDate);
      const { data, error } = await query.order('entry_date', { ascending: false });
      if (error) throw error;
      return data || [];
    }

    let entries = readStorage<FinancialEntry>('financial_entries', INITIAL_ENTRIES).filter((e) => e.owner_id === ownerId);
    if (filters?.farmId) entries = entries.filter((e) => e.farm_id === filters.farmId);
    if (filters?.cropId) entries = entries.filter((e) => e.crop_cycle_id === filters.cropId);
    if (filters?.category) entries = entries.filter((e) => e.category === filters.category);
    if (filters?.startDate) entries = entries.filter((e) => e.entry_date >= filters.startDate!);
    if (filters?.endDate) entries = entries.filter((e) => e.entry_date <= filters.endDate!);
    return entries.sort((a, b) => b.entry_date.localeCompare(a.entry_date));
  },

  async createFinancialEntry(entry: Omit<FinancialEntry, 'id' | 'created_at' | 'updated_at'>): Promise<FinancialEntry> {
    if (entry.amount <= 0) throw new Error('Amount must be positive');
    if (!entry.entry_date) throw new Error('Date is required');

    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('financial_entries')
        .insert([entry])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const newEntry: FinancialEntry = {
      ...entry,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const entries = readStorage<FinancialEntry>('financial_entries', INITIAL_ENTRIES);
    entries.unshift(newEntry);
    writeStorage('financial_entries', entries);
    return newEntry;
  },

  async updateFinancialEntry(id: string, entry: Partial<FinancialEntry>, ownerId: string): Promise<FinancialEntry> {
    if (entry.amount !== undefined && entry.amount <= 0) {
      throw new Error('Amount must be positive');
    }

    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('financial_entries')
        .update({ ...entry, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('owner_id', ownerId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const entries = readStorage<FinancialEntry>('financial_entries', INITIAL_ENTRIES);
    const idx = entries.findIndex((e) => e.id === id && e.owner_id === ownerId);
    if (idx === -1) throw new Error('Entry not found');
    const updated = { ...entries[idx], ...entry, updated_at: new Date().toISOString() };
    entries[idx] = updated;
    writeStorage('financial_entries', entries);
    return updated;
  },

  async deleteFinancialEntry(id: string, ownerId: string): Promise<void> {
    if (supabase && isSupabaseConfigured()) {
      const { error } = await supabase
        .from('financial_entries')
        .delete()
        .eq('id', id)
        .eq('owner_id', ownerId);
      if (error) throw error;
      return;
    }

    const entries = readStorage<FinancialEntry>('financial_entries', INITIAL_ENTRIES).filter((e) => !(e.id === id && e.owner_id === ownerId));
    writeStorage('financial_entries', entries);
  },

  // -------------------------------------------------------------
  // TASKS
  // -------------------------------------------------------------
  async getTasks(ownerId: string, farmId?: string): Promise<FarmTask[]> {
    if (supabase && isSupabaseConfigured()) {
      let query = supabase.from('farm_tasks').select('*').eq('owner_id', ownerId);
      if (farmId) query = query.eq('farm_id', farmId);
      const { data, error } = await query.order('due_date', { ascending: true });
      if (error) throw error;
      return data || [];
    }

    const tasks = readStorage<FarmTask>('farm_tasks', INITIAL_TASKS);
    return tasks
      .filter((t) => t.owner_id === ownerId && (!farmId || t.farm_id === farmId))
      .sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''));
  },

  async createTask(task: Omit<FarmTask, 'id' | 'created_at' | 'updated_at'>): Promise<FarmTask> {
    if (!task.title?.trim()) throw new Error('Task title is required');

    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('farm_tasks')
        .insert([task])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const newTask: FarmTask = {
      ...task,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const tasks = readStorage<FarmTask>('farm_tasks', INITIAL_TASKS);
    tasks.unshift(newTask);
    writeStorage('farm_tasks', tasks);
    return newTask;
  },

  async updateTask(id: string, task: Partial<FarmTask>, ownerId: string): Promise<FarmTask> {
    const payload = {
      ...task,
      completed_at: task.status === 'completed' ? new Date().toISOString() : task.status ? null : undefined,
      updated_at: new Date().toISOString(),
    };

    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('farm_tasks')
        .update(payload)
        .eq('id', id)
        .eq('owner_id', ownerId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const tasks = readStorage<FarmTask>('farm_tasks', INITIAL_TASKS);
    const idx = tasks.findIndex((t) => t.id === id && t.owner_id === ownerId);
    if (idx === -1) throw new Error('Task not found');
    const updated = { ...tasks[idx], ...payload };
    tasks[idx] = updated;
    writeStorage('farm_tasks', tasks);
    return updated;
  },

  async deleteTask(id: string, ownerId: string): Promise<void> {
    if (supabase && isSupabaseConfigured()) {
      const { error } = await supabase
        .from('farm_tasks')
        .delete()
        .eq('id', id)
        .eq('owner_id', ownerId);
      if (error) throw error;
      return;
    }

    const tasks = readStorage<FarmTask>('farm_tasks', INITIAL_TASKS).filter((t) => !(t.id === id && t.owner_id === ownerId));
    writeStorage('farm_tasks', tasks);
  },

  // -------------------------------------------------------------
  // INVENTORY ITEMS & MOVEMENTS (TRANSACTION SAFE)
  // -------------------------------------------------------------
  async getInventory(ownerId: string, farmId?: string): Promise<InventoryItem[]> {
    if (supabase && isSupabaseConfigured()) {
      let query = supabase.from('inventory_items').select('*').eq('owner_id', ownerId);
      if (farmId) query = query.eq('farm_id', farmId);
      const { data, error } = await query.order('name');
      if (error) throw error;
      return data || [];
    }

    const items = readStorage<InventoryItem>('inventory_items', INITIAL_INVENTORY);
    return items.filter((i) => i.owner_id === ownerId && (!farmId || i.farm_id === farmId));
  },

  async createInventoryItem(item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryItem> {
    if (!item.name?.trim()) throw new Error('Item name is required');
    if (item.quantity < 0) throw new Error('Initial quantity cannot be negative');

    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([item])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const newItem: InventoryItem = {
      ...item,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const items = readStorage<InventoryItem>('inventory_items', INITIAL_INVENTORY);
    items.unshift(newItem);
    writeStorage('inventory_items', items);
    return newItem;
  },

  async updateInventoryItem(id: string, item: Partial<InventoryItem>, ownerId: string): Promise<InventoryItem> {
    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('inventory_items')
        .update({ ...item, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('owner_id', ownerId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const items = readStorage<InventoryItem>('inventory_items', INITIAL_INVENTORY);
    const idx = items.findIndex((i) => i.id === id && i.owner_id === ownerId);
    if (idx === -1) throw new Error('Item not found');
    const updated = { ...items[idx], ...item, updated_at: new Date().toISOString() };
    items[idx] = updated;
    writeStorage('inventory_items', items);
    return updated;
  },

  async deleteInventoryItem(id: string, ownerId: string): Promise<void> {
    if (supabase && isSupabaseConfigured()) {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id)
        .eq('owner_id', ownerId);
      if (error) throw error;
      return;
    }

    const items = readStorage<InventoryItem>('inventory_items', INITIAL_INVENTORY).filter((i) => !(i.id === id && i.owner_id === ownerId));
    writeStorage('inventory_items', items);

    const movements = readStorage<StockMovement>('stock_movements', INITIAL_MOVEMENTS).filter((m) => m.inventory_item_id !== id);
    writeStorage('stock_movements', movements);
  },

  async getStockMovements(itemId: string, ownerId: string): Promise<StockMovement[]> {
    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('stock_movements')
        .select('*')
        .eq('inventory_item_id', itemId)
        .eq('owner_id', ownerId)
        .order('movement_date', { ascending: false });
      if (error) throw error;
      return data || [];
    }

    const movements = readStorage<StockMovement>('stock_movements', INITIAL_MOVEMENTS);
    return movements.filter((m) => m.inventory_item_id === itemId && m.owner_id === ownerId);
  },

  // Safe Transactional Stock Movement Operation
  async recordStockMovement(params: {
    itemId: string;
    movementType: 'purchase' | 'usage' | 'adjustment' | 'return';
    quantityDelta: number;
    movementDate: string;
    notes?: string;
    ownerId: string;
  }): Promise<{ newQuantity: number }> {
    const { itemId, movementType, quantityDelta, movementDate, notes, ownerId } = params;

    // Supabase RPC execution
    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase.rpc('record_stock_movement', {
        p_item_id: itemId,
        p_movement_type: movementType,
        p_quantity_delta: quantityDelta,
        p_movement_date: movementDate,
        p_notes: notes || null,
      });
      if (error) throw error;
      return { newQuantity: data.new_quantity };
    }

    // Local atomic transaction logic
    const items = readStorage<InventoryItem>('inventory_items', INITIAL_INVENTORY);
    const item = items.find((i) => i.id === itemId && i.owner_id === ownerId);
    if (!item) throw new Error('Inventory item not found');

    const nextQty = item.quantity + quantityDelta;
    if (nextQty < 0) {
      throw new Error(`Insufficient stock. Current: ${item.quantity} ${item.unit}, requested delta: ${quantityDelta}`);
    }

    item.quantity = nextQty;
    item.updated_at = new Date().toISOString();
    writeStorage('inventory_items', items);

    const movements = readStorage<StockMovement>('stock_movements', INITIAL_MOVEMENTS);
    const newMovement: StockMovement = {
      id: crypto.randomUUID(),
      owner_id: ownerId,
      inventory_item_id: itemId,
      movement_type: movementType,
      quantity_delta: quantityDelta,
      movement_date: movementDate,
      notes,
      created_at: new Date().toISOString(),
    };
    movements.unshift(newMovement);
    writeStorage('stock_movements', movements);

    return { newQuantity: nextQty };
  },

  // Full Account Erase (Secure Documented Workflow)
  async deleteUserAccountAndData(userId: string): Promise<void> {
    if (supabase && isSupabaseConfigured()) {
      // Cascade removes all linked tables by foreign key constraints
      await supabase.from('profiles').delete().eq('id', userId);
      await supabase.auth.signOut();
      return;
    }

    // Clear local sandbox
    const tables = ['farms', 'fields', 'crop_cycles', 'financial_entries', 'farm_tasks', 'inventory_items', 'stock_movements', 'profiles'];
    tables.forEach((t) => localStorage.removeItem(getKey(t)));
    localStorage.removeItem('kisansetu_sandbox_user');
    localStorage.removeItem('kisansetu_sandbox_profile');
  },
};
