import React from 'react';
import {
  BookOpen,
  Compass,
  Globe,
  Menu,
  Navigation,
  Search,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { DIFFICULTY_META, t, UI_COPY } from '../data/i18n';
import { Difficulty, Language, RadarTelemetry, SpeciesData } from '../types/game';
import { VirtualJoystick } from './VirtualJoystick';

interface ExploreHudProps {
  difficulty: Difficulty;
  language: Language;
  muted: boolean;
  isTouchDevice: boolean;
  showTouchControls: boolean;
  discoveredInLevel: number;
  totalInLevel: number;
  sciencePoints: number;
  aimedSpecies: SpeciesData | null;
  radar: RadarTelemetry;
  pointerLocked: boolean;
  onMoveInput: (x: number, y: number) => void;
  onInspectAimed: () => void;
  onOpenJournal: () => void;
  onToggleLanguage: () => void;
  onToggleMute: () => void;
  onOpenMenu: () => void;
}

export const ExploreHud: React.FC<ExploreHudProps> = ({
  difficulty,
  language,
  muted,
  isTouchDevice,
  showTouchControls,
  discoveredInLevel,
  totalInLevel,
  sciencePoints,
  aimedSpecies,
  radar,
  pointerLocked,
  onMoveInput,
  onInspectAimed,
  onOpenJournal,
  onToggleLanguage,
  onToggleMute,
  onOpenMenu,
}) => {
  const arrowDeg = (radar.relativeAngleRad * 180) / Math.PI;

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-3 sm:p-5">
      {/* Top Perimeter Cluster */}
      <div className="flex items-start justify-between gap-2">
        {/* Top-Left: Progress + Forest Radar */}
        <div className="flex flex-col gap-2 pointer-events-auto max-w-[68vw] sm:max-w-none">
          <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 bg-[#F7F6F2]/94 border border-[#1B2B23]/14 rounded-full px-4 py-2 shadow-sm">
            <span className="text-xs font-semibold text-[#2D6A4F] whitespace-nowrap">
              {t(DIFFICULTY_META[difficulty].label, language)}
            </span>
            <span className="text-[#1B2B23]/20" aria-hidden="true">·</span>
            <span className="text-xs font-medium text-[#1B2B23] tabular-nums whitespace-nowrap">
              {t(UI_COPY.speciesFound, language)}: <strong>{discoveredInLevel}/{totalInLevel}</strong>
            </span>
            <span className="text-[#1B2B23]/20 hidden sm:inline" aria-hidden="true">·</span>
            <span className="text-xs font-mono font-semibold text-[#2D6A4F] tabular-nums whitespace-nowrap">
              {sciencePoints} pts
            </span>
          </div>

          {/* Forest Radar Distance & Bearing Indicator */}
          <div className="inline-flex items-center gap-2.5 bg-[#F7F6F2]/94 border border-[#1B2B23]/14 rounded-full px-3.5 py-1.5 shadow-sm w-fit">
            <div className="w-6 h-6 rounded-full bg-[#2D6A4F]/12 flex items-center justify-center shrink-0">
              {radar.distanceMeters !== null ? (
                <Navigation
                  className="w-3.5 h-3.5 text-[#2D6A4F] transition-transform duration-150"
                  style={{ transform: `rotate(${arrowDeg}deg)` }}
                />
              ) : (
                <Compass className="w-3.5 h-3.5 text-[#2D6A4F]" />
              )}
            </div>
            {radar.distanceMeters !== null && radar.nearestName ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#52665B] font-medium hidden sm:inline">
                  {t(UI_COPY.radarLabel, language)}
                </span>
                <span className="font-mono font-semibold text-[#1B2B23] tabular-nums">
                  {radar.distanceMeters.toFixed(1)} m
                </span>
                <span className="text-[#1B2B23]/20" aria-hidden="true">·</span>
                <span className="text-[#2D6A4F] font-medium truncate max-w-[140px] sm:max-w-[200px]">
                  {t(radar.nearestName, language)}
                </span>
              </div>
            ) : (
              <span className="text-xs font-semibold text-[#2D6A4F]">
                {t(UI_COPY.allFound, language)}
              </span>
            )}
          </div>
        </div>

        {/* Top-Right: Compact Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0">
          <button
            type="button"
            onClick={onOpenJournal}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 min-h-[40px] rounded-full bg-[#F7F6F2]/94 hover:bg-[#F7F6F2] text-[#1B2B23] text-xs font-semibold border border-[#1B2B23]/14 shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-4 h-4 text-[#2D6A4F]" />
            <span className="hidden sm:inline">{t(UI_COPY.fieldJournal, language)}</span>
          </button>

          <button
            type="button"
            onClick={onToggleLanguage}
            className="inline-flex items-center gap-1 px-3 py-2 min-h-[40px] rounded-full bg-[#F7F6F2]/94 hover:bg-[#F7F6F2] text-[#1B2B23] text-xs font-semibold border border-[#1B2B23]/14 shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
            aria-label="Toggle language"
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

          <button
            type="button"
            onClick={onOpenMenu}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#F7F6F2]/94 hover:bg-[#F7F6F2] text-[#1B2B23] border border-[#1B2B23]/14 shadow-sm transition-colors cursor-pointer"
            aria-label={t(UI_COPY.menu, language)}
          >
            <Menu className="w-4 h-4 text-[#1B2B23]" />
          </button>
        </div>
      </div>

      {/* Center Precision Reticle + Creature Lock-On Prompt */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative flex flex-col items-center">
          <div
            className={`rounded-full border-2 transition-all duration-150 ${
              aimedSpecies
                ? 'w-9 h-9 border-[#F7F6F2] bg-[#2D6A4F]/25 scale-110'
                : 'w-2.5 h-2.5 border-[#F7F6F2]/90 bg-[#1B2B23]/35'
            }`}
          />
          {aimedSpecies && (
            <button
              type="button"
              onClick={onInspectAimed}
              className="pointer-events-auto mt-3 inline-flex items-center gap-2 bg-[#F7F6F2]/95 hover:bg-[#F7F6F2] text-[#1B2B23] px-4 py-2 rounded-full border border-[#2D6A4F]/30 shadow-lg cursor-pointer transition-transform active:scale-95"
            >
              <Search className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span className="text-xs font-semibold">
                {t(aimedSpecies.name, language)}
              </span>
              <span className="text-[#1B2B23]/25" aria-hidden="true">·</span>
              <span className="text-xs text-[#2D6A4F] font-medium">
                {isTouchDevice ? t(UI_COPY.tapToInspect, language) : t(UI_COPY.clickToInspect, language)}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Perimeter: Touch Joystick + Discreet Control Hint */}
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-[112px]">
          {showTouchControls && <VirtualJoystick onMove={onMoveInput} />}
        </div>

        <div className="flex-1 flex justify-center">
          <div className="bg-[#1B2B23]/72 text-[#F7F6F2] text-[11px] sm:text-xs px-4 py-1.5 rounded-full text-center max-w-[90vw] truncate">
            {isTouchDevice
              ? t(UI_COPY.controlsHintMobile, language)
              : pointerLocked
                ? t(UI_COPY.controlsHintDesktop, language)
                : t(UI_COPY.pointerLockHint, language)}
          </div>
        </div>

        <div className="hidden sm:block min-w-[112px]" />
      </div>
    </div>
  );
};
