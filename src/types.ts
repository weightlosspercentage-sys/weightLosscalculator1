export type Unit = 'lbs' | 'kg' | 'st';

export interface HeightData {
  unit: 'ft_in' | 'cm';
  feet?: number;
  inches?: number;
  cm?: number;
}

export interface CalculatorState {
  startWeight: string;
  currentWeight: string;
  goalWeight: string;
  unit: Unit;
  // For stones & lbs input
  startStones: string;
  startPounds: string;
  currentStones: string;
  currentPounds: string;
  goalStones: string;
  goalPounds: string;
  // Dates
  startDate: string;
  currentDate: string;
  // Height for BMI
  height: HeightData;
}

export interface WeightCalculationResult {
  startWeightNormalized: number; // in lbs
  currentWeightNormalized: number; // in lbs
  goalWeightNormalized: number | null; // in lbs
  unit: Unit;
  displayStartWeight: number;
  displayCurrentWeight: number;
  displayGoalWeight: number | null;
  weightChange: number; // positive = lost, negative = gained
  percentChange: number; // absolute percentage
  isLoss: boolean;
  isGain: boolean;
  isSame: boolean;
  remainingToGoal: number | null;
  percentGoalAchieved: number | null;
  daysDuration: number | null;
  weeksDuration: number | null;
  lossRatePerWeek: number | null;
  percentRatePerWeek: number | null;
  estimatedDeficitTotal: number | null;
  estimatedDailyDeficit: number | null;
  projectedGoalDate: string | null;
  startBmi: number | null;
  currentBmi: number | null;
  goalBmi: number | null;
  bmiCategoryChange: {
    start: string;
    current: string;
  } | null;
}

export interface MilestoneInfo {
  percentage: number;
  title: string;
  targetWeight: number;
  weightNeeded: number;
  isAchieved: boolean;
  progressPercent: number;
  clinicalImpact: string;
  badgeColor: string;
}

export interface WeightLogEntry {
  id: string;
  date: string;
  weight: number; // in selected unit
  unit: Unit;
  weightInLbs: number; // canonical
  notes?: string;
}

export interface ChallengeParticipant {
  id: string;
  name: string;
  startWeight: number;
  currentWeight: number;
  unit: Unit;
  avatarColor: string;
}
