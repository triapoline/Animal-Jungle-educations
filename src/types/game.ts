export type Language = 'en' | 'id';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameMode = 'title' | 'explore' | 'inspect';

export type AnimalGroup =
  | 'Insects'
  | 'Amphibians'
  | 'Birds'
  | 'Mammals'
  | 'Fish'
  | 'Reptiles';

export interface BilingualText {
  en: string;
  id: string;
}

export interface SpeciesHotspot {
  id: string;
  label: BilingualText;
  conceptTag: BilingualText;
  explanation: BilingualText;
  /** Local offset relative to the creature's root group */
  anchor: [number, number, number];
}

export interface SpeciesQuiz {
  question: BilingualText;
  options: [BilingualText, BilingualText, BilingualText, BilingualText];
  correctIndex: number;
  explanation: BilingualText;
  points: number;
}

export interface SpeciesData {
  id: string;
  difficulty: Difficulty;
  name: BilingualText;
  scientificName: string;
  group: AnimalGroup;
  groupLabel: BilingualText;
  syllabusFocus: BilingualText;
  habitat: BilingualText;
  summary: BilingualText;
  /** Spawn position [x, z] in the forest; y is computed from terrain or perch offset */
  spawnXZ: [number, number];
  /** Vertical offset above terrain/water surface */
  perchHeight: number;
  /** Scale of the 3D creature in the forest */
  worldScale: number;
  /** Ideal camera distance during inspection mode */
  inspectDistance: number;
  /** Target Y offset relative to creature origin when inspecting */
  inspectTargetY: number;
  /** Initial facing yaw in radians */
  initialYaw: number;
  /** Perch prop type to naturally ground the creature */
  perchType: 'flower' | 'fern' | 'mossRock' | 'branch' | 'deadwood' | 'roots' | 'mudbank' | 'leafNest' | 'rottingLog' | 'treeTrunk' | 'streamBank';
  hotspots: SpeciesHotspot[];
  quiz: SpeciesQuiz;
}

export interface SpeciesProgress {
  discovered: boolean;
  exploredHotspots: string[];
  quizAnswered: boolean;
  quizCorrect: boolean;
}

export interface ProjectedHotspot {
  id: string;
  x: number;
  y: number;
  visible: boolean;
}

export interface RadarTelemetry {
  nearestName: BilingualText | null;
  nearestId: string | null;
  distanceMeters: number | null;
  /** Relative angle in radians: 0 = straight ahead, + = right, - = left */
  relativeAngleRad: number;
  remainingCount: number;
}
