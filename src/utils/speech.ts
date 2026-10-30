// Browser-Native Web Speech API Accessibility (No AI APIs or external servers)

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function findVoiceForLanguage(langCode: string): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Attempt matching exact prefix (e.g. 'hi', 'hi-IN', 'en', 'mr-IN', 'ta-IN')
  const matched = voices.find(
    (v) => v.lang.toLowerCase().startsWith(langCode.toLowerCase()) ||
           v.lang.toLowerCase().replace('_', '-').startsWith(langCode.toLowerCase())
  );
  return matched || null;
}

export function speakText(
  text: string,
  langCode: string,
  onEnd?: () => void,
  onError?: () => void
): boolean {
  if (!isSpeechSupported()) {
    if (onError) onError();
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = findVoiceForLanguage(langCode);

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    // Standard BCP-47 fallback
    utterance.lang = langCode === 'en' ? 'en-IN' : `${langCode}-IN`;
  }

  utterance.rate = 0.9; // Slightly slower, comfortable cadence for rural listeners
  utterance.pitch = 1.0;

  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}
