import React, { useState } from 'react';
import {
  User,
  Languages,
  MapPin,
  Key,
  LogOut,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Profile, Farm, CropCycle, FinancialEntry, FarmTask, InventoryItem } from '../../types';
import { TranslationType, SUPPORTED_LANGUAGES, getLanguageDir } from '../../locales';
import { SectionGuide } from '../../components/SectionGuide';
import { FormField } from '../../components/CommonUI';
import { INDIAN_STATES_DISTRICTS } from '../../services/stateDistrictData';
import { exportLedgerToCsv } from '../../utils/csvExport';

interface SettingsViewProps {
  profile: Profile | null;
  farms: Farm[];
  crops: CropCycle[];
  entries: FinancialEntry[];
  tasks: FarmTask[];
  inventory: InventoryItem[];
  t: TranslationType;
  langCode: string;
  onUpdateProfile: (updates: Partial<Profile>) => Promise<void>;
  onSelectLanguage: (code: string) => void;
  onSignOut: () => void;
  onDeleteAccount: () => Promise<void>;
  isConfigured: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  farms,
  crops,
  entries,
  tasks,
  inventory,
  t,
  langCode,
  onUpdateProfile,
  onSelectLanguage,
  onSignOut,
  onDeleteAccount,
  isConfigured,
}) => {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [stateCode, setStateCode] = useState(profile?.state_code || 'MP');
  const [districtName, setDistrictName] = useState(profile?.district_name || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Account Deletion
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionError, setDeletionError] = useState('');

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess(false);

    try {
      await onUpdateProfile({
        full_name: fullName.trim(),
        state_code: stateCode,
        district_name: districtName,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Error updating profile');
    }
  };

  const handleLanguageChange = (code: string) => {
    onSelectLanguage(code);
    onUpdateProfile({ preferred_language: code });
    const dir = getLanguageDir(code);
    document.documentElement.dir = dir;
    document.documentElement.lang = code;
  };

  const handleExportJson = () => {
    const fullBackup = {
      exportedAt: new Date().toISOString(),
      app: 'KisanSetu',
      version: '1.0.0',
      profile,
      farms,
      crops,
      financialEntries: entries,
      tasks,
      inventory,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `KisanSetu_Full_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportLedgerCsv = () => {
    const farmMap: Record<string, string> = {};
    farms.forEach((f) => (farmMap[f.id] = f.name));
    const cropMap: Record<string, string> = {};
    crops.forEach((c) => (cropMap[c.id] = c.crop_name));
    exportLedgerToCsv(entries, farmMap, cropMap);
  };

  const handleDeleteAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmation.trim() !== 'DELETE') {
      setDeletionError('Please type DELETE in capital letters to confirm.');
      return;
    }

    setIsDeleting(true);
    setDeletionError('');
    try {
      await onDeleteAccount();
    } catch (err: any) {
      setDeletionError(err.message || 'Error deleting account');
      setIsDeleting(false);
    }
  };

  const districts = INDIAN_STATES_DISTRICTS.find((s) => s.code === stateCode)?.districts || [];

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1D3027]">{t.settings.title}</h1>
        <p className="text-sm text-[#65746A]">
          Manage your personal farmer profile, language preference, and data exports.
        </p>
      </div>

      {/* Guide */}
      <SectionGuide
        title={t.guide.title}
        langCode={langCode}
        instructions={[
          "Change your display name and default agricultural state/district.",
          "Switch between any of the 22 Eighth Schedule languages anytime.",
          "Download a complete JSON backup of all your farm records to keep an offline copy.",
        ]}
      />

      {/* Farmer Profile Card */}
      <div className="rounded-2xl border border-[#D3E6DC] bg-white p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D3E6DC]">
          <User className="w-5 h-5 text-[#176B43]" />
          <h2 className="text-base font-bold text-[#1D3027]">
            {t.settings.farmerProfile}
          </h2>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-[#E6F3EA] border border-[#A3E3B8] text-xs font-bold text-[#176B43] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {saveError && (
            <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#F8B4B4] text-xs font-bold text-[#B83B35]">
              {saveError}
            </div>
          )}

          <FormField label={t.settings.name} required>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-[#D3E6DC] px-3.5 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
            />
          </FormField>

          <div className="grid sm:grid-cols-2 gap-3">
            <FormField label="Agricultural State">
              <select
                value={stateCode}
                onChange={(e) => {
                  setStateCode(e.target.value);
                  const d = INDIAN_STATES_DISTRICTS.find((s) => s.code === e.target.value)?.districts || [];
                  setDistrictName(d[0] || '');
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
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#176B43] text-xs font-bold text-white shadow-xs hover:bg-[#104C2F]"
            >
              {t.common.save}
            </button>
          </div>
        </form>
      </div>

      {/* Language Selection Card */}
      <div className="rounded-2xl border border-[#D3E6DC] bg-white p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#D3E6DC]">
          <Languages className="w-5 h-5 text-[#176B43]" />
          <h2 className="text-base font-bold text-[#1D3027]">
            {t.settings.language} (22 Official Languages)
          </h2>
        </div>

        <p className="text-xs text-[#65746A] mb-3">
          Select your regional mother tongue. The entire user interface will adapt immediately.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === langCode;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#176B43] bg-[#E6F3EA] text-[#176B43] font-bold shadow-2xs'
                    : 'border-[#D3E6DC] bg-white text-[#1D3027] hover:bg-[#F7F8F0]'
                }`}
              >
                <div className="text-xs font-bold leading-tight">{lang.nativeName}</div>
                <div className="text-[10px] text-[#65746A] mt-0.5">{lang.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Data Export Card */}
      <div className="rounded-2xl border border-[#D3E6DC] bg-white p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-3 border-b border-[#D3E6DC]">
          <Download className="w-5 h-5 text-[#176B43]" />
          <h2 className="text-base font-bold text-[#1D3027]">
            Data Export & Portability
          </h2>
        </div>

        <p className="text-xs text-[#65746A] leading-relaxed">
          Your farm data is 100% owned by you. Download complete copies of your transactions and assets at any time.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D3E6DC] bg-[#F7F8F0] text-xs font-bold text-[#1D3027] hover:bg-[#E6F3EA]"
          >
            <Download className="w-4 h-4 text-[#176B43]" />
            <span>{t.settings.exportData}</span>
          </button>

          <button
            type="button"
            onClick={handleExportLedgerCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D3E6DC] bg-[#F7F8F0] text-xs font-bold text-[#1D3027] hover:bg-[#E6F3EA]"
          >
            <Download className="w-4 h-4 text-[#176B43]" />
            <span>{t.settings.exportCsvLedger}</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="rounded-2xl border border-[#F8B4B4] bg-[#FDF2F2] p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F8B4B4]/60 text-[#B83B35]">
          <Trash2 className="w-5 h-5" />
          <h2 className="text-base font-bold">
            {t.settings.deleteAccountTitle}
          </h2>
        </div>

        <p className="text-xs text-[#65746A] leading-relaxed">
          {t.settings.deleteAccountDesc}
        </p>

        <form onSubmit={handleDeleteAccountSubmit} className="space-y-3 pt-2">
          {deletionError && (
            <div className="p-2.5 rounded-lg bg-white border border-[#F8B4B4] text-xs font-bold text-[#B83B35]">
              {deletionError}
            </div>
          )}

          <FormField label={t.settings.deleteConfirmationPrompt}>
            <input
              type="text"
              placeholder="Type DELETE"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full max-w-xs rounded-xl border border-[#F8B4B4] px-3 py-2 text-xs font-bold text-[#B83B35] bg-white focus:ring-2 focus:ring-[#B83B35]"
            />
          </FormField>

          <button
            type="submit"
            disabled={isDeleting || deleteConfirmation.trim() !== 'DELETE'}
            className="px-4 py-2.5 rounded-xl bg-[#B83B35] text-xs font-bold text-white shadow-xs hover:bg-[#992620] disabled:opacity-40"
          >
            {isDeleting ? 'Deleting Records...' : t.settings.deleteButton}
          </button>
        </form>
      </div>

      {/* Sign Out Card */}
      <div className="pt-2 flex justify-start">
        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D3E6DC] bg-white text-xs font-bold text-[#B83B35] hover:bg-[#FDF2F2]"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.auth.signOut}</span>
        </button>
      </div>
    </div>
  );
};
