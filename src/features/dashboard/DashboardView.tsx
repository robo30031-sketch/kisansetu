import React from 'react';
import {
  Tractor,
  Layers,
  TrendingDown,
  TrendingUp,
  Scale,
  Calendar,
  AlertTriangle,
  Package,
  PlusCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { StatCard, StatusBadge, EmptyState } from '../../components/CommonUI';
import { SectionGuide } from '../../components/SectionGuide';
import { Farm, CropCycle, FinancialEntry, FarmTask, InventoryItem } from '../../types';
import { TranslationType } from '../../locales';

interface DashboardViewProps {
  farms: Farm[];
  crops: CropCycle[];
  entries: FinancialEntry[];
  tasks: FarmTask[];
  inventory: InventoryItem[];
  t: TranslationType;
  langCode: string;
  onNavigate: (tab: any) => void;
  onOpenQuickAction: (action: 'expense' | 'income' | 'crop' | 'task' | 'inventory') => void;
  onCompleteTask: (taskId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  farms,
  crops,
  entries,
  tasks,
  inventory,
  t,
  langCode,
  onNavigate,
  onOpenQuickAction,
  onCompleteTask,
}) => {
  // Current month calculation
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  const thisMonthEntries = entries.filter((e) => {
    const d = new Date(e.entry_date);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const monthExpenses = thisMonthEntries
    .filter((e) => e.entry_type === 'expense')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const monthIncome = thisMonthEntries
    .filter((e) => e.entry_type === 'income')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const netRecorded = monthIncome - monthExpenses;

  // Active crops
  const activeCrops = crops.filter((c) => c.status === 'growing' || c.status === 'planned');

  // Task calculations
  const todayStr = now.toISOString().split('T')[0];
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const overdueTasks = pendingTasks.filter((t) => t.due_date && t.due_date < todayStr);
  const tasksDueToday = pendingTasks.filter((t) => t.due_date === todayStr);
  const upcomingTasks = pendingTasks.filter((t) => !t.due_date || t.due_date > todayStr);

  // Low stock inventory items
  const lowStockItems = inventory.filter((i) => i.quantity <= i.low_stock_threshold);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-linear-to-r from-[#176B43] to-[#257A4E] text-white p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold mb-2">
            <span>🌿</span>
            <span>{t.brand.tagline}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {t.dashboard.title}
          </h1>
          <p className="mt-1 text-sm text-[#E6F3EA] max-w-xl">
            {farms.length === 0
              ? 'Your account is completely empty. Start by adding your first farm below.'
              : t.brand.shortDesc}
          </p>
        </div>
        {/* Subtle decorative field background */}
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none translate-x-10 translate-y-6">
          <Tractor className="w-56 h-56" />
        </div>
      </div>

      {/* When Account is Brand New and Empty: Welcome Callout */}
      {farms.length === 0 && (
        <div className="rounded-2xl border-2 border-[#A3E3B8] bg-linear-to-r from-[#F0F8F3] to-[#E6F3EA] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 font-extrabold text-[#176B43] text-sm">
              <Tractor className="w-5 h-5 text-[#176B43]" />
              <span>Clean Slate Account Ready For Your Farm Records</span>
            </div>
            <p className="text-xs text-[#1D3027] max-w-xl leading-relaxed">
              Feed your own real farm information: name your land, record crop sowing, note fertilizer purchases, and track farm supplies.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('farms')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#176B43] text-white font-bold text-sm shadow-sm hover:bg-[#104C2F] shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.farms.addNewFarm}</span>
          </button>
        </div>
      )}

      {/* Accessibility Voice & How to Use Guide */}
      <SectionGuide
        title={t.guide.title}
        langCode={langCode}
        instructions={[
          "Tap Quick Actions below to immediately record your daily expenses, mandi sales, or new tasks.",
          "Check Today's Farm Work for actions needing attention in your field.",
          "View low stock alerts to know which fertilizers or seeds to buy ahead of time.",
        ]}
      />

      {/* Quick Action Buttons */}
      <div className="rounded-2xl border border-[#D3E6DC] bg-white p-4 shadow-2xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#65746A] mb-3">
          {t.dashboard.quickActions}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <button
            type="button"
            onClick={() => onOpenQuickAction('expense')}
            className="flex items-center gap-2 p-3 rounded-xl bg-[#FDF2F2] border border-[#F8B4B4] text-[#B83B35] font-semibold text-xs sm:text-sm hover:bg-[#FCE8E8] transition-colors"
          >
            <TrendingDown className="w-4 h-4 shrink-0" />
            <span>{t.dashboard.addExpense}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenQuickAction('income')}
            className="flex items-center gap-2 p-3 rounded-xl bg-[#E6F3EA] border border-[#A3E3B8] text-[#176B43] font-semibold text-xs sm:text-sm hover:bg-[#D4EEDC] transition-colors"
          >
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span>{t.dashboard.addIncome}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenQuickAction('crop')}
            className="flex items-center gap-2 p-3 rounded-xl bg-[#F0F8F3] border border-[#D3E6DC] text-[#176B43] font-semibold text-xs sm:text-sm hover:bg-[#E6F3EA] transition-colors"
          >
            <Layers className="w-4 h-4 shrink-0 text-[#3F8F52]" />
            <span>{t.dashboard.addCrop}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenQuickAction('task')}
            className="flex items-center gap-2 p-3 rounded-xl bg-[#FEF7E6] border border-[#FBD87F] text-[#C88716] font-semibold text-xs sm:text-sm hover:bg-[#FDF0D0] transition-colors"
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{t.dashboard.addTask}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenQuickAction('inventory')}
            className="flex items-center gap-2 p-3 rounded-xl bg-[#F7F8F0] border border-[#D3E6DC] text-[#1D3027] font-semibold text-xs sm:text-sm hover:bg-[#EBF0E6] transition-colors col-span-2 sm:col-span-1"
          >
            <Package className="w-4 h-4 shrink-0 text-[#65746A]" />
            <span>{t.dashboard.addStock}</span>
          </button>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title={t.dashboard.totalFarms}
          value={farms.length}
          subtitle={`${farms.reduce((acc, f) => acc + (Number(f.area) || 0), 0).toFixed(1)} ${farms[0]?.area_unit || 'acres'}`}
          icon={<Tractor className="w-5 h-5" />}
          onClick={() => onNavigate('farms')}
        />
        <StatCard
          title={t.dashboard.activeCrops}
          value={activeCrops.length}
          subtitle={`${crops.length} total cycles`}
          icon={<Layers className="w-5 h-5" />}
          onClick={() => onNavigate('crops')}
        />
        <StatCard
          title={t.dashboard.monthExpenses}
          value={formatINR(monthExpenses)}
          subtitle={`${thisMonthEntries.filter((e) => e.entry_type === 'expense').length} entries`}
          trend="negative"
          icon={<TrendingDown className="w-5 h-5 text-[#B83B35]" />}
          onClick={() => onNavigate('ledger')}
        />
        <StatCard
          title={t.dashboard.monthIncome}
          value={formatINR(monthIncome)}
          subtitle={`Net: ${formatINR(netRecorded)}`}
          trend="positive"
          icon={<TrendingUp className="w-5 h-5 text-[#287A46]" />}
          onClick={() => onNavigate('ledger')}
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          title={t.dashboard.pendingTasks}
          value={pendingTasks.length}
          icon={<Clock className="w-5 h-5 text-[#C88716]" />}
          onClick={() => onNavigate('calendar')}
        />
        <StatCard
          title={t.dashboard.overdueTasks}
          value={overdueTasks.length}
          trend={overdueTasks.length > 0 ? 'negative' : 'neutral'}
          icon={<AlertTriangle className="w-5 h-5 text-[#B83B35]" />}
          onClick={() => onNavigate('calendar')}
        />
        <StatCard
          title={t.dashboard.lowStockItems}
          value={lowStockItems.length}
          trend={lowStockItems.length > 0 ? 'negative' : 'neutral'}
          icon={<Package className="w-5 h-5 text-[#C88716]" />}
          onClick={() => onNavigate('inventory')}
        />
      </div>

      {/* Low Stock Warnings Banner */}
      {lowStockItems.length > 0 && (
        <div className="rounded-2xl border border-[#F8B4B4] bg-[#FDF2F2] p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-[#B83B35] font-bold text-sm mb-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{t.dashboard.lowStockAlertTitle} ({lowStockItems.length})</span>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('inventory')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#F8B4B4]/60 cursor-pointer hover:bg-white/90"
              >
                <div>
                  <p className="text-xs font-bold text-[#1D3027]">{item.name}</p>
                  <p className="text-[11px] text-[#B83B35] font-semibold">
                    Stock: {item.quantity} {item.unit} (Alert at {item.low_stock_threshold})
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#B83B35]" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Farm Work Section */}
      <div className="rounded-2xl border border-[#D3E6DC] bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#176B43]" />
            <h2 className="text-base font-bold text-[#1D3027]">
              {t.dashboard.todaysWork}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('calendar')}
            className="text-xs font-semibold text-[#176B43] hover:underline flex items-center gap-1"
          >
            <span>{t.common.view} {t.nav.calendar}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {tasksDueToday.length === 0 && overdueTasks.length === 0 && upcomingTasks.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-[#F7F8F0] border border-[#D3E6DC]/60">
            <CheckCircle2 className="w-8 h-8 text-[#287A46] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#1D3027]">
              {t.dashboard.noTasksToday}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* Overdue tasks callout */}
            {overdueTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-xl border border-[#F8B4B4] bg-[#FDF2F2]"
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-white text-[#B83B35]">
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#B83B35]">{task.title}</h4>
                    <p className="text-[11px] text-[#65746A]">
                      Due Date: <span className="font-semibold text-[#B83B35]">{task.due_date}</span> (Overdue)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onCompleteTask(task.id)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#F8B4B4] text-xs font-bold text-[#176B43] hover:bg-[#E6F3EA]"
                >
                  {t.tasks.markDone}
                </button>
              </div>
            ))}

            {/* Due today tasks */}
            {tasksDueToday.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-xl border border-[#FBD87F] bg-[#FEF7E6]"
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-white text-[#C88716]">
                    <Clock className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#1D3027]">{task.title}</h4>
                    <p className="text-[11px] text-[#C88716] font-semibold">Due Today</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onCompleteTask(task.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#176B43] text-white text-xs font-bold hover:bg-[#104C2F]"
                >
                  {t.tasks.markDone}
                </button>
              </div>
            ))}

            {/* Next upcoming task preview */}
            {upcomingTasks.slice(0, 2).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-xl border border-[#D3E6DC] bg-[#F7F8F0]"
              >
                <div>
                  <h4 className="text-xs font-semibold text-[#1D3027]">{task.title}</h4>
                  <p className="text-[11px] text-[#65746A]">Due: {task.due_date || 'No fixed date'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onCompleteTask(task.id)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#D3E6DC] text-xs font-semibold text-[#176B43] hover:bg-[#E6F3EA]"
                >
                  {t.tasks.markDone}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Farms Quick Preview */}
      {farms.length === 0 && (
        <EmptyState
          title={t.farms.noFarms}
          description="Register your agricultural land to start tracking fields, crop sowing cycles, expenses, and harvest yields."
          actionText={t.farms.addNewFarm}
          onAction={() => onNavigate('farms')}
        />
      )}
    </div>
  );
};
