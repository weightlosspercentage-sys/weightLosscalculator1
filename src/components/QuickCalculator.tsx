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
  Sparkles,
  Copy,
  PlusCircle,
  HelpCircle,
  Activity,
  ArrowRight,
  Scale
} from 'lucide-react';

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
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#3b82f6', '#ec4899'],
    });
  };

  const handleCopySummary = () => {
    if (!result) return;
    const unitLabel = unit === 'kg' ? 'kg' : 'lbs';
    const lines = [
      '📊 Weight Loss Percentage Summary',
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
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <TrendingDown className="w-64 h-64 text-white -mr-12" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold uppercase tracking-wider text-emerald-100 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Clinical Percentage Formula
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Accurate Weight Loss Percentage Calculator
          </h1>
          <p className="mt-2 text-emerald-50 text-sm sm:text-base leading-relaxed">
            Measure your genuine metabolic transformation. A 5% to 10% reduction in body weight 
            unlocks verified cardiovascular, glycemic, and longevity benefits regardless of starting weight.
          </p>

          {/* Quick presets */}
          <div className="mt-4 flex flex-wrap gap-2 items-center text-xs">
            <span className="text-emerald-200 font-medium">Quick examples:</span>
            <button
              type="button"
              onClick={() => handleLoadPreset('10pct')}
              className="px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-lg border border-white/20 transition-colors"
            >
              10% Landmark (215 → 193.5)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('5pct')}
              className="px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-lg border border-white/20 transition-colors"
            >
              5% Landmark (180 → 171)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('50lbs')}
              className="px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-lg border border-white/20 transition-colors"
            >
              20% Major (250 → 200)
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUTS COLUMN */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              Weight Inputs
            </h2>
            <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md uppercase">
              {unit === 'st' ? 'Stones & lbs' : unit}
            </span>
          </div>

          {/* If unit is lbs or kg */}
          {unit !== 'st' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Starting Weight ({unit})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={startWeight}
                    onChange={(e) => setStartWeight(e.target.value)}
                    placeholder="e.g. 215"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base"
                  />
                  <span className="absolute right-3.5 top-2.5 text-slate-400 font-medium text-sm">
                    {unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Current Weight ({unit})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    placeholder="e.g. 193.5"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base"
                  />
                  <span className="absolute right-3.5 top-2.5 text-slate-400 font-medium text-sm">
                    {unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Goal / Target Weight ({unit}) <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={goalWeight}
                    onChange={(e) => setGoalWeight(e.target.value)}
                    placeholder="e.g. 175"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base"
                  />
                  <span className="absolute right-3.5 top-2.5 text-slate-400 font-medium text-sm">
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
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Starting Weight
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      value={startStones}
                      onChange={(e) => setStartStones(e.target.value)}
                      placeholder="Stones"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-slate-400">st</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={startPounds}
                      onChange={(e) => setStartPounds(e.target.value)}
                      placeholder="lbs"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-slate-400">lbs</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Current Weight
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      value={currentStones}
                      onChange={(e) => setCurrentStones(e.target.value)}
                      placeholder="Stones"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-slate-400">st</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={currentPounds}
                      onChange={(e) => setCurrentPounds(e.target.value)}
                      placeholder="lbs"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-slate-400">lbs</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Goal Weight <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      value={goalStones}
                      onChange={(e) => setGoalStones(e.target.value)}
                      placeholder="Stones"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-slate-400">st</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={goalPounds}
                      onChange={(e) => setGoalPounds(e.target.value)}
                      placeholder="lbs"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-slate-400">lbs</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dates Expandable */}
          <div className="border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setShowDates(!showDates)}
              className="flex items-center justify-between w-full text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Weigh-in Dates & Weekly Rate
              </span>
              <span className="text-slate-400 text-xs">{showDates ? 'Hide' : 'Show'}</span>
            </button>

            {showDates && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">
                    Current Date
                  </label>
                  <input
                    type="date"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Height / BMI Expandable */}
          <div className="border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setShowBmi(!showBmi)}
              className="flex items-center justify-between w-full text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                Height (for BMI Category Tracking)
              </span>
              <span className="text-slate-400 text-xs">{showBmi ? 'Hide' : 'Show'}</span>
            </button>

            {showBmi && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setHeightUnit('ft_in')}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium ${
                      heightUnit === 'ft_in' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-500'
                    }`}
                  >
                    Feet & Inches
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeightUnit('cm')}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium ${
                      heightUnit === 'cm' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-500'
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
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                      <span className="absolute right-2.5 top-1.5 text-xs text-slate-400">ft</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={heightInches}
                        onChange={(e) => setHeightInches(e.target.value)}
                        placeholder="Inches"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                      <span className="absolute right-2.5 top-1.5 text-xs text-slate-400">in</span>
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
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                    <span className="absolute right-3 top-1.5 text-xs text-slate-400">cm</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RESULTS COLUMN */}
        <div className="lg:col-span-7 space-y-5">
          {result ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              {/* Hero Percentage Card */}
              <div
                className={`p-6 rounded-2xl border text-center transition-all ${
                  result.isLoss
                    ? 'bg-gradient-to-br from-emerald-50 via-teal-50/60 to-emerald-100/40 border-emerald-200'
                    : result.isGain
                    ? 'bg-gradient-to-br from-rose-50 to-orange-50 border-rose-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 shadow-xs bg-white">
                  {result.isLoss ? (
                    <>
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Body Weight Reduction</span>
                    </>
                  ) : result.isGain ? (
                    <>
                      <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                      <span className="text-rose-700">Weight Increase</span>
                    </>
                  ) : (
                    <span className="text-slate-600">No Weight Change</span>
                  )}
                </div>

                {/* Big number */}
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`text-5xl sm:text-6xl font-extrabold tracking-tight ${
                      result.isLoss
                        ? 'text-emerald-600'
                        : result.isGain
                        ? 'text-rose-600'
                        : 'text-slate-700'
                    }`}
                  >
                    {result.isLoss ? '-' : result.isGain ? '+' : ''}
                    {result.percentChange}%
                  </span>
                </div>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {result.isLoss ? (
                    <>
                      You have lost{' '}
                      <span className="font-bold text-slate-900">
                        {result.weightChange} {unitLabel}
                      </span>{' '}
                      from your starting weight of {result.displayStartWeight} {unitLabel}.
                    </>
                  ) : result.isGain ? (
                    <>
                      You have gained{' '}
                      <span className="font-bold text-slate-900">
                        {Math.abs(result.weightChange)} {unitLabel}
                      </span>{' '}
                      over your starting weight.
                    </>
                  ) : (
                    'Your current weight matches your starting weight exactly.'
                  )}
                </p>

                {/* Milestone celebration banner */}
                {result.isLoss && result.percentChange >= 5 && (
                  <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-xs animate-pulse">
                    <Award className="w-4 h-4 text-emerald-100" />
                    <span>
                      {result.percentChange >= 15
                        ? '🎉 Outstanding! 15%+ Systemic Transformation Reached'
                        : result.percentChange >= 10
                        ? '🎉 Amazing! 10%+ Metabolic Reset Reached'
                        : '🎉 Clinically Significant: 5%+ Landmark Reached!'}
                    </span>
                  </div>
                )}
              </div>

              {/* Goal Progress Bar if goal set */}
              {result.displayGoalWeight !== null && result.remainingToGoal !== null && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Goal Progress (Target: {result.displayGoalWeight} {unitLabel})
                    </span>
                    <span className="text-emerald-700 font-bold">
                      {result.percentGoalAchieved !== null ? `${result.percentGoalAchieved}%` : ''}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, result.percentGoalAchieved || 0)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Start: {result.displayStartWeight} {unitLabel}</span>
                    <span className="font-semibold text-slate-700">
                      {result.remainingToGoal > 0 ? (
                        `${result.remainingToGoal} ${unitLabel} to go`
                      ) : (
                        '🎉 Goal reached or surpassed!'
                      )}
                    </span>
                    <span>Goal: {result.displayGoalWeight} {unitLabel}</span>
                  </div>
                </div>
              )}

              {/* Detailed Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Metric: Weekly Rate */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Weekly Rate
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-bold text-slate-900">
                      {result.lossRatePerWeek !== null ? `${result.lossRatePerWeek}` : '--'}
                    </span>
                    <span className="text-xs text-slate-500">{unitLabel}/wk</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">
                    {result.lossRatePerWeek && Math.abs(result.lossRatePerWeek) <= 2
                      ? 'Healthy pace'
                      : 'Active progression'}
                  </span>
                </div>

                {/* Metric: Calorie Deficit */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" />
                    Est. Deficit
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-bold text-slate-900">
                      {result.estimatedDeficitTotal !== null
                        ? `${(result.estimatedDeficitTotal / 1000).toFixed(1)}k`
                        : '--'}
                    </span>
                    <span className="text-xs text-slate-500">kcal total</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {result.estimatedDailyDeficit !== null
                      ? `~${result.estimatedDailyDeficit} kcal/day`
                      : '3,500 kcal/lb fat'}
                  </span>
                </div>

                {/* Metric: Projected Goal Date */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Projected Goal
                  </span>
                  <div className="mt-1">
                    <span className="text-sm font-bold text-slate-900 leading-tight block">
                      {result.projectedGoalDate || (result.remainingToGoal && result.remainingToGoal <= 0 ? 'Achieved!' : '--')}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {result.projectedGoalDate ? 'At current weekly pace' : 'Set goal & dates'}
                  </span>
                </div>

                {/* Metric: Start BMI */}
                {result.startBmi !== null && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Initial BMI
                    </span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-lg font-bold text-slate-900">
                        {result.startBmi}
                      </span>
                    </div>
                    <span className={`text-[10px] font-medium block mt-0.5 ${getBmiCategory(result.startBmi).color}`}>
                      {getBmiCategory(result.startBmi).label}
                    </span>
                  </div>
                )}

                {/* Metric: Current BMI */}
                {result.currentBmi !== null && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Current BMI
                    </span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-lg font-bold text-slate-900">
                        {result.currentBmi}
                      </span>
                    </div>
                    <span className={`text-[10px] font-medium block mt-0.5 ${getBmiCategory(result.currentBmi).color}`}>
                      {getBmiCategory(result.currentBmi).label}
                    </span>
                  </div>
                )}

                {/* Metric: Duration */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Time Span
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-bold text-slate-900">
                      {result.daysDuration !== null ? result.daysDuration : '--'}
                    </span>
                    <span className="text-xs text-slate-500">days</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {result.weeksDuration !== null ? `${result.weeksDuration} weeks` : 'Continuous'}
                  </span>
                </div>
              </div>

              {/* Actions row: Confetti, Copy, Add to Log */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={triggerConfetti}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Celebrate!
                </button>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  {copiedToast ? 'Copied to Clipboard!' : 'Copy Summary'}
                </button>

                <button
                  type="button"
                  onClick={handleSaveToLog}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                  {savedToast ? 'Saved to Weight Log!' : 'Save to Weight Log'}
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateToTab('milestones')}
                  className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  <span>View Clinical Milestones</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
              <HelpCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium">Please enter positive starting and current weights to view calculations.</p>
            </div>
          )}

          {/* Quick Formula Explainer Banner */}
          <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-sm">
              %
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <span className="font-semibold text-slate-900 block">
                Standard Medical Formula:
              </span>
              <p className="font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-800 text-[11px] inline-block">
                Weight Loss % = ((Starting Weight - Current Weight) ÷ Starting Weight) × 100
              </p>
              <p className="text-[11px] text-slate-500">
                Losing 10 lbs from 200 lbs equals <strong>5.00%</strong>, whereas 10 lbs from 150 lbs equals <strong>6.67%</strong>. 
                Percentage accurately measures relative metabolic effort.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
