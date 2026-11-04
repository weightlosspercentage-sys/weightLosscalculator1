import React from 'react';
import {
  ArrowLeft,
  Scale,
  Mail,
  Lock,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export type SitePageKey =
  | 'about'
  | 'methodology'
  | 'privacy'
  | 'terms'
  | 'contact';

interface SiteInfoPagesProps {
  activePage: SitePageKey;
  onSelectPage: (page: SitePageKey) => void;
  onOpenReviewerProfile: () => void;
  onBackToCalculator: () => void;
}

export const SiteInfoPages: React.FC<SiteInfoPagesProps> = ({
  activePage,
  onSelectPage,
  onOpenReviewerProfile,
  onBackToCalculator
}) => {
  const navTabs: { id: SitePageKey; label: string }[] = [
    { id: 'about', label: 'About Us' },
    { id: 'methodology', label: 'Medical Review & Methodology' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms of Service' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-8 text-slate-800 dark:text-slate-200 transition-colors">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onBackToCalculator}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#7334fd] dark:text-indigo-300 hover:text-[#4950fc] transition-colors min-h-[44px] px-3.5 py-2 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Weight Loss Percentage Calculator</span>
        </button>

        {/* Sub-page Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectPage(tab.id)}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activePage === tab.id
                  ? 'bg-[#7334fd] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. ABOUT US */}
      {activePage === 'about' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7334fd] dark:text-indigo-400">
              About Weight Loss Percentage
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Clinically Validated Weight Loss &amp; Metabolic Calculators
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Weight Loss Percentage (<span className="font-semibold text-slate-900 dark:text-white">weightlosspercentage.com</span>) provides free, peer-reviewed clinical calculators for adults, parents, pediatric nurses, and healthcare professionals. Every mathematical equation on our platform executes locally in your browser with zero paywalls, zero sign-up barriers, and complete medical privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <h2 className="font-bold text-slate-900 dark:text-white text-base">Clinical Medical Leadership</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Our clinical formulas, decision thresholds, and health guidance are reviewed by{' '}
                <button
                  type="button"
                  onClick={onOpenReviewerProfile}
                  className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline"
                >
                  Dr. Rekha Kumar, M.D., M.S.
                </button>
                , Board-Certified Endocrinologist, ABOM Diplomate, and Associate Professor of Clinical Medicine at Weill Cornell Medicine.
              </p>
              <div className="pt-1 flex flex-wrap gap-3 text-xs font-bold">
                <button
                  type="button"
                  onClick={onOpenReviewerProfile}
                  className="text-[#7334fd] dark:text-indigo-400 hover:underline"
                >
                  View Dr. Kumar’s Full Profile →
                </button>
                <a
                  href="https://www.linkedin.com/in/rekha-kumar-m-d-m-s-70b481237/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0a66c2] dark:text-sky-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <h2 className="font-bold text-slate-900 dark:text-white text-base">Platform Engineering</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Engineered for instantaneous client-side precision, accessibility across mobile and desktop devices, and strict local browser data isolation so your health numbers stay private on your device.
              </p>
              <div className="pt-1 text-xs font-bold">
                <a
                  href="https://www.linkedin.com/in/wordpress-seo-specialist-abhi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7334fd] dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Developed by Lead Developer (LinkedIn)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. METHODOLOGY */}
      {activePage === 'methodology' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ca3500] dark:text-orange-400">
              Editorial &amp; Clinical Standards
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              How We Review &amp; Test Our Calculators
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every calculator on Weight Loss Percentage is built on published medical formulas, checked with automated accuracy tests, and reviewed for clinical clarity by{' '}
              <button
                type="button"
                onClick={onOpenReviewerProfile}
                className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline"
              >
                Dr. Rekha Kumar, M.D., M.S.
              </button>
              .
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
              <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7334fd] dark:text-indigo-400" />
                <span>1. Adult Weight Loss Percentage</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Computed via <code className="text-indigo-700 dark:text-indigo-300">((Starting Weight - Current Weight) ÷ Starting Weight) × 100</code>. Milestones are benchmarked against the NIH Diabetes Prevention Program (DPP) and Look AHEAD trials (5%, 10%, and 15% total body weight reduction thresholds).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
              <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ca3500] dark:text-orange-400" />
                <span>2. Newborn Weight Loss Protocol</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Validated against American Academy of Pediatrics (AAP) clinical guidelines. Pounds and ounces are converted using exact factors (<code className="text-orange-700 dark:text-orange-300">1 lb = 16 oz</code>, <code className="text-orange-700 dark:text-orange-300">1 oz = 28.349523125 g</code>) to evaluate 5%, 7%, and 10% postnatal hydration thresholds.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
              <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4950fc] dark:text-indigo-400" />
                <span>3. BMR &amp; TDEE Equations</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Uses the Mifflin-St Jeor equation recognized by the Academy of Nutrition and Dietetics as the clinical standard for estimating resting energy expenditure, paired with physical activity multipliers (1.2 to 1.725).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
              <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>4. Safe Weekly Deficit Boundaries</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                All projections emphasize sustainable fat loss rates of 0.5% to 1.0% of total body weight per week (1 to 2 lbs/week) to preserve lean skeletal muscle mass and prevent adaptive thermogenesis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. PRIVACY POLICY */}
      {activePage === 'privacy' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2.5">
            <Lock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Privacy Policy &amp; Zero-Data Storage Guarantee
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-900 dark:text-white">Effective Date: November 2, 2026.</strong> At Weight Loss Percentage (<code>https://www.weightlosspercentage.com/</code>), protecting your personal health and pediatric measurements is fundamental to our architecture.
          </p>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 text-emerald-950 dark:text-emerald-100">
              <strong className="block font-bold mb-1">100% Client-Side Calculation</strong>
              All weight, height, age, newborn birth weight, and dietary inputs entered into our calculators are processed exclusively inside your local web browser. We do not transmit, log, or store your personal biometric inputs on any remote database or server.
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base mb-1">Local Browser Storage</h2>
              <p>
                If you use optional progress tracking features or downloadable text reports, data remains strictly within your device’s memory or downloaded file folder. Clearing your browser cache immediately removes any locally saved session values.
              </p>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base mb-1">Third-Party Links</h2>
              <p>
                Our site links to official medical institutions (AAP, NIH, WHO) and verified professional profiles on LinkedIn. Visiting external websites is governed by their respective privacy policies.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. TERMS OF SERVICE */}
      {activePage === 'terms' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2.5">
            <Scale className="w-6 h-6 text-[#7334fd] dark:text-indigo-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Terms of Service &amp; Clinical Disclaimer
            </h1>
          </div>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-500/40 text-amber-950 dark:text-amber-100">
              <strong className="block font-bold mb-1">Important Medical Disclaimer</strong>
              The calculators, percentage milestones, neonatal weight charts, and nutritional estimates on Weight Loss Percentage are provided strictly for informational and educational purposes. They do not constitute medical advice, clinical diagnosis, or treatment recommendations. Always consult a qualified physician, pediatrician, or registered dietitian regarding any medical condition, infant feeding concern, or weight management program.
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base mb-1">Use of Calculators</h2>
              <p>
                You may freely use our calculators and download summary reports for personal health tracking, clinical education, or workplace wellness challenges without charge.
              </p>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base mb-1">Accuracy &amp; Liability</h2>
              <p>
                While all equations are verified against published clinical formulas (Mifflin-St Jeor, AAP neonatal nomograms, NIH Look AHEAD thresholds), individual physiological responses vary. Weight Loss Percentage and its medical review board assume no liability for decisions made based on calculator outputs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. CONTACT */}
      {activePage === 'contact' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-[#ca3500] dark:text-orange-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Contact Our Clinical &amp; Technical Team
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Have a question about our calculation formulas, clinical citations, or accessibility features? Reach out to our editorial or development team below:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
              <h2 className="font-bold text-slate-900 dark:text-white text-base">Editorial &amp; Clinical Inquiries</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Email:{' '}
                <a href="mailto:weightlosspercentage@gmail.com" className="text-[#7334fd] dark:text-indigo-400 font-bold hover:underline">
                  weightlosspercentage@gmail.com
                </a>
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Lead Medical Reviewer:{' '}
                <button
                  type="button"
                  onClick={onOpenReviewerProfile}
                  className="text-[#7334fd] dark:text-indigo-400 font-semibold hover:underline"
                >
                  Dr. Rekha Kumar, M.D., M.S.
                </button>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
              <h2 className="font-bold text-slate-900 dark:text-white text-base">Technical &amp; Platform Development</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Report a bug, mobile display issue, or formula enhancement request directly to our engineering lead:
              </p>
              <p className="pt-1">
                <a
                  href="https://www.linkedin.com/in/wordpress-seo-specialist-abhi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#0a66c2] dark:text-sky-400 font-bold hover:underline"
                >
                  <span>Connect with Developer on LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
            <h2 className="font-bold text-slate-900 dark:text-white text-base">Follow Us on Social Media</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
              <a
                href="https://x.com/weightlossperce"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
              >
                <span>X (@weightlossperce)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.facebook.com/weightlossnewborn/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1877F2] text-white hover:bg-[#166fe5] transition-colors"
              >
                <span>Facebook (Weight Loss Newborn)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.instagram.com/weightlosspercentage"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:opacity-95 transition-opacity"
              >
                <span>Instagram (@weightlosspercentage)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.youtube.com/@WeightLossPercentage"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FF0000] text-white hover:bg-[#cc0000] transition-colors"
              >
                <span>YouTube (@WeightLossPercentage)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
