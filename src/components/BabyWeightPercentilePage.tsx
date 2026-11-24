import React, { useState } from 'react';
import { Calculator, Table, HelpCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import {
  weightForAgePercentile,
  percentileBandLabel,
  MAX_PERCENTILE_AGE_MONTHS,
  type BabySex
} from '../utils/growthLms';

interface BabyWeightPercentilePageProps {
  onNavigate?: (path: string) => void;
}

const LBS_PER_KG = 2.20462262185;

const PERCENTILE_FAQ_ITEMS = [
  {
    topic: 'Typical Range',
    question: 'What is a good weight percentile for a baby?',
    answer:
      'Any percentile between the 5th and the 95th sits within the typical range. The 50th percentile is the median, not a target. A healthy baby can sit at the 10th percentile or the 90th percentile and grow perfectly well, as long as the baby follows the same curve over time.'
  },
  {
    topic: 'Median Meaning',
    question: 'What does the 50th percentile mean?',
    answer:
      'The 50th percentile is the median weight for babies the same age and sex. Half of babies weigh more and half weigh less. It is the middle of the chart, not a grade and not a goal.'
  },
  {
    topic: 'WHO and CDC Split',
    question: 'Why does the calculator switch from WHO to CDC at 24 months?',
    answer:
      'The CDC and the American Academy of Pediatrics recommend the WHO Child Growth Standards for infants from birth to 24 months and the CDC 2000 Growth Charts for children aged 2 years and older. The two references describe different populations, so the calculator follows the same age split the agencies recommend.'
  },
  {
    topic: 'Change Between Visits',
    question: 'Can a percentile change between visits?',
    answer:
      'Yes. A percentile can move a few points between visits as feeding, illness, and measurement timing shift the weight. Pediatricians watch the trend across several visits. A steady curve matters more than a single reading.'
  }
];

const REFERENCE_AGES_MONTHS = [0, 2, 4, 6, 9, 12, 18, 24, 36, 48, 60];

function formatAgeLabel(ageMonths: number): string {
  if (ageMonths === 0) return 'Birth';
  if (ageMonths < 12) return `${ageMonths} mo`;
  if (ageMonths % 12 === 0) return `${ageMonths / 12} yr`;
  return `${ageMonths} mo`;
}

function formatKg(kg: number): string {
  return `${kg.toFixed(2)} kg`;
}

function formatLbs(kg: number): string {
  return `${(kg * LBS_PER_KG).toFixed(1)} lbs`;
}

function formatLbsOz(kg: number): string {
  const totalOz = kg * LBS_PER_KG * 16;
  const lbs = Math.floor(totalOz / 16);
  const oz = Math.round(totalOz % 16);
  if (oz === 16) return `${lbs + 1} lb 0 oz`;
  return `${lbs} lb ${oz} oz`;
}

export const BabyWeightPercentilePage: React.FC<BabyWeightPercentilePageProps> = ({ onNavigate }) => {
  const [sex, setSex] = useState<BabySex>('female');
  const [ageMonths, setAgeMonths] = useState<string>('6');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('imperial');
  const [weightKg, setWeightKg] = useState<string>('7.3');
  const [weightLbs, setWeightLbs] = useState<string>('16');
  const [weightOz, setWeightOz] = useState<string>('1');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  const age = Math.max(0, Math.min(MAX_PERCENTILE_AGE_MONTHS, parseFloat(ageMonths) || 0));

  const activeWeightKg =
    unitSystem === 'metric'
      ? Math.max(0.5, parseFloat(weightKg) || 7.3)
      : Math.max(0.5, ((parseFloat(weightLbs) || 0) + (parseFloat(weightOz) || 0) / 16) / LBS_PER_KG);

  const result = weightForAgePercentile(sex, age, activeWeightKg);
  const percentileRounded = Math.round(result.percentile);
  const bandLabel = percentileBandLabel(result.band);
  const sexLabel = sex === 'female' ? 'girl' : 'boy';
  const sexPlural = sex === 'female' ? 'girls' : 'boys';

  const bandBadgeClass =
    result.band === 'typical'
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
      : result.band === 'below'
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800'
        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800';

  return (
    <div id="baby-weight-percentile-page" className="space-y-8">
      {/* Interactive Baby Weight Percentile Calculator Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-white">
              Baby Weight Percentile Calculator (WHO and CDC Growth Charts)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Enter your baby&apos;s sex, age in months, and weight to see the weight percentile for that age and sex.
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => setUnitSystem('imperial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                unitSystem === 'imperial'
                  ? 'bg-white dark:bg-slate-900 text-[#c2410c] dark:text-orange-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Imperial (lbs / oz)
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem('metric')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                unitSystem === 'metric'
                  ? 'bg-white dark:bg-slate-900 text-[#c2410c] dark:text-orange-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Metric (kg)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                Baby&apos;s Sex
              </span>
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => setSex('female')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sex === 'female'
                      ? 'bg-[#c2410c] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Girl
                </button>
                <button
                  type="button"
                  onClick={() => setSex('male')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sex === 'male'
                      ? 'bg-[#c2410c] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Boy
                </button>
              </div>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                Growth standards differ for girls and boys.
              </span>
            </div>

            <div>
              <label
                htmlFor="percentile-age-months"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
              >
                Age in Months (0 to 60)
              </label>
              <input
                id="percentile-age-months"
                type="number"
                min="0"
                max="60"
                step="0.5"
                value={ageMonths}
                onChange={(e) => setAgeMonths(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-base focus:outline-none focus:ring-2 focus:ring-[#c2410c]"
              />
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                Use completed months. Birth is 0 months.
              </span>
            </div>

            {unitSystem === 'metric' ? (
              <div>
                <label
                  htmlFor="percentile-weight-kg"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                >
                  Weight in Kilograms (kg)
                </label>
                <input
                  id="percentile-weight-kg"
                  type="number"
                  min="0.5"
                  max="40"
                  step="0.01"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-base focus:outline-none focus:ring-2 focus:ring-[#c2410c]"
                />
                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Weight: <strong>{formatLbs(activeWeightKg)}</strong> ({formatLbsOz(activeWeightKg)})
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="percentile-weight-lbs"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                  >
                    Weight in Pounds (lbs)
                  </label>
                  <input
                    id="percentile-weight-lbs"
                    type="number"
                    min="0"
                    max="90"
                    step="1"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-base focus:outline-none focus:ring-2 focus:ring-[#c2410c]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="percentile-weight-oz"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                  >
                    Ounces (oz)
                  </label>
                  <input
                    id="percentile-weight-oz"
                    type="number"
                    min="0"
                    max="15"
                    step="1"
                    value={weightOz}
                    onChange={(e) => setWeightOz(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-base focus:outline-none focus:ring-2 focus:ring-[#c2410c]"
                  />
                </div>
                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1 col-span-2">
                  Weight: <strong>{formatKg(activeWeightKg)}</strong>
                </span>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-orange-50/80 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 space-y-1.5">
              <span className="text-xs font-semibold text-[#c2410c] dark:text-orange-300">
                Weight Percentile for Age
              </span>
              <div className="text-4xl sm:text-5xl font-semibold text-[#c2410c] dark:text-orange-300 tabular-nums">
                {percentileRounded}
                <span className="text-2xl sm:text-3xl">th percentile</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                {percentileRounded}th percentile, {bandLabel}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                About {percentileRounded} out of 100 {sexPlural} the same age weigh less than your baby, and about{' '}
                {100 - percentileRounded} out of 100 weigh more.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Median weight</span>
                <div className="text-lg font-semibold text-slate-900 dark:text-white tabular-nums">
                  {unitSystem === 'metric' ? formatKg(result.medianKg) : formatLbs(result.medianKg)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {unitSystem === 'metric' ? formatLbs(result.medianKg) : formatKg(result.medianKg)} at the 50th
                  percentile
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">3rd percentile</span>
                <div className="text-lg font-semibold text-slate-900 dark:text-white tabular-nums">
                  {unitSystem === 'metric' ? formatKg(result.p3Kg) : formatLbs(result.p3Kg)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {unitSystem === 'metric' ? formatLbs(result.p3Kg) : formatKg(result.p3Kg)} at the low end
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">97th percentile</span>
                <div className="text-lg font-semibold text-slate-900 dark:text-white tabular-nums">
                  {unitSystem === 'metric' ? formatKg(result.p97Kg) : formatLbs(result.p97Kg)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {unitSystem === 'metric' ? formatLbs(result.p97Kg) : formatKg(result.p97Kg)} at the high end
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Reference: {result.lms.source === 'WHO' ? 'WHO Child Growth Standards (2006)' : 'CDC 2000 Growth Charts'}
              , weight-for-age, {sexLabel}, {formatAgeLabel(age)}.
            </p>
          </div>
        </div>
      </div>

      {/* What a weight percentile means */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
            What a Baby Weight Percentile Means
          </h2>
        </div>
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            A baby weight percentile is a ranking that places one baby&apos;s weight against the weights of babies the
            same age and sex on a standard growth chart. A percentile of 50 means the baby weighs the same as the
            median baby of that age and sex. A percentile of 25 means the baby weighs more than about 25 out of 100
            babies the same age and sex. A percentile of 75 means the baby weighs more than about 75 out of 100.
          </p>
          <p>
            The percentile answers one question: where does this baby&apos;s weight sit on the growth chart for this age
            and sex. It does not grade the baby. It does not diagnose a problem. It gives parents and pediatricians a
            common reference point for tracking growth over time.
          </p>
          <p>
            Pediatricians track the percentile across visits. A baby who stays near the same percentile line grows
            steadily. A baby who crosses two percentile lines in either direction earns a closer look at feeding,
            illness, and growth.
          </p>
          <p>
            In the first days after birth, weight moves fast. The{' '}
            <a
              href="/calculators/newborn-weight-loss/"
              onClick={(e) => handleLinkClick(e, '/calculators/newborn-weight-loss/')}
              className="text-[#c2410c] dark:text-orange-400 font-semibold hover:underline"
            >
              newborn weight loss calculator
            </a>{' '}
            checks the first-days drop against the normal range. After the first month, the{' '}
            <a
              href="/calculators/baby-weight-loss/"
              onClick={(e) => handleLinkClick(e, '/calculators/baby-weight-loss/')}
              className="text-[#c2410c] dark:text-orange-400 font-semibold hover:underline"
            >
              baby weight loss calculator
            </a>{' '}
            tracks the percentage change from birth weight. The{' '}
            <a
              href="/calculators/infant-weight-loss/"
              onClick={(e) => handleLinkClick(e, '/calculators/infant-weight-loss/')}
              className="text-[#c2410c] dark:text-orange-400 font-semibold hover:underline"
            >
              infant weight loss calculator
            </a>{' '}
            covers the same check for older infants.
          </p>
        </div>
      </section>

      {/* How the percentile is calculated */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
            How the Percentile Is Calculated
          </h2>
        </div>
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            The calculator uses the LMS method. WHO and the CDC publish three numbers for every month of age and each
            sex: L for skew, M for the median weight, and S for spread. The calculator looks up the three numbers for
            the baby&apos;s age and sex, converts the weight into a z-score, and converts the z-score into a percentile.
          </p>
          <p>
            Firstly, enter the baby&apos;s sex, age in months, and weight. Secondly, the calculator finds the L, M, and
            S values for that age and sex. Finally, it computes the z-score and reads the percentile from the standard
            normal distribution.
          </p>
          <p>
            <code>z = ((weight / M)^L - 1) / (L x S)</code>, and the percentile equals the standard normal cumulative
            distribution of z, times 100. When L equals zero, the formula becomes{' '}
            <code>z = ln(weight / M) / S</code>.
          </p>
          <p>
            WHO supplies the values from birth to 24 months. The CDC supplies the values from 24 months to 60
            months. The CDC and the American Academy of Pediatrics recommend the WHO standards for infants under 24
            months and the CDC charts for children aged 2 years and older.
          </p>
        </div>
      </section>

      {/* Reference table */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c2410c] text-white flex items-center justify-center font-semibold shrink-0">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                Weight at the 3rd, 50th, and 97th Percentiles
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Reference weights for {sexPlural} at common ages, computed from the same WHO and CDC values the
                calculator uses. Switch the sex above to see the other table.
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden tabular-nums">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold">
              <tr>
                <th className="p-3">Age</th>
                <th className="p-3">3rd percentile</th>
                <th className="p-3">50th percentile (median)</th>
                <th className="p-3">97th percentile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {REFERENCE_AGES_MONTHS.map((refAge) => {
                const r = weightForAgePercentile(sex, refAge, 1);
                return (
                  <tr key={refAge} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      {formatAgeLabel(refAge)}
                      {refAge < 24 ? ' (WHO)' : ' (CDC)'}
                    </td>
                    <td className="p-3">
                      {formatKg(r.p3Kg)} ({formatLbs(r.p3Kg)})
                    </td>
                    <td className="p-3 font-semibold">
                      {formatKg(r.medianKg)} ({formatLbs(r.medianKg)})
                    </td>
                    <td className="p-3">
                      {formatKg(r.p97Kg)} ({formatLbs(r.p97Kg)})
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The table shows reference weights, not targets. A baby grows well at any percentile inside the typical range
          when the percentile stays steady across visits.
        </p>
      </section>

      {/* When to talk to the doctor */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
            When to Talk to Your Baby&apos;s Doctor
          </h2>
        </div>
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Call the pediatrician when the percentile falls below the 5th or above the 95th, when the percentile
            crosses two lines between visits, or when weight gain stalls for more than a month. A single low or high
            reading rarely signals a problem on its own. The trend across visits matters more than any one number.
          </p>
          <p>
            Bring the growth chart to every visit. The pediatrician reads the percentile together with length, head
            circumference, feeding, and development. Weight alone never tells the whole story.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#c2410c] text-white flex items-center justify-center font-semibold shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-white">
              Baby Weight Percentile Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Answers on the typical range, the 50th percentile, the WHO and CDC split, and percentile changes between
              visits.
            </p>
          </div>
        </div>
        <div className="space-y-2.5">
          {PERCENTILE_FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={item.question}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/40"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div>
                    <span className="text-[11px] font-semibold text-[#c2410c] dark:text-orange-400 block">
                      {item.topic}
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mt-0.5">
                      {item.question}
                    </h3>
                  </div>
                  <span className="text-slate-400 shrink-0 mt-1">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Source and disclaimer */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#c2410c] text-white flex items-center justify-center font-semibold shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <h2 className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-white">Source</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          This calculator uses the WHO Child Growth Standards (2006), weight-for-age, for birth to 24 months, and the
          CDC 2000 Growth Charts, weight-for-age, for 24 to 60 months. The{' '}
          <a
            href="https://www.cdc.gov/growthcharts/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c2410c] dark:text-orange-400 font-semibold hover:underline"
          >
            CDC growth charts
          </a>{' '}
          publish the reference tables and the LMS data files the calculator reads.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>Disclaimer.</strong> This tool is for informational purposes only and does not constitute medical
          advice. Always consult a healthcare provider about your baby&apos;s growth.
        </p>
      </section>

      {/* Cross-Link Footer Bar */}
      <div className="bg-slate-100/80 dark:bg-slate-900/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
        <span className="text-slate-600 dark:text-slate-300">Related Baby Weight Calculators:</span>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/calculators/newborn-weight-loss/"
            onClick={(e) => handleLinkClick(e, '/calculators/newborn-weight-loss/')}
            className="inline-flex items-center gap-1 text-[#c2410c] dark:text-orange-400 hover:underline"
          >
            <span>Newborn Weight Loss Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="/calculators/baby-weight-loss/"
            onClick={(e) => handleLinkClick(e, '/calculators/baby-weight-loss/')}
            className="inline-flex items-center gap-1 text-[#c2410c] dark:text-orange-400 hover:underline"
          >
            <span>Baby Weight Loss Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="/calculators/infant-weight-loss/"
            onClick={(e) => handleLinkClick(e, '/calculators/infant-weight-loss/')}
            className="inline-flex items-center gap-1 text-[#c2410c] dark:text-orange-400 hover:underline"
          >
            <span>Infant Weight Loss Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="/calculators/bmi/"
            onClick={(e) => handleLinkClick(e, '/calculators/bmi/')}
            className="inline-flex items-center gap-1 text-[#c2410c] dark:text-orange-400 hover:underline"
          >
            <span>BMI Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default BabyWeightPercentilePage;
