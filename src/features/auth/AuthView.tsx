import React, { useState } from 'react';
import {
  Tractor,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Languages,
  Layers,
  BookOpen,
  Calendar,
  Package,
  TrendingUp,
  TrendingDown,
  Eye,
  PlusCircle,
} from 'lucide-react';
import { Logo } from '../../components/Logo';
import { LanguageSelector } from '../../components/LanguageSelector';
import { FormField } from '../../components/CommonUI';
import { TranslationType, SUPPORTED_LANGUAGES, getLanguageDir } from '../../locales';
import { INDIAN_STATES_DISTRICTS } from '../../services/stateDistrictData';
import { AreaUnit } from '../../types';

interface AuthViewProps {
  t: TranslationType;
  currentLanguage: string;
  onSelectLanguage: (code: string) => void;
  onSignIn: (email: string, pass: string) => Promise<void>;
  onSignUp: (email: string, pass: string, name: string, lang: string) => Promise<void>;
  onResetPassword: (email: string) => Promise<void>;
  onCompleteOnboarding: (data: {
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
  }) => Promise<void>;
  onExploreSampleFarm: () => void;
  onQuickCleanEntry: (name: string, lang: string) => Promise<void>;
  isConfigured: boolean;
}

export const AuthView: React.FC<AuthViewProps> = ({
  t,
  currentLanguage,
  onSelectLanguage,
  onSignIn,
  onSignUp,
  onResetPassword,
  onCompleteOnboarding,
  onExploreSampleFarm,
  onQuickCleanEntry,
  isConfigured,
}) => {
  const [authTab, setAuthTab] = useState<'signin' | 'signup' | 'instant'>('signin');
  const [showForgot, setShowForgot] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [quickFarmerName, setQuickFarmerName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Active preview tab on the Pre-applied Information side
  const [sampleTab, setSampleTab] = useState<'overview' | 'crops' | 'khata' | 'supplies'>('overview');

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await onSignIn(email.trim(), password);
    } catch (err: any) {
      setErrorMsg(err.message || t.auth.authError);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Farmer name is required.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await onSignUp(email.trim(), password, fullName.trim(), currentLanguage);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickFarmerName.trim()) {
      setErrorMsg('Please enter your farmer name.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await onQuickCleanEntry(quickFarmerName.trim(), currentLanguage);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await onResetPassword(email.trim());
      setSuccessMsg(t.auth.resetSent);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F0] flex flex-col justify-between py-5 px-3 sm:px-6">
      {/* Top Header Bar */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between pb-4 border-b border-[#D3E6DC]">
        <Logo size="md" />
        <div className="flex items-center gap-3">
          <LanguageSelector
            currentLanguage={currentLanguage}
            onSelectLanguage={onSelectLanguage}
          />
        </div>
      </header>

      {/* Main Split Layout: Pre-applied information on one side + Sign-in below / on other side */}
      <div className="max-w-7xl mx-auto w-full my-6 flex-1">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================== */}
          {/* SIDE 1 (LEFT COLUMN): PRE-APPLIED INFORMATION & SHOWCASE */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl border border-[#A3E3B8] bg-linear-to-br from-[#F0F8F3] via-white to-[#E6F3EA] p-6 shadow-sm">
              {/* Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#176B43] text-white text-xs font-bold shadow-2xs">
                  <span>🌾</span>
                  <span>Pre-Applied Information (पूर्व-दर्ज नमूना जानकारी)</span>
                </div>
                <span className="text-[11px] font-semibold text-[#176B43] bg-white px-2.5 py-1 rounded-lg border border-[#D3E6DC]">
                  Live Sample Demo
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#1D3027] tracking-tight">
                See How KisanSetu Organizes Your Farm
              </h2>
              <p className="mt-1 text-xs text-[#65746A] leading-relaxed">
                Below is pre-applied sample data demonstrating how crop cycles, daily expenses, tasks, and inventory alerts work. When you sign in or create your free account, <strong>your account will start 100% empty</strong> for you to feed your own records.
              </p>

              {/* Sample Tabs */}
              <div className="mt-4 flex flex-wrap gap-1.5 p-1 bg-white rounded-xl border border-[#D3E6DC]">
                <button
                  type="button"
                  onClick={() => setSampleTab('overview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    sampleTab === 'overview'
                      ? 'bg-[#176B43] text-white shadow-2xs'
                      : 'text-[#65746A] hover:text-[#1D3027]'
                  }`}
                >
                  🏡 Farm & Land
                </button>
                <button
                  type="button"
                  onClick={() => setSampleTab('crops')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    sampleTab === 'crops'
                      ? 'bg-[#176B43] text-white shadow-2xs'
                      : 'text-[#65746A] hover:text-[#1D3027]'
                  }`}
                >
                  🌱 Crop Cycles
                </button>
                <button
                  type="button"
                  onClick={() => setSampleTab('khata')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    sampleTab === 'khata'
                      ? 'bg-[#176B43] text-white shadow-2xs'
                      : 'text-[#65746A] hover:text-[#1D3027]'
                  }`}
                >
                  📖 Farm Ledger (Khata)
                </button>
                <button
                  type="button"
                  onClick={() => setSampleTab('supplies')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    sampleTab === 'supplies'
                      ? 'bg-[#176B43] text-white shadow-2xs'
                      : 'text-[#65746A] hover:text-[#1D3027]'
                  }`}
                >
                  📦 Supplies & Stock
                </button>
              </div>

              {/* Pre-applied Tab 1: Farm & Land Overview */}
              {sampleTab === 'overview' && (
                <div className="mt-4 space-y-3 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-white border border-[#D3E6DC] shadow-2xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#3F8F52] bg-[#E6F3EA] px-2 py-0.5 rounded-md">
                          Registered Farm
                        </span>
                        <h4 className="text-base font-bold text-[#1D3027] mt-1">
                          KisanSetu Adarsh Farm (आदर्श खेत)
                        </h4>
                        <p className="text-xs text-[#65746A] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#176B43]" />
                          Babai, Hoshangabad (Narmadapuram), MP
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-[#176B43]">8.5</span>
                        <span className="text-xs text-[#65746A] block font-semibold">Acres (एकड़)</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#F0F8F3] grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-[#F7F8F0] border border-[#D3E6DC]/60">
                        <span className="font-bold text-[#1D3027] block">Plot 1: North Tubewell Plot</span>
                        <span className="text-[#65746A] text-[11px]">5.0 Acres • Drip Line Connected</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#F7F8F0] border border-[#D3E6DC]/60">
                        <span className="font-bold text-[#1D3027] block">Plot 2: Roadside Field</span>
                        <span className="text-[#65746A] text-[11px]">3.5 Acres • Direct Road Access</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pre-applied Tab 2: Crop Cycles */}
              {sampleTab === 'crops' && (
                <div className="mt-4 space-y-2.5 animate-in fade-in">
                  <div className="p-3.5 rounded-2xl bg-white border border-[#D3E6DC] shadow-2xs flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1D3027]">Sharbati Wheat (गेहूं)</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#E6F3EA] text-[#176B43]">
                          Growing
                        </span>
                      </div>
                      <p className="text-xs text-[#65746A]">
                        Variety: C-306 • Rabi season • Sown: 15 Oct 2026
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#C88716]">
                      Exp. Harvest: 25 Mar 2027
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#D3E6DC] shadow-2xs flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1D3027]">Mustard (सरसों)</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#E6F3EA] text-[#176B43]">
                          Growing
                        </span>
                      </div>
                      <p className="text-xs text-[#65746A]">
                        Variety: Pusa Bold • Rabi season • Sown: 05 Oct 2026
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#C88716]">
                      Exp. Harvest: 20 Feb 2027
                    </span>
                  </div>
                </div>
              )}

              {/* Pre-applied Tab 3: Khata / Ledger */}
              {sampleTab === 'khata' && (
                <div className="mt-4 space-y-2.5 animate-in fade-in">
                  <div className="p-3 rounded-2xl bg-[#E6F3EA] border border-[#A3E3B8] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#65746A]">Pre-applied Khata Balance:</span>
                      <div className="text-lg font-black text-[#176B43]">+₹39,500</div>
                    </div>
                    <div className="text-right text-[11px] text-[#65746A]">
                      <div>Income: <strong className="text-[#287A46]">₹54,000</strong></div>
                      <div>Expenses: <strong className="text-[#B83B35]">₹14,500</strong></div>
                    </div>
                  </div>

                  <div className="divide-y divide-[#F0F8F3] bg-white rounded-2xl border border-[#D3E6DC] p-2 text-xs">
                    <div className="py-2 px-2 flex justify-between">
                      <span>Seeds (Sharbati 4 bags)</span>
                      <strong className="text-[#B83B35]">−₹6,800</strong>
                    </div>
                    <div className="py-2 px-2 flex justify-between">
                      <span>Fertilizer (DAP & Urea)</span>
                      <strong className="text-[#B83B35]">−₹4,200</strong>
                    </div>
                    <div className="py-2 px-2 flex justify-between">
                      <span>Sowing Labour Wages</span>
                      <strong className="text-[#B83B35]">−₹3,500</strong>
                    </div>
                    <div className="py-2 px-2 flex justify-between font-bold">
                      <span className="text-[#287A46]">Soybean Mandi Sale</span>
                      <strong className="text-[#287A46]">+₹54,000</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Pre-applied Tab 4: Supplies & Alerts */}
              {sampleTab === 'supplies' && (
                <div className="mt-4 space-y-2.5 animate-in fade-in">
                  <div className="p-3.5 rounded-2xl bg-[#FDF2F2] border border-[#F8B4B4] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-[#B83B35]" />
                        <span className="font-bold text-sm text-[#1D3027]">DAP Fertilizer (50 kg)</span>
                        <span className="text-[10px] font-bold bg-[#B83B35] text-white px-2 py-0.5 rounded-full">
                          Low Stock Alert
                        </span>
                      </div>
                      <p className="text-xs text-[#65746A] mt-0.5">
                        Current: 3 Bags (Alert triggers when ≤ 5 bags)
                      </p>
                    </div>
                    <span className="text-sm font-black text-[#B83B35]">3 Bags</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-[#D3E6DC] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#1D3027]">Neem Coated Urea (45 kg)</span>
                      <p className="text-[11px] text-[#65746A]">In shed on wooden pallets</p>
                    </div>
                    <span className="font-bold text-[#176B43]">12 Bags</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-[#D3E6DC] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#1D3027]">Tractor Diesel Fuel</span>
                      <p className="text-[11px] text-[#65746A]">Safe fuel storage drum</p>
                    </div>
                    <span className="font-bold text-[#176B43]">45 Litres</span>
                  </div>
                </div>
              )}

              {/* Button to explore the sample farm interactively */}
              <div className="mt-5 pt-4 border-t border-[#D3E6DC] flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-[#65746A]">
                  Want to click around and test this sample data?
                </span>
                <button
                  type="button"
                  onClick={onExploreSampleFarm}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-[#176B43] text-xs font-bold text-[#176B43] hover:bg-[#E6F3EA] shadow-2xs transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Explore Pre-Applied Sample Farm</span>
                </button>
              </div>
            </div>

            {/* Zero AI / Pure Privacy Guarantee */}
            <div className="p-4 rounded-2xl bg-white border border-[#D3E6DC] text-xs text-[#65746A] flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#176B43] shrink-0" />
              <div>
                <strong className="text-[#1D3027] block">100% Deterministic & Private</strong>
                KisanSetu uses zero artificial intelligence APIs or chatbots. Your numbers are calculated accurately and kept confidential.
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SIDE 2 (RIGHT COLUMN): SIGN IN & CREATE FREE ACCOUNT */}
          {/* ======================================================== */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[#D3E6DC] bg-white p-6 sm:p-7 shadow-lg">
              
              {/* Fresh Empty Account Callout Notice */}
              <div className="mb-5 p-3 rounded-2xl bg-[#E6F3EA] border border-[#A3E3B8] text-xs text-[#1D3027]">
                <div className="flex items-center gap-1.5 font-bold text-[#176B43]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Full Empty Account Guaranteed</span>
                </div>
                <p className="mt-1 text-[11px] text-[#2F7540] leading-relaxed">
                  When you sign in or create your free account, the software will be <strong>completely empty</strong> and ready for you to feed your own farm information.
                </p>
              </div>

              {/* Portal Mode Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#F7F8F0] rounded-2xl border border-[#D3E6DC] mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('signin');
                    setShowForgot(false);
                    setErrorMsg('');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    authTab === 'signin' && !showForgot
                      ? 'bg-[#176B43] text-white shadow-2xs'
                      : 'text-[#65746A] hover:text-[#1D3027]'
                  }`}
                >
                  {t.auth.signIn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('signup');
                    setShowForgot(false);
                    setErrorMsg('');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    authTab === 'signup'
                      ? 'bg-[#176B43] text-white shadow-2xs'
                      : 'text-[#65746A] hover:text-[#1D3027]'
                  }`}
                >
                  {t.auth.signUp}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('instant');
                    setShowForgot(false);
                    setErrorMsg('');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    authTab === 'instant'
                      ? 'bg-[#176B43] text-white shadow-2xs'
                      : 'text-[#65746A] hover:text-[#1D3027]'
                  }`}
                >
                  Quick Entry
                </button>
              </div>

              {/* Error / Success Messages */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-[#FDF2F2] border border-[#F8B4B4] text-xs font-bold text-[#B83B35]">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-[#E6F3EA] border border-[#A3E3B8] text-xs font-bold text-[#176B43]">
                  {successMsg}
                </div>
              )}

              {/* ==================== FORM 1: SIGN IN ==================== */}
              {authTab === 'signin' && !showForgot && (
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-[#1D3027]">
                    Sign In to Your Empty Farm Account
                  </h3>
                  <p className="text-xs text-[#65746A]">
                    Access your private records with your email and password.
                  </p>

                  <FormField label={t.auth.email} required>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#65746A] absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="farmer@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-[#D3E6DC] pl-10 pr-3.5 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                      />
                    </div>
                  </FormField>

                  <FormField label={t.auth.password} required>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#65746A] absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-[#D3E6DC] pl-10 pr-3.5 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                      />
                    </div>
                  </FormField>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-xs font-semibold text-[#176B43] hover:underline"
                    >
                      {t.auth.forgotPassword}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-[#176B43] text-white font-bold text-sm shadow-xs hover:bg-[#104C2F] disabled:opacity-50"
                  >
                    {loading ? t.common.loading : 'Sign In to My Farm'}
                  </button>
                </form>
              )}

              {/* ==================== FORM 2: CREATE FREE ACCOUNT ==================== */}
              {authTab === 'signup' && (
                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-[#1D3027]">
                    Create Free Account (Clean Slate)
                  </h3>
                  <p className="text-xs text-[#65746A]">
                    Zero cost. No credit card required. Starts 100% empty.
                  </p>

                  <FormField label={t.auth.fullName} required>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#65746A] absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Patel"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-xl border border-[#D3E6DC] pl-10 pr-3.5 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                      />
                    </div>
                  </FormField>

                  <FormField label={t.auth.email} required>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#65746A] absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="farmer@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-[#D3E6DC] pl-10 pr-3.5 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                      />
                    </div>
                  </FormField>

                  <FormField label={t.auth.password} required>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#65746A] absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-[#D3E6DC] pl-10 pr-3.5 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                      />
                    </div>
                  </FormField>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-[#176B43] text-white font-bold text-sm shadow-xs hover:bg-[#104C2F] disabled:opacity-50"
                  >
                    {loading ? t.common.loading : 'Create Free Empty Account'}
                  </button>
                </form>
              )}

              {/* ==================== FORM 3: INSTANT FARMER ENTRY ==================== */}
              {authTab === 'instant' && (
                <form onSubmit={handleInstantSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-[#1D3027]">
                    Instant Farmer Entry (No Password Needed)
                  </h3>
                  <p className="text-xs text-[#65746A]">
                    Quickly begin feeding your own farm records immediately.
                  </p>

                  <FormField label="Your Name (किसान का नाम)" required>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#65746A] absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Suresh Kumar"
                        value={quickFarmerName}
                        onChange={(e) => setQuickFarmerName(e.target.value)}
                        className="w-full rounded-xl border border-[#D3E6DC] pl-10 pr-3.5 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                      />
                    </div>
                  </FormField>

                  <FormField label="Preferred Language">
                    <select
                      value={currentLanguage}
                      onChange={(e) => onSelectLanguage(e.target.value)}
                      className="w-full rounded-xl border border-[#D3E6DC] px-3 py-2.5 text-sm text-[#1D3027] bg-white"
                    >
                      {SUPPORTED_LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.nativeName} ({l.name})
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-[#176B43] text-white font-bold text-sm shadow-xs hover:bg-[#104C2F] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>Enter My Empty Farm Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* ==================== FORGOT PASSWORD VIEW ==================== */}
              {showForgot && (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-[#1D3027]">
                    {t.auth.forgotPassword}
                  </h3>
                  <p className="text-xs text-[#65746A]">
                    Enter your email to receive a password reset link.
                  </p>

                  <FormField label={t.auth.email} required>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-[#D3E6DC] px-3.5 py-2.5 text-sm text-[#1D3027] focus:ring-2 focus:ring-[#176B43]"
                    />
                  </FormField>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-[#176B43] text-white font-bold text-sm shadow-xs hover:bg-[#104C2F] disabled:opacity-50"
                  >
                    {loading ? t.common.loading : t.auth.resetPassword}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setShowForgot(false)}
                      className="text-xs font-bold text-[#176B43] hover:underline"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-[#65746A] pt-4 border-t border-[#D3E6DC]/60">
        KisanSetu • Your Farm. Your Records. Your Control. • 22 Official Indian Languages
      </footer>
    </div>
  );
};
