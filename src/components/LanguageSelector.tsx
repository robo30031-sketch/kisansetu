import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES, getLanguageDir } from '../locales';
import { Languages, Check, ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: string;
  onSelectLanguage: (code: string) => void;
  compact?: boolean;
  direction?: 'up' | 'down';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onSelectLanguage,
  compact = false,
  direction = 'down',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  const activeLang = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const handleSelect = (code: string) => {
    onSelectLanguage(code);
    const dir = getLanguageDir(code);
    document.documentElement.dir = dir;
    document.documentElement.lang = code;
    setIsOpen(false);
  };

  const filtered = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-xl border border-[#D3E6DC] bg-white px-3 py-2 text-sm font-medium text-[#1D3027] hover:bg-[#F0F8F3] focus:outline-hidden focus:ring-2 focus:ring-[#176B43] shadow-xs transition-colors ${
          compact ? 'py-1.5 px-2 text-xs' : ''
        }`}
        aria-label="Select language"
      >
        <Languages className="w-4 h-4 text-[#176B43]" />
        <span className="font-semibold">{activeLang.nativeName}</span>
        <span className="text-xs text-[#65746A]">({activeLang.name})</span>
        <ChevronDown className="w-3.5 h-3.5 text-[#65746A]" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute right-0 ${
              direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
            } z-50 w-72 max-h-80 overflow-hidden rounded-2xl border border-[#D3E6DC] bg-white shadow-xl flex flex-col animate-in fade-in zoom-in-95 duration-100`}
          >
            <div className="p-2.5 border-b border-[#E6F3EA] bg-[#F7F8F0]">
              <div className="text-xs font-semibold text-[#176B43] uppercase tracking-wider mb-1.5 px-1">
                22 Official Languages (८वीं अनुसूची)
              </div>
              <input
                type="text"
                placeholder="Search language / खोजें..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full rounded-lg border border-[#D3E6DC] bg-white px-2.5 py-1.5 text-xs text-[#1D3027] placeholder:text-[#65746A] focus:outline-hidden focus:ring-2 focus:ring-[#176B43]"
              />
            </div>

            <div className="overflow-y-auto p-1.5 divide-y divide-[#F7F8F0]">
              {filtered.map((lang) => {
                const isSelected = lang.code === currentLanguage;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg text-sm transition-colors ${
                      isSelected
                        ? 'bg-[#E6F3EA] text-[#176B43] font-semibold'
                        : 'text-[#1D3027] hover:bg-[#F7F8F0]'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{lang.nativeName}</div>
                      <div className="text-xs text-[#65746A]">{lang.name} {lang.dir === 'rtl' ? '(RTL)' : ''}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#176B43]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
