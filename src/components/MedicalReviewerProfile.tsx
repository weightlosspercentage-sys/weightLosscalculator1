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
    <div className="bg-white dark:bg-[#1c1917] rounded-2xl p-6 sm:p-8 border border-[#e5e1d8] dark:border-[#332f2b] space-y-8 text-[#1c1917] dark:text-[#f5f3ef] transition-colors duration-200">
      {isStandalonePage && onBackToCalculator && (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#edeae3] dark:border-[#2a2623]">
          <button
            type="button"
            onClick={onBackToCalculator}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f] transition-colors duration-150 min-h-[40px] px-3 py-2 rounded-lg border border-[#e5e1d8] dark:border-[#332f2b] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            <span>Back to Weight Loss Percentage Calculator</span>
          </button>
          <span className="text-xs text-[#78716c] font-mono">
            https://www.weightlosspercentage.com/authors/dr-rekha-kumar/
          </span>
        </div>
      )}

      {/* Top Profile Identity Card */}
      <div className="bg-[#faf9f7] dark:bg-[#141210] rounded-xl p-6 border border-[#e5e1d8] dark:border-[#332f2b] flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Circular Portrait */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#d6d0c4] dark:border-[#3f3a34] overflow-hidden shrink-0 bg-[#f3f1ed]">
          <picture>
            <source
              type="image/webp"
              srcSet="/assets/dr-rekha-kumar-96w.webp 96w, /assets/dr-rekha-kumar-192w.webp 192w"
              sizes="(min-width: 640px) 96px, 80px"
            />
            <img
              src="/assets/dr-rekha-kumar-96w.png"
              srcSet="/assets/dr-rekha-kumar-96w.png 96w"
              sizes="(min-width: 640px) 96px, 80px"
              width={96}
              height={96}
              loading="lazy"
              decoding="async"
              alt="Dr. Rekha Kumar, M.D., M.S. - Lead Medical Reviewer"
              className="w-full h-full object-cover block"
            />
          </picture>
        </div>

        <div className="space-y-3 flex-1 min-w-0">
          {/* Credentials metadata (quiet unboxed text) */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#57534e] dark:text-[#b5afa6]">
            <span>Board-Certified Endocrinologist</span>
            <span aria-hidden="true">·</span>
            <span>ABOM Diplomate</span>
          </div>

          {/* Name & Title */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1c1917] dark:text-[#f5f3ef] tracking-tight">
              {onOpenFullProfile && !isStandalonePage ? (
                <button
                  type="button"
                  onClick={onOpenFullProfile}
                  className="hover:underline underline-offset-4 transition-colors text-left cursor-pointer"
                >
                  Dr. Rekha Kumar, M.D., M.S.
                </button>
              ) : (
                'Dr. Rekha Kumar, M.D., M.S.'
              )}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#57534e] dark:text-[#b5afa6] mt-0.5">
              Lead Medical Reviewer &amp; Obesity Medicine Specialist
            </p>
          </div>

          {/* LinkedIn Link + Institution */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="https://www.linkedin.com/in/rekha-kumar-m-d-m-s-70b481237/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1c1917] hover:bg-[#292524] dark:bg-[#f5f3ef] dark:hover:bg-[#e5e1d8] text-[#faf9f7] dark:text-[#1c1917] font-medium text-xs transition-colors duration-150 min-h-[36px]"
            >
              <span>Connect on LinkedIn</span>
              <ExternalLink className="w-4 h-4" strokeWidth={1.75} />
            </a>

            <span className="text-xs text-[#57534e] dark:text-[#b5afa6]">
              Weill Cornell Medicine · New York, NY
            </span>

            {!isStandalonePage && onOpenFullProfile && (
              <button
                type="button"
                onClick={onOpenFullProfile}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#1c1917] dark:text-[#f5f3ef] underline underline-offset-2 hover:opacity-80 ml-auto cursor-pointer"
              >
                <span>Author profile (/authors/dr-rekha-kumar/)</span>
                <ExternalLink className="w-4 h-4" strokeWidth={1.75} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* About Dr. Rekha Kumar */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-semibold text-[#1c1917] dark:text-[#f5f3ef] border-b border-[#edeae3] dark:border-[#2a2623] pb-2">
          About Dr. Rekha Kumar
        </h3>
        <div className="text-xs sm:text-sm text-[#57534e] dark:text-[#b5afa6] space-y-3 leading-relaxed">
          <p>
            <strong className="text-[#1c1917] dark:text-[#f5f3ef] font-medium">Dr. Rekha Kumar, M.D., M.S.</strong> is an internationally recognized physician leader in endocrinology, diabetes, metabolism, and clinical obesity medicine. She serves as an{' '}
            <strong className="text-[#1c1917] dark:text-[#f5f3ef] font-medium">Associate Professor of Clinical Medicine at Weill Cornell Medicine</strong> and an Attending Physician at NewYork-Presbyterian Hospital.
          </p>
          <p>
            Dr. Kumar previously served as the{' '}
            <strong className="text-[#1c1917] dark:text-[#f5f3ef] font-medium">Medical Director of the American Board of Obesity Medicine (ABOM)</strong>, where she oversaw national clinical standards and physician examination development for the discipline of obesity medicine. She serves as the{' '}
            <strong className="text-[#1c1917] dark:text-[#f5f3ef] font-medium">Lead Medical Reviewer for Weight Loss Percentage</strong>, ensuring that all calculation engines, clinical milestone guidelines (5%, 7%, 10% thresholds), pediatric nomograms, and energy deficit projections align with peer-reviewed medical standards from the ADA, AHA, Endocrine Society, and AAP.
          </p>
        </div>
      </div>

      {/* Education & Training + Board Certifications Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education & Training */}
        <div className="p-6 rounded-xl bg-[#faf9f7] dark:bg-[#141210] border border-[#e5e1d8] dark:border-[#332f2b] space-y-3">
          <h4 className="text-sm sm:text-base font-medium text-[#1c1917] dark:text-[#f5f3ef] flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6] shrink-0" strokeWidth={1.75} />
            <span>Education &amp; Training</span>
          </h4>
          <ul className="space-y-2 text-xs text-[#57534e] dark:text-[#b5afa6] leading-relaxed">
            <li>
              <strong className="text-[#1c1917] dark:text-[#f5f3ef] font-medium">Fellowship:</strong> Endocrinology, Diabetes &amp; Metabolism, NewYork-Presbyterian / Weill Cornell Medical Center &amp; Memorial Sloan Kettering Cancer Center
            </li>
            <li>
              <strong className="text-[#1c1917] dark:text-[#f5f3ef] font-medium">Residency:</strong> Internal Medicine, NewYork-Presbyterian / Weill Cornell Medical Center
            </li>
            <li>
              <strong className="text-[#1c1917] dark:text-[#f5f3ef] font-medium">Doctor of Medicine (M.D.):</strong> New York Medical College
            </li>
            <li>
              <strong className="text-[#1c1917] dark:text-[#f5f3ef] font-medium">Master of Science (M.S.):</strong> Institute of Human Nutrition, Columbia University
            </li>
            <li>
              <strong className="text-[#1c1917] dark:text-[#f5f3ef] font-medium">Bachelor of Arts (B.A.):</strong> Duke University
            </li>
          </ul>
        </div>

        {/* Board Certifications */}
        <div className="p-6 rounded-xl bg-[#faf9f7] dark:bg-[#141210] border border-[#e5e1d8] dark:border-[#332f2b] space-y-3">
          <h4 className="text-sm sm:text-base font-medium text-[#1c1917] dark:text-[#f5f3ef] flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6] shrink-0" strokeWidth={1.75} />
            <span>Board Certifications</span>
          </h4>
          <ul className="space-y-2 text-xs text-[#57534e] dark:text-[#b5afa6] leading-relaxed">
            <li>
              <strong className="text-[#1c1917] dark:text-[#f5f3ef] font-medium">Endocrinology, Diabetes &amp; Metabolism:</strong> American Board of Internal Medicine (ABIM)
            </li>
            <li>
              <strong className="text-[#1c1917] dark:text-[#f5f3ef] font-medium">Obesity Medicine:</strong> Diplomate, American Board of Obesity Medicine (ABOM)
            </li>
            <li>
              <strong className="text-[#1c1917] dark:text-[#f5f3ef] font-medium">Internal Medicine:</strong> American Board of Internal Medicine (ABIM)
            </li>
            <li>
              <strong className="text-[#1c1917] dark:text-[#f5f3ef] font-medium">New York State Medical License:</strong> Active &amp; In Good Standing
            </li>
          </ul>
        </div>
      </div>

      {/* Medical Review Standards & Clinical Commitment */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-semibold text-[#1c1917] dark:text-[#f5f3ef] border-b border-[#edeae3] dark:border-[#2a2623] pb-2">
          Medical Review Standards &amp; Clinical Commitment
        </h3>
        <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#b5afa6] leading-relaxed">
          At <em>Weight Loss Percentage</em>, our goal is to offer accurate, easy-to-use health calculators without paywalls or confusing medical jargon. Dr. Kumar oversees our medical review process across four key areas:
        </p>
        <ul className="space-y-3 text-xs sm:text-sm text-[#57534e] dark:text-[#b5afa6] leading-relaxed">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6] shrink-0 mt-0.5" strokeWidth={1.75} />
            <span>
              <strong className="text-[#1c1917] dark:text-[#f5f3ef] font-medium">Formula accuracy:</strong> Checking that our weight loss percentage, Mifflin-St Jeor BMR, body fat, and bariatric formulas match current clinical standards.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6] shrink-0 mt-0.5" strokeWidth={1.75} />
            <span>
              <strong className="text-[#1c1917] dark:text-[#f5f3ef] font-medium">Meaningful health milestones:</strong> Reviewing the 5% and 10% adult weight loss benchmarks (from AHA and ADA guidelines) and the 7% to 10% newborn weight loss checkpoints (from AAP guidelines).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6] shrink-0 mt-0.5" strokeWidth={1.75} />
            <span>
              <strong className="text-[#1c1917] dark:text-[#f5f3ef] font-medium">Realistic, healthy pacing:</strong> Making sure our guidance encourages steady, sustainable progress (around 0.5% to 1% of body weight per week) that protects muscle and energy.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6] shrink-0 mt-0.5" strokeWidth={1.75} />
            <span>
              <strong className="text-[#1c1917] dark:text-[#f5f3ef] font-medium">Clear when-to-call-a-doctor guidance:</strong> Providing straightforward notes on when parents or patients should check in with their pediatrician or healthcare provider.
            </span>
          </li>
        </ul>
      </div>

      {/* Calculators & Guides Medically Reviewed by Dr. Kumar */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-semibold text-[#1c1917] dark:text-[#f5f3ef] border-b border-[#edeae3] dark:border-[#2a2623] pb-2">
          Calculators &amp; Guides Medically Reviewed by Dr. Kumar
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="#percentage"
            onClick={(e) => {
              if (onSelectCalculatorMode) {
                e.preventDefault();
                onSelectCalculatorMode('adult');
              }
            }}
            className="p-4 rounded-xl bg-[#faf9f7] dark:bg-[#141210] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f] border border-[#e5e1d8] dark:border-[#332f2b] transition-colors duration-150 block space-y-1.5"
          >
            <h4 className="text-xs sm:text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef]">
              Weight Loss Percentage Calculator
            </h4>
            <p className="text-xs text-[#57534e] dark:text-[#b5afa6] leading-relaxed">
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
            className="p-4 rounded-xl bg-[#faf9f7] dark:bg-[#141210] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f] border border-[#e5e1d8] dark:border-[#332f2b] transition-colors duration-150 block space-y-1.5"
          >
            <h4 className="text-xs sm:text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef]">
              Newborn Weight Loss Calculator
            </h4>
            <p className="text-xs text-[#57534e] dark:text-[#b5afa6] leading-relaxed">
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
            className="p-4 rounded-xl bg-[#faf9f7] dark:bg-[#141210] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f] border border-[#e5e1d8] dark:border-[#332f2b] transition-colors duration-150 block space-y-1.5"
          >
            <h4 className="text-xs sm:text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef]">
              BMR &amp; Daily Calorie Calculator
            </h4>
            <p className="text-xs text-[#57534e] dark:text-[#b5afa6] leading-relaxed">
              Estimate resting metabolism and daily maintenance calories with the Mifflin-St Jeor formula.
            </p>
          </a>
        </div>
      </div>

      {/* Platform Engineering & Technical Development Attribution */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#57534e] dark:text-[#b5afa6] bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
        <div className="flex items-center gap-3">
          <Code2 className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6] shrink-0" strokeWidth={1.75} />
          <div>
            <span className="text-xs text-[#78716c] dark:text-[#8c857d] block">
              Web application &amp; calculator design
            </span>
            <p className="font-medium text-[#1c1917] dark:text-[#f5f3ef]">
              Developed by{' '}
              <a
                href="https://www.linkedin.com/in/wordpress-seo-specialist-abhi/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80 inline-flex items-center gap-1"
              >
                <span>Lead Developer</span>
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.75} />
              </a>
            </p>
          </div>
        </div>
        <p className="text-xs text-[#78716c] dark:text-[#8c857d]">
          Runs privately in your browser · No health data stored on servers
        </p>
      </div>
    </div>
  );
};
