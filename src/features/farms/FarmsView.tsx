import React, { useState } from 'react';
import {
  Tractor,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Maximize2,
  Layers,
  ChevronRight,
  X,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { Farm, Field, AreaUnit } from '../../types';
import { TranslationType } from '../../locales';
import { SectionGuide } from '../../components/SectionGuide';
import { ConfirmDialog, FormField, EmptyState } from '../../components/CommonUI';
import { INDIAN_STATES_DISTRICTS } from '../../services/stateDistrictData';

interface FarmsViewProps {
  farms: Farm[];
  fields: Field[];
  t: TranslationType;
  langCode: string;
  onSaveFarm: (farm: Partial<Farm>) => Promise<void>;
  onDeleteFarm: (farmId: string) => Promise<void>;
  onSaveField: (field: Partial<Field>) => Promise<void>;
  onDeleteField: (fieldId: string) => Promise<void>;
}

export const FarmsView: React.FC<FarmsViewProps> = ({
  farms,
  fields,
  t,
  langCode,
  onSaveFarm,
  onDeleteFarm,
  onSaveField,
  onDeleteField,
}) => {
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(farms[0] || null);
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);

  // Deletion confirm states
  const [deleteTargetFarmId, setDeleteTargetFarmId] = useState<string | null>(null);
  const [deleteTargetFieldId, setDeleteTargetFieldId] = useState<string | null>(null);

  // Form states for Farm
  const [farmName, setFarmName] = useState('');
  const [farmArea, setFarmArea] = useState<number>(0);
  const [farmUnit, setFarmUnit] = useState<AreaUnit>('acres');
  const [stateCode, setStateCode] = useState('MP');
  const [districtName, setDistrictName] = useState('');
  const [village, setVillage] = useState('');
  const [farmNotes, setFarmNotes] = useState('');
  const [farmError, setFarmError] = useState('');

  // Form states for Field
  const [fieldName, setFieldName] = useState('');
  const [fieldArea, setFieldArea] = useState<number>(1);
  const [fieldNotes, setFieldNotes] = useState('');
  const [fieldError, setFieldError] = useState('');

  const openNewFarmModal = () => {
    setEditingFarm(null);
    setFarmName('');
    setFarmArea(0);
    setFarmUnit('acres');
    setStateCode('MP');
    setDistrictName(INDIAN_STATES_DISTRICTS[0]?.districts[0] || '');
    setVillage('');
    setFarmNotes('');
    setFarmError('');
    setIsFarmModalOpen(true);
  };

  const openEditFarmModal = (f: Farm) => {
    setEditingFarm(f);
    setFarmName(f.name);
    setFarmArea(Number(f.area) || 0);
    setFarmUnit((f.area_unit as AreaUnit) || 'acres');
    setStateCode(f.state_code || 'MP');
    setDistrictName(f.district_name || '');
    setVillage(f.village || '');
    setFarmNotes(f.notes || '');
    setFarmError('');
    setIsFarmModalOpen(true);
  };

  const handleFarmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName.trim()) {
      setFarmError('Please enter a farm name.');
      return;
    }
    if (farmArea < 0) {
      setFarmError('Farm area cannot be negative.');
      return;
    }

    try {
      await onSaveFarm({
        id: editingFarm ? editingFarm.id : undefined,
        name: farmName.trim(),
        area: Number(farmArea),
        area_unit: farmUnit,
        state_code: stateCode,
        district_name: districtName,
        village: village.trim(),
        notes: farmNotes.trim(),
      });
      setIsFarmModalOpen(false);
    } catch (err: any) {
      setFarmError(err.message || 'Error saving farm');
    }
  };

  const handleFieldSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarm) return;
    if (!fieldName.trim()) {
      setFieldError('Field plot name is required.');
      return;
    }
    if (fieldArea <= 0) {
      setFieldError('Field area must be greater than zero.');
      return;
    }

    try {
      await onSaveField({
        farm_id: selectedFarm.id,
        name: fieldName.trim(),
        area: Number(fieldArea),
        area_unit: selectedFarm.area_unit,
        notes: fieldNotes.trim(),
      });
      setFieldName('');
      setFieldArea(1);
      setFieldNotes('');
      setIsFieldModalOpen(false);
    } catch (err: any) {
      setFieldError(err.message || 'Error saving field');
    }
  };

  const selectedDistricts =
    INDIAN_STATES_DISTRICTS.find((s) => s.code === stateCode)?.districts || [];

  const farmFields = selectedFarm
    ? fields.filter((f) => f.farm_id === selectedFarm.id)
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1D3027]">{t.farms.title}</h1>
          <p className="text-sm text-[#65746A]">
            Manage your land holdings, acreage, and plot divisions.
          </p>
        </div>
        <button
          type="button"
          onClick={openNewFarmModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#176B43] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#104C2F] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t.farms.addNewFarm}</span>
        </button>
      </div>

      {/* Accessibility Voice & Section Instructions */}
      <SectionGuide
        title={t.guide.title}
        langCode={langCode}
        instructions={[
          "Each farm represents a separate piece of land or location.",
          "Add specific Fields or Plots inside your farm to track individual crop rotations and drip lines.",
          "Deleting a farm will remove associated fields and linked entries.",
        ]}
      />

      {/* Farms List */}
      {farms.length === 0 ? (
        <EmptyState
          title={t.farms.noFarms}
          description="Register your land with village name and area to begin."
          actionText={t.farms.addNewFarm}
          onAction={openNewFarmModal}
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Farm selector cards */}
          <div className="space-y-3 lg:col-span-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#65746A]">
              Registered Farms ({farms.length})
            </h2>
            {farms.map((farm) => {
              const isSelected = selectedFarm?.id === farm.id;
              const countFields = fields.filter((f) => f.farm_id === farm.id).length;
              return (
                <div
                  key={farm.id}
                  onClick={() => setSelectedFarm(farm)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#176B43] bg-[#F0F8F3] shadow-xs'
                      : 'border-[#D3E6DC] bg-white hover:border-[#3F8F52]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#1D3027]">{farm.name}</h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-[#65746A]">
                        <MapPin className="w-3.5 h-3.5 text-[#3F8F52]" />
                        <span>
                          {farm.village ? `${farm.village}, ` : ''}
                          {farm.district_name || ''}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-[#176B43]">
                        {farm.area} {farm.area_unit}
                      </span>
                      <p className="text-[11px] text-[#65746A]">{countFields} fields</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#D3E6DC]/60 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#176B43]">
                      {isSelected ? 'Viewing Details •' : 'Select to view'}
                    </span>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => openEditFarmModal(farm)}
                        className="p-1 text-[#65746A] hover:text-[#176B43]"
                        title={t.common.edit}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTargetFarmId(farm.id)}
                        className="p-1 text-[#65746A] hover:text-[#B83B35]"
                        title={t.common.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Farm Details & Field Plots */}
          {selectedFarm && (
            <div className="lg:col-span-2 space-y-5">
              <div className="rounded-2xl border border-[#D3E6DC] bg-white p-5 shadow-2xs">
                <div className="flex items-start justify-between pb-4 border-b border-[#D3E6DC]">
                  <div>
                    <span className="text-xs font-bold text-[#176B43] uppercase tracking-wider">
                      {t.farms.farmDetails}
                    </span>
                    <h2 className="text-xl font-bold text-[#1D3027] mt-0.5">
                      {selectedFarm.name}
                    </h2>
                    <p className="text-xs text-[#65746A] mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#176B43]" />
                      <span>
                        {selectedFarm.village ? `${selectedFarm.village}, ` : ''}
                        {selectedFarm.district_name}, {selectedFarm.state_code}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#176B43]">
                      {selectedFarm.area}
                    </div>
                    <div className="text-xs font-semibold text-[#65746A]">
                      {selectedFarm.area_unit}
                    </div>
                  </div>
                </div>

                {selectedFarm.notes && (
                  <p className="mt-3 text-xs text-[#65746A] bg-[#F7F8F0] p-3 rounded-xl border border-[#D3E6DC]/60">
                    <strong className="text-[#1D3027]">Notes:</strong> {selectedFarm.notes}
                  </p>
                )}

                {/* Sub-Fields / Plots Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#176B43]" />
                      <h3 className="text-sm font-bold text-[#1D3027]">
                        {t.farms.fieldsTitle} ({farmFields.length})
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFieldModalOpen(true)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#176B43] bg-[#E6F3EA] px-3 py-1.5 rounded-lg hover:bg-[#D4EEDC]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.farms.addField}</span>
                    </button>
                  </div>

                  {farmFields.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-[#D3E6DC] text-center text-xs text-[#65746A] bg-[#F7F8F0]">
                      No plots or sub-fields defined. Add a plot (e.g. North Tubewell Field) to track localized crop sowings.
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {farmFields.map((field) => (
                        <div
                          key={field.id}
                          className="p-3 rounded-xl border border-[#D3E6DC] bg-[#F7F8F0] flex items-center justify-between"
                        >
                          <div>
                            <h4 className="text-xs font-bold text-[#1D3027]">{field.name}</h4>
                            <p className="text-[11px] text-[#65746A]">
                              {field.area} {field.area_unit}
                            </p>
                            {field.notes && (
                              <p className="text-[10px] text-[#65746A] italic mt-0.5">{field.notes}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setDeleteTargetFieldId(field.id)}
                            className="p-1.5 text-[#65746A] hover:text-[#B83B35] rounded-md hover:bg-white"
                            title="Delete plot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD / EDIT FARM MODAL */}
      {/* ======================================================== */}
      {isFarmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#D3E6DC] my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#D3E6DC]">
              <h2 className="text-base font-bold text-[#1D3027]">
                {editingFarm ? t.farms.editFarm : t.farms.addNewFarm}
              </h2>
              <button
                type="button"
                onClick={() => setIsFarmModalOpen(false)}
                className="p-1 rounded-lg text-[#65746A] hover:bg-[#F7F8F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFarmSubmit} className="mt-4 space-y-4">
              {farmError && (
                <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#F8B4B4] text-xs font-semibold text-[#B83B35]">
                  {farmError}
                </div>
              )}

              <FormField label={t.farms.nameLabel} required>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ganga Farm / Home Land"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full rounded-xl border border-[#D3E6DC] px-3.5 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label={t.farms.areaLabel} required>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={farmArea || ''}
                    onChange={(e) => setFarmArea(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3.5 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                  />
                </FormField>

                <FormField label={t.farms.unitLabel} required>
                  <select
                    value={farmUnit}
                    onChange={(e) => setFarmUnit(e.target.value as AreaUnit)}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43] bg-white"
                  >
                    <option value="acres">{t.common.all === 'सभी' ? 'एकड़ (Acres)' : 'Acres'}</option>
                    <option value="hectares">Hectares</option>
                    <option value="bigha">Bigha</option>
                    <option value="guntha">Guntha</option>
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="State">
                  <select
                    value={stateCode}
                    onChange={(e) => {
                      setStateCode(e.target.value);
                      const districts =
                        INDIAN_STATES_DISTRICTS.find((s) => s.code === e.target.value)?.districts || [];
                      setDistrictName(districts[0] || '');
                    }}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43] bg-white"
                  >
                    {INDIAN_STATES_DISTRICTS.map((st) => (
                      <option key={st.code} value={st.code}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="District">
                  <select
                    value={districtName}
                    onChange={(e) => setDistrictName(e.target.value)}
                    className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43] bg-white"
                  >
                    {selectedDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField label={t.farms.villageLabel}>
                <input
                  type="text"
                  placeholder="Village / Gram / Tehsil"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full rounded-xl border border-[#D3E6DC] px-3.5 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                />
              </FormField>

              <FormField label={t.farms.notesLabel}>
                <textarea
                  rows={2}
                  placeholder="Soil type, irrigation details, canal access..."
                  value={farmNotes}
                  onChange={(e) => setFarmNotes(e.target.value)}
                  className="w-full rounded-xl border border-[#D3E6DC] px-3.5 py-2 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                />
              </FormField>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFarmModalOpen(false)}
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
      {/* ADD FIELD / PLOT MODAL */}
      {/* ======================================================== */}
      {isFieldModalOpen && selectedFarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#D3E6DC] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#D3E6DC]">
              <h2 className="text-base font-bold text-[#1D3027]">
                {t.farms.addField} ({selectedFarm.name})
              </h2>
              <button
                type="button"
                onClick={() => setIsFieldModalOpen(false)}
                className="p-1 rounded-lg text-[#65746A] hover:bg-[#F7F8F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFieldSubmit} className="mt-4 space-y-4">
              {fieldError && (
                <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#F8B4B4] text-xs font-semibold text-[#B83B35]">
                  {fieldError}
                </div>
              )}

              <FormField label={t.farms.fieldName} required>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Drip Plot / Field A"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  className="w-full rounded-xl border border-[#D3E6DC] px-3.5 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                />
              </FormField>

              <FormField label={`${t.farms.fieldArea} (${selectedFarm.area_unit})`} required>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={fieldArea}
                  onChange={(e) => setFieldArea(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-[#D3E6DC] px-3.5 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                />
              </FormField>

              <FormField label={t.common.notes}>
                <input
                  type="text"
                  placeholder="Special remarks for this plot"
                  value={fieldNotes}
                  onChange={(e) => setFieldNotes(e.target.value)}
                  className="w-full rounded-xl border border-[#D3E6DC] px-3.5 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                />
              </FormField>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFieldModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D3E6DC] text-xs font-semibold text-[#65746A] hover:bg-[#F7F8F0]"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#176B43] text-xs font-bold text-white shadow-xs hover:bg-[#104C2F]"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Farm Warning Dialog */}
      <ConfirmDialog
        isOpen={deleteTargetFarmId !== null}
        title={t.farms.deleteFarm}
        message={t.farms.confirmDelete}
        confirmLabel={t.common.delete}
        cancelLabel={t.common.cancel}
        isDestructive
        onConfirm={async () => {
          if (deleteTargetFarmId) {
            await onDeleteFarm(deleteTargetFarmId);
            setDeleteTargetFarmId(null);
            if (selectedFarm?.id === deleteTargetFarmId) {
              setSelectedFarm(farms.find((f) => f.id !== deleteTargetFarmId) || null);
            }
          }
        }}
        onCancel={() => setDeleteTargetFarmId(null)}
      />

      {/* Delete Field Confirmation */}
      <ConfirmDialog
        isOpen={deleteTargetFieldId !== null}
        title="Delete Plot"
        message="Are you sure you want to delete this field plot?"
        confirmLabel={t.common.delete}
        cancelLabel={t.common.cancel}
        isDestructive
        onConfirm={async () => {
          if (deleteTargetFieldId) {
            await onDeleteField(deleteTargetFieldId);
            setDeleteTargetFieldId(null);
          }
        }}
        onCancel={() => setDeleteTargetFieldId(null)}
      />
    </div>
  );
};
