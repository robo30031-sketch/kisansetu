import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Layers,
  Filter,
  TrendingDown,
  TrendingUp,
  Scale,
  Package,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { FinancialEntry, Farm, CropCycle, InventoryItem } from '../../types';
import { TranslationType } from '../../locales';
import { SectionGuide } from '../../components/SectionGuide';
import { exportLedgerToCsv } from '../../utils/csvExport';

interface ReportsViewProps {
  entries: FinancialEntry[];
  farms: Farm[];
  crops: CropCycle[];
  inventory: InventoryItem[];
  t: TranslationType;
  langCode: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  entries,
  farms,
  crops,
  inventory,
  t,
  langCode,
}) => {
  const [selectedRange, setSelectedRange] = useState<'30days' | '3months' | 'year' | 'all'>('year');
  const [selectedFarm, setSelectedFarm] = useState<string>('all');

  const now = new Date();
  const filterDate = new Date();
  if (selectedRange === '30days') {
    filterDate.setDate(now.getDate() - 30);
  } else if (selectedRange === '3months') {
    filterDate.setMonth(now.getMonth() - 3);
  } else if (selectedRange === 'year') {
    filterDate.setFullYear(now.getFullYear(), 0, 1);
  }

  const rangeDateStr = filterDate.toISOString().split('T')[0];

  const filteredEntries = entries.filter((e) => {
    if (selectedFarm !== 'all' && e.farm_id !== selectedFarm) return false;
    if (selectedRange !== 'all' && e.entry_date < rangeDateStr) return false;
    return true;
  });

  const totalExpense = filteredEntries
    .filter((e) => e.entry_type === 'expense')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalIncome = filteredEntries
    .filter((e) => e.entry_type === 'income')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const recordedBalance = totalIncome - totalExpense;

  // Expense by category breakdown
  const categoryExpenseMap: Record<string, number> = {};
  filteredEntries
    .filter((e) => e.entry_type === 'expense')
    .forEach((e) => {
      categoryExpenseMap[e.category] = (categoryExpenseMap[e.category] || 0) + Number(e.amount);
    });

  const expenseChartData = Object.keys(categoryExpenseMap).map((cat) => ({
    name: cat.replace('_', ' '),
    amount: categoryExpenseMap[cat],
  }));

  // Crop-cycle financial performance
  const cropFinancialSummaries = crops.map((c) => {
    const linkedEntries = filteredEntries.filter((e) => e.crop_cycle_id === c.id);
    const exp = linkedEntries
      .filter((e) => e.entry_type === 'expense')
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const inc = linkedEntries
      .filter((e) => e.entry_type === 'income')
      .reduce((sum, e) => sum + Number(e.amount), 0);
    return {
      crop: c,
      expense: exp,
      income: inc,
      diff: inc - exp,
    };
  });

  const farmMap: Record<string, string> = {};
  farms.forEach((f) => (farmMap[f.id] = f.name));

  const cropMap: Record<string, string> = {};
  crops.forEach((c) => (cropMap[c.id] = c.crop_name));

  const handleExport = () => {
    exportLedgerToCsv(filteredEntries, farmMap, cropMap);
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const BAR_COLORS = ['#176B43', '#3F8F52', '#C88716', '#2F7540', '#4A9E60', '#B83B35', '#287A46'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1D3027]">{t.reports.title}</h1>
          <p className="text-sm text-[#65746A]">
            Review your agricultural earnings, expense distributions, and crop balances.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-xl bg-[#176B43] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#104C2F]"
        >
          <Download className="w-4 h-4" />
          <span>{t.common.exportCsv}</span>
        </button>
      </div>

      {/* Guide */}
      <SectionGuide
        title={t.guide.title}
        langCode={langCode}
        instructions={[
          "Compare your seasonal farm earnings against input costs like fertilizers and machinery rental.",
          "The 'Recorded Balance' strictly reflects entered ledger entries and does not assume unrecorded costs.",
          "Click 'Export CSV' to download your full spreadsheet records safely to your phone or computer.",
        ]}
      />

      {/* Range and Farm Filters */}
      <div className="rounded-2xl border border-[#D3E6DC] bg-white p-3.5 shadow-2xs flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-[#65746A]">Period:</span>
        <div className="inline-flex rounded-xl border border-[#D3E6DC] p-1 bg-[#F7F8F0]">
          <button
            type="button"
            onClick={() => setSelectedRange('30days')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              selectedRange === '30days'
                ? 'bg-[#176B43] text-white shadow-xs'
                : 'text-[#65746A] hover:text-[#1D3027]'
            }`}
          >
            {t.reports.last30Days}
          </button>
          <button
            type="button"
            onClick={() => setSelectedRange('3months')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              selectedRange === '3months'
                ? 'bg-[#176B43] text-white shadow-xs'
                : 'text-[#65746A] hover:text-[#1D3027]'
            }`}
          >
            {t.reports.last3Months}
          </button>
          <button
            type="button"
            onClick={() => setSelectedRange('year')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              selectedRange === 'year'
                ? 'bg-[#176B43] text-white shadow-xs'
                : 'text-[#65746A] hover:text-[#1D3027]'
            }`}
          >
            {t.reports.thisYear}
          </button>
          <button
            type="button"
            onClick={() => setSelectedRange('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              selectedRange === 'all'
                ? 'bg-[#176B43] text-white shadow-xs'
                : 'text-[#65746A] hover:text-[#1D3027]'
            }`}
          >
            {t.reports.allTime}
          </button>
        </div>

        <select
          value={selectedFarm}
          onChange={(e) => setSelectedFarm(e.target.value)}
          className="rounded-xl border border-[#D3E6DC] px-3 py-1.5 text-xs text-[#1D3027] bg-[#F7F8F0]"
        >
          <option value="all">All Farms</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#F8B4B4] bg-[#FDF2F2] p-5 shadow-2xs">
          <span className="text-xs font-semibold text-[#B83B35] uppercase tracking-wider">
            Total Recorded Expenses
          </span>
          <div className="mt-1 text-2xl font-black text-[#B83B35]">
            {formatINR(totalExpense)}
          </div>
        </div>

        <div className="rounded-2xl border border-[#A3E3B8] bg-[#E6F3EA] p-5 shadow-2xs">
          <span className="text-xs font-semibold text-[#176B43] uppercase tracking-wider">
            Total Recorded Income
          </span>
          <div className="mt-1 text-2xl font-black text-[#176B43]">
            {formatINR(totalIncome)}
          </div>
        </div>

        <div className="rounded-2xl border border-[#D3E6DC] bg-white p-5 shadow-2xs">
          <span className="text-xs font-semibold text-[#65746A] uppercase tracking-wider">
            Recorded Balance (Income − Expense)
          </span>
          <div
            className={`mt-1 text-2xl font-black ${
              recordedBalance >= 0 ? 'text-[#287A46]' : 'text-[#B83B35]'
            }`}
          >
            {formatINR(recordedBalance)}
          </div>
        </div>
      </div>

      {/* Category Expense Bar Chart */}
      {expenseChartData.length > 0 && (
        <div className="rounded-2xl border border-[#D3E6DC] bg-white p-5 shadow-2xs">
          <h2 className="text-sm font-bold text-[#1D3027] mb-4">
            Expenses by Category (₹)
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseChartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#65746A' }}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11, fill: '#65746A' }} />
                <Tooltip
                  formatter={(val: any) => [formatINR(Number(val)), 'Amount']}
                  contentStyle={{
                    borderRadius: '12px',
                    borderColor: '#D3E6DC',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {expenseChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Crop Financial Summaries Table */}
      <div className="rounded-2xl border border-[#D3E6DC] bg-white p-5 shadow-2xs">
        <h2 className="text-sm font-bold text-[#1D3027] mb-3">
          {t.reports.cropBreakdown}
        </h2>
        {cropFinancialSummaries.length === 0 ? (
          <p className="text-xs text-[#65746A] italic py-4">
            No crop cycles registered yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1D3027]">
              <thead className="bg-[#F7F8F0] border-b border-[#D3E6DC] text-[#65746A] uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Crop Name</th>
                  <th className="py-2.5 px-3">Season</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Linked Expenses</th>
                  <th className="py-2.5 px-3 text-right">Linked Income</th>
                  <th className="py-2.5 px-3 text-right">Recorded Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F8F3]">
                {cropFinancialSummaries.map(({ crop, expense, income, diff }) => (
                  <tr key={crop.id} className="hover:bg-[#F9FCFA]">
                    <td className="py-2.5 px-3 font-bold text-[#1D3027]">
                      {crop.crop_name} {crop.variety ? `(${crop.variety})` : ''}
                    </td>
                    <td className="py-2.5 px-3 text-[#65746A]">{crop.season || '—'}</td>
                    <td className="py-2.5 px-3">
                      <span className="capitalize text-[11px] font-semibold text-[#176B43]">
                        {crop.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#B83B35] font-semibold">
                      {formatINR(expense)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#287A46] font-semibold">
                      {formatINR(income)}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right font-black ${
                        diff >= 0 ? 'text-[#287A46]' : 'text-[#B83B35]'
                      }`}
                    >
                      {formatINR(diff)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Harvest Summary Strip */}
      <div className="rounded-2xl border border-[#D3E6DC] bg-white p-5 shadow-2xs">
        <h2 className="text-sm font-bold text-[#1D3027] mb-3">
          Harvested Outputs Summary
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {crops
            .filter((c) => c.status === 'harvested' && c.actual_yield)
            .map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl border border-[#A3E3B8] bg-[#F0F8F3]"
              >
                <p className="text-xs font-bold text-[#1D3027]">{c.crop_name}</p>
                <div className="text-lg font-black text-[#176B43] mt-1">
                  {c.actual_yield} {c.yield_unit || 'Quintal'}
                </div>
                <p className="text-[11px] text-[#65746A]">
                  Harvested on {c.actual_harvest_date || 'completed season'}
                </p>
              </div>
            ))}
          {crops.filter((c) => c.status === 'harvested' && c.actual_yield).length === 0 && (
            <p className="text-xs text-[#65746A] italic col-span-2">
              No crops marked as harvested yet. When you harvest your crop, record the quantity in the Crops tab.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
