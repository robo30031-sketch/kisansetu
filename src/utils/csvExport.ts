import { FinancialEntry } from '../types';

/**
 * Sanitize text to prevent CSV / Spreadsheet Formula Injection
 * Prepends a single quote if string starts with dangerous spreadsheet formula characters (=, +, -, @, \t, \r)
 */
export function sanitizeCsvField(value: any): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);

  // Formula injection prevention
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }

  // Escape inner double quotes by doubling them
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportLedgerToCsv(entries: FinancialEntry[], farmNames: Record<string, string>, cropNames: Record<string, string>): void {
  const headers = [
    'Date',
    'Type',
    'Category',
    'Amount (INR)',
    'Farm',
    'Crop Cycle',
    'Payment Method',
    'Description',
    'Record ID',
  ];

  const rows = entries.map((e) => [
    sanitizeCsvField(e.entry_date),
    sanitizeCsvField(e.entry_type.toUpperCase()),
    sanitizeCsvField(e.category),
    sanitizeCsvField(e.amount.toFixed(2)),
    sanitizeCsvField(farmNames[e.farm_id] || e.farm_id),
    sanitizeCsvField(e.crop_cycle_id ? cropNames[e.crop_cycle_id] || e.crop_cycle_id : '-'),
    sanitizeCsvField(e.payment_method || '-'),
    sanitizeCsvField(e.description || '-'),
    sanitizeCsvField(e.id),
  ]);

  const csvRows = [headers.map(sanitizeCsvField).join(','), ...rows.map((r) => r.join(','))];
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCsv(`KisanSetu_Ledger_Export_${dateStr}.csv`, csvRows.join('\r\n'));
}
