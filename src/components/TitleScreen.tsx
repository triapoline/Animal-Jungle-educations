import React, { useEffect } from 'react';
import { ArrowRight, BookOpen, Globe, Volume2, VolumeX } from 'lucide-react';
import { DIFFICULTY_META, t, UI_COPY } from '../data/i18n';
import { Difficulty, Language } from '../types/game';

interface TitleScreenProps {
  difficulty: Difficulty;
  language: Language;
  muted: boolean;
  totalPoints: number;
  totalDiscovered: number;
  hasStartedBefore: boolean;
  onSelectDifficulty: (d: Difficulty) => void;
  onStart: () => void;
  onToggleLanguage: () => void;
  onToggleMute: () => void;
  onOpenJournal: () => void;
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export const TitleScreen: React.FC<TitleScreenProps> = ({
  difficulty,
  language,
  muted,
  totalPoints,
  totalDiscovered,
  hasStartedBefore,
  onSelectDifficulty,
  onStart,
  onToggleLanguage,
  onToggleMute,
  onOpenJournal,
}) => {
  // Allow pressing Enter to launch straight into the forest
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onStart();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onStart]);

  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 md:p-8 pointer-events-none">
      {/* Top utility row over open sunlit 3D rainforest */}
      <div className="flex items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-3 bg-[#F7F6F2]/94 px-4 py-2 rounded-full border border-[#1B2B23]/12 shadow-sm">
          <span className="text-xs font-medium text-[#52665B] tabular-nums">
            {totalDiscovered}/12 {t(UI_COPY.discovered, language)}
          </span>
          <span className="text-[#1B2B23]/25" aria-hidden="true">·</span>
          <span className="text-xs font-semibold text-[#2D6A4F] font-mono tabular-nums">
            {totalPoints} pts
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenJournal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F7F6F2]/94 hover:bg-[#F7F6F2] text-[#1B2B23] text-xs font-semibold border border-[#1B2B23]/12 shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>{t(UI_COPY.fieldJournal, language)}</span>
          </button>

          <button
            type="button"
            onClick={onToggleLanguage}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F7F6F2]/94 hover:bg-[#F7F6F2] text-[#1B2B23] text-xs font-semibold border border-[#1B2B23]/12 shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
            aria-label="Switch language"
          >
            <Globe className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>{language === 'en' ? 'EN · ID' : 'ID · EN'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#F7F6F2]/94 hover:bg-[#F7F6F2] text-[#1B2B23] border border-[#1B2B23]/12 shadow-sm transition-colors cursor-pointer"
            aria-label={muted ? t(UI_COPY.unmute, language) : t(UI_COPY.mute, language)}
          >
            {muted ? <VolumeX className="w-4 h-4 text-[#52665B]" /> : <Volume2 className="w-4 h-4 text-[#2D6A4F]" />}
          </button>
        </div>
      </div>

      {/* Main editorial card anchored left/center leaving generous live 3D forest backdrop visible */}
      <div className="flex-1 flex items-center justify-center md:justify-start my-3 overflow-y-auto bio-scroll">
        <div className="pointer-events-auto w-full max-w-[560px] bg-[#F7F6F2]/95 border border-[#1B2B23]/14 rounded-[28px] p-5 sm:p-7 md:p-8 shadow-xl">
          {/* Bespoke inline SVG botanical emblem & title lockup */}
          <div className="flex items-start gap-3.5 mb-3">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-11 h-11 shrink-0 mt-0.5"
              aria-hidden="true"
            >
              <circle cx="24" cy="24" r="22" fill="#2D6A4F" />
              <path
                d="M14 31C14 20.5 22.5 14 33.5 14C33.5 24.5 26 33 15.5 33"
                stroke="#F7F6F2"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 33.5C18.5 27.5 24.5 22.5 31 17.5"
                stroke="#B7E4C7"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="29" cy="27" r="2.2" fill="#E8D27C" />
            </svg>

            <div>
              <p className="text-xs font-medium text-[#2D6A4F] tracking-wide mb-1">
                {t(UI_COPY.subtitle, language)}
              </p>
              <h1 className="font-display text-2xl sm:text-3xl md:text-[34px] font-semibold leading-tight text-[#1B2B23] text-balance">
                {t(UI_COPY.title, language)}
              </h1>
            </div>
          </div>

          <p className="text-sm text-[#43564B] leading-relaxed mb-5">
            {t(UI_COPY.missionIntro, language)}
          </p>

          {/* Difficulty Selector */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#1B2B23]">
                {t(UI_COPY.selectDifficulty, language)}
              </span>
              <span className="text-xs text-[#52665B]">
                {t(DIFFICULTY_META[difficulty].grade, language)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {DIFFICULTIES.map((level) => {
                const active = level === difficulty;
                const meta = DIFFICULTY_META[level];
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => onSelectDifficulty(level)}
                    className={`px-3 py-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      active
                        ? 'bg-[#2D6A4F] text-[#F7F6F2] border-[#2D6A4F] shadow-sm'
                        : 'bg-[#ECEAE2]/70 hover:bg-[#ECEAE2] text-[#1B2B23] border-[#1B2B23]/10'
                    }`}
                  >
                    <div className="text-sm font-semibold leading-tight">
                      {t(meta.label, language)}
                    </div>
                    <div
                      className={`text-[11px] mt-0.5 truncate ${
                        active ? 'text-[#D8F3DC]' : 'text-[#52665B]'
                      }`}
                    >
                      {level === 'easy' ? 'P3–P4' : level === 'medium' ? 'P5–P6' : 'PSLE+'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active difficulty syllabus & species summary */}
            <div className="rounded-2xl bg-[#ECEAE2]/65 px-4 py-3 border border-[#1B2B23]/8">
              <p className="text-xs font-semibold text-[#2D6A4F] mb-1">
                {t(DIFFICULTY_META[difficulty].focus, language)}
              </p>
              <p className="text-xs text-[#43564B] leading-relaxed">
                {t(DIFFICULTY_META[difficulty].speciesPreview, language)}
              </p>
            </div>
          </div>

          {/* Primary Start CTA */}
          <button
            type="button"
            onClick={onStart}
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#2D6A4F] hover:bg-[#1E4D38] active:scale-[0.99] text-[#F7F6F2] text-base font-semibold shadow-md transition-all cursor-pointer"
          >
            <span>
              {hasStartedBefore
                ? t(UI_COPY.resumeExploring, language)
                : t(UI_COPY.startExploring, language)}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Single flat control hint line */}
      <div className="flex justify-center pointer-events-none">
        <p className="bg-[#1B2B23]/75 text-[#F7F6F2] text-xs px-4 py-1.5 rounded-full text-center">
          {t(UI_COPY.controlsHintTitle, language)}
        </p>
      </div>
    </div>
  );
};
