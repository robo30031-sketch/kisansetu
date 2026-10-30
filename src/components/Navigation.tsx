import React from 'react';
import {
  Home,
  Tractor,
  BookOpen,
  Calendar,
  MoreHorizontal,
  Package,
  BarChart3,
  User,
  Settings,
  Languages,
  LogOut,
  Sparkles,
  Layers,
  Menu,
  X,
  MoreVertical,
} from 'lucide-react';
import { Logo } from './Logo';
import { LanguageSelector } from './LanguageSelector';
import { TranslationType } from '../locales';

export type ActiveTab =
  | 'home'
  | 'farms'
  | 'crops'
  | 'ledger'
  | 'calendar'
  | 'inventory'
  | 'reports'
  | 'settings'
  | 'more';

interface NavigationProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentLanguage: string;
  onSelectLanguage: (code: string) => void;
  t: TranslationType;
  userName?: string;
  onSignOut: () => void;
  isConfigured: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  currentLanguage,
  onSelectLanguage,
  t,
  userName = 'Farmer',
  onSignOut,
  isConfigured,
}) => {
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  // Close drawer on Escape key and prevent background scroll when open
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileSidebarOpen(false);
        setShowMoreMenu(false);
      }
    };
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileSidebarOpen]);

  const mainNavItems = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'farms', label: t.nav.myFarms, icon: Tractor },
    { id: 'ledger', label: t.nav.ledger, icon: BookOpen },
    { id: 'calendar', label: t.nav.calendar, icon: Calendar },
  ];

  const moreItems = [
    { id: 'inventory', label: t.nav.inventory, icon: Package },
    { id: 'crops', label: t.crops.title, icon: Layers },
    { id: 'reports', label: t.nav.reports, icon: BarChart3 },
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ];

  return (
    <>
      {/* ======================================================== */}
      {/* DESKTOP SIDEBAR (md and up) */}
      {/* ======================================================== */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#D3E6DC] h-screen sticky top-0 shrink-0 z-30 select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#D3E6DC] flex items-center justify-between">
          <Logo size="md" />
        </div>

        {/* Database Mode Indicator */}
        <div className="px-4 py-2 border-b border-[#D3E6DC]/60 bg-[#F7F8F0]">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#65746A]">Database:</span>
            {isConfigured ? (
              <span className="inline-flex items-center gap-1 text-[#287A46] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#287A46]"></span>
                Supabase Cloud
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#C88716] font-bold" title="Unconfigured: Running local interactive sandbox">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C88716]"></span>
                Local Sandbox
              </span>
            )}
          </div>
        </div>

        {/* Main Nav Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#65746A]">
            Farm Operations
          </p>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id as ActiveTab);
                  setShowMoreMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#176B43] text-white shadow-xs'
                    : 'text-[#1D3027] hover:bg-[#F0F8F3] hover:text-[#176B43]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#3F8F52]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <p className="px-3 pt-4 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#65746A]">
            Management & Records
          </p>
          {moreItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id as ActiveTab);
                  setShowMoreMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#176B43] text-white shadow-xs'
                    : 'text-[#1D3027] hover:bg-[#F0F8F3] hover:text-[#176B43]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#3F8F52]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Language & User Profile */}
        <div className="p-3 border-t border-[#D3E6DC] bg-[#F7F8F0] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1D3027]">{t.nav.language}:</span>
            <LanguageSelector
              currentLanguage={currentLanguage}
              onSelectLanguage={onSelectLanguage}
              compact
              direction="up"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#176B43] text-white font-bold flex items-center justify-center text-xs shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-[#1D3027] truncate">
                {userName}
              </span>
            </div>
            <button
              type="button"
              onClick={onSignOut}
              className="p-1.5 text-[#65746A] hover:text-[#B83B35] rounded-lg hover:bg-white"
              title={t.auth.signOut}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MOBILE TOP BAR (sm only) */}
      {/* ======================================================== */}
      <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-[#D3E6DC] px-3 py-2 flex items-center justify-between shadow-2xs">
        {/* Left: Three lines (Hamburger Menu) Button + Brand Logo */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 -ml-1 text-[#1D3027] hover:text-[#176B43] hover:bg-[#F0F8F3] active:bg-[#E6F3EA] rounded-xl transition-colors flex items-center justify-center focus:outline-hidden focus:ring-2 focus:ring-[#176B43]"
            aria-label="Open sidebar menu (तीन लाइनें)"
            title="Open sidebar menu (तीन लाइनें)"
          >
            <Menu className="w-6 h-6 stroke-[2.2]" />
          </button>
          <Logo size="sm" />
        </div>

        {/* Right: Language Selector + Three Dots (More Options) Button */}
        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSelector
            currentLanguage={currentLanguage}
            onSelectLanguage={onSelectLanguage}
            compact
          />
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 text-[#65746A] hover:text-[#176B43] hover:bg-[#F0F8F3] active:bg-[#E6F3EA] rounded-xl transition-colors flex items-center justify-center focus:outline-hidden focus:ring-2 focus:ring-[#176B43]"
            aria-label="Open sidebar menu (तीन डॉट्स)"
            title="Open sidebar menu (तीन डॉट्स)"
          >
            <MoreVertical className="w-5 h-5 stroke-2" />
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MOBILE SIDEBAR DRAWER (Opened via 3 Lines or 3 Dots) */}
      {/* ======================================================== */}
      {isMobileSidebarOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sidebar */}
          <aside
            className="md:hidden fixed top-0 bottom-0 left-0 rtl:left-auto rtl:right-0 z-50 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col border-r rtl:border-r-0 rtl:border-l border-[#D3E6DC] animate-in slide-in-from-left rtl:slide-in-from-right duration-250 select-none"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Sidebar"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#D3E6DC] flex items-center justify-between bg-white">
              <Logo size="sm" />
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 text-[#65746A] hover:text-[#1D3027] hover:bg-[#F0F8F3] rounded-xl transition-colors"
                aria-label="Close sidebar (बंद करें)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Database Indicator in Mobile Drawer */}
            <div className="px-4 py-2 border-b border-[#D3E6DC]/60 bg-[#F7F8F0]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#65746A]">Database:</span>
                {isConfigured ? (
                  <span className="inline-flex items-center gap-1 text-[#287A46] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#287A46]"></span>
                    Supabase Cloud
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[#C88716] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C88716]"></span>
                    Local Sandbox
                  </span>
                )}
              </div>
            </div>

            {/* Farmer Profile Badge */}
            <div className="p-3.5 mx-3 mt-3 rounded-2xl bg-[#E6F3EA] border border-[#A3E3B8] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#176B43] text-white font-bold flex items-center justify-center text-sm shadow-2xs shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-[#1D3027] truncate">
                  {userName}
                </div>
                <div className="text-[11px] text-[#2F7540] font-medium">
                  {t.brand.name}
                </div>
              </div>
            </div>

            {/* Nav Items List */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              <p className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#65746A]">
                Farm Operations
              </p>
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id as ActiveTab);
                      setIsMobileSidebarOpen(false);
                      setShowMoreMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#176B43] text-white shadow-xs'
                        : 'text-[#1D3027] hover:bg-[#F0F8F3] hover:text-[#176B43]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#3F8F52]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <p className="px-3 pt-4 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#65746A]">
                Management & Records
              </p>
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id as ActiveTab);
                      setIsMobileSidebarOpen(false);
                      setShowMoreMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#176B43] text-white shadow-xs'
                        : 'text-[#1D3027] hover:bg-[#F0F8F3] hover:text-[#176B43]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#3F8F52]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Drawer Footer: Language & Logout */}
            <div className="p-3 border-t border-[#D3E6DC] bg-[#F7F8F0] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1D3027]">{t.nav.language}:</span>
                <LanguageSelector
                  currentLanguage={currentLanguage}
                  onSelectLanguage={onSelectLanguage}
                  compact
                  direction="up"
                />
              </div>

              <div className="pt-2 border-t border-[#D3E6DC]/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileSidebarOpen(false);
                    onSignOut();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#F8B4B4] bg-[#FDF2F2] text-[#B83B35] font-bold text-xs hover:bg-[#FCE8E8] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.auth.signOut}</span>
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* ======================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Fixed at bottom on small screens) */}
      {/* ======================================================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#D3E6DC] shadow-lg px-2 py-1.5">
        <div className="flex items-center justify-around">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id as ActiveTab);
                  setShowMoreMenu(false);
                }}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
                  isActive ? 'text-[#176B43]' : 'text-[#65746A]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className={`text-[10px] mt-0.5 leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* More Drawer Button */}
          <button
            type="button"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
              showMoreMenu || ['inventory', 'crops', 'reports', 'settings'].includes(currentTab)
                ? 'text-[#176B43]'
                : 'text-[#65746A]'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium leading-tight">
              {t.nav.more}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile "More" Drawer Modal */}
      {showMoreMenu && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-2xs"
            onClick={() => setShowMoreMenu(false)}
          />
          <div className="md:hidden fixed bottom-16 left-3 right-3 z-50 rounded-2xl bg-white border border-[#D3E6DC] shadow-2xl p-4 animate-in slide-in-from-bottom-5">
            <div className="text-xs font-bold text-[#65746A] uppercase tracking-wider mb-3">
              {t.nav.more} Operations
            </div>
            <div className="grid grid-cols-2 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id as ActiveTab);
                      setShowMoreMenu(false);
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-semibold transition-colors ${
                      isActive
                        ? 'border-[#176B43] bg-[#E6F3EA] text-[#176B43]'
                        : 'border-[#D3E6DC] bg-white text-[#1D3027] hover:bg-[#F7F8F0]'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#3F8F52]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#D3E6DC] flex items-center justify-between">
              <span className="text-xs text-[#65746A]">{userName}</span>
              <button
                type="button"
                onClick={onSignOut}
                className="flex items-center gap-1.5 text-xs font-bold text-[#B83B35] px-2 py-1 rounded-lg hover:bg-[#FDF2F2]"
              >
                <LogOut className="w-3.5 h-3.5" />
                {t.auth.signOut}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
