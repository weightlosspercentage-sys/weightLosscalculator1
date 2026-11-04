import React from 'react';
import { ExternalLink, GraduationCap, ScrollText, ArrowLeft, CheckCircle2, Code2 } from 'lucide-react';

interface MedicalReviewerProfileProps {
  isStandalonePage?: boolean;
  onBackToCalculator?: () => void;
  onSelectCalculatorMode?: (mode: 'adult' | 'newborn' | 'bmr') => void;
  onOpenFullProfile?: () => void;
}

export const MedicalReviewerProfile: React.FC<MedicalReviewerProfileProps> = ({
  isStandalonePage = false,
  onBackToCalculator,
  onSelectCalculatorMode,
  onOpenFullProfile
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-8 text-slate-800 dark:text-slate-200 transition-colors">
      {isStandalonePage && onBackToCalculator && (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onBackToCalculator}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#7334fd] dark:text-indigo-300 hover:text-[#4950fc] transition-colors min-h-[44px] px-3 py-2 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Weight Loss Percentage Calculator</span>
          </button>
          <span className="text-xs text-slate-400 font-mono">
            https://www.weightlosspercentage.com/authors/dr-rekha-kumar/
          </span>
        </div>
      )}

      {/* Top Profile Identity Card (Matches Screenshot 2) */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 sm:p-7 border border-slate-200/90 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
        {/* Circular Portrait from Screenshot 2 */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[3px] border-slate-900 dark:border-indigo-400 shadow-md ring-4 ring-blue-500/20 overflow-hidden shrink-0 bg-slate-900">
          <svg
            viewBox="28 29 61 61"
            className="w-full h-full block"
            role="img"
            aria-label="Dr. Rekha Kumar, M.D., M.S. - Lead Medical Reviewer"
          >
            <image
              href="/assets/aistudio/image_54629f3a.png"
              width="453"
              height="744"
              preserveAspectRatio="xMidYMid slice"
            />
          </svg>
        </div>

        <div className="space-y-2.5 flex-1 min-w-0">
          {/* Verification Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/40">
              <span>✓</span>
              <span>Board-Certified Endocrinologist</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40">
              <span>✓</span>
              <span>ABOM Diplomate</span>
            </span>
          </div>

          {/* Name & Title */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {onOpenFullProfile && !isStandalonePage ? (
                <button
                  type="button"
                  onClick={onOpenFullProfile}
                  className="hover:text-[#4950fc] dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Dr. Rekha Kumar, M.D., M.S.
                </button>
              ) : (
                'Dr. Rekha Kumar, M.D., M.S.'
              )}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-[#4f46e5] dark:text-indigo-400 mt-0.5">
              Lead Medical Reviewer &amp; Obesity Medicine Specialist
            </p>
          </div>

          {/* LinkedIn CTA + Institution */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="https://www.linkedin.com/in/rekha-kumar-m-d-m-s-70b481237/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs shadow-xs transition-colors min-h-[38px]"
            >
              <span className="font-serif font-black text-xs bg-white text-[#0a66c2] w-4 h-4 rounded-xs flex items-center justify-center leading-none">
                in
              </span>
              <span>Connect on LinkedIn</span>
            </a>

            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Weill Cornell Medicine | New York, NY
            </span>

            {!isStandalonePage && onOpenFullProfile && (
              <button
                type="button"
                onClick={onOpenFullProfile}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#7334fd] dark:text-indigo-400 hover:underline ml-auto"
              >
                <span>Author Profile (/authors/dr-rekha-kumar/)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* About Dr. Rekha Kumar */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          About Dr. Rekha Kumar
        </h3>
        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
          <p>
            <strong className="text-slate-900 dark:text-white">Dr. Rekha Kumar, M.D., M.S.</strong> is an internationally recognized physician leader in endocrinology, diabetes, metabolism, and clinical obesity medicine. She serves as an{' '}
            <strong className="text-slate-900 dark:text-white">Associate Professor of Clinical Medicine at Weill Cornell Medicine</strong> and an Attending Physician at NewYork-Presbyterian Hospital.
          </p>
          <p>
            Dr. Kumar previously served as the{' '}
            <strong className="text-slate-900 dark:text-white">Medical Director of the American Board of Obesity Medicine (ABOM)</strong>, where she oversaw national clinical standards and physician examination development for the discipline of obesity medicine. She serves as the{' '}
            <strong className="text-slate-900 dark:text-white">Lead Medical Reviewer for Weight Loss Percentage</strong>, ensuring that all calculation engines, clinical milestone guidelines (5%, 7%, 10% thresholds), pediatric nomograms, and energy deficit projections align with peer-reviewed medical standards from the ADA, AHA, Endocrine Society, and AAP.
          </p>
        </div>
      </div>

      {/* Education & Training + Board Certifications Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Education & Training */}
        <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-3">
          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-slate-700 dark:text-indigo-400 shrink-0" />
            <span>Education &amp; Training</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <li>
              <strong className="text-slate-900 dark:text-white">Fellowship:</strong> Endocrinology, Diabetes &amp; Metabolism, NewYork-Presbyterian / Weill Cornell Medical Center &amp; Memorial Sloan Kettering Cancer Center
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Residency:</strong> Internal Medicine, NewYork-Presbyterian / Weill Cornell Medical Center
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Doctor of Medicine (M.D.):</strong> New York Medical College
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Master of Science (M.S.):</strong> Institute of Human Nutrition, Columbia University
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Bachelor of Arts (B.A.):</strong> Duke University
            </li>
          </ul>
        </div>

        {/* Board Certifications */}
        <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-3">
          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>Board Certifications</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <li>
              <strong className="text-slate-900 dark:text-white">Endocrinology, Diabetes &amp; Metabolism:</strong> American Board of Internal Medicine (ABIM)
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Obesity Medicine:</strong> Diplomate, American Board of Obesity Medicine (ABOM)
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Internal Medicine:</strong> American Board of Internal Medicine (ABIM)
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">New York State Medical License:</strong> Active &amp; In Good Standing
            </li>
          </ul>
        </div>
      </div>

      {/* Medical Review Standards & Clinical Commitment */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Medical Review Standards &amp; Clinical Commitment
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          At <em>Weight Loss Percentage</em>, our goal is to offer accurate, easy-to-use health calculators without paywalls or confusing medical jargon. Dr. Kumar oversees our medical review process across four key areas:
        </p>
        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pl-2 sm:pl-4 leading-relaxed">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#7334fd] dark:text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-900 dark:text-white">Formula Accuracy:</strong> Checking that our weight loss percentage, Mifflin-St Jeor BMR, body fat, and bariatric formulas match current clinical standards.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#7334fd] dark:text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-900 dark:text-white">Meaningful Health Milestones:</strong> Reviewing the 5% and 10% adult weight loss benchmarks (from AHA and ADA guidelines) and the 7% to 10% newborn weight loss checkpoints (from AAP guidelines).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#7334fd] dark:text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-900 dark:text-white">Realistic, Healthy Pacing:</strong> Making sure our guidance encourages steady, sustainable progress (around 0.5% to 1% of body weight per week) that protects muscle and energy.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#7334fd] dark:text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-900 dark:text-white">Clear When-to-Call-a-Doctor Guidance:</strong> Providing straightforward notes on when parents or patients should check in with their pediatrician or healthcare provider.
            </span>
          </li>
        </ul>
      </div>

      {/* Calculators & Guides Medically Reviewed by Dr. Kumar */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Calculators &amp; Guides Medically Reviewed by Dr. Kumar
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <a
            href="#percentage"
            onClick={(e) => {
              if (onSelectCalculatorMode) {
                e.preventDefault();
                onSelectCalculatorMode('adult');
              }
            }}
            className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/50 hover:bg-sky-100/70 dark:hover:bg-sky-900/50 border border-sky-200/80 dark:border-sky-500/40 transition-colors block space-y-1.5"
          >
            <h4 className="text-xs sm:text-sm font-extrabold text-sky-800 dark:text-sky-300">
              Weight Loss Percentage Calculator
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Track percentage lost from your starting weight and see your next health milestone.
            </p>
          </a>

          <a
            href="#newborn"
            onClick={(e) => {
              if (onSelectCalculatorMode) {
                e.preventDefault();
                onSelectCalculatorMode('newborn');
              }
            }}
            className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/50 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 border border-emerald-200/80 dark:border-emerald-500/40 transition-colors block space-y-1.5"
          >
            <h4 className="text-xs sm:text-sm font-extrabold text-emerald-800 dark:text-emerald-300">
              Newborn Weight Loss Calculator
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Check newborn weight changes in lbs/oz or grams using AAP first-week guidelines.
            </p>
          </a>

          <a
            href="#body"
            onClick={(e) => {
              if (onSelectCalculatorMode) {
                e.preventDefault();
                onSelectCalculatorMode('bmr');
              }
            }}
            className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/50 hover:bg-purple-100/70 dark:hover:bg-purple-900/50 border border-purple-200/80 dark:border-purple-500/40 transition-colors block space-y-1.5"
          >
            <h4 className="text-xs sm:text-sm font-extrabold text-purple-800 dark:text-purple-300">
              BMR &amp; Daily Calorie Calculator
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Estimate resting metabolism and daily maintenance calories with the Mifflin-St Jeor formula.
            </p>
          </a>
        </div>
      </div>

      {/* Platform Engineering & Technical Development Attribution */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/70 dark:bg-slate-800/70 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-[#7334fd] dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Web Application &amp; Calculator Design
            </span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Developed by{' '}
              <a
                href="https://www.linkedin.com/in/wordpress-seo-specialist-abhi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7334fd] dark:text-indigo-400 hover:underline font-bold inline-flex items-center gap-1"
              >
                <span>Lead Developer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Runs privately in your browser · No health data stored on servers
        </p>
      </div>
    </div>
  );
};
