export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  script: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', script: 'Latin' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', script: 'Devanagari' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', dir: 'ltr', script: 'Gurmukhi' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr', script: 'Bengali' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', dir: 'ltr', script: 'Devanagari' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', dir: 'ltr', script: 'Telugu' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', dir: 'ltr', script: 'Tamil' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', dir: 'ltr', script: 'Gujarati' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', dir: 'ltr', script: 'Kannada' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', dir: 'ltr', script: 'Malayalam' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', dir: 'ltr', script: 'Odia' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', dir: 'ltr', script: 'Bengali-Assamese' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl', script: 'Perso-Arabic' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', dir: 'ltr', script: 'Devanagari' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', dir: 'ltr', script: 'Devanagari' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', dir: 'ltr', script: 'Devanagari' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', dir: 'ltr', script: 'Devanagari' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', dir: 'ltr', script: 'Devanagari' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر', dir: 'rtl', script: 'Perso-Arabic' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', dir: 'rtl', script: 'Perso-Arabic' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', dir: 'ltr', script: 'Ol Chiki' },
  { code: 'brx', name: 'Bodo', nativeName: 'बर’', dir: 'ltr', script: 'Devanagari' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', dir: 'ltr', script: 'Bengali' },
];

export const getLanguageDir = (code: string): 'ltr' | 'rtl' => {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
  return lang?.dir || 'ltr';
};
