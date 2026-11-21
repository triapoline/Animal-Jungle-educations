/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ExploreHud } from './components/ExploreHud';
import { FieldJournalModal } from './components/FieldJournalModal';
import { InspectionOverlay } from './components/InspectionOverlay';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { TitleScreen } from './components/TitleScreen';
import { t, UI_COPY } from './data/i18n';
import { getSpeciesByDifficulty, getSpeciesById } from './data/species';
import { bioAudio } from './engine/audio';
import { BioQuestEngine } from './engine/BioQuestEngine';
import {
  Difficulty,
  GameMode,
  Language,
  ProjectedHotspot,
  RadarTelemetry,
  SpeciesProgress,
} from './types/game';

const STORAGE_KEY = 'bioquest3d_progress_v1';

interface SavedState {
  progressMap: Record<string, SpeciesProgress>;
  points: number;
  language: Language;
  completedTiers: Difficulty[];
}

function loadSavedState(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { progressMap: {}, points: 0, language: 'en', completedTiers: [] };
    }
    const parsed = JSON.parse(raw) as Partial<SavedState>;
    return {
      progressMap: parsed.progressMap ?? {},
      points: typeof parsed.points === 'number' ? parsed.points : 0,
      language: parsed.language === 'id' ? 'id' : 'en',
      completedTiers: Array.isArray(parsed.completedTiers) ? parsed.completedTiers : [],
    };
  } catch {
    return { progressMap: {}, points: 0, language: 'en', completedTiers: [] };
  }
}

export default function App() {
  const initialSaved = useMemo(() => loadSavedState(), []);

  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<BioQuestEngine | null>(null);
  const bubbleRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [mode, setMode] = useState<GameMode>('title');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [language, setLanguage] = useState<Language>(initialSaved.language);
  const [muted, setMuted] = useState(false);
  const [hasStartedBefore, setHasStartedBefore] = useState(false);

  const [progressMap, setProgressMap] = useState<Record<string, SpeciesProgress>>(
    initialSaved.progressMap,
  );
  const [sciencePoints, setSciencePoints] = useState<number>(initialSaved.points);
  const [completedTiers, setCompletedTiers] = useState<Difficulty[]>(initialSaved.completedTiers);

  const [aimedSpeciesId, setAimedSpeciesId] = useState<string | null>(null);
  const [inspectedSpeciesId, setInspectedSpeciesId] = useState<string | null>(null);
  const [activeHotspotId, setActiveHotspotId] = useState<string>('');
  const [pointerLocked, setPointerLocked] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const [journalOpen, setJournalOpen] = useState(false);
  const [levelCompleteOpen, setLevelCompleteOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const [radar, setRadar] = useState<RadarTelemetry>({
    nearestName: null,
    nearestId: null,
    distanceMeters: null,
    relativeAngleRad: 0,
    remainingCount: 4,
  });

  // Detect touch screens once on mount
  useEffect(() => {
    const touch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 900);
    setIsTouchDevice(touch);
  }, []);

  // Persist progress cleanly to localStorage
  useEffect(() => {
    try {
      const payload: SavedState = {
        progressMap,
        points: sciencePoints,
        language,
        completedTiers,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota issues
    }
  }, [progressMap, sciencePoints, language, completedTiers]);

  // Ref-stored callbacks so the mounted Three.js engine never recreates on React state updates
  const openInspectionRef = useRef<(speciesId: string) => void>(() => {});
  const requestMenuRef = useRef<() => void>(() => {});

  const handleOpenInspection = useCallback((speciesId: string) => {
    const species = getSpeciesById(speciesId);
    if (!species) return;
    const firstHotspotId = species.hotspots[0]?.id ?? '';

    const entered = engineRef.current?.enterInspection(speciesId, firstHotspotId);
    if (!entered) return;

    bioAudio.playDiscover();
    setInspectedSpeciesId(speciesId);
    setActiveHotspotId(firstHotspotId);
    setMode('inspect');
    setJournalOpen(false);

    // Immediately mark species discovered & auto-explore its first detail hotspot (1/4)
    setProgressMap((prev) => {
      const existing = prev[speciesId] ?? {
        discovered: false,
        exploredHotspots: [],
        quizAnswered: false,
        quizCorrect: false,
      };
      const alreadyExploredFirst = existing.exploredHotspots.includes(firstHotspotId);
      const nextExplored = alreadyExploredFirst
        ? existing.exploredHotspots
        : [...existing.exploredHotspots, firstHotspotId];

      let bonus = 0;
      if (!existing.discovered) bonus += 20;
      if (!alreadyExploredFirst && firstHotspotId) bonus += 15;
      if (bonus > 0) {
        setSciencePoints((p) => p + bonus);
      }

      return {
        ...prev,
        [speciesId]: {
          ...existing,
          discovered: true,
          exploredHotspots: nextExplored,
        },
      };
    });
  }, []);

  openInspectionRef.current = handleOpenInspection;

  requestMenuRef.current = () => {
    setMode('title');
    engineRef.current?.setMode('title');
  };

  // Mount Three.js engine strictly ONCE inside isolated canvas container
  useEffect(() => {
    const mountEl = canvasMountRef.current;
    if (!mountEl) return;

    const engine = new BioQuestEngine(mountEl, {
      onAimedCreatureChange: (id) => setAimedSpeciesId(id),
      onSelectCreature: (id) => openInspectionRef.current(id),
      onHotspotsProjected: (projected: ProjectedHotspot[]) => {
        // Direct DOM transform update (0 React re-renders per animation frame!)
        for (const item of projected) {
          const el = bubbleRefs.current[item.id];
          if (!el) continue;
          if (item.visible) {
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
            el.style.transform = `translate3d(${item.x.toFixed(1)}px, ${item.y.toFixed(1)}px, 0) translate(-50%, -50%)`;
          } else {
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
          }
        }
      },
      onRadarUpdate: (telemetry) => setRadar(telemetry),
      onPointerLockChange: (locked) => setPointerLocked(locked),
      onContextLostChange: (lost) => setContextLost(lost),
      onRequestMenu: () => requestMenuRef.current(),
    });

    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
      bioAudio.dispose();
    };
  }, []);

  // Sync discovered species visual rings into the 3D engine
  useEffect(() => {
    const discoveredIds = new Set(
      Object.entries(progressMap)
        .filter(([, p]) => p.discovered)
        .map(([id]) => id),
    );
    engineRef.current?.setDiscoveredSpecies(discoveredIds);
  }, [progressMap]);

  // Pause 3D input when modals are open
  useEffect(() => {
    engineRef.current?.setPaused(journalOpen || levelCompleteOpen);
  }, [journalOpen, levelCompleteOpen]);

  const handleSelectDifficulty = useCallback(
    (nextDiff: Difficulty) => {
      bioAudio.playUiClick();
      setDifficulty(nextDiff);
      const discoveredIds = new Set(
        Object.entries(progressMap)
          .filter(([, p]) => p.discovered)
          .map(([id]) => id),
      );
      engineRef.current?.loadDifficulty(nextDiff, discoveredIds);
    },
    [progressMap],
  );

  const handleStartExploring = useCallback(() => {
    bioAudio.playUiClick();
    bioAudio.startAmbience();
    setHasStartedBefore(true);
    setMode('explore');
    engineRef.current?.setMode('explore');
  }, []);

  const handleToggleLanguage = useCallback(() => {
    bioAudio.playUiClick();
    setLanguage((prev) => (prev === 'en' ? 'id' : 'en'));
  }, []);

  const handleToggleMute = useCallback(() => {
    const nextMuted = bioAudio.toggleMute();
    setMuted(nextMuted);
  }, []);

  const handleSelectHotspot = useCallback(
    (hotspotId: string) => {
      if (!inspectedSpeciesId) return;
      bioAudio.playHotspot();
      setActiveHotspotId(hotspotId);
      engineRef.current?.focusHotspot(hotspotId);

      setProgressMap((prev) => {
        const existing = prev[inspectedSpeciesId] ?? {
          discovered: true,
          exploredHotspots: [],
          quizAnswered: false,
          quizCorrect: false,
        };
        if (existing.exploredHotspots.includes(hotspotId)) {
          return prev;
        }
        setSciencePoints((p) => p + 15);
        return {
          ...prev,
          [inspectedSpeciesId]: {
            ...existing,
            exploredHotspots: [...existing.exploredHotspots, hotspotId],
          },
        };
      });
    },
    [inspectedSpeciesId],
  );

  const handleAnswerQuiz = useCallback(
    (optionIndex: number) => {
      if (!inspectedSpeciesId) return;
      const species = getSpeciesById(inspectedSpeciesId);
      if (!species) return;

      const isCorrect = optionIndex === species.quiz.correctIndex;
      if (isCorrect) {
        bioAudio.playCorrect();
      } else {
        bioAudio.playIncorrect();
      }

      setProgressMap((prev) => {
        const existing = prev[inspectedSpeciesId] ?? {
          discovered: true,
          exploredHotspots: [],
          quizAnswered: false,
          quizCorrect: false,
        };
        if (existing.quizCorrect) return prev;

        if (isCorrect) {
          setSciencePoints((p) => p + species.quiz.points);
        }

        const nextMap: Record<string, SpeciesProgress> = {
          ...prev,
          [inspectedSpeciesId]: {
            ...existing,
            quizAnswered: true,
            quizCorrect: isCorrect,
          },
        };

        // Check if all 4 species in the current difficulty now have their quiz mastered
        if (isCorrect && !completedTiers.includes(difficulty)) {
          const tierSpecies = getSpeciesByDifficulty(difficulty);
          const allDone = tierSpecies.every((sp) => nextMap[sp.id]?.quizCorrect);
          if (allDone) {
            setCompletedTiers((tiers) => [...tiers, difficulty]);
            window.setTimeout(() => {
              setLevelCompleteOpen(true);
            }, 950);
          }
        }

        return nextMap;
      });
    },
    [inspectedSpeciesId, difficulty, completedTiers],
  );

  const handleReturnToForest = useCallback(() => {
    bioAudio.playUiClick();
    setInspectedSpeciesId(null);
    setMode('explore');
    engineRef.current?.exitInspection();
  }, []);

  const handleSwitchDifficultyFromModal = useCallback(
    (nextDiff: Difficulty) => {
      handleSelectDifficulty(nextDiff);
      setJournalOpen(false);
      setLevelCompleteOpen(false);
      setInspectedSpeciesId(null);
      setHasStartedBefore(true);
      setMode('explore');
      engineRef.current?.setMode('explore');
    },
    [handleSelectDifficulty],
  );

  const handleResetProgress = useCallback(() => {
    bioAudio.playUiClick();
    setProgressMap({});
    setSciencePoints(0);
    setCompletedTiers([]);
    engineRef.current?.setDiscoveredSpecies(new Set());
  }, []);

  const levelSpecies = useMemo(() => getSpeciesByDifficulty(difficulty), [difficulty]);
  const discoveredInLevel = useMemo(
    () => levelSpecies.filter((s) => progressMap[s.id]?.discovered).length,
    [levelSpecies, progressMap],
  );
  const totalDiscovered = useMemo(
    () => Object.values(progressMap).filter((p) => p.discovered).length,
    [progressMap],
  );

  const aimedSpecies = useMemo(
    () => (aimedSpeciesId ? getSpeciesById(aimedSpeciesId) ?? null : null),
    [aimedSpeciesId],
  );
  const inspectedSpecies = useMemo(
    () => (inspectedSpeciesId ? getSpeciesById(inspectedSpeciesId) ?? null : null),
    [inspectedSpeciesId],
  );

  const inspectedProgress: SpeciesProgress = useMemo(() => {
    if (!inspectedSpeciesId || !progressMap[inspectedSpeciesId]) {
      return {
        discovered: true,
        exploredHotspots: [],
        quizAnswered: false,
        quizCorrect: false,
      };
    }
    return progressMap[inspectedSpeciesId];
  }, [inspectedSpeciesId, progressMap]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1B2B23]">
      {/* Isolated WebGL Viewport Container */}
      <div ref={canvasMountRef} className="fixed inset-0 z-0" />

      {/* Graceful WebGL Context Loss Banner */}
      {contextLost && (
        <div className="fixed inset-0 z-50 bg-[#1B2B23]/85 flex items-center justify-center p-6">
          <div className="bg-[#F7F6F2] text-[#1B2B23] rounded-3xl px-6 py-5 text-sm font-medium shadow-xl">
            {t(UI_COPY.webglLost, language)}
          </div>
        </div>
      )}

      {/* Title / Expedition Setup Overlay */}
      {mode === 'title' && (
        <TitleScreen
          difficulty={difficulty}
          language={language}
          muted={muted}
          totalPoints={sciencePoints}
          totalDiscovered={totalDiscovered}
          hasStartedBefore={hasStartedBefore}
          onSelectDifficulty={handleSelectDifficulty}
          onStart={handleStartExploring}
          onToggleLanguage={handleToggleLanguage}
          onToggleMute={handleToggleMute}
          onOpenJournal={() => {
            bioAudio.playUiClick();
            setJournalOpen(true);
          }}
        />
      )}

      {/* Active First-Person Forest Exploration HUD */}
      {mode === 'explore' && (
        <ExploreHud
          difficulty={difficulty}
          language={language}
          muted={muted}
          isTouchDevice={isTouchDevice}
          showTouchControls={isTouchDevice}
          discoveredInLevel={discoveredInLevel}
          totalInLevel={levelSpecies.length}
          sciencePoints={sciencePoints}
          aimedSpecies={aimedSpecies}
          radar={radar}
          pointerLocked={pointerLocked}
          onMoveInput={(x, y) => engineRef.current?.setVirtualMoveInput(x, y)}
          onInspectAimed={() => {
            if (aimedSpeciesId) handleOpenInspection(aimedSpeciesId);
          }}
          onOpenJournal={() => {
            bioAudio.playUiClick();
            setJournalOpen(true);
          }}
          onToggleLanguage={handleToggleLanguage}
          onToggleMute={handleToggleMute}
          onOpenMenu={() => {
            bioAudio.playUiClick();
            setMode('title');
            engineRef.current?.setMode('title');
          }}
        />
      )}

      {/* Direct Close-Up 3D Creature Inspection Mode */}
      {mode === 'inspect' && inspectedSpecies && (
        <InspectionOverlay
          species={inspectedSpecies}
          progress={inspectedProgress}
          activeHotspotId={activeHotspotId}
          language={language}
          muted={muted}
          bubbleRefs={bubbleRefs}
          onSelectHotspot={handleSelectHotspot}
          onAnswerQuiz={handleAnswerQuiz}
          onReturnToForest={handleReturnToForest}
          onToggleLanguage={handleToggleLanguage}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Field Journal Modal */}
      <FieldJournalModal
        open={journalOpen}
        language={language}
        activeDifficulty={difficulty}
        progressMap={progressMap}
        totalPoints={sciencePoints}
        onClose={() => {
          bioAudio.playUiClick();
          setJournalOpen(false);
        }}
        onSwitchDifficulty={handleSwitchDifficultyFromModal}
        onInspectSpecies={(speciesId) => {
          handleOpenInspection(speciesId);
        }}
        onResetProgress={handleResetProgress}
      />

      {/* Level Complete Celebration Modal */}
      <LevelCompleteModal
        open={levelCompleteOpen}
        difficulty={difficulty}
        language={language}
        totalPoints={sciencePoints}
        onNextDifficulty={handleSwitchDifficultyFromModal}
        onKeepExploring={() => {
          bioAudio.playUiClick();
          setLevelCompleteOpen(false);
        }}
      />
    </div>
  );
}
