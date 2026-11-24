import React, { useMemo } from 'react';
import { SILOS_DATA } from '../data/keywordMatrix';
import { searchTools } from '../utils/toolSearch';
import { ToolMode } from './HeroToolBox';
import { ClinicalFocus } from '../utils/seoIntentRouter';
import { LOCALE_TRANSLATIONS } from '../data/localeStrings';
import { EXTENDED_LOCALE_PARITY } from '../data/multilingualParity';
import { AdSlot } from './AdSlot';
import { AD_SLOT_IN_ARTICLE } from '../config/adsense';
import {
  ChevronRight,
  Calculator,
  Baby,
  Scale,
  Flame,
  Stethoscope
} from 'lucide-react';

interface SiloContentSectionsProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onSelectToolMode?: (mode: ToolMode) => void;
  onSelectClinicalFocus?: (focus: ClinicalFocus) => void;
  locale?: string;
}

export const SiloContentSections: React.FC<SiloContentSectionsProps> = ({
  searchQuery = '',
  onClearSearch,
  onSelectToolMode,
  onSelectClinicalFocus,
  locale = 'en'
}) => {
  const t = LOCALE_TRANSLATIONS[locale] || LOCALE_TRANSLATIONS.en;
  const p = EXTENDED_LOCALE_PARITY[locale] || EXTENDED_LOCALE_PARITY.en;
  const filteredSilos = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return SILOS_DATA;
    const matchedIds = new Set(searchTools(trimmed).map((t) => t.id));
    return SILOS_DATA.filter((s) => matchedIds.has(s.id));
  }, [searchQuery]);

  const handleContainerLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const link = (e.target as HTMLElement).closest('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#')) return;

    if (onSelectToolMode) {
      if (href === '#newborn' || href === '#baby' || href === '#infant' || href === '#calculate-birth' || href === '#pounds') {
        onSelectToolMode('newborn');
      } else if (
        href === '#bmr' ||
        href === '#tdee' ||
        href === '#metabolic-rate' ||
        href === '#keto' ||
        href === '#walking' ||
        href === '#running' ||
        href === '#cycling' ||
        href === '#rowing'
      ) {
        onSelectToolMode('bmr');
      } else if (href === '#calorie' || href === '#calories' || href === '#nutrition' || href === '#subway') {
        onSelectToolMode('subway');
      } else {
        onSelectToolMode('adult');
      }
    }

    if (onSelectClinicalFocus) {
      if (href === '#water-fasting') {
        onSelectClinicalFocus('fasting');
      } else if (href === '#glp1-calculator') {
        onSelectClinicalFocus('glp1');
      } else if (href === '#gastric-bypass' || href === '#bariatric-surgery') {
        onSelectClinicalFocus('bariatric');
      }
    }

    if (href === '#') {
      e.preventDefault();
      document.getElementById('calculator-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16" onClick={handleContainerLinkClick}>
      {/* ================= CALCULATORS & CLINICAL GUIDES DIRECTORY ================= */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#7334fd] dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.directoryTitle}
            </h2>
          </div>
          {searchQuery.trim() && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                Showing {filteredSilos.length} of {SILOS_DATA.length} for “{searchQuery.trim()}”
              </span>
              {onClearSearch && (
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="font-bold text-[#7334fd] dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4">
          {t.directorySubtitle}
        </p>
        {filteredSilos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
            {filteredSilos.map((silo) => (
              <a
                key={silo.id}
                href={silo.anchor}
                className="min-h-[44px] px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/60 active:bg-indigo-100 border border-slate-200/60 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:text-[#7334fd] dark:hover:text-indigo-300 font-semibold transition-colors flex items-center justify-between group"
              >
                <span className="truncate">{p.siloHubTitles[silo.id] || silo.hubKeyword}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#7334fd] dark:group-hover:text-indigo-300 shrink-0" />
              </a>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>No guides matched “{searchQuery.trim()}”.</span>
            {onClearSearch && (
              <button
                type="button"
                onClick={onClearSearch}
                className="font-bold text-[#7334fd] dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Show all {SILOS_DATA.length} guides
              </button>
            )}
          </div>
        )}
              {/* Dedicated Calculators Navigation List for BMI, BMI Chart, Ideal Weight, Newborn & Baby Tools */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
            BMI, Ideal Weight &amp; Pediatric Calculators Navigation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
            <a
              href="/calculators/bmi/"
              className="min-h-[42px] px-3 py-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/80 text-[#7334fd] dark:text-indigo-300 font-bold flex items-center justify-between transition-colors"
            >
              <span className="truncate">BMI Calculator (kg/cm &amp; lbs/in)</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </a>
            <a
              href="/calculators/bmi-chart/"
              className="min-h-[42px] px-3 py-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/80 text-[#7334fd] dark:text-indigo-300 font-bold flex items-center justify-between transition-colors"
            >
              <span className="truncate">BMI Chart (Women &amp; Men)</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </a>
            <a
              href="/calculators/ideal-weight/"
              className="min-h-[42px] px-3 py-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/80 text-[#7334fd] dark:text-indigo-300 font-bold flex items-center justify-between transition-colors"
            >
              <span className="truncate">Ideal Weight by Height</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </a>
            <a
              href="/calculators/newborn-weight-loss/"
              className="min-h-[42px] px-3 py-2 rounded-xl bg-orange-50/70 dark:bg-orange-950/50 hover:bg-orange-100 dark:hover:bg-orange-900/60 border border-orange-200/80 dark:border-orange-800/80 text-[#ca3500] dark:text-orange-300 font-bold flex items-center justify-between transition-colors"
            >
              <span className="truncate">Newborn Weight Loss Calculator</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </a>
            <a
              href="/calculators/baby-weight-loss/"
              className="min-h-[42px] px-3 py-2 rounded-xl bg-sky-50/70 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200/80 dark:border-sky-800/80 text-[#4950fc] dark:text-sky-300 font-bold flex items-center justify-between transition-colors"
            >
              <span className="truncate">Baby Weight Loss Calculator</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>
</section>

      {/* ================= SILO 1: PERCENTAGE ================= */}
      <section id="percentage" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Weight Loss Percentage Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            Weight loss percentage is a metric that expresses weight lost as a proportion of starting weight. The formula divides weight lost by starting weight and multiplies by 100. A 200-pound person who loses 15 pounds has lost 7.5 percent. Doctors and clinical researchers use this metric because it normalises progress across body sizes.
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#ca3500] dark:text-orange-400" />
            <span>How the calculation works</span>
          </h3>
          <p>
            The formula is one subtraction, one division and one multiplication.
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
            Weight Loss % = ((Starting Weight − Current Weight) ÷ Starting Weight) × 100
          </div>
          <p>
            The calculator takes two inputs: starting weight and current weight. It returns one number: the percentage. Firstly, it subtracts current weight from starting weight to find total pounds lost. Secondly, it divides that loss by the starting weight. Finally, it multiplies by 100 to express the result as a percentage.
          </p>
          <p>
            A worked example makes the arithmetic concrete. Starting weight is 200 lbs and current weight is 185 lbs. Weight lost equals 200 − 185 = 15 lbs. Then (15 ÷ 200) × 100 = 7.5% total weight loss, which crosses the 5% clinical health milestone.
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Quick reference table
          </h3>
          <p>
            The table shows what 5%, 10%, 15% and 20% weight loss equals for common starting weights.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden tabular-nums">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3">Starting Weight</th>
                  <th className="p-3">5% Weight Loss</th>
                  <th className="p-3">10% Weight Loss</th>
                  <th className="p-3">15% Weight Loss</th>
                  <th className="p-3">20% Weight Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="p-3 font-semibold">150 lbs</td>
                  <td className="p-3">7.5 lbs (142.5 lbs)</td>
                  <td className="p-3">15 lbs (135 lbs)</td>
                  <td className="p-3">22.5 lbs (127.5 lbs)</td>
                  <td className="p-3">30 lbs (120 lbs)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">180 lbs</td>
                  <td className="p-3">9 lbs (171 lbs)</td>
                  <td className="p-3">18 lbs (162 lbs)</td>
                  <td className="p-3">27 lbs (153 lbs)</td>
                  <td className="p-3">36 lbs (144 lbs)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">200 lbs</td>
                  <td className="p-3">10 lbs (190 lbs)</td>
                  <td className="p-3">20 lbs (180 lbs)</td>
                  <td className="p-3">30 lbs (170 lbs)</td>
                  <td className="p-3">40 lbs (160 lbs)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">250 lbs</td>
                  <td className="p-3">12.5 lbs (237.5 lbs)</td>
                  <td className="p-3">25 lbs (225 lbs)</td>
                  <td className="p-3">37.5 lbs (212.5 lbs)</td>
                  <td className="p-3">50 lbs (200 lbs)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">300 lbs</td>
                  <td className="p-3">15 lbs (285 lbs)</td>
                  <td className="p-3">30 lbs (270 lbs)</td>
                  <td className="p-3">45 lbs (255 lbs)</td>
                  <td className="p-3">60 lbs (240 lbs)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Baby className="w-4 h-4 text-[#7334fd] dark:text-indigo-400" />
            <span>The calculator suite</span>
          </h3>
          <p>
            One metric anchors the suite. Each tool below measures a different variable of the same process: energy balance.
          </p>
          <p>
            Newborn tracking starts at birth. Parents tracking the first week of life use the{' '}
            <a href="/calculators/newborn-weight-loss/" className="text-[#ca3500] dark:text-orange-400 font-bold hover:underline">
              newborn weight loss calculator
            </a>
            , which compares each day&apos;s weight against the normal early-loss range of the first week of life. Tracking continues after week one. For weeks two to four, the{' '}
            <a href="/calculators/baby-weight-loss/" className="text-[#4950fc] dark:text-sky-400 font-bold hover:underline">
              baby weight loss percentage calculator
            </a>{' '}
            continues the same percentage tracking week by week against expected regain patterns.
          </p>
          <p>
            Metabolism tools set the calorie context. Before setting a target, the{' '}
            <a href="/calculators/bmr/" className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline">
              BMR calculator
            </a>{' '}
            estimates the calorie floor the body needs at complete rest. The{' '}
            <a href="/calculators/tdee/" className="text-[#4950fc] dark:text-sky-400 font-bold hover:underline">
              TDEE calculator
            </a>{' '}
            extends that resting estimate with activity level, giving the full daily budget the deficit works against. The{' '}
            <a href="/calculators/calorie-deficit/" className="text-[#ca3500] dark:text-orange-400 font-bold hover:underline">
              calorie deficit calculator
            </a>{' '}
            then sizes the gap between intake and budget that produces fat loss.
          </p>
          <p>
            Food and composition tools fill in the details. The{' '}
            <a href="/restaurants/subway/" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">
              Subway calorie calculator
            </a>{' '}
            shows how a restaurant meal fits inside the daily budget. The{' '}
            <a href="/calculators/bmi/" className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline">
              BMI calculator
            </a>{' '}
            classifies body mass against WHO categories. The{' '}
            <a href="/calculators/body-fat-percentage/" className="text-[#ca3500] dark:text-orange-400 font-bold hover:underline">
              body fat percentage calculator
            </a>{' '}
            estimates composition with the US Navy method. The protein calculator sets daily protein targets that preserve muscle during a deficit. The{' '}
            <a href="/calculators/water-intake/" className="text-[#4950fc] dark:text-sky-400 font-bold hover:underline">
              water intake calculator
            </a>{' '}
            personalises hydration. The macro calculator splits calories into protein, fat and carbohydrate targets.
          </p>
          <p>
            Stage-specific tools cover special cases. The{' '}
            <a href="/calculators/postpartum-weight-loss/" className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline">
              postpartum weight loss calculator
            </a>{' '}
            plans safe breastfeeding weight loss. The{' '}
            <a href="/calculators/bariatric-surgery-weight-loss/" className="text-[#ca3500] dark:text-orange-400 font-bold hover:underline">
              bariatric surgery calculator
            </a>{' '}
            tracks excess weight loss percentage after VSG or bypass procedures. The{' '}
            <a href="/calculators/weight-loss/" className="text-[#4950fc] dark:text-sky-400 font-bold hover:underline">
              weight loss calculator
            </a>{' '}
            projects the timeline to reach a goal weight. The{' '}
            <a href="/calculators/biggest-loser/" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">
              Biggest Loser weight loss calculator
            </a>{' '}
            applies the same percentage formula to the competition format, where ranking depends on percentage rather than pounds.
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Percentage versus pounds: which to trust
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3">Criterion</th>
                  <th className="p-3">Percentage</th>
                  <th className="p-3">Raw pounds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="p-3 font-semibold">Comparability across body sizes</td>
                  <td className="p-3">High. One scale for every frame</td>
                  <td className="p-3">Low. Ten pounds means different things at 150 and 300</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Clinical thresholds</td>
                  <td className="p-3">Built in. The 5% and 10% milestones are percentage-based</td>
                  <td className="p-3">None. Pounds carry no threshold</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Goal setting</td>
                  <td className="p-3">Scales to the individual frame automatically</td>
                  <td className="p-3">Needs manual adjustment per person</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Limitation</td>
                  <td className="p-3">Does not separate fat loss from muscle or water loss</td>
                  <td className="p-3">Same limitation, plus no comparability</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            An editorial note on method. Percentage is the better headline metric for almost every purpose. Pounds still matter in the kitchen, where portions are weighed in ounces and grams. Track the percentage for decisions. Track the pounds for cooking. The percentage tells you whether you are succeeding. The scale tells you what to eat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Evidence and references</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>MedlinePlus (NIH): Health topics</li>
              <li>NIH NIDDK: Weight management</li>
              <li>
                <a href="/methodology/" className="text-[#7334fd] dark:text-indigo-400 font-semibold hover:underline">
                  Editorial and Methodology Policy
                </a>
                : our accuracy standards
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Medical disclaimer</h3>
            <p>
              This tool is for educational and informational purposes only and does not replace professional medical advice. Consult a registered dietitian or healthcare professional before starting restrictive dieting or intensive training.
            </p>
            <p>
              Clinical evidence suggests a safe and sustainable rate of fat loss is 1 to 2 pounds per week (0.5% to 1.0% of total body weight). Rapid weight reduction can cause metabolic adaptation, lean muscle loss and nutritional deficiencies.
            </p>
            <p>
              BMR, TDEE and calorie deficit models estimate energy expenditure from baseline physiological variables. Actual metabolic rates vary with lean body mass distribution, hormonal health, activity levels and individual adaptation. Adjust caloric targets gradually and prioritise nutrient-dense whole foods.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#newborn" className="text-[#ca3500] dark:text-orange-400 hover:underline">Newborn Weight Loss Calculator</a>
          <span>•</span>
          <a href="#water-fasting" className="text-[#4950fc] dark:text-sky-400 hover:underline">Water Fasting &amp; OMAD Calculator</a>
          <span>•</span>
          <a href="#glp1-calculator" className="text-emerald-700 dark:text-emerald-400 hover:underline">GLP-1 &amp; Semaglutide Calculator</a>
        </div>
      </section>

      {/* ================= SILO 2: NEWBORN ================= */}
      <section id="newborn" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Newborn Weight Loss Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            A newborn weight loss calculator is a functional tool that measures an infant&apos;s weight change as a percentage of birth weight in the first days of life. It accepts two inputs: birth weight and current weight. It returns one value: the percentage lost.
          </p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Reviewed by Dr. Rekha Kumar, M.D., M.S. Verified against AAP and WHO guidelines. Last updated August 2026.
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Newborn Weight Loss Percentage Formula
          </h3>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
            The formula is weight loss percentage = (birth weight − current weight) ÷ birth weight × 100.
          </div>
          <p>
            The formula has three variables. The input variables are birth weight and current weight. The output variable is weight loss percentage.
          </p>
          <p>
            Worked example. Firstly, subtract current weight from birth weight: 3,500g − 3,300g = 200g. Secondly, divide the difference by birth weight: 200 ÷ 3,500 = 0.0571. Finally, multiply by 100 to state the result as a percentage: 5.71%.
          </p>
          <p>
            A 5.71% reading sits inside the normal physiological range for a breastfed newborn on day 3.
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Safe Ranges vs. Warning Signs
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3">Reading</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">What it means</th>
                  <th className="p-3">What to do</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="p-3 font-semibold text-emerald-700 dark:text-emerald-400">Below 7%</td>
                  <td className="p-3 font-semibold">Normal physiological drop</td>
                  <td className="p-3">Expected post-birth fluid excretion</td>
                  <td className="p-3">Continue on-demand nursing or formula feedings 8 to 12 times per 24 hours</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-amber-700 dark:text-amber-400">7% to 10%</td>
                  <td className="p-3 font-semibold">Borderline, monitor closely</td>
                  <td className="p-3">Common around the day-3 peak loss</td>
                  <td className="p-3">Assess latch, count wet diapers (minimum 4 to 6 per day), and consider a lactation consultation</td>
                </tr>
                <tr className="bg-rose-50/50 dark:bg-rose-950/40">
                  <td className="p-3 font-bold text-rose-700 dark:text-rose-400">Above 10%</td>
                  <td className="p-3 font-bold text-rose-900 dark:text-rose-200">Clinical action required</td>
                  <td className="p-3">Exceeds the AAP guideline threshold</td>
                  <td className="p-3 font-semibold text-rose-800 dark:text-rose-300">Contact a pediatrician immediately to assess hydration status and the feeding plan</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Why Newborns Lose Weight (Physiological Weight Loss)
          </h3>
          <p>
            Newborn weight loss in the first days of life is a normal biological process. Most healthy newborns lose between 5% and 7% of their birth weight within 3 to 5 days after delivery. Babies shed excess extracellular fluid accumulated in the womb. They pass meconium, the first dark stool. They adjust to oral feeding outside the uterus while maternal milk supply is still arriving.
          </p>
          <p>
            Clinical guidelines state the following facts. Weight loss up to 7% is typical for exclusively breastfed babies. Formula-fed babies typically lose 3% to 5% or less. A loss between 7% and 10% calls for close feeding and latch monitoring, and a loss above 10% triggers clinical evaluation to rule out inadequate milk transfer, dehydration, hypernatremia, or latching difficulties.
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Hour-by-Hour Clinical Thresholds (Nomogram)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3">Age (Hours / Days)</th>
                  <th className="p-3">Normal Loss (Breastfed)</th>
                  <th className="p-3">Normal Loss (Formula)</th>
                  <th className="p-3">Clinical Action Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="p-3 font-semibold">0 to 24 Hours (Day 1)</td>
                  <td className="p-3">3% to 5%</td>
                  <td className="p-3">2% to 4%</td>
                  <td className="p-3">Above 7% loss (assess latch and feedings)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">24 to 48 Hours (Day 2)</td>
                  <td className="p-3">5% to 7%</td>
                  <td className="p-3">3% to 5%</td>
                  <td className="p-3">Above 8% loss (consult lactation or pediatrician)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">48 to 72 Hours (Day 3, peak loss)</td>
                  <td className="p-3">7% to 8%</td>
                  <td className="p-3">4% to 5%</td>
                  <td className="p-3">Above 10% loss (immediate medical assessment)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Days 4 to 5 (milk arrival)</td>
                  <td className="p-3">Stabilizing, initial gain</td>
                  <td className="p-3">Weight gain begins</td>
                  <td className="p-3">Continued loss after day 5</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Days 10 to 14 (milestone)</td>
                  <td className="p-3">Regained birth weight</td>
                  <td className="p-3">Regained birth weight</td>
                  <td className="p-3">Failure to regain birth weight by day 14</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Birth weight returns by day 10 to 14 for most infants. After that milestone, parents can follow weekly change through the first month with the{' '}
            <a href="/calculators/baby-weight-loss/" className="text-[#4950fc] dark:text-sky-400 font-bold hover:underline">
              baby weight tracker
            </a>
            , which applies the same percentage method to the regain curve. Mothers can track their own recovery with the{' '}
            <a href="/calculators/postpartum-weight-loss/" className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline">
              postpartum recovery calculator
            </a>
            , which measures maternal weight change while breastfeeding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Impact of Delivery Method (Vaginal vs. C-Section IV Fluids)
            </h3>
            <p>
              Mothers who undergo Cesarean delivery or receive high volumes of intrapartum IV fluids during labor often pass extra fluid to the newborn prior to birth. This temporary fluid expansion can raise initial weight loss readings by 2 to 4 percentage points during the first 48 hours as the infant excretes the excess fluid through diuresis. Pediatricians factor intrapartum IV fluid volume into their assessment of C-section newborn weight trajectories.
            </p>

            <h3 className="text-base font-bold text-slate-900 dark:text-white pt-2">
              When to Call Your Pediatrician
            </h3>
            <p>Contact your baby&apos;s doctor immediately in any of these cases.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Weight loss exceeds 10% of birth weight at any point.</li>
              <li>The baby has not regained birth weight by 14 days of age.</li>
              <li>The baby shows signs of dehydration: fewer wet diapers, dry mouth, or weakness.</li>
              <li>The baby appears lethargic or jaundiced, or is difficult to wake for feedings.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Monitoring at Home vs. at the Clinic (Comparison Checklist)
            </h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>A home scale suits daily trend checks in the first week. A clinic scale suits the 48 to 72 hour threshold visit and the two-week regain check.</li>
              <li>One consistent scale used at the same time of day produces comparable numbers. Switching scales between readings breaks the trend line.</li>
              <li>One consistent unit (grams) removes conversion error. Mixing ounces and grams introduces it.</li>
              <li>Home readings answer &quot;is today within range.&quot; Clinic readings answer &quot;is the trajectory within the guideline.&quot; Both serve the same decision: whether feeding is adequate.</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Unit Conversion Guide
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3">Unit</th>
                  <th className="p-3">Equals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="p-3 font-semibold">1 pound (lb)</td>
                  <td className="p-3">16 ounces (oz), or 453.592 grams (g)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">1 ounce (oz)</td>
                  <td className="p-3">28.3495 grams (g)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">7 lb 8 oz</td>
                  <td className="p-3">120 oz, or 3,402 grams</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Average newborn birth weight</td>
                  <td className="p-3">5.5 to 8.8 lb (2,500 to 4,000 g)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Normal infant weight percentile range</td>
                  <td className="p-3">10th to 90th percentile</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            For highest accuracy, measure in grams and use the same unit for both weights.
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Why Clinicians Chart Percentage, Not Grams (Expert Perspective)
          </h3>
          <p>
            A 200-gram loss means little without the denominator. On a 3,500-gram infant it equals 5.71%. On a 2,500-gram infant it equals 8.0%. The percentage states both results on one scale, which is why pediatric nomograms and AAP guidance use percentage thresholds instead of gram thresholds. Grams measure the baby. Percentages measure the baby against the guideline. For parents, the percentage also answers the only question that matters at 3 a.m.: is this number within the normal range.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Related Pediatric and Postpartum Calculators
            </h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <a href="/calculators/postpartum-weight-loss/" className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline">
                  Postpartum Weight Loss Calculator
                </a>
                . Track maternal weight recovery while breastfeeding safely.
              </li>
              <li>
                <a href="/calculators/baby-weight-loss/" className="text-[#4950fc] dark:text-sky-400 font-bold hover:underline">
                  Infant Weight Loss Tracker
                </a>
                . Monitor weekly weight percentiles beyond the 14-day newborn window.
              </li>
              <li>
                <a href="/category/pregnancy/" className="text-[#ca3500] dark:text-orange-400 font-bold hover:underline">
                  Pregnancy Weight Gain Calculator
                </a>
                . Trimester-by-trimester gestational weight gain targets.
              </li>
              <li>
                <a href="/" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">
                  Master Weight Loss Percentage Calculator
                </a>
                . Standard body weight loss percentage tool for adults.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Scientific References and Clinical Guidelines
            </h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>American Academy of Pediatrics (AAP). &quot;Management of Hyperbilirubinemia and Physiological Weight Loss in the Newborn Infant.&quot; Pediatric Clinical Practice Guidelines. PubMed ID: 35925414.</li>
              <li>World Health Organization (WHO). &quot;Infant and Young Child Feeding: Standardized Newborn Weight Loss Curves.&quot; WHO guidelines, approved by the Guidelines Review Committee.</li>
              <li>Flaherman, V. J., et al. &quot;Early Weight Loss Nomogram for Exclusively Breastfed Newborns.&quot; Pediatrics, 135(1), 16 to 23.</li>
              <li>Centers for Disease Control and Prevention (CDC). Healthy Weight Guidelines.</li>
              <li>National Heart, Lung, and Blood Institute (NHLBI). Obesity Guidelines.</li>
            </ol>
            <h3 className="font-bold text-slate-900 dark:text-white text-base pt-2">
              Medical Disclaimer
            </h3>
            <p>
              This calculator and guide are for educational purposes only and do not replace professional medical advice. Always consult a board-certified pediatrician or healthcare provider regarding infant weight loss, feeding concerns, or health evaluation.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="/calculators/baby-weight-loss/" className="text-[#4950fc] dark:text-sky-400 hover:underline">Baby Weight Loss Calculator</a>
          <span>•</span>
          <a href="/calculators/bmi/" className="text-[#7334fd] dark:text-indigo-400 hover:underline">BMI Calculator</a>
          <span>•</span>
          <a href="/calculators/bmi-chart/" className="text-[#ca3500] dark:text-orange-400 hover:underline">BMI Chart</a>
          <span>•</span>
          <a href="/calculators/ideal-weight/" className="text-emerald-700 dark:text-emerald-400 hover:underline">Ideal Weight by Height</a>
        </div>
      </section>

      {/* ================= SILO 2B: WATER FASTING & OMAD ================= */}
      <section id="water-fasting" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
              Water Fasting &amp; OMAD Weight Loss Calculator
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
              Separating glycogen-bound water drop (Days 1 to 3) from true adipose fat oxidation across 24-hour, 48-hour, 72-hour, 5-day, 7-day, and OMAD protocols.
            </p>
          </div>
          <a
            href="#"
            onClick={() => {
              onSelectToolMode?.('adult');
              onSelectClinicalFocus?.('fasting');
            }}
            className="px-3.5 py-2 rounded-xl bg-[#7334fd] text-white font-bold text-xs shadow-xs hover:opacity-95"
          >
            Open Water Fast &amp; OMAD Mode Above
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#ca3500] dark:text-orange-400" />
              Why Early Fasting Scale Drops Are Mostly Glycogen &amp; Water
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Your liver and skeletal muscles store roughly 400g to 500g of carbohydrate as glycogen, and each gram of glycogen binds 3g to 4g of intracellular water. During the first 24 to 72 hours of a water fast, your body depletes this glycogen reserve first, releasing 2.5 to 5.0 lbs (1.1 to 2.3 kg) of water weight that naturally returns when you refeed.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#7334fd] dark:text-indigo-400" />
              True Fat Burn Formula (TDEE ÷ 3,500 kcal)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              True adipose fat loss during a water fast or OMAD (One Meal a Day, 23:1) schedule is governed by your Total Daily Energy Expenditure. An adult burning 2,100 kcal/day oxidizes approximately <strong className="text-slate-900 dark:text-white">0.60 lbs (0.27 kg) of pure body fat per 24 hours</strong> of zero-calorie fasting.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
              <tr>
                <th className="p-3">Fasting Protocol</th>
                <th className="p-3">Total Scale Drop (200 lb Adult)</th>
                <th className="p-3">Glycogen + Water (Refeed)</th>
                <th className="p-3">True Fat Loss Kept</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 tabular-nums">
              <tr>
                <td className="p-3 font-semibold">24-Hour Water Fast (1 Day)</td>
                <td className="p-3">-2.8 lbs (-1.4%)</td>
                <td className="p-3 text-sky-700 dark:text-sky-300">-2.2 lbs water</td>
                <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">-0.6 lbs (-0.30%)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">48-Hour Water Fast (2 Days)</td>
                <td className="p-3">-5.0 lbs (-2.5%)</td>
                <td className="p-3 text-sky-700 dark:text-sky-300">-3.8 lbs water</td>
                <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">-1.2 lbs (-0.60%)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">72-Hour Water Fast (3 Days)</td>
                <td className="p-3">-6.8 lbs (-3.4%)</td>
                <td className="p-3 text-sky-700 dark:text-sky-300">-5.0 lbs water</td>
                <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">-1.8 lbs (-0.90%)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">5-Day Water Fast (Physician-Monitored)</td>
                <td className="p-3">-8.8 lbs (-4.4%)</td>
                <td className="p-3 text-sky-700 dark:text-sky-300">-5.8 lbs water</td>
                <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">-3.0 lbs (-1.50%)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">OMAD 23:1 (30 Days @ -750 kcal/d)</td>
                <td className="p-3">-8.9 lbs (-4.5%)</td>
                <td className="p-3 text-sky-700 dark:text-sky-300">-2.5 lbs water</td>
                <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">-6.4 lbs (-3.21%)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#bmr" className="text-[#ca3500] dark:text-orange-400 hover:underline">BMR &amp; Weekly Forecast Calculator</a>
          <span>•</span>
          <a href="#keto" className="text-[#4950fc] dark:text-sky-400 hover:underline">Keto Diet Calculator</a>
        </div>
      </section>

      {/* ================= SILO 2C: GLP-1, SEMAGLUTIDE & TIRZEPATIDE ================= */}
      <section id="glp1-calculator" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
              GLP-1, Semaglutide &amp; Tirzepatide Weight Loss Calculator
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
              Expected Total Body Weight Loss (%TBWL) timelines for Ozempic®, Wegovy®, Mounjaro®, Zepbound®, and Phase 2/3 clinical trial benchmarks.
            </p>
          </div>
          <a
            href="#"
            onClick={() => {
              onSelectToolMode?.('adult');
              onSelectClinicalFocus?.('glp1');
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:opacity-95"
          >
            Open GLP-1 Medication Mode Above
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              STEP-1 (Semaglutide) vs. SURMOUNT-1 (Tirzepatide)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              In the landmark NEJM STEP-1 trial, adults treated with once-weekly 2.4 mg semaglutide (Wegovy® / Ozempic®) achieved a mean <strong className="text-slate-900 dark:text-white">14.9% Total Body Weight Loss</strong> at 68 weeks. In SURMOUNT-1, dual GIP/GLP-1 agonist tirzepatide (Mounjaro® / Zepbound® 15 mg) achieved a mean <strong className="text-slate-900 dark:text-white">20.9% TBWL</strong> at 72 weeks.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Clinical Safety &amp; Pre-Filled Pen Dosing Notice
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Investigational triple-agonists (such as retatrutide, 24.2% Phase 2 benchmark) and research peptides (MOTS-c, AOD-9604, Lipo-C) are not FDA-approved for retail compounding. Always use licensed pharmacy pre-filled pens and never attempt home bacteriostatic water reconstitution or non-standard syringe unit mixing.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#gastric-bypass" className="text-[#ca3500] dark:text-orange-400 hover:underline">Gastric Bypass &amp; Sleeve Calculator</a>
          <span>•</span>
          <a href="#per-month" className="text-[#4950fc] dark:text-sky-400 hover:underline">Healthy Weight Loss Per Month</a>
        </div>
      </section>

      {/* ================= SILO 3: CALORIE ================= */}
      <section id="calorie" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Subway Calorie Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Balancing everyday restaurant meals with daily movement, cycling, and resting calorie needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Customizing Sandwiches</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              When eating out, small swaps make a big difference. Choosing lean turkey or chicken and swapping heavy mayo for mustard or vinegar can save 150 to 250 calories on a single sandwich without leaving you hungry.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Cycling &amp; Cardio Burn</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Thirty minutes on a stationary bike or outdoor ride typically burns 200 to 350 calories depending on your pace and body weight. It is a practical way to widen your daily calorie deficit without extreme dieting.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Calorie Needs While Breastfeeding</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Producing breast milk uses roughly 400 to 500 extra calories a day. Nursing mothers should aim for gradual weight loss and avoid overly strict calorie cuts so milk supply and energy stay strong.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#percentage" className="text-[#ca3500] dark:text-orange-400 hover:underline">Weight Loss Percentage Calculator</a>
          <span>•</span>
          <a href="#newborn" className="text-[#4950fc] dark:text-sky-400 hover:underline">Newborn Weight Loss Calculator</a>
        </div>
      </section>

      {/* ================= SILO 4: NUTRITION ================= */}
      <section id="nutrition" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Subway Nutrition Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Checking protein, carbs, fat, and sodium when building meals on the go.
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Keeping Protein High on a Calorie Budget</h3>
          <p>
            Looking up meal nutrition before you order makes it much easier to hit your protein target while staying within your daily calories. Aiming for 25 to 35 grams of protein per meal helps keep you full through the afternoon and protects lean muscle while you lose weight.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Subway Nutrition Calculator: Example 6-Inch Builds</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Totals below come from this page’s own Subway builder. A footlong doubles the 6-inch total. Turkey and chicken builds carry roughly 18 to 25 grams of protein per 6-inch sub; totals vary with bread and sauce.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3">6-Inch Build</th>
                  <th className="p-3">Calories</th>
                  <th className="p-3">Protein</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="p-3 font-semibold">Turkey, 9-grain wheat, mustard, no cheese</td>
                  <td className="p-3">315 kcal</td>
                  <td className="p-3">~18 g</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Rotisserie chicken, 9-grain wheat, provolone, mustard</td>
                  <td className="p-3">415 kcal</td>
                  <td className="p-3">~25 g</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Philly steak, Italian herbs &amp; cheese, provolone, mayo</td>
                  <td className="p-3">630 kcal</td>
                  <td className="p-3">~25 g</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Italian B.M.T., artisan Italian white, pepper jack, honey mustard</td>
                  <td className="p-3">600 kcal</td>
                  <td className="p-3">~20 g</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#percentage" className="text-[#ca3500] dark:text-orange-400 hover:underline">Weight Loss Percentage Calculator</a>
          <span>•</span>
          <a href="#newborn" className="text-[#4950fc] dark:text-sky-400 hover:underline">Newborn Weight Loss Calculator</a>
        </div>
      </section>

      {/* ================= SILO 5: LBS ================= */}
      <section id="lbs" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            5'2" 105 lbs
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Understanding how height and weight pair together on standard adult BMI charts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Example Height &amp; Weight Ranges</h3>
            <p>
              At <strong className="text-slate-900 dark:text-white">5'2" and 105 lbs</strong>, an adult’s Body Mass Index (BMI) is <strong className="text-slate-900 dark:text-white">19.2</strong>, which sits within the standard healthy weight range (18.5 to 24.9). Similarly, 5'5" at 120 lbs equals a BMI of 20.0.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">When Weight Drops Too Low</h3>
            <p>
              The same weight looks very different at a taller height. For example, 105 lbs at 5'6" works out to a BMI of 16.9, which is below the 18.5 threshold and considered underweight. At that point, doctors recommend focusing on nourishing weight gain rather than further weight loss.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#percent" className="text-[#ca3500] dark:text-orange-400 hover:underline">Percent Weight Loss Calculator</a>
          <span>•</span>
          <a href="#baby" className="text-[#4950fc] dark:text-sky-400 hover:underline">Baby Weight Loss Calculator</a>
        </div>
      </section>

      {/* ================= SILO 6: MUCH ================= */}
      <section id="much" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            How Much Weight Have I Lost Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Checking your total progress so far and setting realistic monthly expectations.
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Seeing the Bigger Picture</h3>
          <p>
            When you are working toward a long-term goal, it is easy to feel stuck if the scale only moves half a pound in a week. Checking your total pounds and percentage lost from day one reminds you how far you have already come. For most adults, losing about 0.5% to 1% of body weight per week adds up to lasting progress over a few months. Use the <a href="/calculators/how-much-weight-can-i-lose-in-a-month/" className="text-[#7334fd] dark:text-indigo-400 hover:underline font-semibold">how much weight can I lose in a month calculator</a> to turn a daily calorie deficit into a date: pick your deficit, and the tool projects your loss week by week.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#percentage" className="text-[#ca3500] dark:text-orange-400 hover:underline">Weight Loss Percentage Calculator</a>
          <span>•</span>
          <a href="/calculators/how-much-weight-can-i-lose-in-a-month/" className="text-[#4950fc] dark:text-sky-400 hover:underline">How Much Weight Can I Lose in a Month Calculator</a>
        </div>
      </section>

      {/* ================= SILO 7: CALORIES ================= */}
      <section id="calories" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Subway Calories Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Comparing meal calories against your resting metabolism and daily activity.
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Knowing roughly how many calories are in your favorite takeout meals makes it much simpler to stay consistent without giving up convenience foods entirely. Pair meal estimates with your daily maintenance calories (TDEE) so you can plan filling meals that fit your day.
        </p>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#percentage" className="text-[#ca3500] dark:text-orange-400 hover:underline">Weight Loss Percentage Calculator</a>
          <span>•</span>
          <a href="#newborn" className="text-[#4950fc] dark:text-sky-400 hover:underline">Newborn Weight Loss Calculator</a>
        </div>
      </section>

      {/* ================= SILO 8: PERCENT ================= */}
      <section id="percent" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Percent Weight Loss Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Quick math for 5% and 10% weight loss goals.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Why Percent Change Is Fairer</h3>
            <p>
              Ten pounds is a very different share of body weight for someone starting at 150 lbs (6.7%) compared to someone starting at 250 lbs (4.0%). Tracking percentages puts everyone on an even footing.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Finding 5% of Your Weight</h3>
            <p>
              To find 5% of your current weight, multiply your weight by <strong className="text-slate-900 dark:text-white">0.05</strong>. For a 200 lb adult, a 5% milestone is an approachable 10 lbs.
            </p>
          </div>
        </div>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#lbs" className="text-[#ca3500] dark:text-orange-400 hover:underline">5'2" 105 lbs</a>
          <span>•</span>
          <a href="#baby" className="text-[#4950fc] dark:text-sky-400 hover:underline">Baby Weight Loss Calculator</a>
        </div>
      </section>

      {/* ================= SILO 9: BABY ================= */}
      <section id="baby" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Baby Weight Loss Percentage Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            A baby weight loss percentage calculator is a functional tool that converts weight change into a percentage of birth weight. The metric is ((birth weight minus current weight) divided by birth weight) times 100. It standardizes tracking from birth through the first month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              What the tool computes
            </h3>
            <p>
              A baby weight loss percentage is ((starting weight minus current weight) divided by starting weight) times 100. The tool&apos;s input is birth weight plus the baby&apos;s current weight. The tool&apos;s output is one percentage. The tool accepts pounds, ounces and grams. The reference weight is birth weight or peak weight. The first 72 hours drop fastest. For hour-by-hour thresholds in those first days, the{' '}
              <a href="/calculators/newborn-weight-loss/" className="text-[#ca3500] dark:text-orange-400 font-bold hover:underline">
                newborn first-days tool
              </a>
              , which maps each 24-hour window in finer detail than this monthly tracker.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              How to use it
            </h3>
            <p>
              Firstly, weigh the baby on the same scale at the same time of day. Secondly, enter the birth weight and the new weight in the calculator above. Finally, read the percentage against the normal-range table below.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Worked examples
          </h3>
          <p>
            The calculator applies one formula to every entry. Two worked examples show the arithmetic.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden tabular-nums">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3">Birth weight</th>
                  <th className="p-3">Current weight</th>
                  <th className="p-3">Calculation</th>
                  <th className="p-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="p-3 font-semibold">10 lb</td>
                  <td className="p-3">9.5 lb</td>
                  <td className="p-3 font-mono">((10 − 9.5) ÷ 10) × 100</td>
                  <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">5 percent</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">8 lb</td>
                  <td className="p-3">7.5 lb</td>
                  <td className="p-3 font-mono">((8 − 7.5) ÷ 8) × 100</td>
                  <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">6.25 percent</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Normal ranges for the first month
          </h3>
          <p>
            The table below states the expected change by stage and the line where a pediatrician takes over.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3">Period</th>
                  <th className="p-3">Expected change</th>
                  <th className="p-3">Red-flag line</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="p-3 font-semibold">First 72 hours</td>
                  <td className="p-3">5 to 7 percent of birth weight lost</td>
                  <td className="p-3 font-semibold text-rose-700 dark:text-rose-400">Above 10 percent</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">First 3 to 5 days, breastfed</td>
                  <td className="p-3">Up to 7 percent of birth weight lost</td>
                  <td className="p-3 font-semibold text-rose-700 dark:text-rose-400">Above 10 percent</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">First 3 to 5 days, formula-fed</td>
                  <td className="p-3">3 to 5 percent of birth weight lost</td>
                  <td className="p-3 font-semibold text-rose-700 dark:text-rose-400">Above 10 percent</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Day 10 to day 14</td>
                  <td className="p-3">Birth weight regained</td>
                  <td className="p-3 font-semibold text-rose-700 dark:text-rose-400">Birth weight not regained by day 14</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Weight loss after the first 3 to 4 days is not normal. Later loss, or a failure to gain after that window, requires clinical evaluation. This tracker covers birth through the first month, including the regain curve by day 10 to 14. For day-by-day first-week physiology, see the{' '}
            <a href="/calculators/newborn-weight-loss/" className="text-[#ca3500] dark:text-orange-400 font-bold hover:underline">
              newborn weight loss calculator
            </a>
            , which examines the earliest feeding checks in finer detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Continue tracking or call the pediatrician
            </h3>
            <p>
              The checklist below separates routine home tracking from situations the guidelines assign to a clinician.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Continue tracking at home.</strong> The loss sits inside the expected range in the table above. The baby wets at least 6 diapers daily from day 4 onward. Feeds are regular and the baby wakes easily.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Call the pediatrician.</strong> The loss exceeds 10 percent of birth weight. Birth weight is not regained by day 14. The baby wets fewer than 6 diapers daily from day 4 onward. The baby appears jaundiced or lethargic. The baby is hard to wake for feeds.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Why percentage beats ounces
            </h3>
            <p>
              An ounce figure hides severity because birth weights differ. Seven lost ounces on a 6 pound baby is 7.3 percent. The same seven ounces on a 9 pound baby is 4.9 percent. The percentage puts both babies on one scale, so parents and clinicians compare like with like. Raw ounces never standardize across body sizes.
            </p>
            <h3 className="text-base font-bold text-slate-900 dark:text-white pt-2">
              Responsive feeding and logging
            </h3>
            <p>
              Responsive feeding supports healthy growth, whether breastfeeding or formula. A simple log of weight changes, wet diapers and sleep patterns reveals the baby&apos;s trend faster than memory alone.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Method, review and sources
            </h3>
            <p>
              The tool&apos;s method is standard physiological formulas with evidence-based guidelines. The medical reviewer is Dr. Rekha Kumar, M.D., M.S., Lead Medical Reviewer. The page&apos;s last update is August 2026. The source guidelines are NIH and CDC. The references are CDC Healthy Weight Guidelines, the NIH National Heart, Lung, and Blood Institute Obesity Guidelines, and PubMed studies on fat mass versus lean mass loss. The tool&apos;s price is 0 USD. The tool&apos;s description is a free baby weight loss calculator, dietitian-reviewed.
            </p>
            <h3 className="font-bold text-slate-900 dark:text-white text-base pt-2">
              Medical disclaimer
            </h3>
            <p>
              This tool is for informational purposes only and does not constitute medical advice. Always consult a healthcare provider. Any concerns about your baby&apos;s weight, feeding, or development belong in a conversation with a medical professional.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Related pages
            </h3>
            <p>
              The{' '}
              <a href="/blog/how-to-calculate-weight-loss-percentage/" className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline">
                guide to calculating weight loss percentage
              </a>{' '}
              works through the reasoning behind the arithmetic step by step. A printable reference of these ranges lives on the{' '}
              <a href="/blog/weight-loss-percentage-chart/" className="text-[#ca3500] dark:text-orange-400 font-bold hover:underline">
                weight loss percentage chart page
              </a>
              . Adults tracking their own progress use the{' '}
              <a href="/" className="text-[#4950fc] dark:text-sky-400 font-bold hover:underline">
                general weight loss percentage calculator
              </a>
              , which applies the same percentage method to any starting weight.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="/calculators/newborn-weight-loss/" className="text-[#ca3500] dark:text-orange-400 hover:underline">Newborn Weight Loss Calculator</a>
          <span>•</span>
          <a href="/calculators/bmi/" className="text-[#7334fd] dark:text-indigo-400 hover:underline">BMI Calculator</a>
          <span>•</span>
          <a href="/calculators/bmi-chart/" className="text-[#4950fc] dark:text-sky-400 hover:underline">BMI Chart</a>
          <span>•</span>
          <a href="/calculators/ideal-weight/" className="text-emerald-700 dark:text-emerald-400 hover:underline">Ideal Weight by Height</a>
        </div>
      </section>

      {/* ================= SILO 10: KETO ================= */}
      <section id="keto" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Keto Diet Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            How low-carb and ketogenic diets affect early water weight vs. long-term fat loss.
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          When you cut carbohydrates sharply on a keto plan, your body uses up stored glycogen and releases the water bound to it. That often causes a fast 3 to 6 lb drop in the first week, after which weight loss settles into a steadier pace driven by your overall calorie balance. A standard keto split is about 70% fat, 25% protein, and 5% carbs. Start from your TDEE: the <a href="/calculators/tdee/" className="text-[#7334fd] dark:text-indigo-400 hover:underline font-semibold">TDEE calculator</a> sets your daily calories, then the split divides them into fat, protein, and carbs.
        </p>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#percentage" className="text-[#ca3500] dark:text-orange-400 hover:underline">Weight Loss Percentage Calculator</a>
          <span>•</span>
          <a href="#newborn" className="text-[#4950fc] dark:text-sky-400 hover:underline">Newborn Weight Loss Calculator</a>
          <span>•</span>
          <a href="/calculators/tdee/" className="text-[#7334fd] dark:text-indigo-400 hover:underline">TDEE Calculator</a>
        </div>
      </section>

      {/* ================= SILO 11: METABOLIC RATE ================= */}
      <section id="metabolic-rate" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Basal Metabolic Rate Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            How the Mifflin-St Jeor formula estimates the calories your body burns at rest.
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Your Basal Metabolic Rate (BMR) is the energy your body uses every day just to keep your heart beating, lungs breathing, and body warm, even if you stayed in bed all day. Dietitians generally recommend keeping your daily food intake above your BMR so your body has enough fuel to stay healthy.
        </p>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#percentage" className="text-[#ca3500] dark:text-orange-400 hover:underline">Weight Loss Percentage Calculator</a>
          <span>•</span>
          <a href="#newborn" className="text-[#4950fc] dark:text-sky-400 hover:underline">Newborn Weight Loss Calculator</a>
        </div>
      </section>

      {/* ================= SILO 12: GASTRIC BYPASS ================= */}
      <section id="gastric-bypass" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Gastric Bypass Surgery Weight Loss Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Typical recovery timelines after Roux-en-Y gastric bypass and gastric sleeve procedures.
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Following gastric bypass or sleeve surgery, patients usually experience their fastest weight loss during the first 3 to 6 months, eventually reaching about 60% to 70% excess weight loss (or roughly 25% to 35% of total starting weight) by 12 to 18 months alongside regular follow-ups with their surgical care team.
        </p>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#percentage" className="text-[#ca3500] dark:text-orange-400 hover:underline">Weight Loss Percentage Calculator</a>
          <span>•</span>
          <a href="#newborn" className="text-[#4950fc] dark:text-sky-400 hover:underline">Newborn Weight Loss Calculator</a>
        </div>
      </section>

      {/* Mid-Page In-Article Advertisement Unit (24px spacing from surrounding content cards) */}
      <AdSlot slot={AD_SLOT_IN_ARTICLE} variant="in-article" />

      {/* ================= SILO 13: CALCULATE BIRTH ================= */}
      <section id="calculate-birth" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Birth Weight Loss Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Simple birth weight comparisons for hospital discharge and first-week pediatric visits.
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          When you bring your baby in for their first checkup 1 to 2 days after leaving the hospital, your pediatrician compares that day’s scale reading against the original birth weight to make sure feeding is off to a comfortable start.
        </p>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#percentage" className="text-[#ca3500] dark:text-orange-400 hover:underline">Weight Loss Percentage Calculator</a>
          <span>•</span>
          <a href="#newborn" className="text-[#4950fc] dark:text-sky-400 hover:underline">Newborn Weight Loss Calculator</a>
        </div>
      </section>

      {/* ================= SILO 14: PER MONTH ================= */}
      <section id="per-month" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Healthy Weight Loss Per Month
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Why 4 to 8 pounds per month is a sustainable pace for lasting results.
          </p>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Losing 4 to 8 pounds a month (about 1 to 2 pounds a week) lets you eat satisfying meals, keep your workout strength up, and hold onto lean muscle. Crash diets that promise 15+ pounds in a month mostly drain water and muscle, making weight rebound much more likely. Project your own timeline with the <a href="/calculators/how-much-weight-can-i-lose-in-a-month/" className="text-[#7334fd] dark:text-indigo-400 hover:underline font-semibold">how much weight can I lose in a month calculator</a>.
          </p>
        </div>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#lbs" className="text-[#ca3500] dark:text-orange-400 hover:underline">5'2" 105 lbs</a>
          <span>•</span>
          <a href="#percent" className="text-[#4950fc] dark:text-sky-400 hover:underline">Percent Weight Loss Calculator</a>
          <span>•</span>
          <a href="/calculators/how-much-weight-can-i-lose-in-a-month/" className="text-[#7334fd] dark:text-indigo-400 hover:underline">How Much Weight Can I Lose in a Month Calculator</a>
        </div>
      </section>

      {/* ================= SILO 15: BMR ================= */}
      <section id="bmr" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            BMR Calculator: Basal Metabolic Rate &amp; Resting Calories
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            A basal metabolic rate calculator estimates the minimum calories your body needs at complete rest. BMR is the energy cost of breathing, circulation, cellular maintenance and temperature regulation. This tool computes it with the Mifflin-St Jeor equation, the most widely validated published formula.
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            What this calculator computes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                  <tr>
                    <th className="p-3">Input</th>
                    <th className="p-3">Unit</th>
                    <th className="p-3">Role in the equation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  <tr>
                    <td className="p-3 font-semibold">Weight</td>
                    <td className="p-3">Kilograms or pounds</td>
                    <td className="p-3">Primary driver of the estimate</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Height</td>
                    <td className="p-3">Centimetres or inches</td>
                    <td className="p-3">Secondary scaling factor</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Age</td>
                    <td className="p-3">Years</td>
                    <td className="p-3">Reduces the estimate as age rises</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Sex</td>
                    <td className="p-3">Male or female</td>
                    <td className="p-3">Selects the equation variant</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Body fat percentage</td>
                    <td className="p-3">Optional, for the Katch-McArdle option</td>
                    <td className="p-3">Derives lean body mass</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                    <tr>
                      <th className="p-3">Output</th>
                      <th className="p-3">Unit</th>
                      <th className="p-3">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                    <tr>
                      <td className="p-3 font-semibold">BMR</td>
                      <td className="p-3">Calories per day</td>
                      <td className="p-3">Minimum energy at complete rest</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">BMR share</td>
                      <td className="p-3">Percentage</td>
                      <td className="p-3">Roughly 60 to 75 percent of total daily burn</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                BMR accounts for roughly 60 to 75 percent of total daily calorie burn. The remainder comes from movement, digestion and exercise. A BMR value sets the floor. No sustainable plan sits below it for long.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            The Mifflin-St Jeor equation
          </h3>
          <p>
            The Mifflin-St Jeor equation is the calculation this tool runs by default. Researchers published it in 1990 after validating it against measured resting expenditure. Its standard published forms are below.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3">Variant</th>
                  <th className="p-3">Equation (weight in kg, height in cm, age in years)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-mono">
                <tr>
                  <td className="p-3 font-sans font-semibold">Men</td>
                  <td className="p-3">BMR = 10 × weight + 6.25 × height − 5 × age + 5</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-semibold">Women</td>
                  <td className="p-3">BMR = 10 × weight + 6.25 × height − 5 × age − 161</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The equation&apos;s subject is basal metabolic rate. Its inputs are weight, height, age and sex. Its output is calories per day at rest. Its key property is that muscle tissue costs more energy than fat tissue at rest, so two people at the same weight can hold different BMR values.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              How to use the calculator
            </h3>
            <p>
              Firstly, enter your weight, height, age and sex. Secondly, add your body fat percentage if you know it, because that unlocks the Katch-McArdle option. Finally, read your BMR and compare it against your current intake to see your true baseline.
            </p>
            <p>
              Once you know your baseline,{' '}
              <a href="/" className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline">
                the main weight loss percentage tool
              </a>{' '}
              turns any two weigh-ins into a single comparable number. For the arithmetic behind converting start and current weight into a percentage, see{' '}
              <a href="/blog/how-to-calculate-weight-loss-percentage/" className="text-[#ca3500] dark:text-orange-400 font-bold hover:underline">
                the page that walks through the weight loss percentage formula step by step
              </a>
              .
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              The Katch-McArdle option
            </h3>
            <p>
              The Katch-McArdle formula is the alternative this tool offers. Its defining input is lean body mass, which the tool derives from your body fat percentage. It suits athletes and people with measured body composition, because measured lean mass reflects reality better than height-weight proxies. It suits general users less, because few people know their lean mass with precision.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-xs text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-slate-700">
              BMR = 370 + (21.6 × Lean Body Mass in kg)
            </div>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Which equation should you use
          </h3>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong className="text-slate-900 dark:text-white">Choose Mifflin-St Jeor</strong> when you know weight, height, age and sex but not body fat percentage. It is the default for general populations and the most widely validated option in published comparisons.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Choose Katch-McArdle</strong> when you have a measured body fat percentage. It replaces height-weight proxies with actual lean body mass, which raises accuracy for lean and athletic builds.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Avoid the original Harris-Benedict equation</strong> for new estimates. Published in 1918, it overestimates resting expenditure for modern populations in most comparison studies. Its 1984 revised coefficients narrowed the gap but did not displace Mifflin-St Jeor as the clinical default.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Match the equation to the data you trust.</strong> An equation is only as accurate as its inputs. A precise body fat measurement beats a proxy-based formula. A guessed body fat percentage does not.
            </li>
          </ul>
          <p>
            If your goal is structured weekly loss,{' '}
            <a href="/calculators/biggest-loser/" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">
              the Biggest Loser framework
            </a>{' '}
            sets the deficit against this same resting baseline.
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            The most common mistake: BMR is not TDEE
          </h3>
          <p>
            People read their BMR and treat it as their daily calorie target. It is not. BMR is the floor. Total daily energy expenditure is BMR multiplied by an activity multiplier, so{' '}
            <a href="/calculators/tdee/" className="text-[#4950fc] dark:text-sky-400 font-bold hover:underline">
              the TDEE calculator page
            </a>{' '}
            extends this resting baseline with your movement level, and that product is the number a weight loss plan works from. Eating below BMR for extended periods invites adaptive thermogenesis, the slowdown where the body conserves energy and burns muscle for fuel. The safe deficit sits between BMR and TDEE, never below the floor for long without medical supervision.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            About this calculator
          </h3>
          <p>
            This calculator uses standard physiological formulas and evidence-based guidelines. The National Institutes of Health and the Centers for Disease Control and Prevention guidelines were consulted in its creation. Medical review by Dr. Rekha Kumar, M.D., M.S., Lead Medical Reviewer. Last updated August 2026.
          </p>
          <p>
            <strong className="text-slate-900 dark:text-white">Disclaimer.</strong> This tool is for informational purposes only and does not constitute medical advice. Always consult a healthcare provider before changing your diet or activity.
          </p>
          <p>
            <strong className="text-slate-900 dark:text-white">Scientific references.</strong> CDC Healthy Weight Guidelines. NIH National Heart, Lung, and Blood Institute Obesity Guidelines. PubMed studies on the rate of fat mass versus lean mass loss.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="/calculators/calorie-deficit/" className="text-[#ca3500] dark:text-orange-400 hover:underline">calorie deficit calculator</a>
          <span>•</span>
          <a href="/calculators/bmr/" className="text-[#7334fd] dark:text-indigo-400 hover:underline">BMR calculator</a>
          <span>•</span>
          <a href="/calculators/tdee/" className="text-[#4950fc] dark:text-sky-400 hover:underline">TDEE</a>
          <span>•</span>
          <a href="/blog/healthy-weight-loss-per-month/" className="text-emerald-600 dark:text-emerald-400 hover:underline">healthy weight loss per month</a>
        </div>
      </section>

      {/* ================= SILO 16: INFANT ================= */}
      <section id="infant" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Infant Weight Loss Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Helpful context for parents tracking newborn weight between hospital discharge and the first pediatric visit.
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Because different scales can vary slightly, pediatricians always prefer weighing your baby unclothed on a medical infant scale and looking at the percentage change alongside wet diapers, stool output, and how content your baby seems after feeding.
        </p>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#lbs" className="text-[#ca3500] dark:text-orange-400 hover:underline">5'2" 105 lbs</a>
          <span>•</span>
          <a href="#percent" className="text-[#4950fc] dark:text-sky-400 hover:underline">Percent Weight Loss Calculator</a>
        </div>
      </section>

      {/* ================= SILO 17: BMI ================= */}
      <section id="bmi" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            5'4" 115 BMI
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Quick reference for a 5'4" adult weighing 115 pounds.
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          At 5'4" (64 inches) and 115 lbs, an adult’s BMI is <strong className="text-slate-900 dark:text-white">19.7</strong>, which falls comfortably inside the standard healthy range of 18.5 to 24.9. For someone at 5'4", the healthy BMI weight window runs from about 108 lbs to 145 lbs.
        </p>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#lbs" className="text-[#ca3500] dark:text-orange-400 hover:underline">5'2" 105 lbs</a>
          <span>•</span>
          <a href="#percent" className="text-[#4950fc] dark:text-sky-400 hover:underline">Percent Weight Loss Calculator</a>
        </div>
      </section>

      {/* ================= SILO 18: SUBWAY ================= */}
      <section id="subway" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Subway Nutrition Calculator &amp; Calorie Counter (2026 Menu)
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            A Subway calorie calculator is a sandwich-builder tool that sums the calories, protein, carbohydrates, fat and sodium of one custom Subway sandwich. It takes the 6-inch or Footlong base, the bread, the protein, the cheese, the vegetables and the sauce, and returns the meal totals.
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Build the sandwich, read the totals
          </h3>
          <p>
            The builder above follows one sequence. Firstly, choose the size: 6-inch or Footlong. Secondly, choose the bread. Thirdly, choose the protein. Finally, add cheese, vegetables and sauce. Each selection adds its official 2026 menu values to the totals card. The calculator sums calories, protein, carbohydrates, fat and sodium for the complete sandwich.
          </p>
          <p>
            Subway publishes one nutrition table per ingredient. The tool reads that table directly. It does not estimate. It does not average.
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Fixed reference values
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3">Ingredient choice</th>
                  <th className="p-3">Energy it adds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="p-3 font-semibold">6-inch 9-Grain Wheat or Sourdough bread</td>
                  <td className="p-3">190 to 210 calories</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Mayonnaise or Chipotle Southwest sauce</td>
                  <td className="p-3">100 to 150 calories per serving</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Mustard, vinegar or sweet onion sauce</td>
                  <td className="p-3">0 to 40 calories per serving</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Standard 6-inch turkey breast on wheat</td>
                  <td className="p-3">280 to 315 calories for the complete sandwich</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Why the range matters
          </h3>
          <p>
            Subway is popular for offering healthier fast-food choices. The health claim collapses or holds on four decisions: bread, protein, cheese and sauce. The table above makes the mechanism visible. A 6-inch turkey breast on wheat reads roughly 280 to 315 calories. Add cheese, mayonnaise and Italian herbs and cheese bread and the same sandwich easily doubles its caloric density. The driver is never the turkey. The drivers are the cheese, the sauce and the bread.
          </p>
          <p>
            New Zealand diners use the same builder. The tool covers the official 2026 menu. Subway publishes different nutrition values per region, so the calculator displays the values from the menu data it loads.
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Lowest-calorie build order
          </h3>
          <p>
            Opinion: the cheapest calories come from the base, not the extras. Build in this order when calories are the constraint.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Choice</th>
                  <th className="p-3">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="p-3 font-bold">1</td>
                  <td className="p-3 font-semibold">9-Grain Wheat or Sourdough bread</td>
                  <td className="p-3">The two lowest-calorie 6-inch breads at 190 to 210 calories</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">2</td>
                  <td className="p-3 font-semibold">Turkey breast protein</td>
                  <td className="p-3">The baseline sandwich reads 280 to 315 calories before extras</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">3</td>
                  <td className="p-3 font-semibold">Mustard, vinegar or sweet onion sauce</td>
                  <td className="p-3">Each adds 0 to 40 calories, against 100 to 150 for mayonnaise or Chipotle Southwest</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">4</td>
                  <td className="p-3 font-semibold">Skip or halve the cheese</td>
                  <td className="p-3">Cheese is a stated density driver alongside sauce and bread</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Related calculators
            </h3>
            <p>
              To place one Subway meal inside your daily budget, the{' '}
              <a href="/calculators/bmr/" className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline">
                BMR calculator sets the resting calorie floor
              </a>{' '}
              the meal must fit under, and the{' '}
              <a href="/calculators/calorie-deficit/" className="text-[#4950fc] dark:text-sky-400 font-bold hover:underline">
                Calorie Deficit Calculator
              </a>{' '}
              fits a Subway meal into your daily calorie deficit.
            </p>
            <p>
              For the burger-chain version of this exercise, the{' '}
              <a href="/restaurants/five-guys/" className="text-[#b91c1c] dark:text-red-400 font-bold hover:underline">
                Five Guys calorie calculator
              </a>{' '}
              breaks a custom burger into the same ingredient-by-ingredient totals, while the{' '}
              <a href="/restaurants/mcdonalds/" className="text-[#ca3500] dark:text-orange-400 font-bold hover:underline">
                McDonald&apos;s Nutrition Calculator
              </a>{' '}
              covers fast-food burgers, fries and meals.
            </p>
            <p>
              To record the meal as part of a plan, the{' '}
              <a href="/blog/how-to-calculate-weight-loss-percentage/" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">
                guide on how to calculate weight loss percentage
              </a>{' '}
              shows the exact formula the percentage view applies to it. The{' '}
              <a href="/" className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline">
                homepage calculator suite
              </a>{' '}
              extends this builder with BMI, TDEE, deficit and macro tools that carry one meal into a full day.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Evidence and references
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>HHS: Dietary Guidelines for Americans (health.gov)</li>
              <li>Dietary Guidelines for Americans (dietaryguidelines.gov)</li>
            </ul>
            <p className="pt-2">
              This tool is for informational purposes only and is not a substitute for professional medical advice.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#percentage" className="text-[#ca3500] dark:text-orange-400 hover:underline">Weight Loss Percentage Calculator</a>
          <span>•</span>
          <a href="/restaurants/five-guys/" className="text-[#b91c1c] dark:text-red-400 hover:underline">Five Guys Calorie Calculator</a>
          <span>•</span>
          <a href="/calculators/calorie-deficit/" className="text-[#4950fc] dark:text-sky-400 hover:underline">Calorie Deficit Calculator</a>
        </div>
      </section>

      {/* ================= SILO 19: BARIATRIC SURGERY ================= */}
      <section id="bariatric-surgery" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Bariatric Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Understanding Excess Weight Loss (EWL) vs. Total Body Weight Loss (TBWL) after surgery.
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Bariatric clinics often talk about "excess weight," which is the difference between your starting weight and the weight that corresponds to a BMI of 25. Tracking both your total body weight percentage and your excess weight percentage helps you and your surgeon follow your recovery curve over the first 18 months.
        </p>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#percentage" className="text-[#ca3500] dark:text-orange-400 hover:underline">Weight Loss Percentage Calculator</a>
          <span>•</span>
          <a href="#newborn" className="text-[#4950fc] dark:text-sky-400 hover:underline">Newborn Weight Loss Calculator</a>
        </div>
      </section>

      {/* ================= SILO 20: BIGGEST LOSER ================= */}
      <section id="biggest-loser" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Biggest Loser Weight Loss Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            The Biggest Loser weight loss calculator computes your loss as a percentage of starting weight with the same ranking formula the show used. Enter starting weight and current weight. The tool returns one percentage. A 300-lb contestant who loses 30 lbs ties a 150-lb contestant who loses 15 lbs at 10.0%.
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            How the Biggest Loser formula works
          </h3>
          <p>
            The show ranked contestants on percentage of starting weight lost. That single rule defines this calculator. Its input is two numbers: your starting weight and your current weight. Its output is one number: your weight loss percentage. The equation is the following.
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
            Weight Loss % = ((Starting Weight − Current Weight) ÷ Starting Weight) × 100
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden tabular-nums">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3">Contestant</th>
                  <th className="p-3">Starting weight</th>
                  <th className="p-3">Weight lost</th>
                  <th className="p-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="p-3 font-semibold">Contestant A</td>
                  <td className="p-3">300 lbs</td>
                  <td className="p-3">30 lbs</td>
                  <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">10.0%</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Contestant B</td>
                  <td className="p-3">150 lbs</td>
                  <td className="p-3">15 lbs</td>
                  <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">10.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The two rows tie. The percentage states one fact about both bodies. Raw pounds would have declared the 300-lb contestant the winner. The method derives from the{' '}
            <a href="/blog/how-to-calculate-weight-loss-percentage/" className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline">
              standard weight loss percentage formula
            </a>{' '}
            used across clinical weight programs. Plot each weekly result on the{' '}
            <a href="/blog/weight-loss-percentage-chart/" className="text-[#ca3500] dark:text-orange-400 font-bold hover:underline">
              weight loss percentage chart
            </a>{' '}
            to watch the trend.
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Why the show ranked by percentage
          </h3>
          <p>
            Pounds reward size. A heavier body burns more at rest because its basal metabolic rate runs higher, and the same calorie deficit removes more pounds per week from a larger frame. Percentage divides the loss by the frame. The result measures effort, not mass.
          </p>
          <p>
            The show&apos;s ranking rule was explicit. The contestant with the highest percentage won the weigh-in. Ties stood as ties. Nobody earned points for pounds.
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Percentage ranking versus pounds ranking
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3">Criterion</th>
                  <th className="p-3">Percentage ranking</th>
                  <th className="p-3">Pounds ranking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="p-3 font-semibold">What it measures</td>
                  <td className="p-3">Share of starting weight lost</td>
                  <td className="p-3">Absolute mass lost</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Fairness across body sizes</td>
                  <td className="p-3">High: one scale fits all sizes</td>
                  <td className="p-3">Low: size determines the result</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">What a tie means</td>
                  <td className="p-3">Both bodies changed by the same share</td>
                  <td className="p-3">Impossible to compare across sizes</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Who it favors</td>
                  <td className="p-3">Consistent deficit keepers</td>
                  <td className="p-3">Larger contestants</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The comparison resolves one question. Percentage answers how much of yourself you lost. Pounds answers how much mass moved. Only the first question compares two people.
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Expert perspective: copy the formula, not the pace
          </h3>
          <p>
            The formula is sound. The pace is not. Contestants on the show lost 5 to 10 pounds per week under dangerous calorie deficits and dehydration. Medical research ties that speed to severe muscle wasting and long-term metabolic slowdown. Follow-up studies on contestants revealed the mechanics of adaptive thermogenesis. Their results appear in the reference list below.
          </p>
          <p>
            A sustainable target is 0.5% to 1.0% of body weight per week. That range sits far below show pace. It keeps the loss inside what the body can repeat. Use this calculator to track the share. Set the weekly goal from the medical range, not from television. A safe workflow runs in three steps. Firstly, estimate your baseline burn with the{' '}
            <a href="/calculators/bmr/" className="text-[#4950fc] dark:text-sky-400 font-bold hover:underline">
              site&apos;s resting-metabolism tool
            </a>
            . Secondly, fix the weekly target inside the 0.5% to 1.0% band. Finally, record the share here each week and compare it with the stated range.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              About this calculator
            </h3>
            <p>
              This calculator applies standard physiological formulas under evidence-based guidelines. Dr. Rekha Kumar, M.D., M.S., reviewed it as Lead Medical Reviewer. The page last updated in August 2026.
            </p>
            <p>
              The tool serves information only. It does not replace medical advice. Consult a healthcare provider before you change your diet or training. Every calculator in the suite lives on the{' '}
              <a href="/" className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline">
                Weight Loss Percentage home page
              </a>
              .
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Scientific references
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>CDC Healthy Weight Guidelines</li>
              <li>NIH National Heart, Lung, and Blood Institute obesity guidelines</li>
              <li>PubMed studies on fat mass versus lean mass loss rates</li>
              <li>Metabolic adaptation research on weight loss competition cohorts</li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="/calculators/how-much-weight-can-i-lose-in-a-month/" className="text-[#ca3500] dark:text-orange-400 hover:underline">how much weight can i lose in a month calculator</a>
          <span>•</span>
          <a href="/calculators/calorie-deficit/" className="text-[#4950fc] dark:text-sky-400 hover:underline">calorie deficit calculator</a>
          <span>•</span>
          <a href="#weight-log" className="text-emerald-600 dark:text-emerald-400 hover:underline">biggest loser calorie tracker</a>
        </div>
      </section>

      {/* ================= SILO 21: CALCULATE ================= */}
      <section id="calculate" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Calculate Weight Loss
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Tips for consistent weigh-ins so your numbers tell the truth.
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          For the most reliable numbers, weigh yourself at the same time of day, ideally in the morning after using the restroom and before breakfast, on a flat, hard floor. That keeps daily clothing and meal differences from muddying your progress.
        </p>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#lbs" className="text-[#ca3500] dark:text-orange-400 hover:underline">5'2" 105 lbs</a>
          <span>•</span>
          <a href="#percent" className="text-[#4950fc] dark:text-sky-400 hover:underline">Percent Weight Loss Calculator</a>
        </div>
      </section>

      {/* ================= SILO 22: BODY ================= */}
      <section id="body" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Total Body Weight Loss
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Why medical studies use Total Body Weight Loss (TBWL) to measure health improvements.
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          When doctors discuss nutrition programs or modern GLP-1 medications, they usually report results as <strong className="text-slate-900 dark:text-white">Total Body Weight Loss (TBWL)</strong>, which is the straightforward percentage lost from your starting scale weight. Hitting 5%, 10%, and 15% TBWL directly tracks with better heart and metabolic health.
        </p>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#percentage" className="text-[#ca3500] dark:text-orange-400 hover:underline">Weight Loss Percentage Calculator</a>
          <span>•</span>
          <a href="#newborn" className="text-[#4950fc] dark:text-sky-400 hover:underline">Newborn Weight Loss Calculator</a>
        </div>
      </section>

      {/* ================= SILO 23: POUNDS ================= */}
      <section id="pounds" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            10% of 7 Pounds
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            A quick ounce conversion often checked by new parents.
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          To find <strong className="text-slate-900 dark:text-white">10% of 7 pounds</strong>, multiply 7 lbs by 0.10 to get 0.70 lbs, which equals <strong className="text-slate-900 dark:text-white">11.2 ounces</strong> (since 0.70 × 16 oz = 11.2 oz). That means a 7 lb 0 oz newborn who loses 10% of their birth weight would weigh about <strong className="text-slate-900 dark:text-white">6 lbs 4.8 oz</strong>.
        </p>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#lbs" className="text-[#ca3500] dark:text-orange-400 hover:underline">5'2" 105 lbs</a>
          <span>•</span>
          <a href="#percent" className="text-[#4950fc] dark:text-sky-400 hover:underline">Percent Weight Loss Calculator</a>
        </div>
      </section>

      {/* ================= SILO 24: TDEE ================= */}
      <section id="tdee" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            TDEE Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Using your Total Daily Energy Expenditure to set a comfortable daily calorie target.
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Your <strong className="text-slate-900 dark:text-white">TDEE</strong> is the number of calories you burn in a full 24-hour day including work, errands, and exercise. Eating right at your TDEE maintains your current weight, while eating 300 to 500 calories below your TDEE creates a steady, sustainable pace for fat loss.
        </p>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#percentage" className="text-[#ca3500] dark:text-orange-400 hover:underline">Weight Loss Percentage Calculator</a>
          <span>•</span>
          <a href="#newborn" className="text-[#4950fc] dark:text-sky-400 hover:underline">Newborn Weight Loss Calculator</a>
        </div>
      </section>
    </div>
  );
};

