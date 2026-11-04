import React from 'react';
import { Unit } from '../types';
import { getMilestoneProgress } from '../utils/calculations';
import {
  Award,
  CheckCircle,
  Heart,
  Activity,
  Flame,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface MilestoneRoadmapProps {
  startWeightLbs: number;
  currentWeightLbs: number;
  unit: Unit;
  onNavigateToCalculator: () => void;
}

export const MilestoneRoadmap: React.FC<MilestoneRoadmapProps> = ({
  startWeightLbs,
  currentWeightLbs,
  unit,
  onNavigateToCalculator,
}) => {
  const milestones = getMilestoneProgress(startWeightLbs, currentWeightLbs, unit);
  const unitLabel = unit === 'kg' ? 'kg' : 'lbs';
  const totalLostLbs = Math.max(0, startWeightLbs - currentWeightLbs);
  const currentPercent = startWeightLbs > 0 ? +((totalLostLbs / startWeightLbs) * 100).toFixed(1) : 0;

  const getCardIcon = (pct: number) => {
    switch (pct) {
      case 5:
        return Heart;
      case 10:
        return Activity;
      case 15:
        return Flame;
      case 20:
        return ShieldCheck;
      default:
        return Award;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Clinical Health Milestones Roadmap
            </h2>
          </div>
          <p className="mt-1 text-slate-500 text-sm max-w-2xl">
            In clinical endocrinology and cardiology, weight loss success is measured in percentage brackets.
            Each bracket triggers transformative biochemical and metabolic health improvements.
          </p>
        </div>

        {/* Current status pill */}
        <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shrink-0">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Current Progress
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600">
              {currentPercent}%
            </span>
            <span className="text-xs text-slate-500 font-medium">body weight lost</span>
          </div>
        </div>
      </div>

      {/* Grid of 4 Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {milestones.map((milestone) => {
          const Icon = getCardIcon(milestone.percentage);
          const isAchieved = milestone.isAchieved;

          return (
            <div
              key={milestone.percentage}
              className={`rounded-2xl p-6 border transition-all ${
                isAchieved
                  ? 'bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/30 border-emerald-300 shadow-sm'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              {/* Card top */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg shadow-xs ${
                      isAchieved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {milestone.percentage}%
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                      {milestone.title}
                      {isAchieved && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </h3>
                    <span className="text-xs text-slate-500">
                      Target Weight: <strong className="text-slate-800">{milestone.targetWeight} {unitLabel}</strong>
                    </span>
                  </div>
                </div>

                {isAchieved ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                    {milestone.weightNeeded} {unitLabel} to go
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Milestone Completion</span>
                  <span className={isAchieved ? 'text-emerald-700 font-bold' : 'text-slate-800'}>
                    {milestone.progressPercent}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isAchieved
                        ? 'bg-emerald-600'
                        : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                    }`}
                    style={{ width: `${milestone.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Clinical Impact Section */}
              <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 mb-1">
                  <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Clinical & Medical Evidence:</span>
                </div>
                <p>{milestone.clinicalImpact}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clinical Reference Box */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Why Doctors Focus on Percentages Rather Than Absolute Pounds
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          National Institutes of Health (NIH) and World Health Organization (WHO) clinical obesity guidelines 
          highlight that biological systems respond to relative adipose tissue depletion rather than arbitrary pound targets:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs text-slate-300">
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <strong className="text-emerald-300 block mb-1 font-semibold">Equal Health Value</strong>
            A 160 lb person losing 16 lbs experiences identical hormonal and metabolic reset as a 260 lb person losing 26 lbs (both achieved 10%).
          </div>
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <strong className="text-emerald-300 block mb-1 font-semibold">Joint & Spine Relief</strong>
            Every 1% reduction removes approximately 4 times that force from knees during routine walking and stair climbing.
          </div>
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <strong className="text-emerald-300 block mb-1 font-semibold">Insulin Sensitivity</strong>
            The first 5% lost clears ectopic lipid deposits from the pancreas and liver, often lowering fasting blood glucose within 3-4 weeks.
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onNavigateToCalculator}
            className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <span>Update your current weight in the calculator</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
