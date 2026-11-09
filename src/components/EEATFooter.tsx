import React from 'react';
import {
  BookOpen,
  Lock,
  ExternalLink,
  AlertTriangle,
  FlaskConical
} from 'lucide-react';
import { MedicalReviewerProfile } from './MedicalReviewerProfile';
import { SitePageKey } from './SiteInfoPages';

interface EEATFooterProps {
  onOpenReviewerProfile?: () => void;
  onOpenSitePage?: (page: SitePageKey) => void;
  onSelectCalculatorMode?: (mode: 'adult' | 'newborn' | 'bmr') => void;
  onNavigateCanonicalHub?: (path: string) => void;
  hideReviewerCard?: boolean;
}

const CANONICAL_HUB_LINKS = [
  { href: '/calculators/newborn-weight-loss/', label: 'Newborn Weight Loss Calculator' },
  { href: '/calculators/water-fasting-weight-loss/', label: 'Water Fasting Weight Loss Calculator' },
  { href: '/calculators/omad-weight-loss/', label: 'OMAD & Intermittent Fasting Calculator' },
  { href: '/calculators/glp1-weight-loss/', label: 'GLP-1, Semaglutide & Tirzepatide Calculator' },
  { href: '/calculators/bariatric-surgery-weight-loss/', label: 'Bariatric Surgery (%EWL) Calculator' },
  { href: '/calculators/postpartum-weight-loss/', label: 'Postpartum & Breastfeeding Calculator' },
  { href: '/calculators/bmr/', label: 'BMR & 12-Week Projection Calculator' },
  { href: '/calculators/calorie-deficit/', label: 'Calorie Deficit Calculator' },
  { href: '/calculators/keto/', label: 'Keto Macro Calculator' },
  { href: '/calculators/biggest-loser/', label: 'Biggest Loser % Calculator' },
  { href: '/restaurants/subway/', label: 'Subway Calorie Calculator' },
  { href: '/restaurants/mcdonalds/', label: "McDonald's Calorie Calculator" }
];

const REGIONAL_EDITION_LINKS = [
  { href: '/', label: 'United States (EN)' },
  { href: '/uk/', label: 'United Kingdom (EN-GB)' },
  { href: '/ca/', label: 'Canada (EN-CA)' },
  { href: '/au/', label: 'Australia (EN-AU)' },
  { href: '/de/', label: 'Deutschland (DE)' },
  { href: '/it/', label: 'Italia (IT)' },
  { href: '/ru/', label: 'Россия (RU)' },
  { href: '/zh/', label: '中文 (ZH)' }
];

export const EEATFooter: React.FC<EEATFooterProps> = ({
  onOpenReviewerProfile,
  onOpenSitePage,
  onSelectCalculatorMode,
  onNavigateCanonicalHub,
  hideReviewerCard = false
}) => {
  return (
    <footer id="medical-review" className="w-full space-y-12 pt-8 pb-16 text-slate-700 dark:text-slate-300 scroll-mt-20">
      {/* Clinical Medical Reviewer Profile Section (Screenshot 2) */}
      {!hideReviewerCard && (
        <MedicalReviewerProfile
          isStandalonePage={false}
          onOpenFullProfile={onOpenReviewerProfile}
          onSelectCalculatorMode={onSelectCalculatorMode}
        />
      )}

      {/* Clinical Validation & Mathematical Verification Note */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center gap-2.5">
          <FlaskConical className="w-5 h-5 text-[#7334fd] dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            How Our Calculators Work &amp; How They Are Reviewed
          </h2>
        </div>
        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
          <p>
            Every calculator on this page uses standard, published medical equations, including the basic weight loss percentage formula, the Mifflin-St Jeor equation for daily calorie needs, and American Academy of Pediatrics (AAP) guidelines for newborn weight checks. For babies weighed in pounds and ounces, we convert ounces to grams using the exact conversion factor (1 oz = 28.3495 grams) so parents and nurses get consistent numbers in either unit.
          </p>
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <strong className="text-slate-900 dark:text-white font-bold block mb-1">Example Calculation:</strong>
            <p>
              If you start at 215.0 lbs and reach 193.5 lbs, you have lost 21.5 lbs:
              <br />
              <code className="text-indigo-700 dark:text-indigo-300">Percentage Lost = ((215.0 − 193.5) ÷ 215.0) × 100 = 10.00%</code>.
              <br />
              In long-term studies like the NIH Look AHEAD trial, reaching a 10% weight loss is a major milestone linked to healthier blood sugar and blood pressure.
            </p>
          </div>
        </div>
      </section>

      {/* Official Clinical Bodies & Peer-Reviewed Sources */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-[#4950fc] dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Medical Guidelines &amp; Reference Sources
          </h2>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <li className="py-2.5 flex items-start justify-between gap-3">
            <div>
              <strong className="text-slate-900 dark:text-white font-semibold block">American Academy of Pediatrics (AAP):</strong>
              <span>Clinical Practice Guidelines for newborn hydration and expected weight changes in the first week of life.</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
          </li>
          <li className="py-2.5 flex items-start justify-between gap-3">
            <div>
              <strong className="text-slate-900 dark:text-white font-semibold block">National Institutes of Health (NIH) / NIDDK:</strong>
              <span>Diabetes Prevention Program (DPP) &amp; Look AHEAD Study on the health benefits of 5% to 10% weight loss.</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
          </li>
          <li className="py-2.5 flex items-start justify-between gap-3">
            <div>
              <strong className="text-slate-900 dark:text-white font-semibold block">American Heart Association (AHA) &amp; American Diabetes Association (ADA):</strong>
              <span>Guidelines for adult weight management, blood pressure, and blood sugar improvement.</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
          </li>
          <li className="py-2.5 flex items-start justify-between gap-3">
            <div>
              <strong className="text-slate-900 dark:text-white font-semibold block">World Health Organization (WHO):</strong>
              <span>Adult Body Mass Index (BMI) categories and infant growth standards.</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
          </li>
        </ul>
      </section>

      {/* Privacy Guarantee, Medical Disclaimer & Footer Navigation */}
      <section className="bg-slate-900 dark:bg-slate-900/95 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Private in Your Browser
              </h3>
              <p className="text-xs text-slate-400">
                Your weight and health numbers stay on your device and are never sent to a server.
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-400">
            Medically Reviewed by{' '}
            <button
              type="button"
              onClick={onOpenReviewerProfile}
              className="text-emerald-400 font-bold hover:underline"
            >
              Dr. Rekha Kumar, M.D., M.S.
            </button>{' '}
            · Updated <strong className="text-white">November 2026</strong>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 text-xs text-slate-300 flex items-start gap-3 leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 block mb-0.5 font-bold uppercase tracking-wider">
              Medical &amp; Clinical Health Disclaimer
            </strong>
            The calculations, clinical milestones, and nutritional estimates generated by this calculator are for educational, fitness tracking, and informational purposes only. They do not constitute formal medical diagnoses, clinical prescriptions, or healthcare consultations. Always consult a board-certified physician, pediatrician, or registered dietitian before undertaking significant caloric restrictions or evaluating infant weight changes.
          </div>
        </div>

        {/* Direct Canonical Calculator Hubs & Regional Editions (Semantic Crawl Mesh) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800/80 text-xs">
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Clinical Calculator Hubs
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {CANONICAL_HUB_LINKS.map((hub) => (
                <a
                  key={hub.href}
                  href={hub.href}
                  onClick={(e) => {
                    if (onNavigateCanonicalHub) {
                      e.preventDefault();
                      onNavigateCanonicalHub(hub.href);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-[#7334fd] text-slate-300 hover:text-white border border-slate-700/80 transition-colors font-medium"
                >
                  {hub.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              International &amp; Regional Editions
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {REGIONAL_EDITION_LINKS.map((reg) => (
                <a
                  key={reg.href}
                  href={reg.href}
                  onClick={(e) => {
                    if (onNavigateCanonicalHub) {
                      e.preventDefault();
                      onNavigateCanonicalHub(reg.href);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-[#4950fc] text-slate-300 hover:text-white border border-slate-700/80 transition-colors font-medium"
                >
                  {reg.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Navigation Links & Social Media Interlinks */}
        <div className="pt-2 space-y-4 border-t border-slate-800/80">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <button
                type="button"
                onClick={onOpenReviewerProfile}
                className="hover:text-white font-semibold transition-colors"
              >
                Dr. Rekha Kumar, M.D., M.S.
              </button>
              <span className="text-slate-600">•</span>
              <button
                type="button"
                onClick={() => onOpenSitePage?.('about')}
                className="hover:text-white transition-colors"
              >
                About Us
              </button>
              <span className="text-slate-600">•</span>
              <button
                type="button"
                onClick={() => onOpenSitePage?.('methodology')}
                className="hover:text-white transition-colors"
              >
                Review Methodology
              </button>
              <span className="text-slate-600">•</span>
              <button
                type="button"
                onClick={() => onOpenSitePage?.('privacy')}
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <span className="text-slate-600">•</span>
              <button
                type="button"
                onClick={() => onOpenSitePage?.('terms')}
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </button>
              <span className="text-slate-600">•</span>
              <button
                type="button"
                onClick={() => onOpenSitePage?.('contact')}
                className="hover:text-white transition-colors"
              >
                Contact
              </button>
              <span className="text-slate-600">•</span>
              <a
                href="/sitemap.xml"
                className="hover:text-white transition-colors"
              >
                XML Sitemap
              </a>
            </div>

            {/* Follow Us Social Media Icons */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
                Follow Us
              </span>
              <a
                href="https://x.com/weightlossperce"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Weight Loss Percentage on X"
                title="Follow us on X (@weightlossperce)"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 border border-slate-700/80 flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/weightlossnewborn/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Weight Loss Percentage on Facebook"
                title="Follow us on Facebook"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white text-slate-300 border border-slate-700/80 flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/weightlosspercentage"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Weight Loss Percentage on Instagram"
                title="Follow us on Instagram (@weightlosspercentage)"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent hover:text-white text-slate-300 border border-slate-700/80 flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@WeightLossPercentage"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Weight Loss Percentage on YouTube"
                title="Follow us on YouTube (@WeightLossPercentage)"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white text-slate-300 border border-slate-700/80 flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/50">
            <p>
              © 2026 Weight Loss Percentage (<span className="text-slate-300">weightlosspercentage.com</span>). All rights reserved.
            </p>
            <p className="flex flex-wrap items-center gap-2">
              <span>
                Medical Review:{' '}
                <a
                  href="https://www.linkedin.com/in/rekha-kumar-m-d-m-s-70b481237/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-200 hover:text-white underline"
                >
                  Dr. Rekha Kumar, M.D., M.S.
                </a>
              </span>
              <span className="text-slate-600">|</span>
              <span>
                Developed by{' '}
                <a
                  href="https://www.linkedin.com/in/wordpress-seo-specialist-abhi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-200 hover:text-white underline"
                >
                  Developer
                </a>
              </span>
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
};
