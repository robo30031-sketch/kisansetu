import React, { useState } from 'react';
import {
  Package,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  History,
  AlertTriangle,
  Edit2,
  Trash2,
  X,
  Layers,
  RotateCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { InventoryItem, StockMovement, Farm, InventoryCategory, StockMovementType } from '../../types';
import { TranslationType } from '../../locales';
import { SectionGuide } from '../../components/SectionGuide';
import { StatusBadge, ConfirmDialog, FormField, EmptyState } from '../../components/CommonUI';

interface InventoryViewProps {
  items: InventoryItem[];
  movements: StockMovement[];
  farms: Farm[];
  t: TranslationType;
  langCode: string;
  onSaveItem: (item: Partial<InventoryItem>) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
  onRecordMovement: (params: {
    itemId: string;
    movementType: StockMovementType;
    quantityDelta: number;
    movementDate: string;
    notes?: string;
  }) => Promise<void>;
  onLoadMovements: (itemId: string) => Promise<StockMovement[]>;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  items,
  movements,
  farms,
  t,
  langCode,
  onSaveItem,
  onDeleteItem,
  onRecordMovement,
  onLoadMovements,
}) => {
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedItemForMovement, setSelectedItemForMovement] = useState<InventoryItem | null>(null);

  // Audit history modal
  const [historyItem, setHistoryItem] = useState<InventoryItem | null>(null);
  const [historyMovements, setHistoryMovements] = useState<StockMovement[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFarm, setSelectedFarm] = useState<string>('all');

  // Deletion confirm
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Item Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryCategory>('fertilizer');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unit, setUnit] = useState('Bags');
  const [lowStockThreshold, setLowStockThreshold] = useState<number | ''>(5);
  const [farmId, setFarmId] = useState(farms[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [itemError, setItemError] = useState('');

  // Movement Form State
  const [movementType, setMovementType] = useState<StockMovementType>('usage');
  const [deltaQty, setDeltaQty] = useState<number | ''>('');
  const [movementDate, setMovementDate] = useState(new Date().toISOString().split('T')[0]);
  const [movementNotes, setMovementNotes] = useState('');
  const [movementError, setMovementError] = useState('');

  const openNewItemModal = () => {
    setEditingItem(null);
    setName('');
    setCategory('fertilizer');
    setQuantity(0);
    setUnit('Bags');
    setLowStockThreshold(5);
    setFarmId(farms[0]?.id || '');
    setNotes('');
    setItemError('');
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item: InventoryItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category as InventoryCategory);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setLowStockThreshold(item.low_stock_threshold);
    setFarmId(item.farm_id);
    setNotes(item.notes || '');
    setItemError('');
    setIsItemModalOpen(true);
  };

  const openMovementModal = (item: InventoryItem) => {
    setSelectedItemForMovement(item);
    setMovementType('usage');
    setDeltaQty('');
    setMovementDate(new Date().toISOString().split('T')[0]);
    setMovementNotes('');
    setMovementError('');
    setIsMovementModalOpen(true);
  };

  const openHistoryModal = async (item: InventoryItem) => {
    setHistoryItem(item);
    setIsHistoryLoading(true);
    try {
      const hist = await onLoadMovements(item.id);
      setHistoryMovements(hist);
    } catch (err) {
      console.error(err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId) {
      setItemError('Please select a farm.');
      return;
    }
    if (!name.trim()) {
      setItemError('Item name is required.');
      return;
    }
    if (quantity === '' || Number(quantity) < 0) {
      setItemError('Quantity cannot be negative.');
      return;
    }

    try {
      await onSaveItem({
        id: editingItem ? editingItem.id : undefined,
        name: name.trim(),
        category,
        quantity: Number(quantity),
        unit: unit.trim() || 'Units',
        low_stock_threshold: Number(lowStockThreshold) || 0,
        farm_id: farmId,
        notes: notes.trim() || null,
      });
      setIsItemModalOpen(false);
    } catch (err: any) {
      setItemError(err.message || 'Error saving inventory item');
    }
  };

  const handleMovementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForMovement) return;
    if (!deltaQty || Number(deltaQty) <= 0) {
      setMovementError('Please enter a valid positive quantity.');
      return;
    }

    // Determine signed delta:
    // purchase: +delta
    // return: +delta
    // usage: -delta
    // adjustment: could be positive or negative, let's treat delta as adjustment to add or subtract
    let actualDelta = Number(deltaQty);
    if (movementType === 'usage') {
      actualDelta = -Math.abs(actualDelta);
      if (selectedItemForMovement.quantity + actualDelta < 0) {
        setMovementError(
          `Cannot use ${deltaQty} ${selectedItemForMovement.unit}. Available stock is only ${selectedItemForMovement.quantity} ${selectedItemForMovement.unit}.`
        );
        return;
      }
    } else {
      actualDelta = Math.abs(actualDelta);
    }

    try {
      await onRecordMovement({
        itemId: selectedItemForMovement.id,
        movementType,
        quantityDelta: actualDelta,
        movementDate,
        notes: movementNotes.trim() || undefined,
      });
      setIsMovementModalOpen(false);
    } catch (err: any) {
      setMovementError(err.message || 'Error executing stock movement transaction');
    }
  };

  // Filtered items
  const filteredItems = items.filter((i) => {
    if (selectedCategory !== 'all' && i.category !== selectedCategory) return false;
    if (selectedFarm !== 'all' && i.farm_id !== selectedFarm) return false;
    return true;
  });

  const farmMap: Record<string, string> = {};
  farms.forEach((f) => (farmMap[f.id] = f.name));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1D3027]">{t.inventory.title}</h1>
          <p className="text-sm text-[#65746A]">
            Track bags of seed, quintals of fertilizer, diesel stock, and equipment.
          </p>
        </div>
        <button
          type="button"
          onClick={openNewItemModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#176B43] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#104C2F]"
        >
          <Plus className="w-4 h-4" />
          <span>{t.inventory.addItem}</span>
        </button>
      </div>

      {/* Guide */}
      <SectionGuide
        title={t.guide.title}
        langCode={langCode}
        instructions={[
          "Add all fertilizers, seed bags, sprays, or diesel drums you keep in your farm shed.",
          "Set a 'Low Stock Alert' quantity to be warned before your fertilizer runs out.",
          "When you buy new bags or apply them to your field, record a Stock Movement to keep your count exact.",
        ]}
      />

      {/* Filters */}
      <div className="rounded-2xl border border-[#D3E6DC] bg-white p-3.5 shadow-2xs flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-[#65746A]">Filter Inventory:</span>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-[#D3E6DC] px-3 py-1.5 text-xs text-[#1D3027] bg-[#F7F8F0]"
        >
          <option value="all">All Categories</option>
          <option value="fertilizer">{t.inventory.catFertilizer}</option>
          <option value="seeds">{t.inventory.catSeeds}</option>
          <option value="fuel">{t.inventory.catFuel}</option>
          <option value="tools">{t.inventory.catTools}</option>
          <option value="irrigation_supplies">{t.inventory.catIrrigation}</option>
          <option value="other">{t.inventory.catOther}</option>
        </select>

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

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title={t.inventory.noItems}
          description="Register your stored farming inputs to prevent running out during peak season."
          actionText={t.inventory.addItem}
          onAction={openNewItemModal}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isLowStock = item.quantity <= item.low_stock_threshold;
            const farmName = farmMap[item.farm_id] || 'Farm';

            return (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 shadow-2xs flex flex-col justify-between transition-all ${
                  isLowStock
                    ? 'border-[#F8B4B4] bg-[#FDF2F2]'
                    : 'border-[#D3E6DC] bg-white'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#65746A] bg-white/80 px-2 py-0.5 rounded-md border border-[#D3E6DC]/40">
                        {item.category.replace('_', ' ')}
                      </span>
                      <h3 className="text-base font-bold text-[#1D3027] mt-1.5">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#65746A]">{farmName}</p>
                    </div>
                    {isLowStock ? (
                      <span className="inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full text-xs bg-[#B83B35] text-white">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold px-2.5 py-0.5 rounded-full text-xs bg-[#E6F3EA] text-[#176B43]">
                        In Stock
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/5 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-[#65746A]">Current Stock:</span>
                      <div className="text-2xl font-black text-[#1D3027]">
                        {item.quantity}{' '}
                        <span className="text-sm font-semibold text-[#65746A]">
                          {item.unit}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-xs text-[#65746A]">
                      <span>Alert at:</span>
                      <div className="font-semibold text-[#B83B35]">
                        ≤ {item.low_stock_threshold} {item.unit}
                      </div>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="mt-2 text-[11px] text-[#65746A] bg-white/60 p-2 rounded-lg italic">
                      {item.notes}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-black/5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => openMovementModal(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#176B43] text-white text-xs font-bold shadow-2xs hover:bg-[#104C2F]"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>{t.inventory.recordMovement}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openHistoryModal(item)}
                      className="p-1.5 text-[#65746A] hover:text-[#176B43] rounded-lg hover:bg-white"
                      title="View audit history"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditItemModal(item)}
                      className="p-1.5 text-[#65746A] hover:text-[#176B43] rounded-lg hover:bg-white"
                      title="Edit item"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(item.id)}
                      className="p-1.5 text-[#65746A] hover:text-[#B83B35] rounded-lg hover:bg-white"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* RECORD MOVEMENT MODAL */}
      {/* ======================================================== */}
      {isMovementModalOpen && selectedItemForMovement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#D3E6DC] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#D3E6DC]">
              <div>
                <span className="text-[11px] font-bold text-[#176B43] uppercase tracking-wider">
                  Update Stock
                </span>
                <h2 className="text-base font-bold text-[#1D3027]">
                  {selectedItemForMovement.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsMovementModalOpen(false)}
                className="p-1 rounded-lg text-[#65746A] hover:bg-[#F7F8F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMovementSubmit} className="mt-4 space-y-4">
              {movementError && (
                <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#F8B4B4] text-xs font-semibold text-[#B83B35]">
                  {movementError}
                </div>
              )}

              {/* Movement Type Radio Cards */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMovementType('usage')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    movementType === 'usage'
                      ? 'border-[#B83B35] bg-[#FDF2F2] text-[#B83B35]'
                      : 'border-[#D3E6DC] text-[#65746A] hover:bg-[#F7F8F0]'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>Field Usage (−)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMovementType('purchase')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    movementType === 'purchase'
                      ? 'border-[#176B43] bg-[#E6F3EA] text-[#176B43]'
                      : 'border-[#D3E6DC] text-[#65746A] hover:bg-[#F7F8F0]'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Purchase (+)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMovementType('return')}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                    movementType === 'return'
                      ? 'border-[#176B43] bg-[#E6F3EA] text-[#176B43]'
                      : 'border-[#D3E6DC] text-[#65746A]'
                  }`}
                >
                  <span>Return (+)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMovementType('adjustment')}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                    movementType === 'adjustment'
                      ? 'border-[#C88716] bg-[#FEF7E6] text-[#C88716]'
                      : 'border-[#D3E6DC] text-[#65746A]'
                  }`}
                >
                  <span>Count Adjustment</span>
                </button>
              </div>

              {/* Quantity */}
              <FormField
                label={`Quantity (${selectedItemForMovement.unit})`}
                required
                hint={`Current on hand: ${selectedItemForMovement.quantity} ${selectedItemForMovement.unit}`}
              >
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="e.g. 2"
                  value={deltaQty}
                  onChange={(e) => setDeltaQty(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full rounded-xl border border-[#D3E6DC] px-3.5 py-2.5 text-base font-bold text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                />
              </FormField>

              {/* Date */}
              <FormField label={t.ledger.date} required>
                <input
                  type="date"
                  required
                  value={movementDate}
                  onChange={(e) => setMovementDate(e.target.value)}
                  className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                />
              </FormField>

              {/* Movement Notes */}
              <FormField label={t.common.notes}>
                <input
                  type="text"
                  placeholder="e.g. Applied on Wheat plot 2 / Bought from cooperative"
                  value={movementNotes}
                  onChange={(e) => setMovementNotes(e.target.value)}
                  className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                />
              </FormField>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsMovementModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#D3E6DC] text-xs font-semibold text-[#65746A] hover:bg-[#F7F8F0]"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#176B43] text-xs font-bold text-white shadow-xs hover:bg-[#104C2F]"
                >
                  Save Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD / EDIT ITEM MODAL */}
      {/* ======================================================== */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#D3E6DC] my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#D3E6DC]">
              <h2 className="text-base font-bold text-[#1D3027]">
                {editingItem ? t.inventory.editItem : t.inventory.addItem}
              </h2>
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="p-1 rounded-lg text-[#65746A] hover:bg-[#F7F8F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleItemSubmit} className="mt-4 space-y-4">
              {itemError && (
                <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#F8B4B4] text-xs font-semibold text-[#B83B35]">
                  {itemError}
                </div>
              )}

              <FormField label={t.inventory.itemName} required>
                <input
                  type="text"
                  required
                  placeholder="e.g. DAP Fertilizer (50kg) / Diesel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#D3E6DC] px-3.5 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label={t.inventory.category} required>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as InventoryCategory)}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2 text-xs sm:text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43] bg-white font-medium"
                  >
                    <option value="fertilizer">{t.inventory.catFertilizer}</option>
                    <option value="seeds">{t.inventory.catSeeds}</option>
                    <option value="fuel">{t.inventory.catFuel}</option>
                    <option value="tools">{t.inventory.catTools}</option>
                    <option value="irrigation_supplies">{t.inventory.catIrrigation}</option>
                    <option value="other">{t.inventory.catOther}</option>
                  </select>
                </FormField>

                <FormField label="Farm Location" required>
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
              </div>

              <div className="grid grid-cols-3 gap-3">
                <FormField label={t.inventory.quantity} required>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                  />
                </FormField>

                <FormField label={t.inventory.unit} required>
                  <input
                    type="text"
                    required
                    placeholder="Bags / Litre / kg"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                  />
                </FormField>

                <FormField label={t.inventory.lowStockThreshold} required>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                  />
                </FormField>
              </div>

              <FormField label={t.common.notes}>
                <textarea
                  rows={2}
                  placeholder="Storage shed location, brand, purchase receipt..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-[#D3E6DC] px-3.5 py-2 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                />
              </FormField>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
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

      {/* ======================================================== */}
      {/* AUDIT HISTORY MODAL */}
      {/* ======================================================== */}
      {historyItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#D3E6DC] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#D3E6DC]">
              <div>
                <span className="text-[11px] font-bold text-[#65746A] uppercase tracking-wider">
                  Audit History
                </span>
                <h2 className="text-base font-bold text-[#1D3027]">
                  {historyItem.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setHistoryItem(null)}
                className="p-1 rounded-lg text-[#65746A] hover:bg-[#F7F8F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 max-h-72 overflow-y-auto divide-y divide-[#F0F8F3]">
              {historyMovements.length === 0 ? (
                <p className="text-xs text-[#65746A] py-6 text-center italic">
                  No stock movements recorded yet.
                </p>
              ) : (
                historyMovements.map((m) => (
                  <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold capitalize text-[#1D3027]">
                        {m.movement_type}
                      </span>
                      <p className="text-[11px] text-[#65746A]">{m.movement_date}</p>
                      {m.notes && <p className="text-[10px] text-[#65746A] italic">{m.notes}</p>}
                    </div>
                    <span
                      className={`font-black text-sm ${
                        m.quantity_delta > 0 ? 'text-[#287A46]' : 'text-[#B83B35]'
                      }`}
                    >
                      {m.quantity_delta > 0 ? `+${m.quantity_delta}` : m.quantity_delta}{' '}
                      {historyItem.unit}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#D3E6DC] flex justify-end">
              <button
                type="button"
                onClick={() => setHistoryItem(null)}
                className="px-4 py-2 rounded-xl bg-[#F7F8F0] border border-[#D3E6DC] text-xs font-bold text-[#1D3027]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Delete Supply Item"
        message="Are you sure you want to delete this supply item and its movement records?"
        confirmLabel={t.common.delete}
        cancelLabel={t.common.cancel}
        isDestructive
        onConfirm={async () => {
          if (deleteTargetId) {
            await onDeleteItem(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
