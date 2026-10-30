import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle2,
  Filter,
  X,
  Clock,
  Sparkles,
  Tractor,
} from 'lucide-react';
import { CropCycle, Farm, Field, CropStatus } from '../../types';
import { TranslationType } from '../../locales';
import { SectionGuide } from '../../components/SectionGuide';
import { StatusBadge, ConfirmDialog, FormField, EmptyState } from '../../components/CommonUI';

interface CropsViewProps {
  crops: CropCycle[];
  farms: Farm[];
  fields: Field[];
  t: TranslationType;
  langCode: string;
  onSaveCrop: (crop: Partial<CropCycle>) => Promise<void>;
  onDeleteCrop: (cropId: string) => Promise<void>;
}

export const CropsView: React.FC<CropsViewProps> = ({
  crops,
  farms,
  fields,
  t,
  langCode,
  onSaveCrop,
  onDeleteCrop,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<CropCycle | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Filters
  const [selectedFarmFilter, setSelectedFarmFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Form State
  const [farmId, setFarmId] = useState<string>(farms[0]?.id || '');
  const [fieldId, setFieldId] = useState<string>('');
  const [cropName, setCropName] = useState('');
  const [variety, setVariety] = useState('');
  const [season, setSeason] = useState('Rabi');
  const [sowingDate, setSowingDate] = useState('');
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('');
  const [actualHarvestDate, setActualHarvestDate] = useState('');
  const [actualYield, setActualYield] = useState<number | ''>('');
  const [yieldUnit, setYieldUnit] = useState('Quintal');
  const [status, setStatus] = useState<CropStatus>('growing');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const openNewCropModal = () => {
    setEditingCrop(null);
    setFarmId(farms[0]?.id || '');
    setFieldId('');
    setCropName('');
    setVariety('');
    setSeason('Rabi');
    setSowingDate(new Date().toISOString().split('T')[0]);
    setExpectedHarvestDate('');
    setActualHarvestDate('');
    setActualYield('');
    setYieldUnit('Quintal');
    setStatus('growing');
    setNotes('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditCropModal = (c: CropCycle) => {
    setEditingCrop(c);
    setFarmId(c.farm_id);
    setFieldId(c.field_id || '');
    setCropName(c.crop_name);
    setVariety(c.variety || '');
    setSeason(c.season || 'Rabi');
    setSowingDate(c.sowing_date || '');
    setExpectedHarvestDate(c.expected_harvest_date || '');
    setActualHarvestDate(c.actual_harvest_date || '');
    setActualYield(c.actual_yield !== null && c.actual_yield !== undefined ? c.actual_yield : '');
    setYieldUnit(c.yield_unit || 'Quintal');
    setStatus(c.status);
    setNotes(c.notes || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId) {
      setFormError('Please select a farm.');
      return;
    }
    if (!cropName.trim()) {
      setFormError('Crop name is required.');
      return;
    }

    if (sowingDate && expectedHarvestDate) {
      if (new Date(expectedHarvestDate) < new Date(sowingDate)) {
        setFormError(t.crops.dateValidation);
        return;
      }
    }

    try {
      await onSaveCrop({
        id: editingCrop ? editingCrop.id : undefined,
        farm_id: farmId,
        field_id: fieldId || null,
        crop_name: cropName.trim(),
        variety: variety.trim() || null,
        season: season || null,
        sowing_date: sowingDate || null,
        expected_harvest_date: expectedHarvestDate || null,
        actual_harvest_date: actualHarvestDate || null,
        actual_yield: actualYield === '' ? null : Number(actualYield),
        yield_unit: yieldUnit || null,
        status,
        notes: notes.trim() || null,
      });
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Error saving crop');
    }
  };

  // Filtered crops
  const filteredCrops = crops.filter((c) => {
    if (selectedFarmFilter !== 'all' && c.farm_id !== selectedFarmFilter) return false;
    if (selectedStatusFilter !== 'all' && c.status !== selectedStatusFilter) return false;
    return true;
  });

  const availableFields = fields.filter((f) => f.farm_id === farmId);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1D3027]">{t.crops.title}</h1>
          <p className="text-sm text-[#65746A]">
            Track crop seasons, sowing timelines, and harvest outputs.
          </p>
        </div>
        <button
          type="button"
          onClick={openNewCropModal}
          disabled={farms.length === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-[#176B43] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#104C2F] disabled:opacity-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t.crops.addNewCrop}</span>
        </button>
      </div>

      {/* Guide */}
      <SectionGuide
        title={t.guide.title}
        langCode={langCode}
        instructions={[
          "Register crops when sowing starts to record seed variety and expected harvest dates.",
          "When crop is ready, mark status as Harvested and record the total quintals or bags harvested.",
          "You can link your daily fertilizer and labour costs directly to this crop in the Ledger.",
        ]}
      />

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-[#D3E6DC] bg-white p-3.5 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#176B43]">
          <Filter className="w-4 h-4" />
          <span>Filters:</span>
        </div>

        {/* Farm Filter */}
        <select
          value={selectedFarmFilter}
          onChange={(e) => setSelectedFarmFilter(e.target.value)}
          className="rounded-xl border border-[#D3E6DC] px-3 py-1.5 text-xs text-[#1D3027] bg-[#F7F8F0] focus:ring-2 focus:ring-[#176B43]"
        >
          <option value="all">All Farms ({farms.length})</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="rounded-xl border border-[#D3E6DC] px-3 py-1.5 text-xs text-[#1D3027] bg-[#F7F8F0] focus:ring-2 focus:ring-[#176B43]"
        >
          <option value="all">All Statuses</option>
          <option value="growing">{t.crops.statusGrowing}</option>
          <option value="planned">{t.crops.statusPlanned}</option>
          <option value="harvested">{t.crops.statusHarvested}</option>
          <option value="cancelled">{t.crops.statusCancelled}</option>
        </select>
      </div>

      {/* Crops List */}
      {filteredCrops.length === 0 ? (
        <EmptyState
          title={t.crops.noCrops}
          description="Click the button above to register your first seasonal crop cycle."
          actionText={farms.length > 0 ? t.crops.addNewCrop : undefined}
          onAction={farms.length > 0 ? openNewCropModal : undefined}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCrops.map((crop) => {
            const farm = farms.find((f) => f.id === crop.farm_id);
            const field = fields.find((f) => f.id === crop.field_id);
            return (
              <div
                key={crop.id}
                className="rounded-2xl border border-[#D3E6DC] bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-[#3F8F52] bg-[#E6F3EA] px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                        {crop.season || 'Crop'}
                      </span>
                      <h3 className="text-base font-bold text-[#1D3027]">{crop.crop_name}</h3>
                      {crop.variety && (
                        <p className="text-xs text-[#65746A]">{crop.variety}</p>
                      )}
                    </div>
                    <StatusBadge status={crop.status} />
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs border-t border-[#F0F8F3] pt-3">
                    <div className="flex items-center justify-between text-[#65746A]">
                      <span>Farm / Plot:</span>
                      <span className="font-semibold text-[#1D3027]">
                        {farm?.name || 'Farm'} {field ? `(${field.name})` : ''}
                      </span>
                    </div>

                    {crop.sowing_date && (
                      <div className="flex items-center justify-between text-[#65746A]">
                        <span>Sowing:</span>
                        <span className="font-semibold text-[#1D3027]">{crop.sowing_date}</span>
                      </div>
                    )}

                    {crop.status !== 'harvested' && crop.expected_harvest_date && (
                      <div className="flex items-center justify-between text-[#65746A]">
                        <span>Exp. Harvest:</span>
                        <span className="font-semibold text-[#C88716]">
                          {crop.expected_harvest_date}
                        </span>
                      </div>
                    )}

                    {crop.status === 'harvested' && (
                      <div className="flex items-center justify-between text-[#65746A]">
                        <span>Yield:</span>
                        <span className="font-extrabold text-[#176B43]">
                          {crop.actual_yield || 0} {crop.yield_unit || 'Quintal'}
                        </span>
                      </div>
                    )}
                  </div>

                  {crop.notes && (
                    <p className="mt-3 text-[11px] text-[#65746A] bg-[#F7F8F0] p-2 rounded-lg italic">
                      "{crop.notes}"
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#D3E6DC]/60 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openEditCropModal(crop)}
                    className="p-2 text-[#65746A] hover:text-[#176B43] rounded-lg hover:bg-[#F0F8F3]"
                    title={t.common.edit}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(crop.id)}
                    className="p-2 text-[#65746A] hover:text-[#B83B35] rounded-lg hover:bg-[#FDF2F2]"
                    title={t.common.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD / EDIT CROP CYCLE MODAL */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#D3E6DC] my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#D3E6DC]">
              <h2 className="text-base font-bold text-[#1D3027]">
                {editingCrop ? t.crops.editCrop : t.crops.addNewCrop}
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

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Select Farm" required>
                  <select
                    value={farmId}
                    onChange={(e) => {
                      setFarmId(e.target.value);
                      setFieldId('');
                    }}
                    required
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43] bg-white"
                  >
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Field Plot (Optional)">
                  <select
                    value={fieldId}
                    onChange={(e) => setFieldId(e.target.value)}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43] bg-white"
                  >
                    <option value="">Whole Farm (No plot)</option>
                    {availableFields.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.area} {f.area_unit})
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label={t.crops.cropName} required>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wheat / धान / Cotton"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3.5 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                  />
                </FormField>

                <FormField label={t.crops.variety}>
                  <input
                    type="text"
                    placeholder="e.g. C-306 / PBW 550"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3.5 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label={t.crops.season}>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43] bg-white"
                  >
                    <option value="Kharif">Kharif (खरीफ - Monsoon)</option>
                    <option value="Rabi">Rabi (रबी - Winter)</option>
                    <option value="Zaid">Zaid (जायद - Summer)</option>
                    <option value="Annual">Annual / Perennial</option>
                  </select>
                </FormField>

                <FormField label={t.common.status}>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CropStatus)}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43] bg-white"
                  >
                    <option value="growing">{t.crops.statusGrowing}</option>
                    <option value="planned">{t.crops.statusPlanned}</option>
                    <option value="harvested">{t.crops.statusHarvested}</option>
                    <option value="cancelled">{t.crops.statusCancelled}</option>
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label={t.crops.sowingDate}>
                  <input
                    type="date"
                    value={sowingDate}
                    onChange={(e) => setSowingDate(e.target.value)}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                  />
                </FormField>

                <FormField label={t.crops.expectedHarvest}>
                  <input
                    type="date"
                    value={expectedHarvestDate}
                    onChange={(e) => setExpectedHarvestDate(e.target.value)}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                  />
                </FormField>
              </div>

              {/* Yield details when harvested */}
              {status === 'harvested' && (
                <div className="p-3.5 rounded-xl bg-[#EBF3FF] border border-[#BFDBFE] space-y-3">
                  <h4 className="text-xs font-bold text-[#1D4ED8]">
                    Harvest Recording
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label={t.crops.actualHarvest}>
                      <input
                        type="date"
                        value={actualHarvestDate}
                        onChange={(e) => setActualHarvestDate(e.target.value)}
                        className="w-full rounded-xl border border-[#BFDBFE] px-3 py-2 text-sm text-[#1D3027] bg-white focus:ring-2 focus:ring-[#1D4ED8]"
                      />
                    </FormField>

                    <div className="grid grid-cols-2 gap-2">
                      <FormField label="Total Yield">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={actualYield}
                          onChange={(e) => setActualYield(e.target.value === '' ? '' : parseFloat(e.target.value))}
                          placeholder="e.g. 85"
                          className="w-full rounded-xl border border-[#BFDBFE] px-2 py-2 text-sm text-[#1D3027] bg-white"
                        />
                      </FormField>

                      <FormField label="Unit">
                        <select
                          value={yieldUnit}
                          onChange={(e) => setYieldUnit(e.target.value)}
                          className="w-full rounded-xl border border-[#BFDBFE] px-2 py-2 text-xs text-[#1D3027] bg-white"
                        >
                          <option value="Quintal">Quintal</option>
                          <option value="kg">kg</option>
                          <option value="Bags">Bags</option>
                          <option value="Tonnes">Tonnes</option>
                        </select>
                      </FormField>
                    </div>
                  </div>
                </div>
              )}

              <FormField label={t.common.notes}>
                <textarea
                  rows={2}
                  placeholder="Fertilizer dose used, certified seed dealer, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-[#D3E6DC] px-3.5 py-2 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                />
              </FormField>

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
        title="Delete Crop Cycle"
        message="Are you sure you want to delete this crop cycle record?"
        confirmLabel={t.common.delete}
        cancelLabel={t.common.cancel}
        isDestructive
        onConfirm={async () => {
          if (deleteTargetId) {
            await onDeleteCrop(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
