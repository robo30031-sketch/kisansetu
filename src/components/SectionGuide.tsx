import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { speakText, stopSpeaking, isSpeechSupported, findVoiceForLanguage } from '../utils/speech';

interface SectionGuideProps {
  title: string;
  instructions: string[];
  langCode: string;
}

export const SectionGuide: React.FC<SectionGuideProps> = ({
  title,
  instructions,
  langCode,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVoice, setHasVoice] = useState(true);

  useEffect(() => {
    // Check speech voice availability
    if (isSpeechSupported()) {
      const voice = findVoiceForLanguage(langCode);
      setHasVoice(voice !== null || ['hi', 'en', 'mr', 'ta', 'te', 'bn', 'gu', 'kn', 'ml', 'ur', 'pa'].includes(langCode));
    } else {
      setHasVoice(false);
    }

    return () => {
      stopSpeaking();
      setIsPlaying(false);
    };
  }, [langCode]);

  const toggleSpeech = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      const fullText = `${title}. ${instructions.join('. ')}`;
      const started = speakText(
        fullText,
        langCode,
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
      if (started) {
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-[#D3E6DC] bg-[#F0F8F3] overflow-hidden shadow-2xs">
      <div className="flex items-center justify-between p-3.5">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2.5 text-left flex-1 font-medium text-[#176B43] hover:text-[#104C2F]"
        >
          <HelpCircle className="w-5 h-5 text-[#176B43] shrink-0" />
          <span className="text-sm font-semibold">{title}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#65746A]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#65746A]" />
          )}
        </button>

        {/* Local Web Speech API read-aloud button */}
        {hasVoice && (
          <button
            type="button"
            onClick={toggleSpeech}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isPlaying
                ? 'bg-[#B83B35] text-white animate-pulse'
                : 'bg-white border border-[#D3E6DC] text-[#176B43] hover:bg-[#E6F3EA]'
            }`}
            title={isPlaying ? 'Stop voice reading' : 'Listen with browser voice'}
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Listen (बोलकर सुनें)</span>
              </>
            )}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-[#D3E6DC]/60 text-xs text-[#1D3027] space-y-1.5">
          {instructions.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="font-bold text-[#176B43]">{idx + 1}.</span>
              <p className="leading-relaxed">{step}</p>
            </div>
          ))}
          <p className="pt-1 text-[11px] text-[#65746A] italic">
            * Local offline audio powered strictly by your browser device. No AI or external APIs are invoked.
          </p>
        </div>
      )}
    </div>
  );
};
