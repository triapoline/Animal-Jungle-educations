import React from 'react';
import { ArrowRight, Award, Compass } from 'lucide-react';
import { DIFFICULTY_META, t, UI_COPY } from '../data/i18n';
import { Difficulty, Language } from '../types/game';

interface LevelCompleteModalProps {
  open: boolean;
  difficulty: Difficulty;
  language: Language;
  totalPoints: number;
  onNextDifficulty: (next: Difficulty) => void;
  onKeepExploring: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  open,
  difficulty,
  language,
  totalPoints,
  onNextDifficulty,
  onKeepExploring,
}) => {
  if (!open) return null;

  const nextLevel: Difficulty | null =
    difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'hard' : null;

  return (
    <div
      className="fixed inset-0 z-40 bg-[#1B2B23]/65 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-[#F7F6F2] border border-[#1B2B23]/16 rounded-[28px] p-6 sm:p-7 shadow-2xl text-center">
        <div className="w-14 h-14 rounded-full bg-[#2D6A4F]/12 text-[#2D6A4F] flex items-center justify-center mx-auto mb-4">
          <Award className="w-7 h-7" />
        </div>

        <p className="text-xs font-semibold text-[#2D6A4F] mb-1">
          {t(DIFFICULTY_META[difficulty].label, language)} ·{' '}
          {t(DIFFICULTY_META[difficulty].grade, language)}
        </p>

        <h2 className="font-display text-2xl font-semibold text-[#1B2B23] mb-2">
          {t(UI_COPY.expeditionCompleteTitle, language)}
        </h2>

        <p className="text-sm text-[#43564B] leading-relaxed mb-5">
          {t(UI_COPY.expeditionCompleteBody, language)}
        </p>

        <div className="rounded-2xl bg-[#ECEAE2]/70 py-3 px-4 mb-6 flex items-center justify-center gap-3">
          <span className="text-xs font-medium text-[#52665B]">
            {t(UI_COPY.sciencePoints, language)}
          </span>
          <span className="font-mono text-lg font-semibold text-[#2D6A4F] tabular-nums">
            {totalPoints} pts
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {nextLevel && (
            <button
              type="button"
              onClick={() => onNextDifficulty(nextLevel)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#2D6A4F] hover:bg-[#1E4D38] text-[#F7F6F2] text-sm font-semibold transition-colors cursor-pointer"
            >
              <span>
                {t(UI_COPY.nextDifficulty, language)} ({t(DIFFICULTY_META[nextLevel].label, language)})
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onKeepExploring}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#ECEAE2] hover:bg-[#E0DDD2] text-[#1B2B23] text-sm font-semibold transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#2D6A4F]" />
            <span>{t(UI_COPY.keepExploring, language)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
