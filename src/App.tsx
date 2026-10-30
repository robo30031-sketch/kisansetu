import React, { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import { dbService } from './services/db';
import {
  Farm,
  Field,
  CropCycle,
  FinancialEntry,
  FarmTask,
  InventoryItem,
  StockMovement,
  Profile,
  StockMovementType,
  AreaUnit,
} from './types';
import {
  ALL_TRANSLATIONS,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  getTranslation,
  getLanguageDir,
} from './locales';
import { Navigation, ActiveTab } from './components/Navigation';
import { DashboardView } from './features/dashboard/DashboardView';
import { FarmsView } from './features/farms/FarmsView';
import { CropsView } from './features/crops/CropsView';
import { LedgerView } from './features/ledger/LedgerView';
import { TasksView } from './features/tasks/TasksView';
import { InventoryView } from './features/inventory/InventoryView';
import { ReportsView } from './features/reports/ReportsView';
import { SettingsView } from './features/settings/SettingsView';
import { AuthView } from './features/auth/AuthView';
import { LoadingState } from './components/CommonUI';

export function App() {
  const isConfigured = isSupabaseConfigured();

  // Auth & Session — Starts null so user sees the pre-applied showcase and sign-in options
  const [sessionUser, setSessionUser] = useState<{
    id: string;
    email?: string;
    isSampleDemo?: boolean;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('kisansetu_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return null;
  });

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // App Navigation & Language
  const [currentTab, setCurrentTab] = useState<ActiveTab>('home');
  const [currentLanguage, setCurrentLanguage] = useState<string>(DEFAULT_LANGUAGE);

  // Data collections
  const [farms, setFarms] = useState<Farm[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [crops, setCrops] = useState<CropCycle[]>([]);
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [tasks, setTasks] = useState<FarmTask[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Get active translation dictionary
  const t = getTranslation(currentLanguage);

  // Apply language and text direction to HTML root
  const applyLanguage = (code: string) => {
    setCurrentLanguage(code);
    const dir = getLanguageDir(code);
    document.documentElement.dir = dir;
    document.documentElement.lang = code;
  };

  // 1. Initial Authentication Check
  useEffect(() => {
    const initAuth = async () => {
      setIsAuthLoading(true);

      if (supabase && isConfigured) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            const userObj = {
              id: data.session.user.id,
              email: data.session.user.email,
              isSampleDemo: false,
            };
            setSessionUser(userObj);
            localStorage.setItem('kisansetu_current_user', JSON.stringify(userObj));
            const userProfile = await dbService.getProfile(data.session.user.id);
            if (userProfile) {
              setProfile(userProfile);
              if (userProfile.preferred_language) {
                applyLanguage(userProfile.preferred_language);
              }
            }
          }
        } catch (err) {
          console.warn('Error fetching Supabase session', err);
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(async (_, session) => {
          if (session?.user) {
            const userObj = {
              id: session.user.id,
              email: session.user.email,
              isSampleDemo: false,
            };
            setSessionUser(userObj);
            localStorage.setItem('kisansetu_current_user', JSON.stringify(userObj));
            const userProfile = await dbService.getProfile(session.user.id);
            if (userProfile) {
              setProfile(userProfile);
              if (userProfile.preferred_language) {
                applyLanguage(userProfile.preferred_language);
              }
            }
          } else {
            setSessionUser(null);
            setProfile(null);
            localStorage.removeItem('kisansetu_current_user');
          }
        });

        setIsAuthLoading(false);
        return () => {
          authListener.subscription.unsubscribe();
        };
      } else {
        // Local state
        if (sessionUser) {
          const p = await dbService.getProfile(sessionUser.id);
          if (p) {
            setProfile(p);
            if (p.preferred_language) applyLanguage(p.preferred_language);
          }
        }
        setIsAuthLoading(false);
      }
    };

    initAuth();
  }, [isConfigured]);

  // 2. Fetch User Data whenever sessionUser is present
  const loadAllData = useCallback(async () => {
    if (!sessionUser) return;
    setIsDataLoading(true);
    try {
      const [fetchedFarms, fetchedCrops, fetchedEntries, fetchedTasks, fetchedInventory] =
        await Promise.all([
          dbService.getFarms(sessionUser.id),
          dbService.getCrops(sessionUser.id),
          dbService.getFinancialEntries(sessionUser.id),
          dbService.getTasks(sessionUser.id),
          dbService.getInventory(sessionUser.id),
        ]);

      setFarms(fetchedFarms);
      setCrops(fetchedCrops);
      setEntries(fetchedEntries);
      setTasks(fetchedTasks);
      setInventory(fetchedInventory);

      // Fetch fields for all farms
      if (fetchedFarms.length > 0) {
        const fieldPromises = fetchedFarms.map((f) => dbService.getFields(f.id, sessionUser.id));
        const fieldsNested = await Promise.all(fieldPromises);
        setFields(fieldsNested.flat());
      } else {
        setFields([]);
      }
    } catch (err) {
      console.error('Error fetching farm records', err);
    } finally {
      setIsDataLoading(false);
    }
  }, [sessionUser]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Explore Pre-applied Sample Farm
  const handleExploreSample = async () => {
    const sampleUser = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'sample.farmer@kisansetu.in',
      isSampleDemo: true,
    };
    setSessionUser(sampleUser);
    localStorage.setItem('kisansetu_current_user', JSON.stringify(sampleUser));
    const p = await dbService.getProfile(sampleUser.id);
    if (p) {
      setProfile(p);
      if (p.preferred_language) applyLanguage(p.preferred_language);
    }
  };

  // Farmer Quick Clean Entry (Starts 100% empty)
  const handleQuickCleanEntry = async (name: string, lang: string) => {
    const cleanUserId = `farmer_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cleanUser = {
      id: cleanUserId,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@kisansetu.in`,
      isSampleDemo: false,
    };
    setSessionUser(cleanUser);
    localStorage.setItem('kisansetu_current_user', JSON.stringify(cleanUser));

    const newProfile = await dbService.updateProfile({
      id: cleanUserId,
      full_name: name,
      preferred_language: lang,
    });
    setProfile(newProfile);
    applyLanguage(lang);
    setCurrentTab('home');
  };

  // Auth Operations
  const handleSignIn = async (email: string, pass: string) => {
    if (supabase && isConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) throw error;
      if (data.user) {
        const userObj = { id: data.user.id, email: data.user.email, isSampleDemo: false };
        setSessionUser(userObj);
        localStorage.setItem('kisansetu_current_user', JSON.stringify(userObj));
        const p = await dbService.getProfile(data.user.id);
        if (p) {
          setProfile(p);
          if (p.preferred_language) applyLanguage(p.preferred_language);
        }
      }
    } else {
      // Local Sandbox login: Clean empty account derived from farmer email
      const safeId = `farmer_${btoa(email.toLowerCase()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}`;
      const cleanUser = { id: safeId, email, isSampleDemo: false };
      setSessionUser(cleanUser);
      localStorage.setItem('kisansetu_current_user', JSON.stringify(cleanUser));

      let p = await dbService.getProfile(safeId);
      if (!p) {
        const username = email.split('@')[0];
        p = await dbService.updateProfile({
          id: safeId,
          full_name: username.charAt(0).toUpperCase() + username.slice(1),
          preferred_language: currentLanguage,
        });
      }
      setProfile(p);
      if (p.preferred_language) applyLanguage(p.preferred_language);
      setCurrentTab('home');
    }
  };

  const handleSignUp = async (email: string, pass: string, name: string, lang: string) => {
    if (supabase && isConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: name,
            preferred_language: lang,
          },
        },
      });
      if (error) throw error;
      if (data.user) {
        const userObj = { id: data.user.id, email: data.user.email, isSampleDemo: false };
        setSessionUser(userObj);
        localStorage.setItem('kisansetu_current_user', JSON.stringify(userObj));
      }
    } else {
      // Local clean empty farmer registration
      const newFarmerId = `farmer_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const cleanUser = { id: newFarmerId, email, isSampleDemo: false };
      setSessionUser(cleanUser);
      localStorage.setItem('kisansetu_current_user', JSON.stringify(cleanUser));

      const p = await dbService.updateProfile({
        id: newFarmerId,
        full_name: name,
        preferred_language: lang,
      });
      setProfile(p);
      applyLanguage(lang);
      setCurrentTab('home');
    }
  };

  const handleResetPassword = async (email: string) => {
    if (supabase && isConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    }
  };

  const handleCompleteOnboarding = async (data: {
    fullName: string;
    preferredLanguage: string;
    stateCode: string;
    districtName: string;
    firstFarm: {
      name: string;
      area: number;
      unit: AreaUnit;
      village?: string;
    };
  }) => {
    if (!sessionUser) return;

    // 1. Update Profile
    const updated = await dbService.updateProfile({
      id: sessionUser.id,
      full_name: data.fullName,
      preferred_language: data.preferredLanguage,
      state_code: data.stateCode,
      district_name: data.districtName,
    });
    setProfile(updated);
    applyLanguage(data.preferredLanguage);

    // 2. Create First Farm
    await dbService.createFarm({
      owner_id: sessionUser.id,
      name: data.firstFarm.name,
      area: data.firstFarm.area,
      area_unit: data.firstFarm.unit,
      state_code: data.stateCode,
      district_name: data.districtName,
      village: data.firstFarm.village || null,
    });

    await loadAllData();
    setCurrentTab('home');
  };

  const handleSignOut = async () => {
    if (supabase && isConfigured) {
      await supabase.auth.signOut();
    }
    setSessionUser(null);
    setProfile(null);
  };

  // Database Mutation Handlers with Auto-Refresh
  const handleSaveFarm = async (farm: Partial<Farm>) => {
    if (!sessionUser) return;
    if (farm.id) {
      await dbService.updateFarm(farm.id, farm, sessionUser.id);
    } else {
      await dbService.createFarm({
        owner_id: sessionUser.id,
        name: farm.name!,
        area: farm.area!,
        area_unit: farm.area_unit || 'acres',
        state_code: farm.state_code || null,
        district_name: farm.district_name || null,
        village: farm.village || null,
        notes: farm.notes || null,
      });
    }
    await loadAllData();
  };

  const handleDeleteFarm = async (farmId: string) => {
    if (!sessionUser) return;
    await dbService.deleteFarm(farmId, sessionUser.id);
    await loadAllData();
  };

  const handleSaveField = async (field: Partial<Field>) => {
    if (!sessionUser) return;
    await dbService.createField({
      owner_id: sessionUser.id,
      farm_id: field.farm_id!,
      name: field.name!,
      area: field.area!,
      area_unit: field.area_unit || 'acres',
      notes: field.notes || null,
    });
    await loadAllData();
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!sessionUser) return;
    await dbService.deleteField(fieldId, sessionUser.id);
    await loadAllData();
  };

  const handleSaveCrop = async (crop: Partial<CropCycle>) => {
    if (!sessionUser) return;
    if (crop.id) {
      await dbService.updateCrop(crop.id, crop, sessionUser.id);
    } else {
      await dbService.createCrop({
        owner_id: sessionUser.id,
        farm_id: crop.farm_id!,
        field_id: crop.field_id || null,
        crop_name: crop.crop_name!,
        variety: crop.variety || null,
        season: crop.season || null,
        sowing_date: crop.sowing_date || null,
        expected_harvest_date: crop.expected_harvest_date || null,
        actual_harvest_date: crop.actual_harvest_date || null,
        actual_yield: crop.actual_yield ?? null,
        yield_unit: crop.yield_unit || null,
        status: crop.status || 'growing',
        notes: crop.notes || null,
      });
    }
    await loadAllData();
  };

  const handleDeleteCrop = async (cropId: string) => {
    if (!sessionUser) return;
    await dbService.deleteCrop(cropId, sessionUser.id);
    await loadAllData();
  };

  const handleSaveFinancialEntry = async (entry: Partial<FinancialEntry>) => {
    if (!sessionUser) return;
    if (entry.id) {
      await dbService.updateFinancialEntry(entry.id, entry, sessionUser.id);
    } else {
      await dbService.createFinancialEntry({
        owner_id: sessionUser.id,
        farm_id: entry.farm_id!,
        field_id: entry.field_id || null,
        crop_cycle_id: entry.crop_cycle_id || null,
        entry_type: entry.entry_type!,
        category: entry.category!,
        amount: entry.amount!,
        entry_date: entry.entry_date!,
        description: entry.description || null,
        payment_method: entry.payment_method || null,
      });
    }
    await loadAllData();
  };

  const handleDeleteFinancialEntry = async (entryId: string) => {
    if (!sessionUser) return;
    await dbService.deleteFinancialEntry(entryId, sessionUser.id);
    await loadAllData();
  };

  const handleSaveTask = async (task: Partial<FarmTask>) => {
    if (!sessionUser) return;
    if (task.id) {
      await dbService.updateTask(task.id, task, sessionUser.id);
    } else {
      await dbService.createTask({
        owner_id: sessionUser.id,
        farm_id: task.farm_id!,
        crop_cycle_id: task.crop_cycle_id || null,
        title: task.title!,
        due_date: task.due_date || null,
        status: task.status || 'pending',
        notes: task.notes || null,
      });
    }
    await loadAllData();
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!sessionUser) return;
    await dbService.deleteTask(taskId, sessionUser.id);
    await loadAllData();
  };

  const handleToggleTaskComplete = async (taskId: string, isDone: boolean) => {
    if (!sessionUser) return;
    await dbService.updateTask(
      taskId,
      { status: isDone ? 'completed' : 'pending' },
      sessionUser.id
    );
    await loadAllData();
  };

  const handleSaveInventoryItem = async (item: Partial<InventoryItem>) => {
    if (!sessionUser) return;
    if (item.id) {
      await dbService.updateInventoryItem(item.id, item, sessionUser.id);
    } else {
      await dbService.createInventoryItem({
        owner_id: sessionUser.id,
        farm_id: item.farm_id!,
        name: item.name!,
        category: item.category!,
        quantity: item.quantity ?? 0,
        unit: item.unit || 'Bags',
        low_stock_threshold: item.low_stock_threshold ?? 0,
        notes: item.notes || null,
      });
    }
    await loadAllData();
  };

  const handleDeleteInventoryItem = async (itemId: string) => {
    if (!sessionUser) return;
    await dbService.deleteInventoryItem(itemId, sessionUser.id);
    await loadAllData();
  };

  const handleRecordStockMovement = async (params: {
    itemId: string;
    movementType: StockMovementType;
    quantityDelta: number;
    movementDate: string;
    notes?: string;
  }) => {
    if (!sessionUser) return;
    await dbService.recordStockMovement({
      ...params,
      ownerId: sessionUser.id,
    });
    await loadAllData();
  };

  const handleLoadMovements = async (itemId: string) => {
    if (!sessionUser) return [];
    return await dbService.getStockMovements(itemId, sessionUser.id);
  };

  const handleDeleteAccount = async () => {
    if (!sessionUser) return;
    await dbService.deleteUserAccountAndData(sessionUser.id);
    setSessionUser(null);
    setProfile(null);
  };

  // Quick Action Handler from Dashboard
  const handleQuickAction = (action: 'expense' | 'income' | 'crop' | 'task' | 'inventory') => {
    if (action === 'expense' || action === 'income') {
      setCurrentTab('ledger');
    } else if (action === 'crop') {
      setCurrentTab('crops');
    } else if (action === 'task') {
      setCurrentTab('calendar');
    } else if (action === 'inventory') {
      setCurrentTab('inventory');
    }
  };

  // Loading Screen
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8F0] flex items-center justify-center p-4">
        <LoadingState message="Loading KisanSetu..." />
      </div>
    );
  }

  // Not signed in -> Show Auth / Welcome View with Pre-applied Information on one side
  if (!sessionUser) {
    return (
      <AuthView
        t={t}
        currentLanguage={currentLanguage}
        onSelectLanguage={applyLanguage}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onResetPassword={handleResetPassword}
        onCompleteOnboarding={handleCompleteOnboarding}
        onExploreSampleFarm={handleExploreSample}
        onQuickCleanEntry={handleQuickCleanEntry}
        isConfigured={isConfigured}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8F0] flex flex-col md:flex-row text-[#1D3027]">
      {/* Responsive Navigation (Sidebar on Desktop, Bottom bar on Mobile) */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentLanguage={currentLanguage}
        onSelectLanguage={applyLanguage}
        t={t}
        userName={profile?.full_name || 'Kisan'}
        onSignOut={handleSignOut}
        isConfigured={isConfigured}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* Sample Demo Banner if user is viewing pre-applied sample farm */}
        {sessionUser.isSampleDemo ? (
          <div className="mb-6 p-4 rounded-2xl bg-[#E6F3EA] border-2 border-[#176B43] text-xs text-[#1D3027] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#176B43] text-white">
                <span className="font-bold text-sm">🌾</span>
              </span>
              <div>
                <strong className="text-sm font-bold text-[#176B43] block">
                  Viewing Pre-applied Sample Farm (8.5 Acres • Ramesh Patel)
                </strong>
                <span className="text-[#65746A]">
                  This is a demonstration account with pre-filled sample records. To start your own clean farm, click Create Your Account.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="px-4 py-2 rounded-xl bg-[#176B43] text-white font-bold text-xs hover:bg-[#104C2F] shrink-0"
            >
              Sign In to Empty Account
            </button>
          </div>
        ) : (
          /* Real Clean Farmer Account Banner */
          !isConfigured && (
            <div className="mb-6 p-3.5 rounded-2xl bg-[#F0F8F3] border border-[#A3E3B8] text-xs text-[#1D3027] flex items-start justify-between gap-3 shadow-2xs">
              <div>
                <div className="font-bold text-[#176B43] flex items-center gap-1.5">
                  <span>🌱</span>
                  <span>Your Personal Farm Account (Clean Slate)</span>
                </div>
                <p className="mt-0.5 text-[11px] text-[#65746A]">
                  Feed your own genuine farm information below. All your added fields, crop cycles, khata entries, and supplies are private to your account.
                </p>
              </div>
            </div>
          )
        )}

        {/* Tab Router */}
        {currentTab === 'home' && (
          <DashboardView
            farms={farms}
            crops={crops}
            entries={entries}
            tasks={tasks}
            inventory={inventory}
            t={t}
            langCode={currentLanguage}
            onNavigate={setCurrentTab}
            onOpenQuickAction={handleQuickAction}
            onCompleteTask={(taskId) => handleToggleTaskComplete(taskId, true)}
          />
        )}

        {currentTab === 'farms' && (
          <FarmsView
            farms={farms}
            fields={fields}
            t={t}
            langCode={currentLanguage}
            onSaveFarm={handleSaveFarm}
            onDeleteFarm={handleDeleteFarm}
            onSaveField={handleSaveField}
            onDeleteField={handleDeleteField}
          />
        )}

        {currentTab === 'crops' && (
          <CropsView
            crops={crops}
            farms={farms}
            fields={fields}
            t={t}
            langCode={currentLanguage}
            onSaveCrop={handleSaveCrop}
            onDeleteCrop={handleDeleteCrop}
          />
        )}

        {currentTab === 'ledger' && (
          <LedgerView
            entries={entries}
            farms={farms}
            crops={crops}
            t={t}
            langCode={currentLanguage}
            onSaveEntry={handleSaveFinancialEntry}
            onDeleteEntry={handleDeleteFinancialEntry}
          />
        )}

        {currentTab === 'calendar' && (
          <TasksView
            tasks={tasks}
            farms={farms}
            crops={crops}
            t={t}
            langCode={currentLanguage}
            onSaveTask={handleSaveTask}
            onDeleteTask={handleDeleteTask}
            onToggleComplete={handleToggleTaskComplete}
          />
        )}

        {currentTab === 'inventory' && (
          <InventoryView
            items={inventory}
            movements={movements}
            farms={farms}
            t={t}
            langCode={currentLanguage}
            onSaveItem={handleSaveInventoryItem}
            onDeleteItem={handleDeleteInventoryItem}
            onRecordMovement={handleRecordStockMovement}
            onLoadMovements={handleLoadMovements}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsView
            entries={entries}
            farms={farms}
            crops={crops}
            inventory={inventory}
            t={t}
            langCode={currentLanguage}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            profile={profile}
            farms={farms}
            crops={crops}
            entries={entries}
            tasks={tasks}
            inventory={inventory}
            t={t}
            langCode={currentLanguage}
            onUpdateProfile={async (updates) => {
              if (sessionUser) {
                const updated = await dbService.updateProfile({ ...updates, id: sessionUser.id });
                setProfile(updated);
              }
            }}
            onSelectLanguage={applyLanguage}
            onSignOut={handleSignOut}
            onDeleteAccount={handleDeleteAccount}
            isConfigured={isConfigured}
          />
        )}
      </main>
    </div>
  );
}

export default App;
