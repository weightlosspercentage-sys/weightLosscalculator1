import React, { useState } from 'react';
import { Scale, Calculator, Table, Ruler, HelpCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export type BmiTopicalRoute =
  | '/calculators/bmi/'
  | '/calculators/bmi-chart/'
  | '/calculators/ideal-weight/';

interface BmiTopicalPagesProps {
  activeRoute: BmiTopicalRoute;
  onNavigate?: (path: string) => void;
}

const LBS_PER_KG = 2.20462262185;
const CM_PER_INCH = 2.54;

function getAdultBmiCategoryInfo(bmi: number): {
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  rangeText: string;
  badgeClass: string;
  interpretation: string;
} {
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      rangeText: 'Below 18.5',
      badgeClass: 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border-sky-300 dark:border-sky-800',
      interpretation:
        'A BMI below 18.5 is classified as Underweight for adults. A healthcare provider can evaluate calorie intake, nutrient absorption, and lean muscle mass.'
    };
  }
  if (bmi < 25) {
    return {
      category: 'Normal',
      rangeText: '18.5 to 24.9',
      badgeClass:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      interpretation:
        'A BMI of 18.5 to 24.9 is classified as Normal weight for adults and is associated with the lowest population risk for weight-related cardiometabolic conditions.'
    };
  }
  if (bmi < 30) {
    return {
      category: 'Overweight',
      rangeText: '25 to 29.9',
      badgeClass:
        'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      interpretation:
        'A BMI of 25.0 to 29.9 is classified as Overweight for adults. Losing 5% to 10% of starting body weight through a steady calorie deficit helps move BMI toward the normal 18.5 to 24.9 range.'
    };
  }
  return {
    category: 'Obese',
    rangeText: '30 and above',
    badgeClass:
      'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    interpretation:
      'A BMI of 30.0 and above is classified as Obese for adults. A gradual daily calorie deficit of 500 kcal per day loses about 1 lb per week and steadily reduces BMI.'
  };
}

const BMI_FAQ_ITEMS = [
  {
    topic: 'Healthy Adult Target',
    question: 'What should your BMI be?',
    answer:
      'For adults aged 20 and older, a normal BMI is 18.5 to 24.9. The World Health Organization defines four adult BMI categories: Underweight is below 18.5, Normal is 18.5 to 24.9, Overweight is 25 to 29.9, and Obese is 30 and above.'
  },
  {
    topic: 'Women’s BMI Standards',
    question: 'What is my BMI for women?',
    answer:
      'Adult women use the exact same BMI formula and category cutoffs as adult men: BMI equals weight in kilograms divided by height in metres squared. For women, a BMI below 18.5 is Underweight, 18.5 to 24.9 is Normal, 25 to 29.9 is Overweight, and 30 and above is Obese.'
  },
  {
    topic: 'Weight Reduction Strategy',
    question: 'How do you lower your BMI?',
    answer:
      'You lower your BMI by reducing total body weight relative to your height. Eating 500 kcal per day below your Total Daily Energy Expenditure (TDEE) produces roughly 1 pound (0.45 kg) of weight loss per week, while adequate protein intake and strength training preserve lean muscle as your BMI drops.'
  },
  {
    topic: 'Origin & Category Cutoffs',
    question: 'When was BMI created and who invented BMI (BMI history)?',
    answer:
      'The Body Mass Index formula was devised in the 1830s by Adolphe Quetelet, a Belgian mathematician, astronomer, and statistician, who called it the Quetelet Index. Modern public health agencies later adopted the formula with four adult category cutoffs: Underweight below 18.5, Normal 18.5 to 24.9, Overweight 25 to 29.9, and Obese 30 and above.'
  }
];

const CHART_HEIGHTS_INCHES = [58, 60, 62, 64, 66, 68, 70, 72, 74, 76];
const MATRIX_WEIGHTS_LBS = [100, 115, 130, 145, 160, 175, 190, 205, 220, 240];
const IDEAL_TABLE_HEIGHTS_INCHES = [
  58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78
];

function formatFeetInches(totalInches: number): string {
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

export const BmiTopicalPages: React.FC<BmiTopicalPagesProps> = ({ activeRoute, onNavigate }) => {
  // Page 1: BMI Calculator state
  const [calcMode, setCalcMode] = useState<'standard' | 'reverse-weight' | 'reverse-height'>('standard');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState<string>('170');
  const [weightKg, setWeightKg] = useState<string>('70');
  const [heightInches, setHeightInches] = useState<string>('67');
  const [weightLbs, setWeightLbs] = useState<string>('154');
  const [age, setAge] = useState<string>('34');
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [targetBmi, setTargetBmi] = useState<string>('22.0');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Page 3: Ideal Weight by Height state
  const [idealUnit, setIdealUnit] = useState<'imperial' | 'metric'>('imperial');
  const [idealHeightCm, setIdealHeightCm] = useState<string>('170');
  const [idealHeightInches, setIdealHeightInches] = useState<string>('67');

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  // Compute Standard BMI
  const activeHeightM =
    unitSystem === 'metric'
      ? Math.max(0.5, (parseFloat(heightCm) || 170) / 100)
      : Math.max(0.5, ((parseFloat(heightInches) || 67) * CM_PER_INCH) / 100);

  const activeWeightKg =
    unitSystem === 'metric'
      ? Math.max(10, parseFloat(weightKg) || 70)
      : Math.max(10, (parseFloat(weightLbs) || 154) / LBS_PER_KG);

  const computedBmi = activeWeightKg / (activeHeightM * activeHeightM);
  const bmiRounded = Math.round(computedBmi * 10) / 10;
  const bmiCat = getAdultBmiCategoryInfo(bmiRounded);

  const healthyMinKg = 18.5 * activeHeightM * activeHeightM;
  const healthyMaxKg = 24.9 * activeHeightM * activeHeightM;
  const healthyMinLbs = healthyMinKg * LBS_PER_KG;
  const healthyMaxLbs = healthyMaxKg * LBS_PER_KG;

  // Compute Reverse BMI: BMI + Height -> Weight
  const revBmiVal = Math.max(10, parseFloat(targetBmi) || 22);
  const revWeightKgFromHeight = revBmiVal * activeHeightM * activeHeightM;
  const revWeightLbsFromHeight = revWeightKgFromHeight * LBS_PER_KG;

  // Compute Reverse BMI: BMI + Weight -> Height
  const revHeightMFromWeight = Math.sqrt(activeWeightKg / revBmiVal);
  const revHeightCmFromWeight = revHeightMFromWeight * 100;
  const revHeightInchesFromWeight = revHeightCmFromWeight / CM_PER_INCH;

  // Compute Ideal Weight Page values
  const idealHeightM =
    idealUnit === 'metric'
      ? Math.max(0.5, (parseFloat(idealHeightCm) || 170) / 100)
      : Math.max(0.5, ((parseFloat(idealHeightInches) || 67) * CM_PER_INCH) / 100);
  const idealMinKg = 18.5 * idealHeightM * idealHeightM;
  const idealMaxKg = 24.9 * idealHeightM * idealHeightM;
  const idealMidKg = 21.7 * idealHeightM * idealHeightM;
  const idealMinLbs = idealMinKg * LBS_PER_KG;
  const idealMaxLbs = idealMaxKg * LBS_PER_KG;
  const idealMidLbs = idealMidKg * LBS_PER_KG;

  return (
    <div className="space-y-8">
      {/* Topical Cluster Switcher Bar */}
      <nav
        aria-label="BMI and Ideal Weight Calculators Navigation"
        className="flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Scale className="w-4 h-4 text-[#7334fd] dark:text-indigo-400" />
          <span>BMI &amp; Healthy Weight Suite:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <a
            href="/calculators/bmi/"
            onClick={(e) => handleLinkClick(e, '/calculators/bmi/')}
            aria-current={activeRoute === '/calculators/bmi/' ? 'page' : undefined}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              activeRoute === '/calculators/bmi/'
                ? 'bg-[#7334fd] text-white border-[#7334fd] shadow-2xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-[#7334fd]'
            }`}
          >
            BMI Calculator
          </a>
          <a
            href="/calculators/bmi-chart/"
            onClick={(e) => handleLinkClick(e, '/calculators/bmi-chart/')}
            aria-current={activeRoute === '/calculators/bmi-chart/' ? 'page' : undefined}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              activeRoute === '/calculators/bmi-chart/'
                ? 'bg-[#7334fd] text-white border-[#7334fd] shadow-2xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-[#7334fd]'
            }`}
          >
            BMI Chart (Women &amp; Men)
          </a>
          <a
            href="/calculators/ideal-weight/"
            onClick={(e) => handleLinkClick(e, '/calculators/ideal-weight/')}
            aria-current={activeRoute === '/calculators/ideal-weight/' ? 'page' : undefined}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              activeRoute === '/calculators/ideal-weight/'
                ? 'bg-[#7334fd] text-white border-[#7334fd] shadow-2xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-[#7334fd]'
            }`}
          >
            Ideal Weight by Height
          </a>
        </div>
      </nav>

      {/* =====================================================================
          NEW PAGE 1: /calculators/bmi/ - BMI Calculator
         ===================================================================== */}
      {activeRoute === '/calculators/bmi/' && (
        <div id="bmi-calculator-page" className="space-y-8">
          {/* Interactive BMI & Reverse BMI Calculator Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCalcMode('standard')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    calcMode === 'standard'
                      ? 'bg-[#7334fd] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                  }`}
                >
                  Standard BMI Calculator
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMode('reverse-weight')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    calcMode === 'reverse-weight'
                      ? 'bg-[#ca3500] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                  }`}
                >
                  Reverse BMI: Find Weight (BMI + Height)
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMode('reverse-height')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    calcMode === 'reverse-height'
                      ? 'bg-[#4950fc] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                  }`}
                >
                  Reverse BMI: Find Height (BMI + Weight)
                </button>
              </div>

              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => setUnitSystem('metric')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    unitSystem === 'metric'
                      ? 'bg-white dark:bg-slate-900 text-[#7334fd] dark:text-indigo-300 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Metric (kg / cm)
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem('imperial')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    unitSystem === 'imperial'
                      ? 'bg-white dark:bg-slate-900 text-[#7334fd] dark:text-indigo-300 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Imperial (lbs / inches)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Input Controls */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {calcMode !== 'reverse-height' && (
                  <div>
                    <label
                      htmlFor="bmi-height-input"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                    >
                      {unitSystem === 'metric' ? 'Height (cm)' : 'Height (inches)'}
                    </label>
                    {unitSystem === 'metric' ? (
                      <input
                        id="bmi-height-input"
                        type="number"
                        min="50"
                        max="260"
                        step="0.5"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#7334fd]"
                      />
                    ) : (
                      <div className="space-y-1">
                        <input
                          id="bmi-height-input"
                          type="number"
                          min="24"
                          max="100"
                          step="0.5"
                          value={heightInches}
                          onChange={(e) => setHeightInches(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#7334fd]"
                        />
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                          {formatFeetInches(parseFloat(heightInches) || 67)} ({((parseFloat(heightInches) || 67) * CM_PER_INCH).toFixed(1)} cm)
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {calcMode !== 'reverse-weight' && (
                  <div>
                    <label
                      htmlFor="bmi-weight-input"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                    >
                      {unitSystem === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}
                    </label>
                    {unitSystem === 'metric' ? (
                      <input
                        id="bmi-weight-input"
                        type="number"
                        min="15"
                        max="400"
                        step="0.1"
                        value={weightKg}
                        onChange={(e) => setWeightKg(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#7334fd]"
                      />
                    ) : (
                      <input
                        id="bmi-weight-input"
                        type="number"
                        min="35"
                        max="900"
                        step="0.5"
                        value={weightLbs}
                        onChange={(e) => setWeightLbs(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#7334fd]"
                      />
                    )}
                  </div>
                )}

                {calcMode !== 'standard' && (
                  <div>
                    <label
                      htmlFor="bmi-target-input"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                    >
                      Target BMI
                    </label>
                    <input
                      id="bmi-target-input"
                      type="number"
                      min="12"
                      max="60"
                      step="0.1"
                      value={targetBmi}
                      onChange={(e) => setTargetBmi(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#7334fd]"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="bmi-age-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                  >
                    Age (Years)
                  </label>
                  <input
                    id="bmi-age-input"
                    type="number"
                    min="20"
                    max="110"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#7334fd]"
                  />
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                    Gender
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        gender === 'female'
                          ? 'bg-indigo-50 dark:bg-indigo-950/80 border-[#7334fd] text-[#7334fd] dark:text-indigo-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Female
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        gender === 'male'
                          ? 'bg-indigo-50 dark:bg-indigo-950/80 border-[#7334fd] text-[#7334fd] dark:text-indigo-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Male
                    </button>
                  </div>
                </div>
              </div>

              {/* Output Panel */}
              <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
                {calcMode === 'standard' && (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Your Body Mass Index
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${bmiCat.badgeClass}`}>
                        {bmiCat.category} ({bmiCat.rangeText})
                      </span>
                    </div>
                    <div className="text-4xl sm:text-5xl font-semibold text-[#7334fd] dark:text-indigo-400 tabular-nums">
                      {bmiRounded.toFixed(1)}{' '}
                      <span className="text-sm font-bold text-slate-500 dark:text-slate-400">kg/m²</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {bmiCat.interpretation}
                    </p>
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <div>
                        <strong className="text-slate-900 dark:text-white">Healthy BMI Weight Range (18.5 to 24.9):</strong>{' '}
                        {unitSystem === 'metric'
                          ? `${healthyMinKg.toFixed(1)} kg to ${healthyMaxKg.toFixed(1)} kg (${healthyMinLbs.toFixed(0)} to ${healthyMaxLbs.toFixed(0)} lbs)`
                          : `${healthyMinLbs.toFixed(1)} lbs to ${healthyMaxLbs.toFixed(1)} lbs (${healthyMinKg.toFixed(1)} to ${healthyMaxKg.toFixed(1)} kg)`}
                      </div>
                      <div>
                        <strong className="text-slate-900 dark:text-white">Profile:</strong>{' '}
                        {gender === 'female' ? 'Adult Female' : 'Adult Male'}, Age {age || 34} (WHO adult cutoffs apply equally to women and men aged 20+).
                      </div>
                    </div>
                  </>
                )}

                {calcMode === 'reverse-weight' && (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Reverse BMI: Required Weight
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          getAdultBmiCategoryInfo(revBmiVal).badgeClass
                        }`}
                      >
                        {getAdultBmiCategoryInfo(revBmiVal).category}
                      </span>
                    </div>
                    <div className="text-3xl sm:text-4xl font-semibold text-[#ca3500] dark:text-orange-400 tabular-nums">
                      {unitSystem === 'metric'
                        ? `${revWeightKgFromHeight.toFixed(1)} kg (${revWeightLbsFromHeight.toFixed(1)} lbs)`
                        : `${revWeightLbsFromHeight.toFixed(1)} lbs (${revWeightKgFromHeight.toFixed(1)} kg)`}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      To reach a BMI of <strong>{revBmiVal.toFixed(1)}</strong> at a height of{' '}
                      <strong>
                        {(activeHeightM * 100).toFixed(1)} cm ({((activeHeightM * 100) / CM_PER_INCH).toFixed(1)} inches)
                      </strong>
                      , body weight equals <strong>{revWeightKgFromHeight.toFixed(1)} kg</strong> (
                      <strong>{revWeightLbsFromHeight.toFixed(1)} lbs</strong>) using the formula Weight = BMI × Height(m)².
                    </p>
                  </>
                )}

                {calcMode === 'reverse-height' && (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Reverse BMI: Required Height
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          getAdultBmiCategoryInfo(revBmiVal).badgeClass
                        }`}
                      >
                        {getAdultBmiCategoryInfo(revBmiVal).category}
                      </span>
                    </div>
                    <div className="text-3xl sm:text-4xl font-semibold text-[#4950fc] dark:text-sky-400 tabular-nums">
                      {unitSystem === 'metric'
                        ? `${revHeightCmFromWeight.toFixed(1)} cm (${revHeightInchesFromWeight.toFixed(1)} in)`
                        : `${revHeightInchesFromWeight.toFixed(1)} in / ${formatFeetInches(revHeightInchesFromWeight)} (${revHeightCmFromWeight.toFixed(1)} cm)`}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      A weight of <strong>{activeWeightKg.toFixed(1)} kg</strong> (
                      <strong>{(activeWeightKg * LBS_PER_KG).toFixed(1)} lbs</strong>) corresponds to a BMI of{' '}
                      <strong>{revBmiVal.toFixed(1)}</strong> at a height of{' '}
                      <strong>{revHeightCmFromWeight.toFixed(1)} cm</strong> (
                      <strong>{revHeightInchesFromWeight.toFixed(1)} inches</strong>) using Height(m) = √(Weight ÷ BMI).
                    </p>
                  </>
                )}

                {/* Adult BMI Category Scale Bar */}
                <div className="pt-2 space-y-1.5">
                  <div className="grid grid-cols-4 gap-1 text-[10px] font-bold text-center">
                    <div className="p-1.5 rounded-lg bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200">
                      Underweight
                      <span className="block font-normal">&lt; 18.5</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
                      Normal
                      <span className="block font-normal">18.5 to 24.9</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                      Overweight
                      <span className="block font-normal">25 to 29.9</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200">
                      Obese
                      <span className="block font-normal">30+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Local CSS/SVG Featured Image Concept with Caption */}
          <figure className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-full overflow-x-auto">
              <svg
                viewBox="0 0 800 210"
                role="img"
                aria-label="BMI Formula and Adult Category Scale Diagram"
                className="w-full h-auto min-w-[540px] rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-2"
              >
                <rect x="20" y="20" width="760" height="62" rx="12" fill="#4f46e5" fillOpacity="0.1" stroke="#6366f1" strokeWidth="1.5" />
                <text x="400" y="46" textAnchor="middle" fill="#4338ca" fontSize="15" fontWeight="800" fontFamily="sans-serif">
                  BMI Formula: BMI = Weight (kg) ÷ [Height (m)]²   |   Imperial: BMI = 703 × Weight (lbs) ÷ [Height (inches)]²
                </text>
                <text x="400" y="68" textAnchor="middle" fill="#475569" fontSize="12" fontWeight="600" fontFamily="sans-serif">
                  Devised by Adolphe Quetelet in the 1830s • Standard World Health Organization Adult Classification
                </text>

                {/* 4 Category Blocks */}
                <rect x="20" y="102" width="175" height="72" rx="10" fill="#0284c7" />
                <text x="107" y="132" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="800" fontFamily="sans-serif">
                  Underweight
                </text>
                <text x="107" y="154" textAnchor="middle" fill="#e0f2fe" fontSize="13" fontWeight="700" fontFamily="sans-serif">
                  BMI Below 18.5
                </text>

                <rect x="215" y="102" width="175" height="72" rx="10" fill="#059669" />
                <text x="302" y="132" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="800" fontFamily="sans-serif">
                  Normal Weight
                </text>
                <text x="302" y="154" textAnchor="middle" fill="#d1fae5" fontSize="13" fontWeight="700" fontFamily="sans-serif">
                  BMI 18.5 to 24.9
                </text>

                <rect x="410" y="102" width="175" height="72" rx="10" fill="#d97706" />
                <text x="497" y="132" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="800" fontFamily="sans-serif">
                  Overweight
                </text>
                <text x="497" y="154" textAnchor="middle" fill="#fef3c7" fontSize="13" fontWeight="700" fontFamily="sans-serif">
                  BMI 25.0 to 29.9
                </text>

                <rect x="605" y="102" width="175" height="72" rx="10" fill="#e11d48" />
                <text x="692" y="132" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="800" fontFamily="sans-serif">
                  Obese
                </text>
                <text x="692" y="154" textAnchor="middle" fill="#ffe4e6" fontSize="13" fontWeight="700" fontFamily="sans-serif">
                  BMI 30.0 and Above
                </text>
              </svg>
            </div>
            <figcaption className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
              Figure 1: Adult Body Mass Index (BMI) formula and World Health Organization category cutoffs (Underweight below 18.5, Normal 18.5 to 24.9, Overweight 25 to 29.9, Obese 30 and above).
            </figcaption>
          </figure>

          {/* Guide Section: What BMI Is, The BMI Formula, and How to Lower Your BMI */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
                Complete Guide to Body Mass Index: What BMI Is, the BMI Formula, and How to Lower Your BMI
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Clinical reference on how BMI is calculated, how adult categories are defined, and how to move into the healthy 18.5 to 24.9 range.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="space-y-2.5">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#7334fd] dark:text-indigo-400 shrink-0" />
                  What BMI Is
                </h3>
                <p>
                  Body Mass Index (BMI) is a numerical screening index that compares a person’s body weight to their height squared. Doctors, epidemiologists, and dietitians use BMI to classify adult weight into four standard categories: Underweight (below 18.5), Normal weight (18.5 to 24.9), Overweight (25 to 29.9), and Obese (30 and above).
                </p>
                <p>
                  You can compare your score across all heights and weights on our{' '}
                  <a
                    href="/calculators/bmi-chart/"
                    onClick={(e) => handleLinkClick(e, '/calculators/bmi-chart/')}
                    className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline"
                  >
                    BMI chart for women and men
                  </a>{' '}
                  or look up your exact target weight window on our{' '}
                  <a
                    href="/calculators/ideal-weight/"
                    onClick={(e) => handleLinkClick(e, '/calculators/ideal-weight/')}
                    className="text-[#ca3500] dark:text-orange-400 font-bold hover:underline"
                  >
                    ideal weight by height calculator
                  </a>.
                </p>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#ca3500] dark:text-orange-400 shrink-0" />
                  The BMI Formula
                </h3>
                <p>
                  The metric BMI formula states that BMI equals weight in kg divided by height in metres squared. If your height is measured in centimetres, divide centimetres by 100 first to get metres, square that height, and divide your weight in kilograms by the result.
                </p>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-100 space-y-1">
                  <div>Metric: BMI = weight (kg) ÷ [height (m)]²</div>
                  <div>Imperial: BMI = 703 × weight (lbs) ÷ [height (in)]²</div>
                </div>
                <p>
                  For newborns and infants in the first weeks of life, pediatricians evaluate postnatal percentage weight change rather than adult BMI. Parents can check early infant weight changes with our{' '}
                  <a
                    href="/calculators/newborn-weight-loss/"
                    onClick={(e) => handleLinkClick(e, '/calculators/newborn-weight-loss/')}
                    className="text-[#4950fc] dark:text-sky-400 font-bold hover:underline"
                  >
                    newborn weight loss calculator
                  </a>{' '}
                  and{' '}
                  <a
                    href="/calculators/baby-weight-loss/"
                    onClick={(e) => handleLinkClick(e, '/calculators/baby-weight-loss/')}
                    className="text-[#4950fc] dark:text-sky-400 font-bold hover:underline"
                  >
                    baby weight loss calculator
                  </a>.
                </p>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  How to Lower Your BMI
                </h3>
                <p>
                  Lowering an overweight or obese BMI requires reducing total body weight through a sustained daily calorie deficit. A daily deficit of 500 kcal below your Total Daily Energy Expenditure (TDEE) results in approximately 1 pound (0.45 kg) of fat loss per week, or 4 to 8 pounds per month at a safe clinical pace of 1 to 2 pounds per week.
                </p>
                <p>
                  Combining a moderate calorie deficit with sufficient dietary protein and regular resistance training ensures that weight lost comes primarily from fat tissue rather than skeletal muscle as your BMI moves toward 18.5 to 24.9.
                </p>
              </div>
            </div>
          </section>

          {/* BMI Calculator FAQ Section */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#7334fd] text-white flex items-center justify-center font-bold shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  BMI Calculator Frequently Asked Questions
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Answers on healthy BMI targets, BMI for women, how to lower BMI, and the history of the BMI formula.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {BMI_FAQ_ITEMS.map((item, idx) => {
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
                        <span className="text-[11px] font-bold text-[#7334fd] dark:text-indigo-400 block">
                          {item.topic}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
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
        </div>
      )}

      {/* =====================================================================
          NEW PAGE 2: /calculators/bmi-chart/ - BMI Chart
         ===================================================================== */}
      {activeRoute === '/calculators/bmi-chart/' && (
        <div id="bmi-chart-page" className="space-y-8">
          {/* Featured Image Concept as Local CSS/SVG Visual with Caption */}
          <figure className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-full overflow-x-auto">
              <svg
                viewBox="0 0 800 220"
                role="img"
                aria-label="BMI Chart Categories for Women and Men Visual Reference"
                className="w-full h-auto min-w-[540px] rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-2"
              >
                <text x="400" y="34" textAnchor="middle" fill="#1e293b" fontSize="16" fontWeight="900" fontFamily="sans-serif">
                  WHO Adult BMI Chart Categories for Women and Men (BMI = kg ÷ m²)
                </text>
                <rect x="25" y="52" width="180" height="115" rx="12" fill="#0284c7" />
                <text x="115" y="88" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="800" fontFamily="sans-serif">
                  Underweight
                </text>
                <text x="115" y="114" textAnchor="middle" fill="#e0f2fe" fontSize="18" fontWeight="900" fontFamily="sans-serif">
                  &lt; 18.5
                </text>
                <text x="115" y="142" textAnchor="middle" fill="#bae6fd" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                  Below healthy weight range
                </text>

                <rect x="215" y="52" width="180" height="115" rx="12" fill="#059669" />
                <text x="305" y="88" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="800" fontFamily="sans-serif">
                  Normal
                </text>
                <text x="305" y="114" textAnchor="middle" fill="#d1fae5" fontSize="18" fontWeight="900" fontFamily="sans-serif">
                  18.5 to 24.9
                </text>
                <text x="305" y="142" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                  Healthy weight range
                </text>

                <rect x="405" y="52" width="180" height="115" rx="12" fill="#d97706" />
                <text x="495" y="88" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="800" fontFamily="sans-serif">
                  Overweight
                </text>
                <text x="495" y="114" textAnchor="middle" fill="#fef3c7" fontSize="18" fontWeight="900" fontFamily="sans-serif">
                  25.0 to 29.9
                </text>
                <text x="495" y="142" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                  Above normal weight range
                </text>

                <rect x="595" y="52" width="180" height="115" rx="12" fill="#e11d48" />
                <text x="685" y="88" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="800" fontFamily="sans-serif">
                  Obese
                </text>
                <text x="685" y="114" textAnchor="middle" fill="#ffe4e6" fontSize="18" fontWeight="900" fontFamily="sans-serif">
                  30.0 and Above
                </text>
                <text x="685" y="142" textAnchor="middle" fill="#fecdd3" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                  Clinical obesity threshold
                </text>

                <text x="400" y="196" textAnchor="middle" fill="#475569" fontSize="12" fontWeight="700" fontFamily="sans-serif">
                  All values in the tables below are computed directly from BMI = weight (kg) ÷ height (m)²
                </text>
              </svg>
            </div>
            <figcaption className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
              Figure 1: BMI chart categories for adult women and men showing Underweight (below 18.5), Normal (18.5 to 24.9), Overweight (25 to 29.9), and Obese (30 and above).
            </figcaption>
          </figure>

          {/* 1. BMI Categories Table + Overweight Chart & Obesity Chart */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
                BMI Categories Table, Overweight Chart, and Obesity Chart
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Standard World Health Organization adult BMI categories apply to both women and men aged 20 and older. To calculate your exact score for any height and weight, use our{' '}
                <a
                  href="/calculators/bmi/"
                  onClick={(e) => handleLinkClick(e, '/calculators/bmi/')}
                  className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline"
                >
                  online BMI calculator
                </a>{' '}
                or find your target weight window on the{' '}
                <a
                  href="/calculators/ideal-weight/"
                  onClick={(e) => handleLinkClick(e, '/calculators/ideal-weight/')}
                  className="text-[#ca3500] dark:text-orange-400 font-bold hover:underline"
                >
                  ideal weight by height page
                </a>.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold">
                  <tr>
                    <th className="p-3.5">BMI Category</th>
                    <th className="p-3.5">BMI Range (kg/m²)</th>
                    <th className="p-3.5">Classification Details for Women and Men</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                  <tr>
                    <td className="p-3.5 font-bold text-sky-700 dark:text-sky-400">Underweight</td>
                    <td className="p-3.5 font-mono font-bold">Below 18.5</td>
                    <td className="p-3.5">Body weight is below the normal range for stature.</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-emerald-700 dark:text-emerald-400">Normal</td>
                    <td className="p-3.5 font-mono font-bold">18.5 to 24.9</td>
                    <td className="p-3.5">Healthy weight range for adult women and men.</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-amber-700 dark:text-amber-400">Overweight (Overweight Chart)</td>
                    <td className="p-3.5 font-mono font-bold">25 to 29.9</td>
                    <td className="p-3.5">Weight exceeds the normal BMI 24.9 threshold but is below the 30.0 obesity cutoff.</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-rose-700 dark:text-rose-400">Obese (Obesity Chart)</td>
                    <td className="p-3.5 font-mono font-bold">30 and above</td>
                    <td className="p-3.5">
                      Includes Class I Obesity (30.0 to 34.9), Class II Obesity (35.0 to 39.9), and Class III Obesity (40.0 and above).
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Women's BMI Chart, Men's BMI Chart, Overweight & Obesity Thresholds by Height */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base sm:text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Table className="w-5 h-5 text-[#7334fd] dark:text-indigo-400 shrink-0" />
                Women’s BMI Chart and Men’s BMI Chart: Category Weight Cutoffs by Height
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Both the women’s BMI chart and the men’s BMI chart use the same World Health Organization formula: weight in kilograms divided by height in metres squared. The table below lists the exact formula-computed weight boundaries for Underweight (below 18.5), Normal (18.5 to 24.9), the Overweight chart (25.0 to 29.9), and the Obesity chart (30.0 and above) across adult heights for women and men.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden tabular-nums">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold">
                    <tr>
                      <th className="p-3">Height (ft/in &amp; cm)</th>
                      <th className="p-3 text-sky-700 dark:text-sky-300">Underweight (&lt; 18.5)</th>
                      <th className="p-3 text-emerald-700 dark:text-emerald-300">Normal (18.5 to 24.9)</th>
                      <th className="p-3 text-amber-700 dark:text-amber-300">Overweight Chart (25 to 29.9)</th>
                      <th className="p-3 text-rose-700 dark:text-rose-300">Obesity Chart (30.0+)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                    {CHART_HEIGHTS_INCHES.map((inches) => {
                      const cm = inches * CM_PER_INCH;
                      const m = cm / 100;
                      const m2 = m * m;
                      const w185Kg = 18.5 * m2;
                      const w249Kg = 24.9 * m2;
                      const w250Kg = 25.0 * m2;
                      const w299Kg = 29.9 * m2;
                      const w300Kg = 30.0 * m2;
                      return (
                        <tr key={inches} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                          <td className="p-3 font-bold text-slate-900 dark:text-white">
                            {formatFeetInches(inches)} ({inches}" / {cm.toFixed(1)} cm)
                          </td>
                          <td className="p-3">
                            &lt; {(w185Kg * LBS_PER_KG).toFixed(0)} lbs ({w185Kg.toFixed(1)} kg)
                          </td>
                          <td className="p-3 font-semibold text-emerald-700 dark:text-emerald-400">
                            {(w185Kg * LBS_PER_KG).toFixed(0)} to {(w249Kg * LBS_PER_KG).toFixed(0)} lbs ({w185Kg.toFixed(1)} to {w249Kg.toFixed(1)} kg)
                          </td>
                          <td className="p-3 text-amber-700 dark:text-amber-400">
                            {(w250Kg * LBS_PER_KG).toFixed(0)} to {(w299Kg * LBS_PER_KG).toFixed(0)} lbs ({w250Kg.toFixed(1)} to {w299Kg.toFixed(1)} kg)
                          </td>
                          <td className="p-3 font-semibold text-rose-700 dark:text-rose-400">
                            {(w300Kg * LBS_PER_KG).toFixed(0)}+ lbs ({w300Kg.toFixed(1)}+ kg)
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 2. Height-and-Weight BMI Table (Formula-Computed Matrix) */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                Height-and-Weight BMI Table (Computed from BMI = kg ÷ m²)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Every BMI value in this height-and-weight table is calculated directly from the formula BMI = weight (kg) ÷ height (m)². Match your row (height) and column (weight) to see your exact BMI and color-coded category.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden tabular-nums">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold">
                  <tr>
                    <th className="p-2.5 text-left">Height</th>
                    {MATRIX_WEIGHTS_LBS.map((lbs) => (
                      <th key={lbs} className="p-2">
                        {lbs} lbs
                        <span className="block text-[10px] font-normal text-slate-500 dark:text-slate-400">
                          ({(lbs / LBS_PER_KG).toFixed(0)} kg)
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {CHART_HEIGHTS_INCHES.map((inches) => {
                    const cm = inches * CM_PER_INCH;
                    const m = cm / 100;
                    return (
                      <tr key={inches}>
                        <td className="p-2.5 text-left font-bold text-slate-900 dark:text-white whitespace-nowrap bg-slate-50 dark:bg-slate-800/60">
                          {formatFeetInches(inches)} ({cm.toFixed(0)} cm)
                        </td>
                        {MATRIX_WEIGHTS_LBS.map((lbs) => {
                          const kg = lbs / LBS_PER_KG;
                          const cellBmi = kg / (m * m);
                          const cellColor =
                            cellBmi < 18.5
                              ? 'bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                              : cellBmi < 25
                              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold'
                              : cellBmi < 30
                              ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-semibold';
                          return (
                            <td key={lbs} className={`p-2 ${cellColor}`}>
                              {cellBmi.toFixed(1)}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. BMI Chart by Age: Women by Age, Men, Teens, and Kids */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                BMI Chart by Age: Women by Age, Men, Teens, and Kids
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                How age affects BMI interpretation across adults, teenagers, children, and newborns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="space-y-2.5">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  BMI for Women by Age and Adult Men (Ages 20 and Older)
                </h3>
                <p>
                  For adult women and men aged 20 and older, standard World Health Organization BMI category thresholds do not change with age. Whether an adult woman or man is in their 20s, 30s, 40s, 50s, or 60s, a BMI below 18.5 is Underweight, 18.5 to 24.9 is Normal, 25 to 29.9 is Overweight, and 30 and above is Obese.
                </p>
                <p>
                  Use our{' '}
                  <a
                    href="/calculators/bmi/"
                    onClick={(e) => handleLinkClick(e, '/calculators/bmi/')}
                    className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline"
                  >
                    BMI calculator
                  </a>{' '}
                  to check your exact BMI online, or visit our{' '}
                  <a
                    href="/calculators/ideal-weight/"
                    onClick={(e) => handleLinkClick(e, '/calculators/ideal-weight/')}
                    className="text-[#ca3500] dark:text-orange-400 font-bold hover:underline"
                  >
                    ideal weight by height calculator
                  </a>{' '}
                  to see the normal 18.5 to 24.9 weight range for your stature.
                </p>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  BMI by Age for Teens and Kids (Ages 2 to 19)
                </h3>
                <p>
                  For children and teenagers aged 2 to 19, BMI is calculated with the same height-and-weight equation, but it is NOT interpreted using fixed adult BMI category numbers. Because body composition and stature change continuously during growth and puberty, pediatricians interpret child and teen BMI by age and sex percentiles on standardized clinical growth charts.
                </p>
                <p>
                  For newborns and babies in the first days and weeks after birth, clinicians track birth weight percentage change and daily weight gain rather than adult BMI. Parents can calculate early infant weight changes on our{' '}
                  <a
                    href="/calculators/newborn-weight-loss/"
                    onClick={(e) => handleLinkClick(e, '/calculators/newborn-weight-loss/')}
                    className="text-[#4950fc] dark:text-sky-400 font-bold hover:underline"
                  >
                    newborn weight loss calculator
                  </a>{' '}
                  and{' '}
                  <a
                    href="/calculators/baby-weight-loss/"
                    onClick={(e) => handleLinkClick(e, '/calculators/baby-weight-loss/')}
                    className="text-[#4950fc] dark:text-sky-400 font-bold hover:underline"
                  >
                    baby weight loss calculator
                  </a>.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          NEW PAGE 3: /calculators/ideal-weight/ - Ideal Weight by Height
         ===================================================================== */}
      {activeRoute === '/calculators/ideal-weight/' && (
        <div id="ideal-weight-page" className="space-y-8">
          {/* Interactive Ideal Weight by Height Calculator */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  Healthy &amp; Ideal Weight Range Calculator (BMI 18.5 to 24.9)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Enter your height in inches or centimetres to compute the healthy weight range that gives a normal BMI of 18.5 to 24.9.
                </p>
              </div>

              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => setIdealUnit('imperial')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    idealUnit === 'imperial'
                      ? 'bg-white dark:bg-slate-900 text-[#7334fd] dark:text-indigo-300 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Imperial (inches / lbs)
                </button>
                <button
                  type="button"
                  onClick={() => setIdealUnit('metric')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    idealUnit === 'metric'
                      ? 'bg-white dark:bg-slate-900 text-[#7334fd] dark:text-indigo-300 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Metric (cm / kg)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-4">
                {idealUnit === 'imperial' ? (
                  <div>
                    <label
                      htmlFor="ideal-height-inches"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                    >
                      Your Height in Inches
                    </label>
                    <input
                      id="ideal-height-inches"
                      type="number"
                      min="48"
                      max="90"
                      step="0.5"
                      value={idealHeightInches}
                      onChange={(e) => setIdealHeightInches(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#7334fd]"
                    />
                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Stature: <strong>{formatFeetInches(parseFloat(idealHeightInches) || 67)}</strong> (
                      {((parseFloat(idealHeightInches) || 67) * CM_PER_INCH).toFixed(1)} cm)
                    </span>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="ideal-height-cm"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                    >
                      Your Height in Centimetres (cm)
                    </label>
                    <input
                      id="ideal-height-cm"
                      type="number"
                      min="120"
                      max="230"
                      step="0.5"
                      value={idealHeightCm}
                      onChange={(e) => setIdealHeightCm(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#7334fd]"
                    />
                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Stature: <strong>{((parseFloat(idealHeightCm) || 170) / CM_PER_INCH).toFixed(1)} inches</strong> (
                      {formatFeetInches((parseFloat(idealHeightCm) || 170) / CM_PER_INCH)})
                    </span>
                  </div>
                )}

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Formula: Minimum Healthy Weight = 18.5 × Height(m)², and Maximum Healthy Weight = 24.9 × Height(m)². Check your current BMI on our{' '}
                  <a
                    href="/calculators/bmi/"
                    onClick={(e) => handleLinkClick(e, '/calculators/bmi/')}
                    className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline"
                  >
                    BMI calculator
                  </a>{' '}
                  or compare categories on the{' '}
                  <a
                    href="/calculators/bmi-chart/"
                    onClick={(e) => handleLinkClick(e, '/calculators/bmi-chart/')}
                    className="text-[#ca3500] dark:text-orange-400 font-bold hover:underline"
                  >
                    BMI chart
                  </a>.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    Healthy Weight Range (BMI 18.5 to 24.9)
                  </span>
                  <div className="text-2xl sm:text-3xl font-semibold text-emerald-700 dark:text-emerald-300 tabular-nums">
                    {idealUnit === 'imperial'
                      ? `${idealMinLbs.toFixed(1)} to ${idealMaxLbs.toFixed(1)} lbs`
                      : `${idealMinKg.toFixed(1)} to ${idealMaxKg.toFixed(1)} kg`}
                  </div>
                  <div className="text-xs font-semibold text-emerald-800/80 dark:text-emerald-200">
                    {idealUnit === 'imperial'
                      ? `(${idealMinKg.toFixed(1)} kg to ${idealMaxKg.toFixed(1)} kg)`
                      : `(${idealMinLbs.toFixed(1)} lbs to ${idealMaxLbs.toFixed(1)} lbs)`}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 space-y-1.5">
                  <span className="text-xs font-semibold text-[#7334fd] dark:text-indigo-300">
                    Suggested Midpoint Weight (BMI 21.7)
                  </span>
                  <div className="text-2xl sm:text-3xl font-semibold text-[#7334fd] dark:text-indigo-300 tabular-nums">
                    {idealUnit === 'imperial' ? `${idealMidLbs.toFixed(1)} lbs` : `${idealMidKg.toFixed(1)} kg`}
                  </div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {idealUnit === 'imperial'
                      ? `(${idealMidKg.toFixed(1)} kg at center of 18.5 to 24.9)`
                      : `(${idealMidLbs.toFixed(1)} lbs at center of 18.5 to 24.9)`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Local CSS/SVG Featured Image Concept with Caption */}
          <figure className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-full overflow-x-auto">
              <svg
                viewBox="0 0 800 190"
                role="img"
                aria-label="Ideal Weight Range by Height Formula Diagram"
                className="w-full h-auto min-w-[540px] rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-2"
              >
                <text x="400" y="34" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="900" fontFamily="sans-serif">
                  How Healthy Weight Range Is Derived from Height Using the BMI Formula
                </text>
                <rect x="30" y="54" width="220" height="96" rx="12" fill="#4f46e5" />
                <text x="140" y="88" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="800" fontFamily="sans-serif">
                  1. Measure Height
                </text>
                <text x="140" y="112" textAnchor="middle" fill="#e0e7ff" fontSize="12" fontWeight="600" fontFamily="sans-serif">
                  Convert cm or inches
                </text>
                <text x="140" y="132" textAnchor="middle" fill="#e0e7ff" fontSize="12" fontWeight="600" fontFamily="sans-serif">
                  to metres and square it (m²)
                </text>

                <rect x="290" y="54" width="220" height="96" rx="12" fill="#059669" />
                <text x="400" y="88" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="800" fontFamily="sans-serif">
                  2. Lower Bound (BMI 18.5)
                </text>
                <text x="400" y="112" textAnchor="middle" fill="#d1fae5" fontSize="12" fontWeight="700" fontFamily="sans-serif">
                  Min Healthy Weight (kg)
                </text>
                <text x="400" y="132" textAnchor="middle" fill="#d1fae5" fontSize="12" fontWeight="700" fontFamily="sans-serif">
                  = 18.5 × [Height (m)]²
                </text>

                <rect x="550" y="54" width="220" height="96" rx="12" fill="#0d9488" />
                <text x="660" y="88" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="800" fontFamily="sans-serif">
                  3. Upper Bound (BMI 24.9)
                </text>
                <text x="660" y="112" textAnchor="middle" fill="#ccfbf1" fontSize="12" fontWeight="700" fontFamily="sans-serif">
                  Max Healthy Weight (kg)
                </text>
                <text x="660" y="132" textAnchor="middle" fill="#ccfbf1" fontSize="12" fontWeight="700" fontFamily="sans-serif">
                  = 24.9 × [Height (m)]²
                </text>
              </svg>
            </div>
            <figcaption className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
              Figure 1: Formula-derived healthy weight range by height, bounded by BMI 18.5 (minimum normal weight) and BMI 24.9 (maximum normal weight).
            </figcaption>
          </figure>

          {/* Weight Table by Height */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
                Weight Table by Height: Healthy Weight Range and Suggested Weight
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Every weight range in the table below is calculated directly from the BMI formula (18.5 × m² to 24.9 × m²), with the suggested midpoint weight computed at BMI 21.7. You can also check any individual weight on our{' '}
                <a
                  href="/calculators/bmi/"
                  onClick={(e) => handleLinkClick(e, '/calculators/bmi/')}
                  className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline"
                >
                  BMI calculator
                </a>{' '}
                or view the full category matrix on our{' '}
                <a
                  href="/calculators/bmi-chart/"
                  onClick={(e) => handleLinkClick(e, '/calculators/bmi-chart/')}
                  className="text-[#ca3500] dark:text-orange-400 font-bold hover:underline"
                >
                  BMI chart for women and men
                </a>. For newborn and infant weight checks after birth, use our{' '}
                <a
                  href="/calculators/newborn-weight-loss/"
                  onClick={(e) => handleLinkClick(e, '/calculators/newborn-weight-loss/')}
                  className="text-[#4950fc] dark:text-sky-400 font-bold hover:underline"
                >
                  newborn weight loss calculator
                </a>{' '}
                and{' '}
                <a
                  href="/calculators/baby-weight-loss/"
                  onClick={(e) => handleLinkClick(e, '/calculators/baby-weight-loss/')}
                  className="text-[#4950fc] dark:text-sky-400 font-bold hover:underline"
                >
                  baby weight loss calculator
                </a>.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden tabular-nums">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold">
                  <tr>
                    <th className="p-3">Height (ft/in)</th>
                    <th className="p-3">Height (cm / in)</th>
                    <th className="p-3 text-emerald-700 dark:text-emerald-300">Healthy Weight Range (lbs)</th>
                    <th className="p-3 text-emerald-700 dark:text-emerald-300">Healthy Weight Range (kg)</th>
                    <th className="p-3 text-[#7334fd] dark:text-indigo-300">Suggested Weight (BMI 21.7)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                  {IDEAL_TABLE_HEIGHTS_INCHES.map((inches) => {
                    const cm = inches * CM_PER_INCH;
                    const m = cm / 100;
                    const m2 = m * m;
                    const minKg = 18.5 * m2;
                    const maxKg = 24.9 * m2;
                    const midKg = 21.7 * m2;
                    const minLbs = minKg * LBS_PER_KG;
                    const maxLbs = maxKg * LBS_PER_KG;
                    const midLbs = midKg * LBS_PER_KG;
                    return (
                      <tr key={inches} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{formatFeetInches(inches)}</td>
                        <td className="p-3">
                          {cm.toFixed(1)} cm ({inches} in)
                        </td>
                        <td className="p-3 font-semibold text-emerald-700 dark:text-emerald-400">
                          {minLbs.toFixed(1)} to {maxLbs.toFixed(1)} lbs
                        </td>
                        <td className="p-3 font-semibold text-emerald-700 dark:text-emerald-400">
                          {minKg.toFixed(1)} to {maxKg.toFixed(1)} kg
                        </td>
                        <td className="p-3 font-bold text-[#7334fd] dark:text-indigo-300">
                          {midLbs.toFixed(1)} lbs ({midKg.toFixed(1)} kg)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* Cross-Link Footer Bar between the 3 New BMI/Ideal-Weight Pages & Newborn/Baby Pages */}
      <div className="bg-slate-100/80 dark:bg-slate-900/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
        <span className="text-slate-600 dark:text-slate-300">Related Weight &amp; BMI Calculators:</span>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/calculators/bmi/"
            onClick={(e) => handleLinkClick(e, '/calculators/bmi/')}
            className="inline-flex items-center gap-1 text-[#7334fd] dark:text-indigo-400 hover:underline"
          >
            <span>BMI Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="/calculators/bmi-chart/"
            onClick={(e) => handleLinkClick(e, '/calculators/bmi-chart/')}
            className="inline-flex items-center gap-1 text-[#ca3500] dark:text-orange-400 hover:underline"
          >
            <span>BMI Chart for Women &amp; Men</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="/calculators/ideal-weight/"
            onClick={(e) => handleLinkClick(e, '/calculators/ideal-weight/')}
            className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            <span>Ideal Weight by Height</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="/calculators/newborn-weight-loss/"
            onClick={(e) => handleLinkClick(e, '/calculators/newborn-weight-loss/')}
            className="inline-flex items-center gap-1 text-[#4950fc] dark:text-sky-400 hover:underline"
          >
            <span>Newborn Weight Loss Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="/calculators/baby-weight-loss/"
            onClick={(e) => handleLinkClick(e, '/calculators/baby-weight-loss/')}
            className="inline-flex items-center gap-1 text-[#4950fc] dark:text-sky-400 hover:underline"
          >
            <span>Baby Weight Loss Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
