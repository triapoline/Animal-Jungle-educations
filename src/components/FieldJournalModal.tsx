import React from 'react';
import { Award, CheckCircle2, Lock, RotateCcw, X } from 'lucide-react';
import { DIFFICULTY_META, t, UI_COPY } from '../data/i18n';
import { SPECIES_DATA } from '../data/species';
import { Difficulty, Language, SpeciesProgress } from '../types/game';

interface FieldJournalModalProps {
  open: boolean;
  language: Language;
  activeDifficulty: Difficulty;
  progressMap: Record<string, SpeciesProgress>;
  totalPoints: number;
  onClose: () => void;
  onSwitchDifficulty: (d: Difficulty) => void;
  onInspectSpecies: (speciesId: string) => void;
  onResetProgress: () => void;
}

const LEVELS: Difficulty[] = ['easy', 'medium', 'hard'];

export const FieldJournalModal: React.FC<FieldJournalModalProps> = ({
  open,
  language,
  activeDifficulty,
  progressMap,
  totalPoints,
  onClose,
  onSwitchDifficulty,
  onInspectSpecies,
  onResetProgress,
}) => {
  if (!open) return null;

  const discoveredTotal = Object.values(progressMap).filter((p) => p.discovered).length;
  const quizzesMastered = Object.values(progressMap).filter((p) => p.quizCorrect).length;

  return (
    <div
      className="fixed inset-0 z-40 bg-[#1B2B23]/65 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={t(UI_COPY.fieldJournal, language)}
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#F7F6F2] border border-[#1B2B23]/16 rounded-[28px] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 sm:px-7 py-5 border-b border-[#1B2B23]/10">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#1B2B23]">
              {t(UI_COPY.fieldJournal, language)}
            </h2>
            <p className="text-xs sm:text-sm text-[#52665B] mt-0.5">
              {t(UI_COPY.journalSubtitle, language)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#ECEAE2] hover:bg-[#DFDDD2] flex items-center justify-center text-[#1B2B23] transition-colors cursor-pointer shrink-0"
            aria-label={t(UI_COPY.close, language)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Metrics Row */}
        <div className="grid grid-cols-3 gap-3 px-5 sm:px-7 py-3.5 bg-[#ECEAE2]/55 border-b border-[#1B2B23]/8">
          <div>
            <div className="text-[11px] font-medium text-[#52665B]">
              {t(UI_COPY.speciesFound, language)}
            </div>
            <div className="text-lg font-mono font-semibold text-[#1B2B23] tabular-nums">
              {discoveredTotal} / 12
            </div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#52665B]">
              {t(UI_COPY.quizMastered, language)}
            </div>
            <div className="text-lg font-mono font-semibold text-[#2D6A4F] tabular-nums">
              {quizzesMastered} / 12
            </div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#52665B]">
              {t(UI_COPY.sciencePoints, language)}
            </div>
            <div className="text-lg font-mono font-semibold text-[#2D6A4F] tabular-nums">
              {totalPoints} pts
            </div>
          </div>
        </div>

        {/* Scrollable Species Grid grouped by MOE Tier */}
        <div className="flex-1 overflow-y-auto bio-scroll p-5 sm:p-7 space-y-6">
          {LEVELS.map((level) => {
            const groupSpecies = SPECIES_DATA.filter((s) => s.difficulty === level);
            const isCurrent = level === activeDifficulty;
            return (
              <section key={level} className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[#1B2B23]">
                      {t(DIFFICULTY_META[level].label, language)} —{' '}
                      <span className="text-[#2D6A4F]">
                        {t(DIFFICULTY_META[level].grade, language)}
                      </span>
                    </h3>
                    <p className="text-xs text-[#52665B]">
                      {t(DIFFICULTY_META[level].focus, language)}
                    </p>
                  </div>
                  {!isCurrent && (
                    <button
                      type="button"
                      onClick={() => onSwitchDifficulty(level)}
                      className="px-3.5 py-1.5 rounded-full bg-[#2D6A4F] hover:bg-[#1E4D38] text-[#F7F6F2] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {t(UI_COPY.switchLevel, language)}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {groupSpecies.map((sp) => {
                    const prog = progressMap[sp.id];
                    const found = Boolean(prog?.discovered);
                    const parts = prog?.exploredHotspots.length ?? 0;
                    const quizzed = Boolean(prog?.quizCorrect);

                    return (
                      <div
                        key={sp.id}
                        className={`rounded-2xl p-4 border transition-colors ${
                          found
                            ? 'bg-white border-[#2D6A4F]/25'
                            : 'bg-[#ECEAE2]/50 border-[#1B2B23]/8'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <div className="text-[11px] font-semibold text-[#2D6A4F]">
                              {t(sp.groupLabel, language)} · {t(sp.syllabusFocus, language)}
                            </div>
                            <h4 className="font-semibold text-sm text-[#1B2B23] mt-0.5">
                              {t(sp.name, language)}
                            </h4>
                            <p className="text-[11px] italic text-[#52665B]">
                              {sp.scientificName}
                            </p>
                          </div>
                          {found ? (
                            <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] shrink-0" />
                          ) : (
                            <Lock className="w-4 h-4 text-[#52665B]/55 shrink-0 mt-0.5" />
                          )}
                        </div>

                        <p className="text-xs text-[#43564B] leading-relaxed mb-3">
                          {found ? t(sp.summary, language) : t(sp.habitat, language)}
                        </p>

                        <div className="flex items-center justify-between gap-2 text-[11px] border-t border-[#1B2B23]/8 pt-2.5">
                          <div className="flex items-center gap-2 text-[#52665B] tabular-nums">
                            <span>
                              {t(UI_COPY.partsExplored, language)}: <strong>{parts}/4</strong>
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className={quizzed ? 'text-[#2D6A4F] font-semibold' : ''}>
                              {quizzed
                                ? t(UI_COPY.quizMastered, language)
                                : t(UI_COPY.quizPending, language)}
                            </span>
                          </div>

                          {found && isCurrent && (
                            <button
                              type="button"
                              onClick={() => onInspectSpecies(sp.id)}
                              className="text-xs font-semibold text-[#2D6A4F] hover:underline cursor-pointer whitespace-nowrap"
                            >
                              {language === 'en' ? 'Inspect 3D' : 'Amati 3D'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 py-4 border-t border-[#1B2B23]/10 bg-[#ECEAE2]/40">
          <button
            type="button"
            onClick={onResetProgress}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#52665B] hover:text-[#7D2222] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t(UI_COPY.resetProgress, language)}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D6A4F] hover:bg-[#1E4D38] text-[#F7F6F2] text-xs font-semibold transition-colors cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>{t(UI_COPY.close, language)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
