import React, { useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Download,
  Search,
  Filter,
  X,
  Calendar,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { FinancialEntry, Farm, CropCycle, EntryType } from '../../types';
import { TranslationType } from '../../locales';
import { SectionGuide } from '../../components/SectionGuide';
import { ConfirmDialog, FormField, EmptyState } from '../../components/CommonUI';
import { exportLedgerToCsv } from '../../utils/csvExport';

interface LedgerViewProps {
  entries: FinancialEntry[];
  farms: Farm[];
  crops: CropCycle[];
  t: TranslationType;
  langCode: string;
  onSaveEntry: (entry: Partial<FinancialEntry>) => Promise<void>;
  onDeleteEntry: (entryId: string) => Promise<void>;
}

export const LedgerView: React.FC<LedgerViewProps> = ({
  entries,
  farms,
  crops,
  t,
  langCode,
  onSaveEntry,
  onDeleteEntry,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinancialEntry | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmFilter, setSelectedFarmFilter] = useState<string>('all');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Form State
  const [entryType, setEntryType] = useState<EntryType>('expense');
  const [amount, setAmount] = useState<number | ''>('');
  const [category, setCategory] = useState<string>('seeds');
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [farmId, setFarmId] = useState<string>(farms[0]?.id || '');
  const [cropCycleId, setCropCycleId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [formError, setFormError] = useState('');

  const expenseCategories = [
    { id: 'seeds', label: t.ledger.catSeeds },
    { id: 'fertilizer', label: t.ledger.catFertilizer },
    { id: 'labour', label: t.ledger.catLabour },
    { id: 'irrigation', label: t.ledger.catIrrigation },
    { id: 'equipment', label: t.ledger.catEquipment },
    { id: 'fuel', label: t.ledger.catFuel },
    { id: 'transport', label: t.ledger.catTransport },
    { id: 'land_rent', label: t.ledger.catLandRent },
    { id: 'maintenance', label: t.ledger.catMaintenance },
    { id: 'other', label: t.ledger.catOther },
  ];

  const incomeCategories = [
    { id: 'crop_sale', label: t.ledger.catCropSale },
    { id: 'other_income', label: t.ledger.catOtherIncome },
  ];

  const openNewModal = (type: EntryType = 'expense') => {
    setEditingEntry(null);
    setEntryType(type);
    setAmount('');
    setCategory(type === 'expense' ? 'seeds' : 'crop_sale');
    setEntryDate(new Date().toISOString().split('T')[0]);
    setFarmId(farms[0]?.id || '');
    setCropCycleId('');
    setDescription('');
    setPaymentMethod('Cash');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (e: FinancialEntry) => {
    setEditingEntry(e);
    setEntryType(e.entry_type);
    setAmount(e.amount);
    setCategory(e.category);
    setEntryDate(e.entry_date);
    setFarmId(e.farm_id);
    setCropCycleId(e.crop_cycle_id || '');
    setDescription(e.description || '');
    setPaymentMethod(e.payment_method || 'Cash');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!farmId) {
      setFormError('Please select a farm.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setFormError('Please enter a valid positive amount.');
      return;
    }
    if (!entryDate) {
      setFormError('Please select the transaction date.');
      return;
    }

    try {
      await onSaveEntry({
        id: editingEntry ? editingEntry.id : undefined,
        entry_type: entryType,
        amount: Number(amount),
        category,
        entry_date: entryDate,
        farm_id: farmId,
        crop_cycle_id: cropCycleId || null,
        description: description.trim() || null,
        payment_method: paymentMethod || null,
      });
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Error saving financial transaction');
    }
  };

  // Filtered Entries
  const filteredEntries = entries.filter((e) => {
    if (selectedTypeFilter !== 'all' && e.entry_type !== selectedTypeFilter) return false;
    if (selectedFarmFilter !== 'all' && e.farm_id !== selectedFarmFilter) return false;
    if (selectedCropFilter !== 'all' && e.crop_cycle_id !== selectedCropFilter) return false;
    if (startDate && e.entry_date < startDate) return false;
    if (endDate && e.entry_date > endDate) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDesc = e.description?.toLowerCase().includes(q);
      const matchCat = e.category.toLowerCase().includes(q);
      if (!matchDesc && !matchCat) return false;
    }
    return true;
  });

  // Calculate totals
  const totalExpenses = filteredEntries
    .filter((e) => e.entry_type === 'expense')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalIncome = filteredEntries
    .filter((e) => e.entry_type === 'income')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const recordedDiff = totalIncome - totalExpenses;

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
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1D3027]">{t.ledger.title}</h1>
          <p className="text-sm text-[#65746A]">
            Keep exact records of all seeds, fertilizers, labour wages, and mandi sales.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D3E6DC] bg-white px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#1D3027] hover:bg-[#F7F8F0] shadow-2xs"
            title="Download CSV"
          >
            <Download className="w-4 h-4 text-[#176B43]" />
            <span>{t.common.exportCsv}</span>
          </button>

          <button
            type="button"
            onClick={() => openNewModal('expense')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#B83B35] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#992620]"
          >
            <TrendingDown className="w-4 h-4" />
            <span>{t.ledger.addExpense}</span>
          </button>

          <button
            type="button"
            onClick={() => openNewModal('income')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#176B43] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#104C2F]"
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t.ledger.addIncome}</span>
          </button>
        </div>
      </div>

      {/* Guide */}
      <SectionGuide
        title={t.guide.title}
        langCode={langCode}
        instructions={[
          "Tap 'Record Expense' to write down payments for diesel, fertilizer, or worker wages.",
          "Tap 'Record Income' when you sell crops at Mandi or receive government subsidies.",
          "Filter by date, farm, or crop to view exact balances. Balance = Income minus Expenses.",
        ]}
      />

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-[#F8B4B4] bg-[#FDF2F2] p-4 shadow-2xs">
          <span className="text-xs font-semibold text-[#B83B35] uppercase tracking-wider">
            {t.ledger.totalExpenses}
          </span>
          <div className="mt-1 text-2xl font-extrabold text-[#B83B35]">
            {formatINR(totalExpenses)}
          </div>
          <p className="text-[11px] text-[#65746A] mt-1">
            {filteredEntries.filter((e) => e.entry_type === 'expense').length} expense entries
          </p>
        </div>

        <div className="rounded-2xl border border-[#A3E3B8] bg-[#E6F3EA] p-4 shadow-2xs">
          <span className="text-xs font-semibold text-[#176B43] uppercase tracking-wider">
            {t.ledger.totalIncome}
          </span>
          <div className="mt-1 text-2xl font-extrabold text-[#176B43]">
            {formatINR(totalIncome)}
          </div>
          <p className="text-[11px] text-[#65746A] mt-1">
            {filteredEntries.filter((e) => e.entry_type === 'income').length} income entries
          </p>
        </div>

        <div className="rounded-2xl border border-[#D3E6DC] bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-[#65746A] uppercase tracking-wider">
            {t.ledger.recordedDiff}
          </span>
          <div
            className={`mt-1 text-2xl font-black ${
              recordedDiff >= 0 ? 'text-[#287A46]' : 'text-[#B83B35]'
            }`}
          >
            {formatINR(recordedDiff)}
          </div>
          <p className="text-[11px] text-[#65746A] mt-1">
            * Recorded difference of selected filter entries
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-[#D3E6DC] bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[#65746A] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search description, shop or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#D3E6DC] pl-9 pr-3 py-2 text-xs text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="rounded-xl border border-[#D3E6DC] px-3 py-2 text-xs text-[#1D3027] bg-[#F7F8F0]"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>

          {/* Farm Filter */}
          <select
            value={selectedFarmFilter}
            onChange={(e) => setSelectedFarmFilter(e.target.value)}
            className="rounded-xl border border-[#D3E6DC] px-3 py-2 text-xs text-[#1D3027] bg-[#F7F8F0]"
          >
            <option value="all">All Farms</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          {/* Crop Filter */}
          <select
            value={selectedCropFilter}
            onChange={(e) => setSelectedCropFilter(e.target.value)}
            className="rounded-xl border border-[#D3E6DC] px-3 py-2 text-xs text-[#1D3027] bg-[#F7F8F0]"
          >
            <option value="all">All Crops</option>
            {crops.map((c) => (
              <option key={c.id} value={c.id}>
                {c.crop_name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#F0F8F3] text-xs">
          <span className="font-semibold text-[#65746A]">Date Range:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-[#D3E6DC] px-2.5 py-1 text-xs text-[#1D3027]"
          />
          <span>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-[#D3E6DC] px-2.5 py-1 text-xs text-[#1D3027]"
          />
          {(startDate || endDate) && (
            <button
              type="button"
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="text-[#B83B35] font-semibold hover:underline"
            >
              Clear dates
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table / Cards */}
      {filteredEntries.length === 0 ? (
        <EmptyState
          title={t.ledger.noEntries}
          description="Record your daily expenses or crop sales to see your balance."
          actionText={t.ledger.addExpense}
          onAction={() => openNewModal('expense')}
        />
      ) : (
        <div className="rounded-2xl border border-[#D3E6DC] bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1D3027]">
              <thead className="bg-[#F7F8F0] border-b border-[#D3E6DC] text-[#65746A] uppercase font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Farm / Crop</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F8F3]">
                {filteredEntries.map((entry) => {
                  const isExp = entry.entry_type === 'expense';
                  const farmName = farmMap[entry.farm_id] || 'Farm';
                  const cropName = entry.crop_cycle_id ? cropMap[entry.crop_cycle_id] : null;

                  return (
                    <tr key={entry.id} className="hover:bg-[#F9FCFA] transition-colors">
                      <td className="py-3 px-4 font-medium whitespace-nowrap text-[#65746A]">
                        {entry.entry_date}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            isExp ? 'bg-[#FDF2F2] text-[#B83B35]' : 'bg-[#E6F3EA] text-[#176B43]'
                          }`}
                        >
                          {isExp ? '− Expense' : '+ Income'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#1D3027]">
                        {entry.category.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 text-[#65746A] max-w-xs truncate">
                        {entry.description || '—'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-[#65746A]">
                        <span>{farmName}</span>
                        {cropName && <span className="block text-[11px] text-[#3F8F52]">🌱 {cropName}</span>}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-bold whitespace-nowrap ${
                          isExp ? 'text-[#B83B35]' : 'text-[#287A46]'
                        }`}
                      >
                        {isExp ? '-' : '+'}
                        {formatINR(entry.amount)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(entry)}
                            className="p-1.5 text-[#65746A] hover:text-[#176B43] rounded-md hover:bg-[#F0F8F3]"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(entry.id)}
                            className="p-1.5 text-[#65746A] hover:text-[#B83B35] rounded-md hover:bg-[#FDF2F2]"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD / EDIT TRANSACTION MODAL */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#D3E6DC] my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#D3E6DC]">
              <h2 className="text-base font-bold text-[#1D3027]">
                {editingEntry
                  ? 'Edit Transaction'
                  : entryType === 'expense'
                  ? t.ledger.addExpense
                  : t.ledger.addIncome}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#65746A] hover:bg-[#F7F8F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#F8B4B4] text-xs font-semibold text-[#B83B35]">
                  {formError}
                </div>
              )}

              {/* Type Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#F7F8F0] rounded-xl border border-[#D3E6DC]">
                <button
                  type="button"
                  onClick={() => {
                    setEntryType('expense');
                    setCategory('seeds');
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                    entryType === 'expense'
                      ? 'bg-[#B83B35] text-white shadow-xs'
                      : 'text-[#65746A] hover:text-[#1D3027]'
                  }`}
                >
                  {t.ledger.typeExpense}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEntryType('income');
                    setCategory('crop_sale');
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                    entryType === 'income'
                      ? 'bg-[#176B43] text-white shadow-xs'
                      : 'text-[#65746A] hover:text-[#1D3027]'
                  }`}
                >
                  {t.ledger.typeIncome}
                </button>
              </div>

              {/* Amount in INR */}
              <FormField label={t.ledger.amount} required>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-base font-bold text-[#65746A]">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="e.g. 4500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full rounded-xl border border-[#D3E6DC] pl-8 pr-3.5 py-2.5 text-lg font-bold text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                  />
                </div>
              </FormField>

              {/* Category & Date */}
              <div className="grid grid-cols-2 gap-3">
                <FormField label={t.ledger.category} required>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2.5 text-xs sm:text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43] bg-white font-medium"
                  >
                    {entryType === 'expense'
                      ? expenseCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))
                      : incomeCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                  </select>
                </FormField>

                <FormField label={t.ledger.date} required>
                  <input
                    type="date"
                    required
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                  />
                </FormField>
              </div>

              {/* Farm & Linked Crop Cycle */}
              <div className="grid grid-cols-2 gap-3">
                <FormField label={t.ledger.selectFarm} required>
                  <select
                    value={farmId}
                    onChange={(e) => setFarmId(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2 text-xs sm:text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43] bg-white"
                  >
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label={t.ledger.selectCrop}>
                  <select
                    value={cropCycleId}
                    onChange={(e) => setCropCycleId(e.target.value)}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2 text-xs sm:text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43] bg-white"
                  >
                    <option value="">General Farm Cost (No crop)</option>
                    {crops.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.crop_name} ({c.season || 'All'})
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              {/* Payment Method & Description */}
              <div className="grid grid-cols-2 gap-3">
                <FormField label={t.ledger.paymentMethod}>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2 text-xs sm:text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43] bg-white"
                  >
                    <option value="Cash">Cash (नकद)</option>
                    <option value="UPI">UPI / PhonePe / GPay</option>
                    <option value="Bank">Bank Account Transfer</option>
                    <option value="Credit">Credit / Udhaar (उधार)</option>
                  </select>
                </FormField>

                <FormField label={t.ledger.description}>
                  <input
                    type="text"
                    placeholder="Shop name, mandi receipt #, person"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                  />
                </FormField>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#D3E6DC] text-xs font-semibold text-[#65746A] hover:bg-[#F7F8F0]"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#176B43] text-xs font-bold text-white shadow-xs hover:bg-[#104C2F]"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Delete Transaction Record"
        message={t.ledger.confirmDelete}
        confirmLabel={t.common.delete}
        cancelLabel={t.common.cancel}
        isDestructive
        onConfirm={async () => {
          if (deleteTargetId) {
            await onDeleteEntry(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
