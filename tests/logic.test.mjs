import test from 'node:test';
import assert from 'node:assert/strict';

// Test CSV Sanitization and Formula Injection Protection
function sanitizeCsvField(value) {
  if (value === null || value === undefined) return '""';
  let str = String(value);

  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }

  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

test('CSV Sanitization prevents spreadsheet formula injection', () => {
  assert.equal(sanitizeCsvField('=SUM(A1:A10)'), '"\'=SUM(A1:A10)"');
  assert.equal(sanitizeCsvField('+12345'), '"\'+12345"');
  assert.equal(sanitizeCsvField('-500'), '"\'-500"');
  assert.equal(sanitizeCsvField('@cmd'), '"\'@cmd"');
  assert.equal(sanitizeCsvField('Wheat "Sharbati" Grade A'), '"Wheat ""Sharbati"" Grade A"');
  assert.equal(sanitizeCsvField('Normal Text'), '"Normal Text"');
});

// Test Language RTL / LTR resolution
const RTL_LANGUAGES = ['ur', 'sd', 'ks'];
function getLanguageDir(code) {
  return RTL_LANGUAGES.includes(code) ? 'rtl' : 'ltr';
}

test('Language direction returns RTL for Urdu, Sindhi, and Kashmiri', () => {
  assert.equal(getLanguageDir('ur'), 'rtl');
  assert.equal(getLanguageDir('sd'), 'rtl');
  assert.equal(getLanguageDir('ks'), 'rtl');
  assert.equal(getLanguageDir('hi'), 'ltr');
  assert.equal(getLanguageDir('pa'), 'ltr');
  assert.equal(getLanguageDir('en'), 'ltr');
});

// Test Sowing Date vs Harvest Date rule
function validateCropDates(sowingDate, expectedHarvestDate) {
  if (!sowingDate || !expectedHarvestDate) return true;
  return new Date(expectedHarvestDate) >= new Date(sowingDate);
}

test('Harvest date cannot precede sowing date', () => {
  assert.equal(validateCropDates('2026-10-15', '2027-03-25'), true);
  assert.equal(validateCropDates('2026-10-15', '2026-10-15'), true);
  assert.equal(validateCropDates('2026-10-15', '2026-09-01'), false);
});

// Test Inventory Stock Math & Insufficient Stock Prevention
function calculateNewStock(currentQty, delta) {
  const result = currentQty + delta;
  if (result < 0) {
    throw new Error(`Insufficient stock: current ${currentQty}, delta ${delta}`);
  }
  return result;
}

test('Stock movement calculates accurately and rejects negative inventory', () => {
  assert.equal(calculateNewStock(10, 5), 15);
  assert.equal(calculateNewStock(10, -3), 7);
  assert.equal(calculateNewStock(10, -10), 0);
  assert.throws(() => calculateNewStock(5, -6), /Insufficient stock/);
});
