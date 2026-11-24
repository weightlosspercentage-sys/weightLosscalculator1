import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HeroToolBox, ToolMode } from './components/HeroToolBox';
import { StructuredData } from './components/StructuredData';
import type { SitePageKey } from './components/SiteInfoPages';
import { TopToolSearchBar } from './components/TopToolSearchBar';
import { AdSlot } from './components/AdSlot';
import { AD_SLOT_HERO_BELOW } from './config/adsense';

// Lazy-load below-the-fold content sections & secondary routes to minimize initial TBT and improve interaction readiness
const SiloContentSections = lazy(() =>
  import('./components/SiloContentSections').then((m) => ({ default: m.SiloContentSections }))
);
const FAQWithLabels = lazy(() =>
  import('./components/FAQWithLabels').then((m) => ({ default: m.FAQWithLabels }))
);
const EEATFooter = lazy(() =>
  import('./components/EEATFooter').then((m) => ({ default: m.EEATFooter }))
);
const MedicalReviewerProfile = lazy(() =>
  import('./components/MedicalReviewerProfile').then((m) => ({ default: m.MedicalReviewerProfile }))
);
const SiteInfoPages = lazy(() =>
  import('./components/SiteInfoPages').then((m) => ({ default: m.SiteInfoPages }))
);
import { BmiTopicalPages, BmiTopicalRoute } from './components/BmiTopicalPages';
import { BabyWeightPercentilePage } from './components/BabyWeightPercentilePage';
import { BlogArticleContent } from './components/BlogArticleContent';
import { SearchableToolItem } from './utils/toolSearch';
import {
  resolveSearchIntentFromPath,
  ClinicalFocus,
  RestaurantBrand,
  RouteIntentResolution
} from './utils/seoIntentRouter';
import { LOCALES } from './data/keywordMatrix';
import { LOCALE_TRANSLATIONS } from './data/localeStrings';
import {
  Globe,
  Menu,
  X,
  Scale,
  Baby,
  Flame,
  Utensils,
  HelpCircle,
  BookOpen,
  Stethoscope,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

type ActiveView = 'home' | 'reviewer' | 'info';
type NavTarget = 'adult' | 'newborn' | 'bmr' | 'subway' | 'faq' | 'silos';

export const App: React.FC = () => {
  const initialResolution = resolveSearchIntentFromPath(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  const [selectedLocale, setSelectedLocale] = useState<string>(initialResolution.locale);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeToolMode, setActiveToolMode] = useState<ToolMode>(initialResolution.toolMode);
  const [activeBottomNav, setActiveBottomNav] = useState<NavTarget>(initialResolution.toolMode);
  const [clinicalFocus, setClinicalFocus] = useState<ClinicalFocus>(initialResolution.clinicalFocus);
  const [restaurantBrand, setRestaurantBrand] = useState<RestaurantBrand>(initialResolution.restaurantBrand);
  const [routeIntent, setRouteIntent] = useState<RouteIntentResolution>(initialResolution);
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [activeSitePage, setActiveSitePage] = useState<SitePageKey>('about');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('wlp-theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('wlp-theme', darkMode ? 'dark' : 'light');
    } catch {
      // ignore storage errors in restricted frames
    }
  }, [darkMode]);

  const t = LOCALE_TRANSLATIONS[selectedLocale] || LOCALE_TRANSLATIONS.en;

  // Sync <html lang>, <title>, <meta name="description">, OpenGraph/Twitter cards, and self-referencing <link rel="canonical">
  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
    const effectiveTitle =
      activeView === 'home' ? routeIntent.customMetaTitle || t.metaTitle : document.title;
    const effectiveDesc =
      activeView === 'home' ? routeIntent.customMetaDescription || t.metaDescription : t.metaDescription;

    if (activeView === 'home') {
      document.title = effectiveTitle;
      const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (metaDesc) {
        metaDesc.content = effectiveDesc;
      }
      const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
      if (ogTitle) ogTitle.content = effectiveTitle;
      const ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
      if (ogDesc) ogDesc.content = effectiveDesc;
      const twTitle = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement | null;
      if (twTitle) twTitle.content = effectiveTitle;
      const twDesc = document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement | null;
      if (twDesc) twDesc.content = effectiveDesc;
    }

    const canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalEl) {
      let path = routeIntent.canonicalPath || t.canonicalPath;
      if (activeView === 'reviewer') {
        path = '/authors/dr-rekha-kumar/';
      } else if (activeView === 'info') {
        const routeMap: Record<SitePageKey, string> = {
          about: '/about/',
          methodology: '/methodology/',
          privacy: '/privacy-policy/',
          terms: '/terms-of-service/',
          contact: '/contact/'
        };
        path = routeMap[activeSitePage];
      }
      const fullCanonical = `https://www.weightlosspercentage.com${path}`;
      canonicalEl.href = fullCanonical;
      const ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
      if (ogUrl) ogUrl.content = fullCanonical;
    }
  }, [
    selectedLocale,
    activeView,
    activeSitePage,
    routeIntent,
    t.htmlLang,
    t.canonicalPath,
    t.metaTitle,
    t.metaDescription
  ]);

  // Sync URL pathname on initial load and popstate for search intent satisfaction, programmatic redirects, locales, and site pages
  useEffect(() => {
    const syncPath = () => {
      const rawPath = window.location.pathname;
      const path = rawPath.toLowerCase();

      if (path.includes('/authors/dr-rekha-kumar')) {
        setActiveView('reviewer');
        return;
      } else if (path.includes('/about')) {
        setActiveView('info');
        setActiveSitePage('about');
        return;
      } else if (path.includes('/methodology')) {
        setActiveView('info');
        setActiveSitePage('methodology');
        return;
      } else if (path.includes('/privacy')) {
        setActiveView('info');
        setActiveSitePage('privacy');
        return;
      } else if (path.includes('/terms')) {
        setActiveView('info');
        setActiveSitePage('terms');
        return;
      } else if (path.includes('/contact')) {
        setActiveView('info');
        setActiveSitePage('contact');
        return;
      }

      const resolved = resolveSearchIntentFromPath(rawPath);
      if (resolved.shouldRedirectToHome) {
        try {
          window.history.replaceState({}, '', resolved.redirectTarget);
        } catch {
          // ignore in sandboxed frames
        }
      }

      setActiveView('home');
      setSelectedLocale(resolved.locale);
      setActiveToolMode(resolved.toolMode);
      setActiveBottomNav(resolved.toolMode);
      setClinicalFocus(resolved.clinicalFocus);
      setRestaurantBrand(resolved.restaurantBrand);
      setRouteIntent(resolved);
    };
    syncPath();
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navigateHome = () => {
    const homeResolved = resolveSearchIntentFromPath(t.canonicalPath);
    setActiveView('home');
    setRouteIntent(homeResolved);
    setActiveBottomNav(activeToolMode);
    setMobileMenuOpen(false);
    try {
      window.history.pushState({}, '', t.canonicalPath);
    } catch {
      // ignore in sandboxed frames
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateReviewerProfile = () => {
    setActiveView('reviewer');
    setMobileMenuOpen(false);
    try {
      window.history.pushState({}, '', '/authors/dr-rekha-kumar/');
    } catch {
      // ignore in sandboxed frames
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateSitePage = (page: SitePageKey) => {
    setActiveSitePage(page);
    setActiveView('info');
    setMobileMenuOpen(false);
    const routeMap: Record<SitePageKey, string> = {
      about: '/about/',
      methodology: '/methodology/',
      privacy: '/privacy-policy/',
      terms: '/terms-of-service/',
      contact: '/contact/'
    };
    try {
      window.history.pushState({}, '', routeMap[page]);
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateCanonicalHub = (path: string) => {
    const resolved = resolveSearchIntentFromPath(path);
    setActiveView('home');
    setSelectedLocale(resolved.locale);
    setActiveToolMode(resolved.toolMode);
    setActiveBottomNav(resolved.toolMode);
    setClinicalFocus(resolved.clinicalFocus);
    setRestaurantBrand(resolved.restaurantBrand);
    setRouteIntent(resolved);
    setMobileMenuOpen(false);
    try {
      window.history.pushState({}, '', path);
    } catch {
      // ignore in sandboxed frames
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBottomNavClick = (target: NavTarget, customScrollId?: string) => {
    setActiveBottomNav(target);
    setMobileMenuOpen(false);
    if (activeView !== 'home') {
      setActiveView('home');
      try {
        window.history.pushState({}, '', '/');
      } catch {
        // ignore
      }
    }
    if (target === 'adult' || target === 'newborn' || target === 'bmr' || target === 'subway') {
      setActiveToolMode(target);
    }
    setTimeout(() => {
      if (customScrollId) {
        const el = document.getElementById(customScrollId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      if (target === 'adult' || target === 'newborn' || target === 'bmr' || target === 'subway') {
        const heroEl = document.getElementById('calculator-hero');
        if (heroEl) {
          heroEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (target === 'faq') {
        document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (target === 'silos') {
        document.getElementById('percentage')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  const handleSelectSearchTool = (tool: SearchableToolItem) => {
    setMobileMenuOpen(false);
    if (activeView !== 'home') {
      setActiveView('home');
      try {
        window.history.pushState({}, '', '/');
      } catch {
        // ignore
      }
    }
    if (tool.calculatorMode) {
      setActiveToolMode(tool.calculatorMode);
      setActiveBottomNav(tool.calculatorMode);
    } else {
      setActiveBottomNav('silos');
    }
    if (tool.clinicalFocus) {
      setClinicalFocus(tool.clinicalFocus);
    }
    if (tool.restaurantBrand) {
      setRestaurantBrand(tool.restaurantBrand);
    }
    if (tool.routePath) {
      const resolved = resolveSearchIntentFromPath(tool.routePath);
      setRouteIntent(resolved);
      try {
        window.history.pushState({}, '', tool.routePath);
      } catch {
        // ignore
      }
    }

    setTimeout(() => {
      const targetId = tool.id;
      const sectionEl = document.getElementById(targetId);
      if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        document.getElementById('calculator-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const mobileNavItems: {
    id: NavTarget;
    label: string;
    subtitle: string;
    href: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'adult',
      label: 'Weight Loss Percentage Calculator',
      subtitle: 'Track pounds or kg lost, % change & goal progress',
      href: '#percentage',
      icon: <Scale className="w-4 h-4 shrink-0" strokeWidth={1.75} />
    },
    {
      id: 'newborn',
      label: 'Newborn Weight Loss Calculator',
      subtitle: 'Check baby weight change in the first days after birth',
      href: '#newborn',
      icon: <Baby className="w-4 h-4 shrink-0" strokeWidth={1.75} />
    },
    {
      id: 'bmr',
      label: 'BMR & TDEE Calculator',
      subtitle: 'Estimate your resting & daily calorie needs',
      href: '#bmr',
      icon: <Flame className="w-4 h-4 shrink-0" strokeWidth={1.75} />
    },
    {
      id: 'subway',
      label: 'Calorie & Nutrition Calculator',
      subtitle: 'Compare sandwich calories & meal portions',
      href: '#calorie',
      icon: <Utensils className="w-4 h-4 shrink-0" strokeWidth={1.75} />
    },
    {
      id: 'faq',
      label: 'Common Questions (FAQ)',
      subtitle: 'Clear answers on weight loss math & healthy pace',
      href: '#faq-section',
      icon: <HelpCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
    },
    {
      id: 'silos',
      label: 'All 38 Calculators & Guides',
      subtitle: 'Formulas, newborn charts, fasting, GLP-1 & BMI guides',
      href: '#percentage',
      icon: <BookOpen className="w-4 h-4 shrink-0" strokeWidth={1.75} />
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7] dark:bg-[#141210] text-[#1c1917] dark:text-[#f5f3ef] flex flex-col font-sans selection:bg-[#c2410c] selection:text-white pb-20 lg:pb-0 transition-colors duration-200">
      {/* Inject Structured Data (JSON-LD) into DOM head */}
      <StructuredData
        locale={selectedLocale}
        canonicalPath={routeIntent.canonicalPath}
        customTitle={routeIntent.customHeroTitle}
        customDescription={routeIntent.customMetaDescription}
      />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#1c1917] border-b border-[#e5e1d8] dark:border-[#332f2b] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 h-12 sm:h-14">
            {/* Zone 1: Brand Logo (Solid Neutral Tile) */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateHome();
              }}
              className="flex items-center gap-2 sm:gap-2.5 group min-w-0 shrink"
            >
              <div className="w-8 h-8 rounded-[8px] bg-[#1c1917] dark:bg-[#f5f3ef] flex items-center justify-center text-[#faf9f7] dark:text-[#1c1917] shrink-0 font-semibold text-sm sm:text-base leading-none select-none">
                %
              </div>
              <span className="font-semibold text-[#1c1917] dark:text-[#f5f3ef] text-sm sm:text-lg tracking-tight whitespace-nowrap">
                Weight Loss Percentage
              </span>
            </a>

            {/* Zone 2: Concise Single-Line Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-[#57534e] dark:text-[#b5afa6]">
              <a
                href="#percentage"
                onClick={(e) => {
                  e.preventDefault();
                  handleBottomNavClick('adult');
                }}
                aria-current={activeView === 'home' && activeBottomNav === 'adult' ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  activeView === 'home' && activeBottomNav === 'adult'
                    ? 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#1c1917] dark:text-[#f5f3ef]'
                    : 'hover:text-[#1c1917] dark:hover:text-[#f5f3ef] hover:bg-[#faf9f7] dark:hover:bg-[#25221f]/60'
                }`}
              >
                {t.navPercentage}
              </a>
              <a
                href="#newborn"
                onClick={(e) => {
                  e.preventDefault();
                  handleBottomNavClick('newborn');
                }}
                aria-current={activeView === 'home' && activeBottomNav === 'newborn' ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  activeView === 'home' && activeBottomNav === 'newborn'
                    ? 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#1c1917] dark:text-[#f5f3ef]'
                    : 'hover:text-[#1c1917] dark:hover:text-[#f5f3ef] hover:bg-[#faf9f7] dark:hover:bg-[#25221f]/60'
                }`}
              >
                {t.navNewborn}
              </a>
              <a
                href="#bmr"
                onClick={(e) => {
                  e.preventDefault();
                  handleBottomNavClick('bmr');
                }}
                aria-current={activeView === 'home' && activeBottomNav === 'bmr' ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  activeView === 'home' && activeBottomNav === 'bmr'
                    ? 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#1c1917] dark:text-[#f5f3ef]'
                    : 'hover:text-[#1c1917] dark:hover:text-[#f5f3ef] hover:bg-[#faf9f7] dark:hover:bg-[#25221f]/60'
                }`}
              >
                {t.navBmr}
              </a>
              <a
                href="#faq-section"
                onClick={(e) => {
                  e.preventDefault();
                  handleBottomNavClick('faq', 'faq-section');
                }}
                aria-current={activeView === 'home' && activeBottomNav === 'faq' ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  activeView === 'home' && activeBottomNav === 'faq'
                    ? 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#1c1917] dark:text-[#f5f3ef]'
                    : 'hover:text-[#1c1917] dark:hover:text-[#f5f3ef] hover:bg-[#faf9f7] dark:hover:bg-[#25221f]/60'
                }`}
              >
                {t.navFaq}
              </a>
              <button
                type="button"
                onClick={navigateReviewerProfile}
                aria-current={activeView === 'reviewer' ? 'page' : undefined}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  activeView === 'reviewer'
                    ? 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#1c1917] dark:text-[#f5f3ef]'
                    : 'hover:text-[#1c1917] dark:hover:text-[#f5f3ef] hover:bg-[#faf9f7] dark:hover:bg-[#25221f]/60'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-[#78716c] dark:text-[#8c857d]" strokeWidth={1.75} />
                <span>Dr. Rekha Kumar, M.D.</span>
              </button>
            </nav>

            {/* Zone 3: Theme Toggle, Locale Selector & Mobile Menu Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setDarkMode((prev) => !prev)}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-pressed={darkMode}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                className="min-h-[36px] px-2.5 py-1.5 rounded-lg bg-[#f3f1ed] dark:bg-[#25221f] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b] border border-[#e5e1d8] dark:border-[#332f2b] text-[#1c1917] dark:text-[#f5f3ef] flex items-center gap-1.5 text-xs font-medium transition-colors duration-150 cursor-pointer"
              >
                {darkMode ? (
                  <>
                    <Sun className="w-4 h-4 text-[#b5afa6] shrink-0" strokeWidth={1.75} />
                    <span className="hidden sm:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-[#57534e] shrink-0" strokeWidth={1.75} />
                    <span className="hidden sm:inline">Dark</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5 bg-[#f3f1ed] dark:bg-[#25221f] border border-[#e5e1d8] dark:border-[#332f2b] px-2 py-1 rounded-lg text-xs font-medium text-[#1c1917] dark:text-[#f5f3ef] min-h-[36px]">
                <Globe className="w-4 h-4 text-[#78716c] dark:text-[#8c857d] shrink-0" strokeWidth={1.75} />
                <select
                  value={selectedLocale}
                  onChange={(e) => {
                    const nextLocale = e.target.value;
                    setSelectedLocale(nextLocale);
                    const nextT = LOCALE_TRANSLATIONS[nextLocale] || LOCALE_TRANSLATIONS.en;
                    if (activeView === 'home') {
                      try {
                        window.history.pushState({}, '', nextT.canonicalPath);
                      } catch {
                        // ignore in sandboxed frames
                      }
                    }
                  }}
                  className="bg-transparent dark:bg-[#25221f] focus:outline-none cursor-pointer font-medium text-[#1c1917] dark:text-[#f5f3ef] text-xs"
                  aria-label="Select Regional Health Locale"
                >
                  {LOCALES.map((loc) => (
                    <option key={loc.code} value={loc.code} className="bg-white dark:bg-[#1c1917] text-[#1c1917] dark:text-[#f5f3ef]">
                      {loc.code.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-150 shrink-0 cursor-pointer ${
                  mobileMenuOpen
                    ? 'bg-[#1c1917] text-[#faf9f7] dark:bg-[#f5f3ef] dark:text-[#1c1917]'
                    : 'text-[#1c1917] dark:text-[#f5f3ef] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f]'
                }`}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-slide-menu"
              >
                <span className="sr-only">Toggle navigation menu</span>
                {mobileMenuOpen ? (
                  <X className="w-4 h-4" strokeWidth={1.75} />
                ) : (
                  <Menu className="w-4 h-4" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>

          {/* Top Search Bar for Quickly Finding Any of the 38 Calculators & Guides */}
          <div className="pb-2 pt-0">
            <TopToolSearchBar
              query={searchQuery}
              onQueryChange={setSearchQuery}
              onSelectTool={handleSelectSearchTool}
              locale={selectedLocale}
            />
          </div>
        </div>
      </header>

      {/* Smooth Slide-In Mobile Navigation Drawer & Backdrop Overlay */}
      <div
        className={`lg:hidden fixed inset-x-0 top-24 sm:top-28 bottom-14 z-40 transition-opacity duration-200 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto visible'
            : 'opacity-0 pointer-events-none invisible'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-[#1c1917]/40 dark:bg-black/60 transition-opacity duration-200 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Slide-In Drawer Panel from Right */}
        <nav
          id="mobile-slide-menu"
          aria-label="Mobile Navigation Drawer"
          className={`relative ml-auto w-full max-w-sm h-full bg-white dark:bg-[#1c1917] border-l border-[#e5e1d8] dark:border-[#332f2b] flex flex-col justify-between overflow-y-auto p-4 transform transition-transform duration-200 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1 pb-2 border-b border-[#edeae3] dark:border-[#2a2623]">
              <span className="text-xs font-medium text-[#57534e] dark:text-[#b5afa6]">
                Calculators &amp; guides
              </span>
              <span className="text-xs text-[#78716c] dark:text-[#8c857d]">
                Private on device
              </span>
            </div>

            <div className="space-y-1">
              {mobileNavItems.map((item) => {
                const isActive = activeView === 'home' && activeBottomNav === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      handleBottomNavClick(
                        item.id,
                        item.id === 'faq' ? 'faq-section' : item.id === 'silos' ? 'percentage' : 'calculator-hero'
                      );
                    }}
                    className={`group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border transition-colors duration-150 min-h-[52px] ${
                      isActive
                        ? 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#1c1917] dark:text-[#f5f3ef] border-[#d6d0c4] dark:border-[#3f3a34]'
                        : 'bg-white dark:bg-[#1c1917] border-transparent hover:bg-[#faf9f7] dark:hover:bg-[#25221f]/60 text-[#1c1917] dark:text-[#f5f3ef]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[#57534e] dark:text-[#b5afa6] shrink-0">
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-medium truncate">
                          {item.label}
                        </div>
                        <div className="text-xs text-[#78716c] dark:text-[#8c857d] truncate">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center shrink-0">
                      {isActive ? (
                        <span className="text-xs font-medium text-[#c2410c] dark:text-[#ea580c]">
                          Active
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#78716c] dark:text-[#8c857d]" strokeWidth={1.75} />
                      )}
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Clinical Medical Reviewer Card Item */}
            <div className="pt-3 border-t border-[#edeae3] dark:border-[#2a2623]">
              <span className="px-1 text-xs font-medium text-[#57534e] dark:text-[#b5afa6] block mb-2">
                Medical review &amp; site info
              </span>
              <button
                type="button"
                onClick={navigateReviewerProfile}
                aria-current={activeView === 'reviewer' ? 'page' : undefined}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border transition-colors duration-150 min-h-[52px] text-left cursor-pointer ${
                  activeView === 'reviewer'
                    ? 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#1c1917] dark:text-[#f5f3ef] border-[#d6d0c4] dark:border-[#3f3a34]'
                    : 'bg-[#faf9f7] dark:bg-[#141210] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f] border-[#e5e1d8] dark:border-[#332f2b] text-[#1c1917] dark:text-[#f5f3ef]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Stethoscope className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6] shrink-0" strokeWidth={1.75} />
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-medium truncate">
                      Dr. Rekha Kumar, M.D., M.S.
                    </div>
                    <div className="text-xs text-[#78716c] dark:text-[#8c857d] truncate">
                      Lead Medical Reviewer · Weill Cornell Medicine
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#78716c] dark:text-[#8c857d] shrink-0" strokeWidth={1.75} />
              </button>

              {/* Quick Policy Links */}
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(
                  [
                    { key: 'about', label: 'About Us' },
                    { key: 'methodology', label: 'How We Review' },
                    { key: 'contact', label: 'Contact' }
                  ] as { key: SitePageKey; label: string }[]
                ).map((p) => {
                  const isInfoActive = activeView === 'info' && activeSitePage === p.key;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => navigateSitePage(p.key)}
                      aria-current={isInfoActive ? 'page' : undefined}
                      className={`min-h-[36px] px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-150 cursor-pointer ${
                        isInfoActive
                          ? 'bg-[#1c1917] text-[#faf9f7] border-[#1c1917] dark:bg-[#f5f3ef] dark:text-[#1c1917] dark:border-[#f5f3ef]'
                          : 'bg-[#faf9f7] dark:bg-[#141210] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f] text-[#57534e] dark:text-[#b5afa6] border-[#e5e1d8] dark:border-[#332f2b]'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Social Bar inside Mobile Slide-In Drawer */}
          <div className="pt-3 mt-4 border-t border-[#edeae3] dark:border-[#2a2623] px-1 flex items-center justify-between">
            <span className="text-xs font-medium text-[#57534e] dark:text-[#b5afa6]">
              Follow us
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://x.com/weightlossperce"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X"
                className="w-9 h-9 rounded-lg bg-[#f3f1ed] dark:bg-[#25221f] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b] text-[#57534e] dark:text-[#b5afa6] flex items-center justify-center transition-colors duration-150"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/weightlossnewborn/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="w-9 h-9 rounded-lg bg-[#f3f1ed] dark:bg-[#25221f] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b] text-[#57534e] dark:text-[#b5afa6] flex items-center justify-center transition-colors duration-150"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/weightlosspercentage"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="w-9 h-9 rounded-lg bg-[#f3f1ed] dark:bg-[#25221f] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b] text-[#57534e] dark:text-[#b5afa6] flex items-center justify-center transition-colors duration-150"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@WeightLossPercentage"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on YouTube"
                className="w-9 h-9 rounded-lg bg-[#f3f1ed] dark:bg-[#25221f] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b] text-[#57534e] dark:text-[#b5afa6] flex items-center justify-center transition-colors duration-150"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-10">
        {activeView === 'reviewer' ? (
          <Suspense fallback={<div className="min-h-[480px] rounded-2xl bg-white dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] p-8" />}>
            <MedicalReviewerProfile
              isStandalonePage={true}
              onBackToCalculator={navigateHome}
              onSelectCalculatorMode={(mode) => {
                setActiveToolMode(mode);
                setActiveBottomNav(mode);
                navigateHome();
              }}
            />
            <EEATFooter
              hideReviewerCard={true}
              onOpenReviewerProfile={navigateReviewerProfile}
              onOpenSitePage={navigateSitePage}
              onNavigateCanonicalHub={navigateCanonicalHub}
              onSelectCalculatorMode={(mode) => {
                setActiveToolMode(mode);
                setActiveBottomNav(mode);
                navigateHome();
              }}
            />
          </Suspense>
        ) : activeView === 'info' ? (
          <Suspense fallback={<div className="min-h-[480px] rounded-2xl bg-white dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] p-8" />}>
            <SiteInfoPages
              activePage={activeSitePage}
              onSelectPage={navigateSitePage}
              onOpenReviewerProfile={navigateReviewerProfile}
              onBackToCalculator={navigateHome}
            />
            <EEATFooter
              onOpenReviewerProfile={navigateReviewerProfile}
              onOpenSitePage={navigateSitePage}
              onNavigateCanonicalHub={navigateCanonicalHub}
              onSelectCalculatorMode={(mode) => {
                setActiveToolMode(mode);
                setActiveBottomNav(mode);
                navigateHome();
              }}
            />
          </Suspense>
        ) : (
          <>
            {/* Above-The-Fold: Main Heading, Concise Intro & Clinical Reviewer Byline */}
            <section className="space-y-2 max-w-4xl">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#57534e] dark:text-[#b5afa6] font-normal">
                <button
                  type="button"
                  onClick={navigateReviewerProfile}
                  className="inline-flex items-center gap-1.5 text-[#1c1917] dark:text-[#f5f3ef] hover:underline underline-offset-2 font-medium cursor-pointer"
                >
                  <span>{t.bylineReviewed}</span>
                </button>
                <span aria-hidden="true" className="text-[#d6d0c4] dark:text-[#3f3a34]">·</span>
                <span>{t.bylinePrivate}</span>
                <span aria-hidden="true" className="text-[#d6d0c4] dark:text-[#3f3a34]">·</span>
                <span>{t.bylinePdf}</span>
                {routeIntent.intentBadge && (
                  <>
                    <span aria-hidden="true" className="text-[#d6d0c4] dark:text-[#3f3a34]">·</span>
                    <span className="text-xs font-medium text-[#57534e] dark:text-[#b5afa6]">
                      {routeIntent.intentBadge}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-semibold text-[#1c1917] dark:text-[#f5f3ef] tracking-tight leading-tight">
                {routeIntent.customHeroTitle || t.heroTitle}
              </h1>

              {/* Intro text */}
              <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#b5afa6] leading-relaxed font-normal">
                {routeIntent.customHeroIntro || t.heroIntro}
              </p>
            </section>

            {/* Visually Dominant Hero Tool Box */}
            <section id="calculator-hero" className="scroll-mt-20" aria-label="Interactive Weight Loss Percentage Calculator Tool">
              {routeIntent.canonicalPath === '/calculators/bmi/' ||
              routeIntent.canonicalPath === '/calculators/bmi-chart/' ||
              routeIntent.canonicalPath === '/calculators/ideal-weight/' ? (
                <BmiTopicalPages
                  activeRoute={routeIntent.canonicalPath as BmiTopicalRoute}
                  onNavigate={navigateCanonicalHub}
                />
              ) : routeIntent.canonicalPath === '/calculators/baby-weight-percentile/' ? (
                <BabyWeightPercentilePage onNavigate={navigateCanonicalHub} />
              ) : (
                <HeroToolBox
                  externalMode={activeToolMode}
                  locale={selectedLocale}
                  clinicalFocus={clinicalFocus}
                  onClinicalFocusChange={setClinicalFocus}
                  restaurantBrand={restaurantBrand}
                  onRestaurantBrandChange={setRestaurantBrand}
                  defaultWeightUnit={routeIntent.defaultWeightUnit}
                  defaultBabyUnit={routeIntent.defaultBabyUnit}
                  onModeChange={(m) => {
                    setActiveToolMode(m);
                    setActiveBottomNav(m);
                  }}
                />
              )}
            </section>

            {/* Policy-Safe Display Ad Unit 1: Directly below the hero calculator results block (24px+ margin) */}
            <AdSlot slot={AD_SLOT_HERO_BELOW} variant="display" />

            {/* Below-the-Fold Deferred Content with Content-Visibility Optimization */}
            <Suspense fallback={<div className="min-h-[600px] cv-auto" />}>
              <div className="cv-auto">
                {routeIntent.canonicalPath.endsWith('/blog/fat-loss-vs-weight-loss/') ? (
                  <BlogArticleContent slug="fat-loss-vs-weight-loss" />
                ) : routeIntent.canonicalPath.endsWith('/blog/weight-tracking-guide/') ? (
                  <BlogArticleContent slug="weight-tracking-guide" />
                ) : routeIntent.canonicalPath.endsWith('/blog/how-much-weight-have-i-lost/') ? (
                  <BlogArticleContent slug="how-much-weight-have-i-lost" />
                ) : (
                  /* Comprehensive 26 Calculators & Clinical Reference Guides (includes mid-page In-article Ad Unit 2) */
                  <SiloContentSections
                    searchQuery={searchQuery}
                    onClearSearch={() => setSearchQuery('')}
                    locale={selectedLocale}
                    onSelectToolMode={(mode) => {
                      setActiveToolMode(mode);
                      setActiveBottomNav(mode);
                    }}
                    onSelectClinicalFocus={(focus) => {
                      setClinicalFocus(focus);
                    }}
                  />
                )}
              </div>

              <div className="cv-auto">
                {/* Frequently Answered Clinical & Calculation Questions */}
                <FAQWithLabels locale={selectedLocale} />
              </div>

              <div className="cv-auto">
                {/* Complete Medical Review & Trust Footer */}
                <EEATFooter
                  onOpenReviewerProfile={navigateReviewerProfile}
                  onOpenSitePage={navigateSitePage}
                  onNavigateCanonicalHub={navigateCanonicalHub}
                  onSelectCalculatorMode={(mode) => {
                    setActiveToolMode(mode);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            </Suspense>
          </>
        )}
      </main>

      {/* Fixed Bottom Thumb-Zone Navigation Bar on Mobile (< lg) */}
      <nav
        aria-label="Mobile Quick Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#1c1917] border-t border-[#e5e1d8] dark:border-[#332f2b] px-2 pb-safe transition-colors duration-200"
      >
        <div className="grid grid-cols-5 items-center h-14 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => handleBottomNavClick('adult')}
            aria-current={activeBottomNav === 'adult' && activeView === 'home' ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-colors duration-150 ${
              activeBottomNav === 'adult' && activeView === 'home'
                ? 'text-[#1c1917] dark:text-[#f5f3ef] font-medium'
                : 'text-[#78716c] dark:text-[#8c857d] hover:text-[#1c1917] dark:hover:text-[#f5f3ef]'
            }`}
          >
            {activeBottomNav === 'adult' && activeView === 'home' && (
              <span aria-hidden="true" className="absolute top-0 inset-x-3 h-0.5 bg-[#1c1917] dark:bg-[#f5f3ef]" />
            )}
            <Scale className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-[11px] mt-1 whitespace-nowrap">Weight %</span>
          </button>

          <button
            type="button"
            onClick={() => handleBottomNavClick('newborn')}
            aria-current={activeBottomNav === 'newborn' && activeView === 'home' ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-colors duration-150 ${
              activeBottomNav === 'newborn' && activeView === 'home'
                ? 'text-[#1c1917] dark:text-[#f5f3ef] font-medium'
                : 'text-[#78716c] dark:text-[#8c857d] hover:text-[#1c1917] dark:hover:text-[#f5f3ef]'
            }`}
          >
            {activeBottomNav === 'newborn' && activeView === 'home' && (
              <span aria-hidden="true" className="absolute top-0 inset-x-3 h-0.5 bg-[#1c1917] dark:bg-[#f5f3ef]" />
            )}
            <Baby className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-[11px] mt-1 whitespace-nowrap">Newborn</span>
          </button>

          <button
            type="button"
            onClick={() => handleBottomNavClick('bmr')}
            aria-current={activeBottomNav === 'bmr' && activeView === 'home' ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-colors duration-150 ${
              activeBottomNav === 'bmr' && activeView === 'home'
                ? 'text-[#1c1917] dark:text-[#f5f3ef] font-medium'
                : 'text-[#78716c] dark:text-[#8c857d] hover:text-[#1c1917] dark:hover:text-[#f5f3ef]'
            }`}
          >
            {activeBottomNav === 'bmr' && activeView === 'home' && (
              <span aria-hidden="true" className="absolute top-0 inset-x-3 h-0.5 bg-[#1c1917] dark:bg-[#f5f3ef]" />
            )}
            <Flame className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-[11px] mt-1 whitespace-nowrap">BMR/TDEE</span>
          </button>

          <button
            type="button"
            onClick={() => handleBottomNavClick('faq', 'faq-section')}
            aria-current={activeBottomNav === 'faq' && activeView === 'home' ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-colors duration-150 ${
              activeBottomNav === 'faq' && activeView === 'home'
                ? 'text-[#1c1917] dark:text-[#f5f3ef] font-medium'
                : 'text-[#78716c] dark:text-[#8c857d] hover:text-[#1c1917] dark:hover:text-[#f5f3ef]'
            }`}
          >
            {activeBottomNav === 'faq' && activeView === 'home' && (
              <span aria-hidden="true" className="absolute top-0 inset-x-3 h-0.5 bg-[#1c1917] dark:bg-[#f5f3ef]" />
            )}
            <HelpCircle className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-[11px] mt-1 whitespace-nowrap">FAQ</span>
          </button>

          <button
            type="button"
            onClick={() => handleBottomNavClick('silos', 'percentage')}
            aria-current={activeBottomNav === 'silos' && activeView === 'home' ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-colors duration-150 ${
              activeBottomNav === 'silos' && activeView === 'home'
                ? 'text-[#1c1917] dark:text-[#f5f3ef] font-medium'
                : 'text-[#78716c] dark:text-[#8c857d] hover:text-[#1c1917] dark:hover:text-[#f5f3ef]'
            }`}
          >
            {activeBottomNav === 'silos' && activeView === 'home' && (
              <span aria-hidden="true" className="absolute top-0 inset-x-3 h-0.5 bg-[#1c1917] dark:bg-[#f5f3ef]" />
            )}
            <BookOpen className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-[11px] mt-1 whitespace-nowrap">Guides</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;

