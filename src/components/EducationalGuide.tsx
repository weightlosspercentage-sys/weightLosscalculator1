import React, { useState } from 'react';
import { BookOpen, Calculator, HelpCircle, Check, ChevronDown, ChevronUp } from 'lucide-react';

export const EducationalGuide: React.FC = () => {
  const [demoStart, setDemoStart] = useState<number>(200);
  const [demoCurrent, setDemoCurrent] = useState<number>(180);

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const demoLost = Math.max(0, demoStart - demoCurrent);
  const demoPct = demoStart > 0 ? +((demoLost / demoStart) * 100).toFixed(2) : 0;
  const demoFraction = demoStart > 0 ? +(demoLost / demoStart).toFixed(4) : 0;

  const faqs = [
    {
      q: 'Why is 5% weight loss considered clinically significant by doctors?',
      a: 'Extensive clinical trials (such as the NIH Diabetes Prevention Program and Look AHEAD study) proved that shedding just 5% of your total body weight produces dramatic physiological changes: it drops systolic blood pressure by ~5 mmHg, clears visceral fat in the liver by ~30%, lowers HbA1c, and cuts the long-term risk of cardiovascular disease by up to 25%. You do not need to reach your "ideal" weight to gain massive medical protection.',
    },
    {
      q: 'Why do percentages matter more than raw pounds or kilograms?',
      a: 'A 15-pound loss represents an entirely different physical transformation for someone starting at 150 lbs (10% body loss) compared to someone starting at 300 lbs (5% body loss). Percentage normalizes the physiological challenge and cellular adaptation across different heights and body frames.',
    },
    {
      q: 'Why does my scale fluctuate 2 to 4 pounds from day to day?',
      a: 'Day-to-day scale spikes are almost exclusively water and digestive weight rather than fat. For every 1 gram of carbohydrate stored as glycogen in your liver and muscles, your body holds approximately 3 to 4 grams of water. High sodium intake, dehydration, stress/cortisol, and intense resistance workouts all cause temporary water retention.',
    },
    {
      q: 'What is a safe, sustainable weekly rate of weight loss?',
      a: 'Medical guidelines recommend losing 1 to 2 pounds (0.5 to 1.0 kg) per week, which corresponds to roughly 0.5% to 1.0% of your total body weight per week. Losing faster than this often causes loss of lean muscle mass, drops in resting metabolic rate (adaptive thermogenesis), and higher gallstone risk.',
    },
    {
      q: 'Does the formula give the exact same percentage in kg as in lbs?',
      a: 'Yes! Because the formula divides weight lost by starting weight, the units cancel out completely. (20 lbs ÷ 200 lbs) × 100 = 10%, and (9.07 kg ÷ 90.72 kg) × 100 = 10%.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            The Science & Mathematics of Percentage Weight Loss
          </h2>
        </div>
        <p className="mt-1 text-slate-500 text-sm max-w-3xl">
          Learn how percentage weight loss is calculated, why clinical researchers use it as the primary benchmark, 
          and how to interpret your numbers accurately.
        </p>
      </div>

      {/* Interactive 3-Step Formula Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-600" />
          Interactive 3-Step Formula Walkthrough
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                1
              </span>
              Find Total Weight Lost
            </div>
            <p className="text-xs text-slate-500">
              Subtract your current weight from your initial starting weight:
            </p>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
              {demoStart} - {demoCurrent} = <strong className="text-emerald-700">{demoLost} lbs</strong>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                2
              </span>
              Divide by Starting Weight
            </div>
            <p className="text-xs text-slate-500">
              Divide the lost amount by your original starting baseline:
            </p>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
              {demoLost} ÷ {demoStart} = <strong className="text-emerald-700">{demoFraction}</strong>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                3
              </span>
              Multiply by 100 for %
            </div>
            <p className="text-xs text-slate-500">
              Multiply the decimal result by 100 to convert to a percentage:
            </p>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
              {demoFraction} × 100 = <strong className="text-emerald-700">{demoPct}%</strong>
            </div>
          </div>
        </div>

        {/* Try with slider */}
        <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-xs">
            <span className="font-bold text-emerald-900 block">Try your own test values:</span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 font-medium text-slate-700">
                Start:
                <input
                  type="number"
                  value={demoStart}
                  onChange={(e) => setDemoStart(parseFloat(e.target.value) || 1)}
                  className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                />
              </label>
              <label className="flex items-center gap-1.5 font-medium text-slate-700">
                Current:
                <input
                  type="number"
                  value={demoCurrent}
                  onChange={(e) => setDemoCurrent(parseFloat(e.target.value) || 1)}
                  className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                />
              </label>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <span className="text-xs text-slate-500 block">Calculated Result:</span>
            <span className="text-2xl font-black text-emerald-700">
              {demoPct}% lost
            </span>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full p-4 text-left font-semibold text-slate-900 text-sm flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
