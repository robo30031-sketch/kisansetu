-- ====================================================================
-- KISANSETU — INITIAL DATABASE SCHEMA MIGRATION
-- Migration: 001_initial_schema.sql
-- Description: Core tables, RLS policies, indexes, and stock movement transaction function
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. PROFILES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  state_code TEXT,
  district_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_owner_select" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_owner_insert" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_owner_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_owner_delete" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- --------------------------------------------------------------------
-- 2. FARMS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  state_code TEXT,
  district_name TEXT,
  village TEXT,
  area NUMERIC(10,2) CHECK (area IS NULL OR area >= 0),
  area_unit TEXT DEFAULT 'acres',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "farms_owner_select" ON public.farms
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "farms_owner_insert" ON public.farms
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "farms_owner_update" ON public.farms
  FOR UPDATE USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "farms_owner_delete" ON public.farms
  FOR DELETE USING (auth.uid() = owner_id);

CREATE INDEX IF NOT EXISTS idx_farms_owner ON public.farms(owner_id);

-- --------------------------------------------------------------------
-- 3. FIELDS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  area NUMERIC(10,2) NOT NULL CHECK (area > 0),
  area_unit TEXT NOT NULL DEFAULT 'acres',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fields_owner_select" ON public.fields
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "fields_owner_insert" ON public.fields
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM public.farms WHERE id = farm_id AND owner_id = auth.uid())
  );

CREATE POLICY "fields_owner_update" ON public.fields
  FOR UPDATE USING (auth.uid() = owner_id)
  WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM public.farms WHERE id = farm_id AND owner_id = auth.uid())
  );

CREATE POLICY "fields_owner_delete" ON public.fields
  FOR DELETE USING (auth.uid() = owner_id);

CREATE INDEX IF NOT EXISTS idx_fields_farm ON public.fields(farm_id);
CREATE INDEX IF NOT EXISTS idx_fields_owner ON public.fields(owner_id);

-- --------------------------------------------------------------------
-- 4. CROP CYCLES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crop_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  field_id UUID REFERENCES public.fields(id) ON DELETE SET NULL,
  crop_name TEXT NOT NULL,
  variety TEXT,
  season TEXT,
  sowing_date DATE,
  expected_harvest_date DATE,
  actual_harvest_date DATE,
  actual_yield NUMERIC(12,2) CHECK (actual_yield IS NULL OR actual_yield >= 0),
  yield_unit TEXT,
  status TEXT NOT NULL CHECK (status IN ('planned', 'growing', 'harvested', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT check_harvest_after_sowing CHECK (
    expected_harvest_date IS NULL OR sowing_date IS NULL OR expected_harvest_date >= sowing_date
  )
);

ALTER TABLE public.crop_cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crop_cycles_owner_select" ON public.crop_cycles
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "crop_cycles_owner_insert" ON public.crop_cycles
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM public.farms WHERE id = farm_id AND owner_id = auth.uid()) AND
    (field_id IS NULL OR EXISTS (SELECT 1 FROM public.fields WHERE id = field_id AND owner_id = auth.uid()))
  );

CREATE POLICY "crop_cycles_owner_update" ON public.crop_cycles
  FOR UPDATE USING (auth.uid() = owner_id)
  WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM public.farms WHERE id = farm_id AND owner_id = auth.uid()) AND
    (field_id IS NULL OR EXISTS (SELECT 1 FROM public.fields WHERE id = field_id AND owner_id = auth.uid()))
  );

CREATE POLICY "crop_cycles_owner_delete" ON public.crop_cycles
  FOR DELETE USING (auth.uid() = owner_id);

CREATE INDEX IF NOT EXISTS idx_crop_cycles_farm ON public.crop_cycles(farm_id);
CREATE INDEX IF NOT EXISTS idx_crop_cycles_status ON public.crop_cycles(status);

-- --------------------------------------------------------------------
-- 5. FINANCIAL ENTRIES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.financial_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  field_id UUID REFERENCES public.fields(id) ON DELETE SET NULL,
  crop_cycle_id UUID REFERENCES public.crop_cycles(id) ON DELETE SET NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('expense', 'income')),
  category TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  entry_date DATE NOT NULL,
  description TEXT,
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.financial_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "financial_entries_owner_select" ON public.financial_entries
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "financial_entries_owner_insert" ON public.financial_entries
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM public.farms WHERE id = farm_id AND owner_id = auth.uid())
  );

CREATE POLICY "financial_entries_owner_update" ON public.financial_entries
  FOR UPDATE USING (auth.uid() = owner_id)
  WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM public.farms WHERE id = farm_id AND owner_id = auth.uid())
  );

CREATE POLICY "financial_entries_owner_delete" ON public.financial_entries
  FOR DELETE USING (auth.uid() = owner_id);

CREATE INDEX IF NOT EXISTS idx_financial_entries_farm ON public.financial_entries(farm_id);
CREATE INDEX IF NOT EXISTS idx_financial_entries_date ON public.financial_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_financial_entries_type ON public.financial_entries(entry_type);

-- --------------------------------------------------------------------
-- 6. FARM TASKS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.farm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  field_id UUID REFERENCES public.fields(id) ON DELETE SET NULL,
  crop_cycle_id UUID REFERENCES public.crop_cycles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  notes TEXT,
  due_date DATE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.farm_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "farm_tasks_owner_select" ON public.farm_tasks
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "farm_tasks_owner_insert" ON public.farm_tasks
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM public.farms WHERE id = farm_id AND owner_id = auth.uid())
  );

CREATE POLICY "farm_tasks_owner_update" ON public.farm_tasks
  FOR UPDATE USING (auth.uid() = owner_id)
  WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM public.farms WHERE id = farm_id AND owner_id = auth.uid())
  );

CREATE POLICY "farm_tasks_owner_delete" ON public.farm_tasks
  FOR DELETE USING (auth.uid() = owner_id);

CREATE INDEX IF NOT EXISTS idx_farm_tasks_due_date ON public.farm_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_farm_tasks_status ON public.farm_tasks(status);

-- --------------------------------------------------------------------
-- 7. INVENTORY ITEMS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity NUMERIC(14,3) NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  unit TEXT NOT NULL,
  low_stock_threshold NUMERIC(14,3) NOT NULL DEFAULT 0 CHECK (low_stock_threshold >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inventory_items_owner_select" ON public.inventory_items
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "inventory_items_owner_insert" ON public.inventory_items
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM public.farms WHERE id = farm_id AND owner_id = auth.uid())
  );

CREATE POLICY "inventory_items_owner_update" ON public.inventory_items
  FOR UPDATE USING (auth.uid() = owner_id)
  WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM public.farms WHERE id = farm_id AND owner_id = auth.uid())
  );

CREATE POLICY "inventory_items_owner_delete" ON public.inventory_items
  FOR DELETE USING (auth.uid() = owner_id);

CREATE INDEX IF NOT EXISTS idx_inventory_farm ON public.inventory_items(farm_id);

-- --------------------------------------------------------------------
-- 8. STOCK MOVEMENTS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('purchase', 'usage', 'adjustment', 'return')),
  quantity_delta NUMERIC(14,3) NOT NULL,
  movement_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stock_movements_owner_select" ON public.stock_movements
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "stock_movements_owner_insert" ON public.stock_movements
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM public.inventory_items WHERE id = inventory_item_id AND owner_id = auth.uid())
  );

-- No update/delete on audit log directly
CREATE POLICY "stock_movements_owner_delete" ON public.stock_movements
  FOR DELETE USING (auth.uid() = owner_id);

CREATE INDEX IF NOT EXISTS idx_stock_movements_item ON public.stock_movements(inventory_item_id);

-- --------------------------------------------------------------------
-- 9. TRANSACTION-SAFE INVENTORY FUNCTION
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.record_stock_movement(
  p_item_id UUID,
  p_movement_type TEXT,
  p_quantity_delta NUMERIC,
  p_movement_date DATE,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_item RECORD;
  v_new_quantity NUMERIC;
  v_movement_id UUID;
  v_uid UUID;
BEGIN
  -- 1. Authenticate user
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- 2. Lock item and verify ownership
  SELECT * INTO v_item
  FROM public.inventory_items
  WHERE id = p_item_id AND owner_id = v_uid
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inventory item not found or unauthorized';
  END IF;

  -- 3. Calculate and validate new quantity
  v_new_quantity := v_item.quantity + p_quantity_delta;
  IF v_new_quantity < 0 THEN
    RAISE EXCEPTION 'Insufficient stock. Remaining quantity cannot be negative (current: %, delta: %)', v_item.quantity, p_quantity_delta;
  END IF;

  -- 4. Update quantity
  UPDATE public.inventory_items
  SET quantity = v_new_quantity,
      updated_at = timezone('utc'::text, now())
  WHERE id = p_item_id;

  -- 5. Record movement
  INSERT INTO public.stock_movements (
    owner_id,
    inventory_item_id,
    movement_type,
    quantity_delta,
    movement_date,
    notes
  )
  VALUES (
    v_uid,
    p_item_id,
    p_movement_type,
    p_quantity_delta,
    p_movement_date,
    p_notes
  )
  RETURNING id INTO v_movement_id;

  RETURN jsonb_build_object(
    'item_id', p_item_id,
    'new_quantity', v_new_quantity,
    'movement_id', v_movement_id
  );
END;
$$;

-- --------------------------------------------------------------------
-- 10. PROFILE CREATION TRIGGER ON AUTH.SIGNUP
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, preferred_language)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'preferred_language', 'en')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
