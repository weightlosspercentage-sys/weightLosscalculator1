import { Unit, HeightData, WeightCalculationResult, MilestoneInfo } from '../types';

export const LBS_PER_KG = 2.20462262185;
export const KCAL_PER_LB_FAT = 3500;
export const KCAL_PER_KG_FAT = 7700;

export function convertToLbs(value: number, unit: Unit, stones = 0): number {
  if (unit === 'kg') {
    return value * LBS_PER_KG;
  }
  if (unit === 'st') {
    return stones * 14 + value;
  }
  return value;
}

export function convertFromLbs(lbs: number, targetUnit: Unit): number {
  if (targetUnit === 'kg') {
    return +(lbs / LBS_PER_KG).toFixed(2);
  }
  return +(lbs).toFixed(2);
}

export function lbsToStonesAndPounds(lbs: number): { stones: number; pounds: number } {
  const stones = Math.floor(lbs / 14);
  const pounds = +(lbs % 14).toFixed(1);
  return { stones, pounds };
}

export function stonesAndPoundsToLbs(stones: number, pounds: number): number {
  return stones * 14 + pounds;
}

export function calculateBmi(weightKg: number, heightMeters: number): number {
  if (heightMeters <= 0 || weightKg <= 0) return 0;
  return +(weightKg / (heightMeters * heightMeters)).toFixed(1);
}

export function getBmiCategory(bmi: number): { label: string; color: string; desc: string } {
  if (bmi <= 0) return { label: 'Unknown', color: 'text-slate-500', desc: 'No data' };
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-amber-500', desc: 'Below recommended healthy range' };
  if (bmi < 25.0) return { label: 'Normal weight', color: 'text-emerald-500', desc: 'Optimal health range' };
  if (bmi < 30.0) return { label: 'Overweight', color: 'text-amber-600', desc: 'Slightly above recommended range' };
  if (bmi < 35.0) return { label: 'Obese (Class I)', color: 'text-rose-500', desc: 'Moderate health risk' };
  if (bmi < 40.0) return { label: 'Obese (Class II)', color: 'text-rose-600', desc: 'Severe health risk' };
  return { label: 'Obese (Class III)', color: 'text-purple-600', desc: 'Very severe health risk' };
}

export function getHeightInMeters(height: HeightData): number {
  if (height.unit === 'cm' && height.cm && height.cm > 0) {
    return height.cm / 100;
  }
  if (height.unit === 'ft_in') {
    const feet = height.feet || 0;
    const inches = height.inches || 0;
    const totalInches = feet * 12 + inches;
    return totalInches * 0.0254;
  }
  return 0;
}

export function calculateWeightLossResult(
  startVal: number,
  currentVal: number,
  goalVal: number | null,
  unit: Unit,
  startDateStr: string,
  currentDateStr: string,
  height: HeightData,
  startStones = 0,
  currentStones = 0,
  goalStones = 0
): WeightCalculationResult | null {
  if (startVal <= 0 || currentVal <= 0) return null;

  const startWeightLbs = convertToLbs(startVal, unit, startStones);
  const currentWeightLbs = convertToLbs(currentVal, unit, currentStones);
  const goalWeightLbs = goalVal && goalVal > 0 ? convertToLbs(goalVal, unit, goalStones) : null;

  const diffLbs = startWeightLbs - currentWeightLbs;
  const isLoss = diffLbs > 0.0001;
  const isGain = diffLbs < -0.0001;
  const isSame = !isLoss && !isGain;

  const percentChange = +((Math.abs(diffLbs) / startWeightLbs) * 100).toFixed(2);

  // In user unit:
  const displayStartWeight = unit === 'st' ? +(startWeightLbs).toFixed(1) : +(startVal).toFixed(1);
  const displayCurrentWeight = unit === 'st' ? +(currentWeightLbs).toFixed(1) : +(currentVal).toFixed(1);
  const displayGoalWeight = goalWeightLbs !== null 
    ? (unit === 'st' ? +(goalWeightLbs).toFixed(1) : +(goalVal!).toFixed(1))
    : null;

  // Weight change in user unit
  let weightChange: number;
  if (unit === 'kg') {
    weightChange = +((startWeightLbs - currentWeightLbs) / LBS_PER_KG).toFixed(2);
  } else {
    weightChange = +(startWeightLbs - currentWeightLbs).toFixed(2);
  }

  // Goal metrics
  let remainingToGoal: number | null = null;
  let percentGoalAchieved: number | null = null;
  if (goalWeightLbs !== null) {
    const remainingLbs = currentWeightLbs - goalWeightLbs;
    remainingToGoal = unit === 'kg' ? +(remainingLbs / LBS_PER_KG).toFixed(2) : +(remainingLbs).toFixed(2);
    const totalGoalLossLbs = startWeightLbs - goalWeightLbs;
    if (totalGoalLossLbs > 0) {
      percentGoalAchieved = Math.max(0, Math.min(100, +((diffLbs / totalGoalLossLbs) * 100).toFixed(1)));
    }
  }

  // Duration & Rates
  let daysDuration: number | null = null;
  let weeksDuration: number | null = null;
  let lossRatePerWeek: number | null = null;
  let percentRatePerWeek: number | null = null;
  let estimatedDeficitTotal: number | null = null;
  let estimatedDailyDeficit: number | null = null;
  let projectedGoalDate: string | null = null;

  if (startDateStr && currentDateStr) {
    const sDate = new Date(startDateStr);
    const cDate = new Date(currentDateStr);
    const timeDiff = cDate.getTime() - sDate.getTime();
    if (timeDiff > 0) {
      daysDuration = Math.max(1, Math.round(timeDiff / (1000 * 3600 * 24)));
      weeksDuration = +(daysDuration / 7).toFixed(1);
      
      if (weeksDuration > 0) {
        const rateLbs = diffLbs / weeksDuration;
        lossRatePerWeek = unit === 'kg' ? +(rateLbs / LBS_PER_KG).toFixed(2) : +(rateLbs).toFixed(2);
        percentRatePerWeek = +(percentChange / weeksDuration).toFixed(2);
      }

      if (isLoss) {
        estimatedDeficitTotal = Math.round(diffLbs * KCAL_PER_LB_FAT);
        estimatedDailyDeficit = Math.round(estimatedDeficitTotal / daysDuration);

        // Project goal completion date
        if (goalWeightLbs !== null && currentWeightLbs > goalWeightLbs && lossRatePerWeek && lossRatePerWeek > 0) {
          const remainingLbsToLose = currentWeightLbs - goalWeightLbs;
          const weeklyRateLbs = diffLbs / (daysDuration / 7);
          if (weeklyRateLbs > 0.05) {
            const weeksNeeded = remainingLbsToLose / weeklyRateLbs;
            const targetDate = new Date(cDate.getTime() + weeksNeeded * 7 * 86400000);
            projectedGoalDate = targetDate.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          }
        }
      }
    }
  }

  // BMI calculations
  const heightMeters = getHeightInMeters(height);
  let startBmi: number | null = null;
  let currentBmi: number | null = null;
  let goalBmi: number | null = null;
  let bmiCategoryChange: { start: string; current: string } | null = null;

  if (heightMeters > 0) {
    const startKg = startWeightLbs / LBS_PER_KG;
    const currentKg = currentWeightLbs / LBS_PER_KG;
    startBmi = calculateBmi(startKg, heightMeters);
    currentBmi = calculateBmi(currentKg, heightMeters);
    
    if (goalWeightLbs !== null) {
      const goalKg = goalWeightLbs / LBS_PER_KG;
      goalBmi = calculateBmi(goalKg, heightMeters);
    }

    bmiCategoryChange = {
      start: getBmiCategory(startBmi).label,
      current: getBmiCategory(currentBmi).label,
    };
  }

  return {
    startWeightNormalized: startWeightLbs,
    currentWeightNormalized: currentWeightLbs,
    goalWeightNormalized: goalWeightLbs,
    unit,
    displayStartWeight,
    displayCurrentWeight,
    displayGoalWeight,
    weightChange,
    percentChange,
    isLoss,
    isGain,
    isSame,
    remainingToGoal,
    percentGoalAchieved,
    daysDuration,
    weeksDuration,
    lossRatePerWeek,
    percentRatePerWeek,
    estimatedDeficitTotal,
    estimatedDailyDeficit,
    projectedGoalDate,
    startBmi,
    currentBmi,
    goalBmi,
    bmiCategoryChange,
  };
}

export const CLINICAL_MILESTONES = [
  {
    percentage: 5,
    title: '5% Clinical Landmark',
    clinicalImpact: 'Clinically proven to significantly lower blood pressure, normalize blood glucose (HbA1c), reduce liver enzymes, and reduce cardiovascular risk by up to 25%.',
    badgeColor: 'emerald'
  },
  {
    percentage: 10,
    title: '10% Metabolic Reset',
    clinicalImpact: 'Marked reduction in visceral abdominal fat, significant reduction in obstructive sleep apnea severity, 50% drop in fasting triglycerides, and marked easing of osteoarthritis knee pressure.',
    badgeColor: 'sky'
  },
  {
    percentage: 15,
    title: '15% Systemic Transformation',
    clinicalImpact: 'High potential for complete remission of type 2 diabetes, dramatic improvement in NASH/fatty liver disease, major mobility enhancement, and decreased overall systemic inflammation markers (CRP).',
    badgeColor: 'indigo'
  },
  {
    percentage: 20,
    title: '20% Peak Health Rejuvenation',
    clinicalImpact: 'Long-term vascular rejuvenation, profound reduction in all-cause mortality hazard, normalization of metabolic syndrome profile, and substantial improvement in stamina and vitality.',
    badgeColor: 'purple'
  }
];

export function getMilestoneProgress(startWeightLbs: number, currentWeightLbs: number, unit: Unit): MilestoneInfo[] {
  if (startWeightLbs <= 0) return [];

  const weightLostLbs = Math.max(0, startWeightLbs - currentWeightLbs);
  const percentLost = (weightLostLbs / startWeightLbs) * 100;

  return CLINICAL_MILESTONES.map((m) => {
    const targetLbs = startWeightLbs * (1 - m.percentage / 100);
    const weightNeededLbs = Math.max(0, currentWeightLbs - targetLbs);
    const isAchieved = currentWeightLbs <= targetLbs;
    const progressPercent = Math.min(100, Math.max(0, +( (percentLost / m.percentage) * 100 ).toFixed(1)));

    const displayTarget = unit === 'kg' ? +(targetLbs / LBS_PER_KG).toFixed(1) : +(targetLbs).toFixed(1);
    const displayNeeded = unit === 'kg' ? +(weightNeededLbs / LBS_PER_KG).toFixed(1) : +(weightNeededLbs).toFixed(1);

    return {
      percentage: m.percentage,
      title: m.title,
      targetWeight: displayTarget,
      weightNeeded: displayNeeded,
      isAchieved,
      progressPercent,
      clinicalImpact: m.clinicalImpact,
      badgeColor: m.badgeColor
    };
  });
}
