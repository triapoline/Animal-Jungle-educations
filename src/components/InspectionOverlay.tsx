import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Globe,
  HelpCircle,
  Rotate3d,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { t, UI_COPY } from '../data/i18n';
import { Language, SpeciesData, SpeciesProgress } from '../types/game';

interface InspectionOverlayProps {
  species: SpeciesData;
  progress: SpeciesProgress;
  activeHotspotId: string;
  language: Language;
  muted: boolean;
  bubbleRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
  onSelectHotspot: (hotspotId: string) => void;
  onAnswerQuiz: (optionIndex: number) => void;
  onReturnToForest: () => void;
  onToggleLanguage: () => void;
  onToggleMute: () => void;
}

export const InspectionOverlay: React.FC<InspectionOverlayProps> = ({
  species,
  progress,
  activeHotspotId,
  language,
  muted,
  bubbleRefs,
  onSelectHotspot,
  onAnswerQuiz,
  onReturnToForest,
  onToggleLanguage,
  onToggleMute,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(
    progress.quizCorrect ? species.quiz.correctIndex : null,
  );
  const [mobileTab, setMobileTab] = useState<'details' | 'quiz'>('details');
  const [mobileCollapsed, setMobileCollapsed] = useState(false);

  // Reset local option choice whenever a different species is inspected
  useEffect(() => {
    setSelectedOption(progress.quizCorrect ? species.quiz.correctIndex : null);
    setMobileTab('details');
    setMobileCollapsed(false);
  }, [species.id, progress.quizCorrect, species.quiz.correctIndex]);

  const activeHotspot =
    species.hotspots.find((h) => h.id === activeHotspotId) ?? species.hotspots[0];
  const exploredCount = progress.exploredHotspots.length;
  const totalHotspots = species.hotspots.length;

  const handleChooseOption = (idx: number) => {
    if (progress.quizCorrect) return;
    setSelectedOption(idx);
    onAnswerQuiz(idx);
  };

  const renderDetailsContent = () => (
    <div className="space-y-4">
      {/* Species Header */}
      <div className="border-b border-[#1B2B23]/10 pb-3.5">
        <div className="flex items-center gap-2 text-xs text-[#2D6A4F] font-semibold mb-1">
          <span>{t(species.groupLabel, language)}</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#52665B] font-medium truncate">
            {t(species.syllabusFocus, language)}
          </span>
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#1B2B23] leading-snug">
          {t(species.name, language)}
        </h2>
        <p className="text-xs italic text-[#52665B] mt-0.5">{species.scientificName}</p>
      </div>

      {/* Discovery Counter Bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-[#1B2B23]">
            {t(UI_COPY.partsExplored, language)}
          </span>
          <span className="font-mono font-semibold text-[#2D6A4F] tabular-nums">
            {exploredCount}/{totalHotspots}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-[#ECEAE2] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#2D6A4F] transition-all duration-300"
            style={{ width: `${(exploredCount / totalHotspots) * 100}%` }}
          />
        </div>
      </div>

      {/* Active Hotspot Detail */}
      {activeHotspot && (
        <div className="rounded-2xl bg-[#ECEAE2]/75 p-4 border border-[#1B2B23]/8 space-y-2">
          <div className="text-xs font-semibold text-[#2D6A4F]">
            {t(activeHotspot.conceptTag, language)}
          </div>
          <h3 className="text-base font-bold text-[#1B2B23] leading-snug">
            {t(activeHotspot.label, language)}
          </h3>
          <p className="text-[13.5px] leading-relaxed text-[#2D3E35]">
            {t(activeHotspot.explanation, language)}
          </p>
        </div>
      )}

      {/* Habitat metadata */}
      <div className="text-xs text-[#52665B] flex items-center justify-between pt-1">
        <span className="font-semibold text-[#1B2B23]">{t(UI_COPY.habitat, language)}</span>
        <span className="text-right">{t(species.habitat, language)}</span>
      </div>
    </div>
  );

  const renderChecklistAndQuiz = () => {
    const isAnsweredCorrect = progress.quizCorrect;
    const isWrongAttempt =
      selectedOption !== null && selectedOption !== species.quiz.correctIndex && !isAnsweredCorrect;

    return (
      <div className="space-y-4">
        {/* Interactive Hotspot Checklist */}
        <div>
          <h3 className="text-xs font-semibold text-[#52665B] mb-2">
            {t(UI_COPY.anatomyChecklist, language)}
          </h3>
          <div className="space-y-1.5">
            {species.hotspots.map((hs, idx) => {
              const explored = progress.exploredHotspots.includes(hs.id);
              const isSelected = hs.id === activeHotspotId;
              return (
                <button
                  key={hs.id}
                  type="button"
                  onClick={() => onSelectHotspot(hs.id)}
                  className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer border ${
                    isSelected
                      ? 'bg-[#2D6A4F] text-[#F7F6F2] border-[#2D6A4F]'
                      : 'bg-[#ECEAE2]/65 hover:bg-[#ECEAE2] text-[#1B2B23] border-[#1B2B23]/8'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {explored ? (
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? 'text-[#B7E4C7]' : 'text-[#2D6A4F]'
                        }`}
                      />
                    ) : (
                      <Circle
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? 'text-[#F7F6F2]/70' : 'text-[#52665B]/55'
                        }`}
                      />
                    )}
                    <span className="font-medium truncate">
                      {idx + 1}. {t(hs.label, language)}
                    </span>
                  </div>
                  {explored && (
                    <span
                      className={`font-mono text-[10px] shrink-0 ${
                        isSelected ? 'text-[#D8F3DC]' : 'text-[#2D6A4F]'
                      }`}
                    >
                      +15
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 1-Question MOE Quick Check */}
        <div className="border-t border-[#1B2B23]/10 pt-3.5 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D6A4F]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t(UI_COPY.moeQuickCheck, language)}</span>
            </div>
            <span className="text-xs font-mono font-semibold text-[#2D6A4F] tabular-nums">
              +{species.quiz.points} pts
            </span>
          </div>

          <p className="text-[13px] font-semibold text-[#1B2B23] leading-snug">
            {t(species.quiz.question, language)}
          </p>

          <div className="space-y-1.5">
            {species.quiz.options.map((opt, idx) => {
              const isCorrectOption = idx === species.quiz.correctIndex;
              const isPicked = selectedOption === idx;

              let btnStyle =
                'bg-[#ECEAE2]/70 hover:bg-[#ECEAE2] text-[#1B2B23] border-[#1B2B23]/10';
              if (isAnsweredCorrect && isCorrectOption) {
                btnStyle = 'bg-[#2D6A4F] text-[#F7F6F2] border-[#2D6A4F]';
              } else if (isPicked && !isCorrectOption) {
                btnStyle = 'bg-[#A63A3A]/14 text-[#7D2222] border-[#A63A3A]/45';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnsweredCorrect}
                  onClick={() => handleChooseOption(idx)}
                  className={`w-full flex items-start gap-2 px-3 py-2 rounded-xl text-left text-xs leading-snug border transition-colors ${
                    isAnsweredCorrect ? 'cursor-default' : 'cursor-pointer'
                  } ${btnStyle}`}
                >
                  <span className="font-mono font-semibold shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span className="flex-1">{t(opt, language)}</span>
                  {isAnsweredCorrect && isCorrectOption && (
                    <Check className="w-4 h-4 shrink-0 text-[#B7E4C7]" />
                  )}
                </button>
              );
            })}
          </div>

          {isAnsweredCorrect && (
            <div className="rounded-xl bg-[#2D6A4F]/12 border border-[#2D6A4F]/25 p-3 text-xs text-[#1B2B23] space-y-1">
              <div className="font-semibold text-[#2D6A4F]">
                {t(UI_COPY.correctFeedback, language)}
              </div>
              <p className="leading-relaxed text-[#2D3E35]">
                {t(species.quiz.explanation, language)}
              </p>
            </div>
          )}

          {isWrongAttempt && (
            <div className="rounded-xl bg-[#A63A3A]/10 border border-[#A63A3A]/25 p-2.5 text-xs text-[#7D2222]">
              {t(UI_COPY.incorrectFeedback, language)}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-20 pointer-events-none">
      {/* Floating 3D-Projected Hotspot Bubbles (updated directly via refs at 60fps) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {species.hotspots.map((hs, idx) => {
          const explored = progress.exploredHotspots.includes(hs.id);
          const active = hs.id === activeHotspotId;
          return (
            <button
              key={hs.id}
              ref={(el) => {
                bubbleRefs.current[hs.id] = el;
              }}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot(hs.id);
                setMobileTab('details');
              }}
              style={{
                opacity: 0,
                transform: 'translate3d(-9999px, -9999px, 0)',
              }}
              className={`pointer-events-auto fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg border transition-colors cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-[#2D6A4F] text-[#F7F6F2] border-[#F7F6F2] z-30'
                  : explored
                    ? 'bg-[#F7F6F2]/95 text-[#2D6A4F] border-[#2D6A4F]/45 hover:bg-[#F7F6F2] z-20'
                    : 'bg-[#F7F6F2]/95 text-[#1B2B23] border-[#1B2B23]/20 hover:border-[#2D6A4F] z-20'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                  active
                    ? 'bg-[#F7F6F2] text-[#2D6A4F]'
                    : explored
                      ? 'bg-[#2D6A4F] text-[#F7F6F2]'
                      : 'bg-[#ECEAE2] text-[#1B2B23]'
                }`}
              >
                {explored ? <Check className="w-2.5 h-2.5" /> : idx + 1}
              </span>
              <span>{t(hs.label, language)}</span>
            </button>
          );
        })}
      </div>

      {/* Top Inspection Bar */}
      <div className="fixed top-3 sm:top-5 inset-x-3 sm:inset-x-5 flex items-center justify-between gap-2 pointer-events-none z-30">
        <button
          type="button"
          onClick={onReturnToForest}
          className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#2D6A4F] hover:bg-[#1E4D38] text-[#F7F6F2] text-xs sm:text-sm font-semibold shadow-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t(UI_COPY.returnToForest, language)}</span>
        </button>

        <div className="hidden md:flex items-center gap-2 bg-[#1B2B23]/72 text-[#F7F6F2] text-xs px-4 py-1.5 rounded-full">
          <Rotate3d className="w-3.5 h-3.5 text-[#B7E4C7]" />
          <span>{t(UI_COPY.dragToOrbit, language)}</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleLanguage}
            className="inline-flex items-center gap-1 px-3 py-2 min-h-[40px] rounded-full bg-[#F7F6F2]/94 hover:bg-[#F7F6F2] text-[#1B2B23] text-xs font-semibold border border-[#1B2B23]/14 shadow-sm transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>{language.toUpperCase()}</span>
          </button>
          <button
            type="button"
            onClick={onToggleMute}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#F7F6F2]/94 hover:bg-[#F7F6F2] text-[#1B2B23] border border-[#1B2B23]/14 shadow-sm transition-colors cursor-pointer"
            aria-label={muted ? t(UI_COPY.unmute, language) : t(UI_COPY.mute, language)}
          >
            {muted ? <VolumeX className="w-4 h-4 text-[#52665B]" /> : <Volume2 className="w-4 h-4 text-[#2D6A4F]" />}
          </button>
        </div>
      </div>

      {/* DESKTOP: Left Detail Card + Right Checklist & MOE Quick Check */}
      <aside className="hidden lg:flex pointer-events-auto fixed left-5 top-20 bottom-6 w-[310px] xl:w-[332px] flex-col bg-[#F7F6F2]/95 border border-[#1B2B23]/14 rounded-[24px] p-5 shadow-xl overflow-y-auto bio-scroll z-30">
        {renderDetailsContent()}
      </aside>

      <aside className="hidden lg:flex pointer-events-auto fixed right-5 top-20 bottom-6 w-[320px] xl:w-[344px] flex-col justify-between bg-[#F7F6F2]/95 border border-[#1B2B23]/14 rounded-[24px] p-5 shadow-xl overflow-y-auto bio-scroll z-30">
        {renderChecklistAndQuiz()}
      </aside>

      {/* MOBILE / TABLET: Compact Collapsible Bottom Drawer (preserves 3D viewport center!) */}
      <div className="lg:hidden pointer-events-auto fixed bottom-0 inset-x-0 z-30 px-3 pb-3">
        <div className="bg-[#F7F6F2]/96 border border-[#1B2B23]/16 rounded-[24px] shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-[#1B2B23]/10">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setMobileTab('details');
                  setMobileCollapsed(false);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  mobileTab === 'details' && !mobileCollapsed
                    ? 'bg-[#2D6A4F] text-[#F7F6F2]'
                    : 'bg-[#ECEAE2] text-[#1B2B23]'
                }`}
              >
                {t(UI_COPY.tabDetails, language)} ({exploredCount}/{totalHotspots})
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileTab('quiz');
                  setMobileCollapsed(false);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  mobileTab === 'quiz' && !mobileCollapsed
                    ? 'bg-[#2D6A4F] text-[#F7F6F2]'
                    : 'bg-[#ECEAE2] text-[#1B2B23]'
                }`}
              >
                {t(UI_COPY.tabQuiz, language)}
                {progress.quizCorrect ? ' ✓' : ''}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMobileCollapsed((v) => !v)}
              className="w-9 h-9 rounded-full bg-[#ECEAE2] flex items-center justify-center text-[#1B2B23] cursor-pointer"
              aria-label={mobileCollapsed ? 'Expand panel' : 'Collapse panel'}
            >
              {mobileCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {!mobileCollapsed && (
            <div className="p-4 max-h-[44vh] overflow-y-auto bio-scroll">
              {mobileTab === 'details' ? renderDetailsContent() : renderChecklistAndQuiz()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
