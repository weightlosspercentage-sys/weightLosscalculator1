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
      </section>

      {/* ================= SILO 1: PERCENTAGE ================= */}
      <section id="percentage" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Weight Loss Percentage Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            How to measure weight change as a percentage of where you started, and why doctors prefer percentages over raw pounds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#ca3500] dark:text-orange-400" />
              How the Formula Works
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To find your weight loss percentage, subtract your current weight from your starting weight, divide that difference by your starting weight, and multiply by 100. Because the formula compares your change against your own starting point, it works the exact same way in pounds, kilograms, stones, or grams.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
              Weight Loss % = ((Starting Weight − Current Weight) ÷ Starting Weight) × 100
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Baby className="w-4 h-4 text-[#7334fd] dark:text-indigo-400" />
              When Checking a Newborn’s Weight
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              In the first few days after birth, pediatricians and nurses use the exact same percentage formula to see how much fluid a newborn has lost compared to birth weight. A small drop is expected, while a larger drop lets your care team know when to offer extra feeding support.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              See our <a href="#newborn" className="text-[#ca3500] dark:text-orange-400 font-bold hover:underline">Newborn Weight Loss Calculator</a> guide below for day-by-day expectations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-transparent dark:border-slate-700/70">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Protecting Muscle Mass</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Pairing a steady calorie deficit with adequate protein and strength training helps ensure that the percentage you lose comes mostly from body fat rather than lean muscle.
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-transparent dark:border-slate-700/70">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Use Weekly Averages</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Your scale weight can bounce up or down by 1 to 3 pounds a day from water and meals. Comparing 7-day averages gives a much clearer picture of your real progress.
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-transparent dark:border-slate-700/70">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">One Formula for Any Unit</h3>
            <p className="text-slate-600 dark:text-slate-300">
              As long as your starting weight and current weight use the same unit, whether pounds, kilograms, stones, or grams, the percentage result is identical.
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
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Newborn Weight Loss Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            What to expect in the first days after birth, based on American Academy of Pediatrics (AAP) guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Why Newborns Lose Weight at First
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Babies are born with extra fluid to help them through the first couple of days before full milk volume comes in. Because of this, healthy full-term newborns commonly lose 5% to 7% of their birth weight in the first 48 to 72 hours. If weight loss reaches 8% to 10%, your pediatrician or lactation consultant will usually check latch and feeding more closely.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Working With Pounds, Ounces, or Grams
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Hospitals often record birth weight in grams on the discharge chart and tell parents the weight in pounds and ounces. To calculate by hand in pounds and ounces, convert both weights to total ounces first (pounds × 16 + ounces) so you aren’t mixing whole pounds with sixteenths.
            </p>
          </div>
        </div>

        {/* Clinical Newborn Reference Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
              <tr>
                <th className="p-3">Baby’s Age</th>
                <th className="p-3">Typical Weight Change</th>
                <th className="p-3">What It Means</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              <tr>
                <td className="p-3 font-semibold">0 to 24 Hours</td>
                <td className="p-3">2.0% to 4.5% loss</td>
                <td className="p-3 text-emerald-700 dark:text-emerald-400">Expected early fluid loss; feed on demand (8 to 12 times a day).</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">24 to 48 Hours</td>
                <td className="p-3">5.0% to 7.5% loss</td>
                <td className="p-3 text-slate-700 dark:text-slate-300">Common range; keep tracking wet diapers and comfortable latch.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">48 to 72 Hours</td>
                <td className="p-3">7.0% to 9.0% loss</td>
                <td className="p-3 text-amber-700 dark:text-amber-400">Weight usually bottoms out here as milk volume increases.</td>
              </tr>
              <tr className="bg-rose-50/50 dark:bg-rose-950/40">
                <td className="p-3 font-semibold text-rose-900 dark:text-rose-200">10% or More Loss</td>
                <td className="p-3 font-bold text-rose-700 dark:text-rose-400">&gt; 10.0% loss</td>
                <td className="p-3 font-semibold text-rose-800 dark:text-rose-300">Check with your pediatrician or lactation specialist today.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#percentage" className="text-[#ca3500] dark:text-orange-400 hover:underline">Weight Loss Percentage Calculator</a>
          <span>•</span>
          <a href="/calculators/baby-weight-loss/" className="text-[#4950fc] dark:text-sky-400 hover:underline">Baby Weight Loss Calculator</a>
        </div>
      </section>

      {/* ================= SILO 2B: WATER FASTING & OMAD ================= */}
      <section id="water-fasting" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Baby Weight Loss Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            When babies typically stop losing weight and return to their birth weight.
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          After a newborn’s weight reaches its lowest point around day 3 or 4, babies generally start gaining about half an ounce to an ounce (15 to 30 grams) per day. Most healthy full-term babies are back up to their original birth weight by 10 to 14 days old.
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

      {/* ================= SILO 10: KETO ================= */}
      <section id="keto" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Healthy Weight Loss Per Month
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Why 4 to 8 pounds per month is the sweet spot for lasting results.
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
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            BMR Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            The difference between resting calories (BMR) and total daily calories (TDEE).
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Think of <strong className="text-slate-900 dark:text-white">BMR</strong> as your body’s idle burn at rest, and <strong className="text-slate-900 dark:text-white">TDEE</strong> as your true daily burn once you include walking, working, chores, and exercise. To lose about 1 pound per week, aim for roughly 500 calories below your TDEE rather than eating below your BMR.
        </p>
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Katch-McArdle Formula and Resting Metabolic Rate (RMR)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The Katch-McArdle formula estimates BMR from lean body mass instead of total weight: BMR = 370 + (21.6 × lean mass in kg). It suits people who know their body fat percentage. Resting metabolic rate (RMR) is the same resting burn measured under slightly less strict conditions, so for weight loss planning RMR and BMR are interchangeable. Once you have your BMR, the <a href="/calculators/tdee/" className="text-[#7334fd] dark:text-indigo-400 hover:underline font-semibold">TDEE calculator</a> multiplies it by your activity level to set your daily calorie target.
          </p>
        </div>
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

      {/* ================= SILO 16: INFANT ================= */}
      <section id="infant" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Subway Macro Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Comparing breads, proteins, cheeses, and sauces when building a sub.
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          A 6-inch turkey or rotisserie chicken sub on whole wheat with plenty of vegetables and a light vinaigrette or mustard gives you a balanced meal under 400 calories, whereas adding double cheese and creamy dressings on a footlong can easily top 900 calories.
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

      {/* ================= SILO 19: BARIATRIC SURGERY ================= */}
      <section id="bariatric-surgery" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Biggest Loser Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Fair scoring for office, family, or group fitness challenges.
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          In a group weight loss challenge, scoring by percentage lost rather than raw pounds keeps the contest fair for everyone. For example, a 160 lb participant who loses 16 lbs (<strong className="text-slate-900 dark:text-white">10.0%</strong>) ranks ahead of a 260 lb participant who loses 20 lbs (<strong className="text-slate-900 dark:text-white">7.69%</strong>). Plan your challenge pace with the <a href="/calculators/how-much-weight-can-i-lose-in-a-month/" className="text-[#7334fd] dark:text-indigo-400 hover:underline font-semibold">how much weight can I lose in a month calculator</a>, and set the daily target with the <a href="/calculators/calorie-deficit/" className="text-[#7334fd] dark:text-indigo-400 hover:underline font-semibold">calorie deficit calculator</a>.
        </p>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Related Calculators:</span>
          <a href="#" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Weight Loss Calculator</a>
          <span>•</span>
          <a href="#percentage" className="text-[#ca3500] dark:text-orange-400 hover:underline">Weight Loss Percentage Calculator</a>
          <span>•</span>
          <a href="#newborn" className="text-[#4950fc] dark:text-sky-400 hover:underline">Newborn Weight Loss Calculator</a>
          <span>•</span>
          <a href="/calculators/how-much-weight-can-i-lose-in-a-month/" className="text-[#7334fd] dark:text-indigo-400 hover:underline">How Much Weight Can I Lose in a Month Calculator</a>
          <span>•</span>
          <a href="/calculators/calorie-deficit/" className="text-[#7334fd] dark:text-indigo-400 hover:underline">Calorie Deficit Calculator</a>
        </div>
      </section>

      {/* ================= SILO 21: CALCULATE ================= */}
      <section id="calculate" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-20 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
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

