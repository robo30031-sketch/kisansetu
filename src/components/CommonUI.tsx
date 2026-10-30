import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-react';

// Stat Card for Dashboards
export const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'positive' | 'negative' | 'neutral';
  color?: string;
  onClick?: () => void;
}> = ({ title, value, subtitle, icon, trend, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-[#D3E6DC] bg-white p-4 shadow-2xs hover:shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:border-[#176B43]' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#65746A] tracking-wide">{title}</p>
        {icon && <div className="text-[#176B43] bg-[#F0F8F3] p-2 rounded-xl">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <h3 className="text-2xl font-bold tracking-tight text-[#1D3027]">{value}</h3>
      </div>
      {subtitle && (
        <p
          className={`mt-1 text-xs ${
            trend === 'positive'
              ? 'text-[#287A46] font-medium'
              : trend === 'negative'
              ? 'text-[#B83B35] font-medium'
              : 'text-[#65746A]'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

// Status Badge
export const StatusBadge: React.FC<{
  status: string;
  label?: string;
  size?: 'sm' | 'md';
}> = ({ status, label, size = 'md' }) => {
  const getStyle = () => {
    switch (status) {
      case 'growing':
      case 'completed':
      case 'in_stock':
        return 'bg-[#E6F3EA] text-[#176B43] border-[#A3E3B8]';
      case 'planned':
      case 'pending':
        return 'bg-[#FEF7E6] text-[#C88716] border-[#FBD87F]';
      case 'harvested':
        return 'bg-[#EBF3FF] text-[#1D4ED8] border-[#BFDBFE]';
      case 'low_stock':
      case 'overdue':
      case 'cancelled':
        return 'bg-[#FDF2F2] text-[#B83B35] border-[#F8B4B4]';
      default:
        return 'bg-[#F7F8F0] text-[#1D3027] border-[#D3E6DC]';
    }
  };

  const displayText = label || status;

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${getStyle()} ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {displayText}
    </span>
  );
};

// Empty State
export const EmptyState: React.FC<{
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}> = ({ title, description, icon, actionText, onAction }) => {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#D3E6DC] bg-white/70 p-8 text-center my-6">
      {icon && <div className="mx-auto w-12 h-12 text-[#3F8F52] flex items-center justify-center mb-3 bg-[#F0F8F3] rounded-2xl">{icon}</div>}
      <h3 className="text-base font-bold text-[#1D3027]">{title}</h3>
      <p className="mt-1 text-sm text-[#65746A] max-w-md mx-auto">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#176B43] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#104C2F] focus:outline-hidden"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

// Loading State
export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading records...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="w-8 h-8 text-[#176B43] animate-spin" />
      <p className="text-sm font-medium text-[#65746A]">{message}</p>
    </div>
  );
};

// Error State
export const ErrorState: React.FC<{
  title?: string;
  message: string;
  onRetry?: () => void;
}> = ({ title = 'Failed to load', message, onRetry }) => {
  return (
    <div className="rounded-2xl border border-[#F8B4B4] bg-[#FDF2F2] p-6 text-center my-6">
      <AlertTriangle className="w-8 h-8 text-[#B83B35] mx-auto mb-2" />
      <h3 className="text-sm font-bold text-[#B83B35]">{title}</h3>
      <p className="mt-1 text-xs text-[#65746A]">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 px-3 py-1.5 rounded-lg bg-white border border-[#F8B4B4] text-xs font-semibold text-[#B83B35] hover:bg-[#FDF2F2]"
        >
          Retry
        </button>
      )}
    </div>
  );
};

// Confirmation Modal Dialog
export const ConfirmDialog: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#D3E6DC] animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3">
          {isDestructive ? (
            <div className="p-2.5 rounded-xl bg-[#FDF2F2] text-[#B83B35]">
              <AlertCircle className="w-6 h-6" />
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-[#F0F8F3] text-[#176B43]">
              <Info className="w-6 h-6" />
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-[#1D3027]">{title}</h3>
          </div>
        </div>
        <p className="mt-3 text-sm text-[#65746A] leading-relaxed">{message}</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-[#65746A] hover:bg-[#F7F8F0] border border-[#D3E6DC]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-xs ${
              isDestructive
                ? 'bg-[#B83B35] hover:bg-[#992620]'
                : 'bg-[#176B43] hover:bg-[#104C2F]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// Form Field Wrapper
export const FormField: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}> = ({ label, required = false, error, children, hint }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-[#1D3027]">
        {label} {required && <span className="text-[#B83B35]">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-[#65746A]">{hint}</p>}
      {error && <p className="text-[11px] font-semibold text-[#B83B35]">{error}</p>}
    </div>
  );
};
