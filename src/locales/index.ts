import { ALL_TRANSLATIONS, TranslationType } from './registry';
import { SUPPORTED_LANGUAGES, getLanguageDir } from './languages';

export { ALL_TRANSLATIONS, SUPPORTED_LANGUAGES, getLanguageDir };
export type { TranslationType };

export const DEFAULT_LANGUAGE = 'hi';

export function getTranslation(langCode: string): TranslationType {
  return ALL_TRANSLATIONS[langCode] || ALL_TRANSLATIONS['en'] || ALL_TRANSLATIONS['hi'];
}
