import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', variant = 'dark' }) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`${sizeMap[size]} rounded-xl flex items-center justify-center shadow-xs transition-transform ${
          isLight ? 'bg-white text-[#176B43]' : 'bg-[#176B43] text-white'
        }`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5"
        >
          {/* Connected agricultural field furrow lines */}
          <path
            d="M4 23C8 20 14 20 20 22C24 23.3 26 23 28 22"
            stroke={isLight ? '#176B43' : '#A3E3B8'}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M4 26.5C10 24 16 24 22 25.5C25 26.2 27 26 28 25.5"
            stroke={isLight ? '#3F8F52' : '#88D4A1'}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Growing central agricultural crop sprout */}
          <path
            d="M16 22V8"
            stroke={isLight ? '#176B43' : '#FFFFFF'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Left leaf */}
          <path
            d="M16 14C12 14 9 10 10 7C14 7 16 11 16 14Z"
            fill={isLight ? '#3F8F52' : '#69C689'}
          />
          {/* Right leaf */}
          <path
            d="M16 11C20 11 23 7 22 4C18 4 16 8 16 11Z"
            fill={isLight ? '#176B43' : '#FFFFFF'}
          />
        </svg>
      </div>
      <div>
        <span
          className={`font-bold tracking-tight block leading-tight ${
            size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-lg' : 'text-xl'
          } ${isLight ? 'text-white' : 'text-[#1D3027]'}`}
        >
          KisanSetu
        </span>
      </div>
    </div>
  );
};
