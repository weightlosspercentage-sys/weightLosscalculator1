import React, { useState } from 'react';
import { Unit, HeightData, WeightCalculationResult, WeightLogEntry } from '../types';
import {
  calculateWeightLossResult,
  stonesAndPoundsToLbs,
  getBmiCategory,
} from '../utils/calculations';
import confetti from 'canvas-confetti';
import {
  TrendingDown,
  TrendingUp,
  Award,
  Calendar,
  Flame,
  CheckCircle2,
  Copy,
  PlusCircle,
  HelpCircle,
  Activity,
  ArrowRight,
  Scale
} from 'lucide-react';
import { ScaleMilestoneRule } from './ScaleMilestoneRule';

interface QuickCalculatorProps {
  unit: Unit;
  onAddLog: (entry: Omit<WeightLogEntry, 'id'>) => void;
  onNavigateToTab: (tab: string) => void;
}

export const QuickCalculator: React.FC<QuickCalculatorProps> = ({
  unit,
  onAddLog,
  onNavigateToTab,
}) => {
  // Form states
  const [startWeight, setStartWeight] = useState<string>('215');
  const [currentWeight, setCurrentWeight] = useState<string>('193.5');
  const [goalWeight, setGoalWeight] = useState<string>('175');

  // Stone & lbs specific
  const [startStones, setStartStones] = useState<string>('15');
  const [startPounds, setStartPounds] = useState<string>('5');
  const [currentStones, setCurrentStones] = useState<string>('13');
  const [currentPounds, setCurrentPounds] = useState<string>('11');
  const [goalStones, setGoalStones] = useState<string>('12');
  const [goalPounds, setGoalPounds] = useState<string>('7');

  // Dates
  const [startDate, setStartDate] = useState<string>('2026-08-01');
  const [currentDate, setCurrentDate] = useState<string>('2026-11-01');
  const [showDates, setShowDates] = useState<boolean>(true);

  // Height for BMI
  const [showBmi, setShowBmi] = useState<boolean>(true);
  const [heightUnit, setHeightUnit] = useState<'ft_in' | 'cm'>('ft_in');
  const [heightFeet, setHeightFeet] = useState<string>('5');
  const [heightInches, setHeightInches] = useState<string>('10');
  const [heightCm, setHeightCm] = useState<string>('178');

  // UI toast
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  // Parse numerical values based on unit
  let sVal = parseFloat(startWeight) || 0;
  let cVal = parseFloat(currentWeight) || 0;
  let gVal = goalWeight ? parseFloat(goalWeight) : null;

  let sStones = 0;
  let cStones = 0;
  let gStones = 0;

  if (unit === 'st') {
    sStones = parseFloat(startStones) || 0;
    const sLbs = parseFloat(startPounds) || 0;
    sVal = stonesAndPoundsToLbs(sStones, sLbs);

    cStones = parseFloat(currentStones) || 0;
    const cLbs = parseFloat(currentPounds) || 0;
    cVal = stonesAndPoundsToLbs(cStones, cLbs);

    if (goalStones || goalPounds) {
      gStones = parseFloat(goalStones) || 0;
      const gLbs = parseFloat(goalPounds) || 0;
      gVal = stonesAndPoundsToLbs(gStones, gLbs);
    }
  }

  const heightData: HeightData = {
    unit: heightUnit,
    feet: parseFloat(heightFeet) || 0,
    inches: parseFloat(heightInches) || 0,
    cm: parseFloat(heightCm) || 0,
  };

  const result: WeightCalculationResult | null = calculateWeightLossResult(
    sVal,
    cVal,
    gVal,
    unit,
    showDates ? startDate : '',
    showDates ? currentDate : '',
    showBmi ? heightData : { unit: 'cm' },
    sStones,
    cStones,
    gStones
  );

  const triggerConfetti = () => {
    confetti({
      particleCount: 55,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#c2410c', '#ea580c', '#78716c', '#a8a29e', '#1c1917'],
    });
  };

  const handleCopySummary = () => {
    if (!result) return;
    const unitLabel = unit === 'kg' ? 'kg' : 'lbs';
    const lines = [
      'Weight Loss Percentage Summary',
      `• Starting Weight: ${result.displayStartWeight} ${unitLabel}`,
      `• Current Weight: ${result.displayCurrentWeight} ${unitLabel}`,
      result.isLoss
        ? `• Total Weight Lost: ${result.weightChange} ${unitLabel} (${result.percentChange}%)`
        : `• Weight Change: +${Math.abs(result.weightChange)} ${unitLabel} (+${result.percentChange}%)`,
    ];

    if (result.displayGoalWeight !== null && result.remainingToGoal !== null) {
      lines.push(`• Goal Weight: ${result.displayGoalWeight} ${unitLabel}`);
      lines.push(`• Remaining to Goal: ${result.remainingToGoal} ${unitLabel} (${result.percentGoalAchieved}% achieved)`);
    }

    if (result.lossRatePerWeek) {
      lines.push(`• Rate of Loss: ${result.lossRatePerWeek} ${unitLabel}/week`);
    }

    if (result.estimatedDeficitTotal) {
      lines.push(`• Est. Total Calorie Deficit: ${result.estimatedDeficitTotal.toLocaleString()} kcal`);
    }

    if (result.startBmi && result.currentBmi) {
      lines.push(`• BMI: ${result.startBmi} (${result.bmiCategoryChange?.start}) → ${result.currentBmi} (${result.bmiCategoryChange?.current})`);
    }

    lines.push('Calculated with Weight Loss Percentage Calculator');

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleSaveToLog = () => {
    if (!result) return;
    onAddLog({
      date: currentDate || new Date().toISOString().split('T')[0],
      weight: result.displayCurrentWeight,
      unit: unit,
      weightInLbs: result.currentWeightNormalized,
      notes: `Calculator entry (${result.percentChange}% lost)`,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleLoadPreset = (scenario: '10pct' | '5pct' | '50lbs') => {
    if (scenario === '10pct') {
      if (unit === 'kg') {
        setStartWeight('98');
        setCurrentWeight('88.2');
        setGoalWeight('80');
      } else {
        setStartWeight('215');
        setCurrentWeight('193.5');
        setGoalWeight('175');
      }
    } else if (scenario === '5pct') {
      if (unit === 'kg') {
        setStartWeight('80');
        setCurrentWeight('76');
        setGoalWeight('70');
      } else {
        setStartWeight('180');
        setCurrentWeight('171');
        setGoalWeight('155');
      }
    } else if (scenario === '50lbs') {
      if (unit === 'kg') {
        setStartWeight('115');
        setCurrentWeight('95');
        setGoalWeight('85');
      } else {
        setStartWeight('250');
        setCurrentWeight('200');
        setGoalWeight('180');
      }
    }
  };

  const unitLabel = unit === 'kg' ? 'kg' : unit === 'st' ? 'lbs' : 'lbs';

  return (
    <div className="space-y-6">
      {/* Top Banner & Preset Quick Toggles */}
      <div className="bg-[#ffffff] dark:bg-[#1c1917] rounded-2xl p-6 sm:p-8 border border-[#e5e1d8] dark:border-[#332f2b] shadow-xs">
        <div className="max-w-2xl">
          <span className="inline-block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">
            Clinical percentage formula
          </span>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#1c1917] dark:text-[#f5f3ef]">
            Accurate Weight Loss Percentage Calculator
          </h1>
          <p className="mt-2 text-[#57534e] dark:text-[#b5afa6] text-sm sm:text-base leading-relaxed">
            Measure your genuine metabolic progress. A 5% to 10% reduction in body weight
            is associated with verified cardiovascular, glycemic, and longevity benefits regardless of starting weight.
          </p>

          {/* Quick presets */}
          <div className="mt-4 flex flex-wrap gap-2 items-center text-xs">
            <span className="text-[#57534e] dark:text-[#b5afa6] font-medium">Quick examples:</span>
            <button
              type="button"
              onClick={() => handleLoadPreset('10pct')}
              className="px-3 py-1.5 bg-[#faf9f7] dark:bg-[#141210] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f] text-[#1c1917] dark:text-[#f5f3ef] rounded-[8px] border border-[#e5e1d8] dark:border-[#332f2b] transition-colors duration-150 tabular-nums cursor-pointer"
            >
              10% milestone (215 → 193.5)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('5pct')}
              className="px-3 py-1.5 bg-[#faf9f7] dark:bg-[#141210] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f] text-[#1c1917] dark:text-[#f5f3ef] rounded-[8px] border border-[#e5e1d8] dark:border-[#332f2b] transition-colors duration-150 tabular-nums cursor-pointer"
            >
              5% milestone (180 → 171)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('50lbs')}
              className="px-3 py-1.5 bg-[#faf9f7] dark:bg-[#141210] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f] text-[#1c1917] dark:text-[#f5f3ef] rounded-[8px] border border-[#e5e1d8] dark:border-[#332f2b] transition-colors duration-150 tabular-nums cursor-pointer"
            >
              20% reduction (250 → 200)
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUTS COLUMN */}
        <div className="lg:col-span-5 bg-[#ffffff] dark:bg-[#1c1917] rounded-2xl p-6 border border-[#e5e1d8] dark:border-[#332f2b] shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#e5e1d8] dark:border-[#332f2b] pb-3">
            <h2 className="font-medium text-[#1c1917] dark:text-[#f5f3ef] text-lg flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6]" strokeWidth={1.75} />
              Weight inputs
            </h2>
            <span className="text-xs bg-[#f3f1ed] dark:bg-[#25221f] text-[#57534e] dark:text-[#b5afa6] font-medium px-2.5 py-0.5 rounded-[8px]">
              {unit === 'st' ? 'Stones & lbs' : unit}
            </span>
          </div>

          {/* If unit is lbs or kg */}
          {unit !== 'st' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-1.5">
                  Starting weight ({unit})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={startWeight}
                    onChange={(e) => setStartWeight(e.target.value)}
                    placeholder="e.g. 215"
                    className="w-full px-3.5 py-2.5 bg-[#faf9f7] dark:bg-[#141210] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-[#1c1917] dark:text-[#f5f3ef] font-medium tabular-nums focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef] focus:bg-[#ffffff] dark:focus:bg-[#1c1917] transition-colors text-base"
                  />
                  <span className="absolute right-3.5 top-2.5 text-[#78716c] dark:text-[#8c857d] font-normal text-sm">
                    {unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-1.5">
                  Current weight ({unit})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    placeholder="e.g. 193.5"
                    className="w-full px-3.5 py-2.5 bg-[#faf9f7] dark:bg-[#141210] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-[#1c1917] dark:text-[#f5f3ef] font-medium tabular-nums focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef] focus:bg-[#ffffff] dark:focus:bg-[#1c1917] transition-colors text-base"
                  />
                  <span className="absolute right-3.5 top-2.5 text-[#78716c] dark:text-[#8c857d] font-normal text-sm">
                    {unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-1.5">
                  Goal / target weight ({unit}) <span className="text-[#78716c] dark:text-[#8c857d] font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={goalWeight}
                    onChange={(e) => setGoalWeight(e.target.value)}
                    placeholder="e.g. 175"
                    className="w-full px-3.5 py-2.5 bg-[#faf9f7] dark:bg-[#141210] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-[#1c1917] dark:text-[#f5f3ef] font-medium tabular-nums focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef] focus:bg-[#ffffff] dark:focus:bg-[#1c1917] transition-colors text-base"
                  />
                  <span className="absolute right-3.5 top-2.5 text-[#78716c] dark:text-[#8c857d] font-normal text-sm">
                    {unit}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* If unit is stones & lbs */}
          {unit === 'st' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-1.5">
                  Starting weight
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      value={startStones}
                      onChange={(e) => setStartStones(e.target.value)}
                      placeholder="Stones"
                      className="w-full px-3 py-2 bg-[#faf9f7] dark:bg-[#141210] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-[#1c1917] dark:text-[#f5f3ef] font-medium tabular-nums text-sm focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-[#78716c] dark:text-[#8c857d]">st</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={startPounds}
                      onChange={(e) => setStartPounds(e.target.value)}
                      placeholder="lbs"
                      className="w-full px-3 py-2 bg-[#faf9f7] dark:bg-[#141210] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-[#1c1917] dark:text-[#f5f3ef] font-medium tabular-nums text-sm focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-[#78716c] dark:text-[#8c857d]">lbs</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-1.5">
                  Current weight
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      value={currentStones}
                      onChange={(e) => setCurrentStones(e.target.value)}
                      placeholder="Stones"
                      className="w-full px-3 py-2 bg-[#faf9f7] dark:bg-[#141210] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-[#1c1917] dark:text-[#f5f3ef] font-medium tabular-nums text-sm focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-[#78716c] dark:text-[#8c857d]">st</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={currentPounds}
                      onChange={(e) => setCurrentPounds(e.target.value)}
                      placeholder="lbs"
                      className="w-full px-3 py-2 bg-[#faf9f7] dark:bg-[#141210] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-[#1c1917] dark:text-[#f5f3ef] font-medium tabular-nums text-sm focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-[#78716c] dark:text-[#8c857d]">lbs</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-1.5">
                  Goal weight <span className="text-[#78716c] dark:text-[#8c857d] font-normal">(optional)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      value={goalStones}
                      onChange={(e) => setGoalStones(e.target.value)}
                      placeholder="Stones"
                      className="w-full px-3 py-2 bg-[#faf9f7] dark:bg-[#141210] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-[#1c1917] dark:text-[#f5f3ef] font-medium tabular-nums text-sm focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-[#78716c] dark:text-[#8c857d]">st</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={goalPounds}
                      onChange={(e) => setGoalPounds(e.target.value)}
                      placeholder="lbs"
                      className="w-full px-3 py-2 bg-[#faf9f7] dark:bg-[#141210] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-[#1c1917] dark:text-[#f5f3ef] font-medium tabular-nums text-sm focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-[#78716c] dark:text-[#8c857d]">lbs</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dates Expandable */}
          <div className="border-t border-[#e5e1d8] dark:border-[#332f2b] pt-3">
            <button
              type="button"
              onClick={() => setShowDates(!showDates)}
              className="flex items-center justify-between w-full text-xs font-medium text-[#1c1917] dark:text-[#f5f3ef] hover:text-[#57534e] dark:hover:text-[#b5afa6] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6]" strokeWidth={1.75} />
                Weigh-in dates &amp; weekly rate
              </span>
              <span className="text-[#78716c] dark:text-[#8c857d] text-xs font-normal">{showDates ? 'Hide' : 'Show'}</span>
            </button>

            {showDates && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-xs font-normal text-[#57534e] dark:text-[#b5afa6] mb-1">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#faf9f7] dark:bg-[#141210] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-xs text-[#1c1917] dark:text-[#f5f3ef] tabular-nums focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-[#57534e] dark:text-[#b5afa6] mb-1">
                    Current date
                  </label>
                  <input
                    type="date"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#faf9f7] dark:bg-[#141210] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-xs text-[#1c1917] dark:text-[#f5f3ef] tabular-nums focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Height / BMI Expandable */}
          <div className="border-t border-[#e5e1d8] dark:border-[#332f2b] pt-3">
            <button
              type="button"
              onClick={() => setShowBmi(!showBmi)}
              className="flex items-center justify-between w-full text-xs font-medium text-[#1c1917] dark:text-[#f5f3ef] hover:text-[#57534e] dark:hover:text-[#b5afa6] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6]" strokeWidth={1.75} />
                Height (for BMI category tracking)
              </span>
              <span className="text-[#78716c] dark:text-[#8c857d] text-xs font-normal">{showBmi ? 'Hide' : 'Show'}</span>
            </button>

            {showBmi && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setHeightUnit('ft_in')}
                    className={`px-2.5 py-1 rounded-[8px] text-xs transition-colors cursor-pointer ${
                      heightUnit === 'ft_in'
                        ? 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#1c1917] dark:text-[#f5f3ef] font-medium border border-[#e5e1d8] dark:border-[#332f2b]'
                        : 'text-[#57534e] dark:text-[#b5afa6] font-normal hover:bg-[#faf9f7] dark:hover:bg-[#141210]'
                    }`}
                  >
                    Feet &amp; inches
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeightUnit('cm')}
                    className={`px-2.5 py-1 rounded-[8px] text-xs transition-colors cursor-pointer ${
                      heightUnit === 'cm'
                        ? 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#1c1917] dark:text-[#f5f3ef] font-medium border border-[#e5e1d8] dark:border-[#332f2b]'
                        : 'text-[#57534e] dark:text-[#b5afa6] font-normal hover:bg-[#faf9f7] dark:hover:bg-[#141210]'
                    }`}
                  >
                    Centimeters
                  </button>
                </div>

                {heightUnit === 'ft_in' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="number"
                        min="3"
                        max="8"
                        value={heightFeet}
                        onChange={(e) => setHeightFeet(e.target.value)}
                        placeholder="Feet"
                        className="w-full px-3 py-1.5 bg-[#faf9f7] dark:bg-[#141210] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-xs text-[#1c1917] dark:text-[#f5f3ef] tabular-nums focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                      />
                      <span className="absolute right-2.5 top-1.5 text-xs text-[#78716c] dark:text-[#8c857d]">ft</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={heightInches}
                        onChange={(e) => setHeightInches(e.target.value)}
                        placeholder="Inches"
                        className="w-full px-3 py-1.5 bg-[#faf9f7] dark:bg-[#141210] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-xs text-[#1c1917] dark:text-[#f5f3ef] tabular-nums focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                      />
                      <span className="absolute right-2.5 top-1.5 text-xs text-[#78716c] dark:text-[#8c857d]">in</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="number"
                      min="100"
                      max="250"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      placeholder="e.g. 175"
                      className="w-full px-3 py-1.5 bg-[#faf9f7] dark:bg-[#141210] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-xs text-[#1c1917] dark:text-[#f5f3ef] tabular-nums focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                    />
                    <span className="absolute right-3 top-1.5 text-xs text-[#78716c] dark:text-[#8c857d]">cm</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RESULTS COLUMN */}
        <div className="lg:col-span-7 space-y-5">
          {result ? (
            <div className="bg-[#ffffff] dark:bg-[#1c1917] rounded-2xl p-6 border border-[#e5e1d8] dark:border-[#332f2b] shadow-xs space-y-5">
              {/* Hero Percentage Card */}
              <div className="p-6 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b] bg-[#faf9f7] dark:bg-[#141210] text-center">
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">
                  {result.isLoss ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6]" strokeWidth={1.75} />
                      <span>Body weight reduction</span>
                    </>
                  ) : result.isGain ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6]" strokeWidth={1.75} />
                      <span>Weight increase</span>
                    </>
                  ) : (
                    <span>No weight change</span>
                  )}
                </div>

                {/* Big number */}
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`text-5xl sm:text-6xl font-medium tracking-tight tabular-nums ${
                      result.isLoss
                        ? 'text-[#c2410c] dark:text-[#ea580c]'
                        : 'text-[#1c1917] dark:text-[#f5f3ef]'
                    }`}
                  >
                    {result.isLoss ? '-' : result.isGain ? '+' : ''}
                    {result.percentChange}%
                  </span>
                </div>

                <p className="mt-2 text-sm font-normal text-[#57534e] dark:text-[#b5afa6]">
                  {result.isLoss ? (
                    <>
                      You have lost{' '}
                      <span className="font-medium text-[#1c1917] dark:text-[#f5f3ef] tabular-nums">
                        {result.weightChange} {unitLabel}
                      </span>{' '}
                      from your starting weight of{' '}
                      <span className="tabular-nums">
                        {result.displayStartWeight} {unitLabel}
                      </span>
                      .
                    </>
                  ) : result.isGain ? (
                    <>
                      You have gained{' '}
                      <span className="font-medium text-[#1c1917] dark:text-[#f5f3ef] tabular-nums">
                        {Math.abs(result.weightChange)} {unitLabel}
                      </span>{' '}
                      over your starting weight.
                    </>
                  ) : (
                    'Your current weight matches your starting weight.'
                  )}
                </p>

                {/* Clinical milestone rule & plain status note */}
                <div className="mt-5 pt-4 border-t border-[#e5e1d8] dark:border-[#332f2b] text-left space-y-2.5">
                  <ScaleMilestoneRule
                    percentLoss={result.isLoss ? result.percentChange : 0}
                    maxPercent={15}
                    label="Clinical milestones"
                    statusText={result.isLoss ? `${result.percentChange}% lost` : '0%'}
                    compact
                  />
                  <div className="flex items-center gap-2 text-xs text-[#57534e] dark:text-[#b5afa6]">
                    <Award className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6] shrink-0" strokeWidth={1.75} />
                    <span>
                      {result.isLoss && result.percentChange >= 15
                        ? '15% weight loss — a clinically significant milestone'
                        : result.isLoss && result.percentChange >= 10
                        ? '10% weight loss — a clinically significant milestone'
                        : result.isLoss && result.percentChange >= 5
                        ? '5% weight loss — a clinically significant milestone'
                        : 'Next clinical milestone: 5% body weight reduction'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Goal Progress Bar if goal set */}
              {result.displayGoalWeight !== null && result.remainingToGoal !== null && (
                <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b] space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-[#1c1917] dark:text-[#f5f3ef] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6]" strokeWidth={1.75} />
                      Goal progress (target: {result.displayGoalWeight} {unitLabel})
                    </span>
                    <span className="text-[#1c1917] dark:text-[#f5f3ef] font-medium tabular-nums">
                      {result.percentGoalAchieved !== null ? `${result.percentGoalAchieved}%` : ''}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#e5e1d8] dark:bg-[#332f2b] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#1c1917] dark:bg-[#f5f3ef] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, result.percentGoalAchieved || 0)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#78716c] dark:text-[#8c857d] tabular-nums">
                    <span>Start: {result.displayStartWeight} {unitLabel}</span>
                    <span className="font-medium text-[#1c1917] dark:text-[#f5f3ef]">
                      {result.remainingToGoal > 0
                        ? `${result.remainingToGoal} ${unitLabel} to go`
                        : 'Goal reached'}
                    </span>
                    <span>Goal: {result.displayGoalWeight} {unitLabel}</span>
                  </div>
                </div>
              )}

              {/* Detailed Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Metric: Weekly Rate */}
                <div className="p-3.5 bg-[#faf9f7] dark:bg-[#141210] rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                  <span className="text-xs font-normal text-[#57534e] dark:text-[#b5afa6] block">
                    Weekly rate
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-medium text-[#1c1917] dark:text-[#f5f3ef] tabular-nums">
                      {result.lossRatePerWeek !== null ? `${result.lossRatePerWeek}` : '--'}
                    </span>
                    <span className="text-xs text-[#78716c] dark:text-[#8c857d]">{unitLabel}/wk</span>
                  </div>
                  <span className="text-xs text-[#78716c] dark:text-[#8c857d] block mt-0.5">
                    {result.lossRatePerWeek && Math.abs(result.lossRatePerWeek) <= 2
                      ? 'Healthy pace'
                      : 'Active progression'}
                  </span>
                </div>

                {/* Metric: Calorie Deficit */}
                <div className="p-3.5 bg-[#faf9f7] dark:bg-[#141210] rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                  <span className="text-xs font-normal text-[#57534e] dark:text-[#b5afa6] flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6]" strokeWidth={1.75} />
                    Est. deficit
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-medium text-[#1c1917] dark:text-[#f5f3ef] tabular-nums">
                      {result.estimatedDeficitTotal !== null
                        ? `${(result.estimatedDeficitTotal / 1000).toFixed(1)}k`
                        : '--'}
                    </span>
                    <span className="text-xs text-[#78716c] dark:text-[#8c857d]">kcal total</span>
                  </div>
                  <span className="text-xs text-[#78716c] dark:text-[#8c857d] block mt-0.5 tabular-nums">
                    {result.estimatedDailyDeficit !== null
                      ? `~${result.estimatedDailyDeficit} kcal/day`
                      : '3,500 kcal/lb fat'}
                  </span>
                </div>

                {/* Metric: Projected Goal Date */}
                <div className="p-3.5 bg-[#faf9f7] dark:bg-[#141210] rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                  <span className="text-xs font-normal text-[#57534e] dark:text-[#b5afa6] block">
                    Projected goal
                  </span>
                  <div className="mt-1">
                    <span className="text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] leading-tight block tabular-nums">
                      {result.projectedGoalDate || (result.remainingToGoal && result.remainingToGoal <= 0 ? 'Achieved' : '--')}
                    </span>
                  </div>
                  <span className="text-xs text-[#78716c] dark:text-[#8c857d] block mt-0.5">
                    {result.projectedGoalDate ? 'At current weekly pace' : 'Set goal & dates'}
                  </span>
                </div>

                {/* Metric: Start BMI */}
                {result.startBmi !== null && (
                  <div className="p-3.5 bg-[#faf9f7] dark:bg-[#141210] rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                    <span className="text-xs font-normal text-[#57534e] dark:text-[#b5afa6] block">
                      Initial BMI
                    </span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-lg font-medium text-[#1c1917] dark:text-[#f5f3ef] tabular-nums">
                        {result.startBmi}
                      </span>
                    </div>
                    <span className="text-xs font-normal text-[#78716c] dark:text-[#8c857d] block mt-0.5">
                      {getBmiCategory(result.startBmi).label}
                    </span>
                  </div>
                )}

                {/* Metric: Current BMI */}
                {result.currentBmi !== null && (
                  <div className="p-3.5 bg-[#faf9f7] dark:bg-[#141210] rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                    <span className="text-xs font-normal text-[#57534e] dark:text-[#b5afa6] block">
                      Current BMI
                    </span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-lg font-medium text-[#1c1917] dark:text-[#f5f3ef] tabular-nums">
                        {result.currentBmi}
                      </span>
                    </div>
                    <span className="text-xs font-normal text-[#78716c] dark:text-[#8c857d] block mt-0.5">
                      {getBmiCategory(result.currentBmi).label}
                    </span>
                  </div>
                )}

                {/* Metric: Duration */}
                <div className="p-3.5 bg-[#faf9f7] dark:bg-[#141210] rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                  <span className="text-xs font-normal text-[#57534e] dark:text-[#b5afa6] block">
                    Time span
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-medium text-[#1c1917] dark:text-[#f5f3ef] tabular-nums">
                      {result.daysDuration !== null ? result.daysDuration : '--'}
                    </span>
                    <span className="text-xs text-[#78716c] dark:text-[#8c857d]">days</span>
                  </div>
                  <span className="text-xs text-[#78716c] dark:text-[#8c857d] block mt-0.5 tabular-nums">
                    {result.weeksDuration !== null ? `${result.weeksDuration} weeks` : 'Continuous'}
                  </span>
                </div>
              </div>

              {/* Actions row: Save to Log, Copy, Mark Milestone */}
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#e5e1d8] dark:border-[#332f2b]">
                <button
                  type="button"
                  onClick={handleSaveToLog}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-white" strokeWidth={1.75} />
                  {savedToast ? 'Saved to weight log' : 'Save to weight log'}
                </button>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#f3f1ed] dark:bg-[#25221f] hover:bg-[#e7e3dc] dark:hover:bg-[#332f2b] text-[#1c1917] dark:text-[#f5f3ef] text-xs font-medium border border-[#e5e1d8] dark:border-[#332f2b] transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6]" strokeWidth={1.75} />
                  {copiedToast ? 'Copied to clipboard' : 'Copy summary'}
                </button>

                <button
                  type="button"
                  onClick={triggerConfetti}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#f3f1ed] dark:bg-[#25221f] hover:bg-[#e7e3dc] dark:hover:bg-[#332f2b] text-[#1c1917] dark:text-[#f5f3ef] text-xs font-medium border border-[#e5e1d8] dark:border-[#332f2b] transition-colors cursor-pointer"
                >
                  <Award className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6]" strokeWidth={1.75} />
                  Mark milestone
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateToTab('milestones')}
                  className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-[#1c1917] dark:text-[#f5f3ef] hover:text-[#c2410c] dark:hover:text-[#ea580c] transition-colors cursor-pointer"
                >
                  <span>View clinical milestones</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#ffffff] dark:bg-[#1c1917] rounded-2xl p-12 text-center border border-[#e5e1d8] dark:border-[#332f2b] text-[#78716c] dark:text-[#8c857d]">
              <HelpCircle className="w-4 h-4 mx-auto text-[#78716c] dark:text-[#8c857d] mb-2" strokeWidth={1.75} />
              <p className="text-sm font-normal">Please enter positive starting and current weights to view calculations.</p>
            </div>
          )}

          {/* Quick Formula Explainer Banner */}
          <div className="bg-[#faf9f7] dark:bg-[#141210] rounded-2xl p-4 border border-[#e5e1d8] dark:border-[#332f2b] flex items-start gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-[#f3f1ed] dark:bg-[#25221f] border border-[#e5e1d8] dark:border-[#332f2b] text-[#1c1917] dark:text-[#f5f3ef] flex items-center justify-center shrink-0 font-medium text-sm">
              %
            </div>
            <div className="text-xs text-[#57534e] dark:text-[#b5afa6] space-y-1.5">
              <span className="font-medium text-[#1c1917] dark:text-[#f5f3ef] block">
                Standard medical formula
              </span>
              <p className="font-mono bg-[#ffffff] dark:bg-[#1c1917] px-2.5 py-1 rounded-[8px] border border-[#e5e1d8] dark:border-[#332f2b] text-[#1c1917] dark:text-[#f5f3ef] text-xs inline-block">
                Weight Loss % = ((Starting Weight - Current Weight) ÷ Starting Weight) × 100
              </p>
              <p className="text-xs text-[#78716c] dark:text-[#8c857d] leading-relaxed">
                Losing 10 lbs from 200 lbs equals <span className="font-medium text-[#1c1917] dark:text-[#f5f3ef] tabular-nums">5.00%</span>, whereas 10 lbs from 150 lbs equals <span className="font-medium text-[#1c1917] dark:text-[#f5f3ef] tabular-nums">6.67%</span>.
                Percentage accurately measures relative metabolic effort.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
