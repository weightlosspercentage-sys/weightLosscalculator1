import React, { useState, useEffect } from 'react';
import { HeroToolBox, ToolMode } from './components/HeroToolBox';
import { FAQWithLabels } from './components/FAQWithLabels';
import { SiloContentSections } from './components/SiloContentSections';
import { EEATFooter } from './components/EEATFooter';
import { StructuredData } from './components/StructuredData';
import { MedicalReviewerProfile } from './components/MedicalReviewerProfile';
import { SiteInfoPages, SitePageKey } from './components/SiteInfoPages';
import { TopToolSearchBar } from './components/TopToolSearchBar';
import { SearchableToolItem } from './utils/toolSearch';
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
  const [selectedLocale, setSelectedLocale] = useState<string>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeToolMode, setActiveToolMode] = useState<ToolMode>('adult');
  const [activeBottomNav, setActiveBottomNav] = useState<NavTarget>('adult');
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

  // Sync <html lang>, <title>, <meta name="description">, and <link rel="canonical"> whenever locale or active view changes
  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
    if (activeView === 'home') {
      document.title = t.metaTitle;
      const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (metaDesc) {
        metaDesc.content = t.metaDescription;
      }
    }
    const canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalEl) {
      let path = t.canonicalPath;
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
      canonicalEl.href = `https://www.weightlosspercentage.com${path}`;
    }
  }, [selectedLocale, activeView, activeSitePage, t.htmlLang, t.canonicalPath, t.metaTitle, t.metaDescription]);

  // Sync URL pathname on initial load and popstate for /authors/dr-rekha-kumar/, locales, and site pages
  useEffect(() => {
    const syncPath = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.startsWith('/de')) setSelectedLocale('de');
      else if (path.startsWith('/it')) setSelectedLocale('it');
      else if (path.startsWith('/ru')) setSelectedLocale('ru');
      else if (path.startsWith('/zh')) setSelectedLocale('zh');
      else if (path.startsWith('/ca')) setSelectedLocale('ca');
      else if (path.startsWith('/uk')) setSelectedLocale('uk');

      if (path.includes('/authors/dr-rekha-kumar')) {
        setActiveView('reviewer');
      } else if (path.includes('/about')) {
        setActiveView('info');
        setActiveSitePage('about');
      } else if (path.includes('/methodology')) {
        setActiveView('info');
        setActiveSitePage('methodology');
      } else if (path.includes('/privacy')) {
        setActiveView('info');
        setActiveSitePage('privacy');
      } else if (path.includes('/terms')) {
        setActiveView('info');
        setActiveSitePage('terms');
      } else if (path.includes('/contact')) {
        setActiveView('info');
        setActiveSitePage('contact');
      }
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
    setActiveView('home');
    setActiveBottomNav(activeToolMode);
    setMobileMenuOpen(false);
    try {
      window.history.pushState({}, '', '/');
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
    activeClass: string;
    badgeColor: string;
  }[] = [
    {
      id: 'adult',
      label: 'Weight Loss Percentage Calculator',
      subtitle: 'Track pounds or kg lost, % change & goal progress',
      href: '#percentage',
      icon: <Scale className="w-4 h-4 shrink-0" />,
      activeClass: 'bg-indigo-50/90 dark:bg-indigo-950/70 text-[#7334fd] dark:text-indigo-300 border-indigo-200/90 dark:border-indigo-800/80 shadow-2xs',
      badgeColor: 'bg-[#7334fd]'
    },
    {
      id: 'newborn',
      label: 'Newborn Weight Loss Calculator',
      subtitle: 'Check baby weight change in the first days after birth',
      href: '#newborn',
      icon: <Baby className="w-4 h-4 shrink-0" />,
      activeClass: 'bg-orange-50/90 dark:bg-orange-950/70 text-[#ca3500] dark:text-orange-300 border-orange-200/90 dark:border-orange-800/80 shadow-2xs',
      badgeColor: 'bg-[#ca3500]'
    },
    {
      id: 'bmr',
      label: 'BMR & TDEE Calculator',
      subtitle: 'Estimate your resting & daily calorie needs',
      href: '#bmr',
      icon: <Flame className="w-4 h-4 shrink-0" />,
      activeClass: 'bg-blue-50/90 dark:bg-blue-950/70 text-[#4950fc] dark:text-sky-300 border-blue-200/90 dark:border-blue-800/80 shadow-2xs',
      badgeColor: 'bg-[#4950fc]'
    },
    {
      id: 'subway',
      label: 'Calorie & Nutrition Calculator',
      subtitle: 'Compare sandwich calories & meal portions',
      href: '#calorie',
      icon: <Utensils className="w-4 h-4 shrink-0" />,
      activeClass: 'bg-pink-50/90 dark:bg-pink-950/70 text-[#ca5983] dark:text-pink-300 border-pink-200/90 dark:border-pink-800/80 shadow-2xs',
      badgeColor: 'bg-[#ca5983]'
    },
    {
      id: 'faq',
      label: 'Common Questions (FAQ)',
      subtitle: 'Clear answers on weight loss math & healthy pace',
      href: '#faq-section',
      icon: <HelpCircle className="w-4 h-4 shrink-0" />,
      activeClass: 'bg-indigo-50/90 dark:bg-indigo-950/70 text-[#7334fd] dark:text-indigo-300 border-indigo-200/90 dark:border-indigo-800/80 shadow-2xs',
      badgeColor: 'bg-[#7334fd]'
    },
    {
      id: 'silos',
      label: 'All 24 Calculators & Guides',
      subtitle: 'Formulas, newborn charts, BMI & nutrition guides',
      href: '#percentage',
      icon: <BookOpen className="w-4 h-4 shrink-0" />,
      activeClass: 'bg-indigo-50/90 dark:bg-indigo-950/70 text-[#7334fd] dark:text-indigo-300 border-indigo-200/90 dark:border-indigo-800/80 shadow-2xs',
      badgeColor: 'bg-[#7334fd]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-[#ca3500] selection:text-white pb-20 lg:pb-0 transition-colors duration-200">
      {/* Inject Structured Data (JSON-LD) into DOM head */}
      <StructuredData locale={selectedLocale} />

      {/* Top Navigation Bar (Compact 48px on Mobile, 54px on Desktop) */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 h-12 sm:h-13">
            {/* Zone 1: Brand Logo matching Screenshot 1 ([%] Weight Loss Percentage) */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateHome();
              }}
              className="flex items-center gap-2 sm:gap-2.5 group min-w-0 shrink"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-gradient-to-b from-[#5856f6] via-[#7c3aed] to-[#c94b38] flex items-center justify-center text-white shadow-xs shrink-0 font-black text-base sm:text-lg leading-none select-none">
                %
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-xl tracking-tight truncate">
                Weight Loss <span className="text-[#ca3500] dark:text-orange-400">Percentage</span>
              </span>
            </a>

            {/* Zone 2: Concise Single-Line Desktop Nav Links with Active Indicators */}
            <nav className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
              <a
                href="#percentage"
                onClick={(e) => {
                  e.preventDefault();
                  handleBottomNavClick('adult');
                }}
                aria-current={activeView === 'home' && activeBottomNav === 'adult' ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeView === 'home' && activeBottomNav === 'adult'
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 text-[#7334fd] dark:text-indigo-300 shadow-2xs'
                    : 'hover:text-[#7334fd] dark:hover:text-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800/70'
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
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeView === 'home' && activeBottomNav === 'newborn'
                    ? 'bg-orange-50 dark:bg-orange-950/80 text-[#ca3500] dark:text-orange-300 shadow-2xs'
                    : 'hover:text-[#ca3500] dark:hover:text-orange-300 hover:bg-slate-50 dark:hover:bg-slate-800/70'
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
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeView === 'home' && activeBottomNav === 'bmr'
                    ? 'bg-blue-50 dark:bg-blue-950/80 text-[#4950fc] dark:text-sky-300 shadow-2xs'
                    : 'hover:text-[#4950fc] dark:hover:text-sky-300 hover:bg-slate-50 dark:hover:bg-slate-800/70'
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
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeView === 'home' && activeBottomNav === 'faq'
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 text-[#7334fd] dark:text-indigo-300 shadow-2xs'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/70'
                }`}
              >
                {t.navFaq}
              </a>
              <button
                type="button"
                onClick={navigateReviewerProfile}
                aria-current={activeView === 'reviewer' ? 'page' : undefined}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeView === 'reviewer'
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 text-[#7334fd] dark:text-indigo-300 shadow-2xs'
                    : 'hover:text-[#7334fd] dark:hover:text-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-[#7334fd] dark:text-indigo-400" />
                <span>Dr. Rekha Kumar, M.D.</span>
              </button>
            </nav>

            {/* Zone 3: Theme Toggle, Locale Selector & Mobile Menu Button */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setDarkMode((prev) => !prev)}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-pressed={darkMode}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                className="min-h-[36px] px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
              >
                {darkMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="hidden sm:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="hidden sm:inline">Dark</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-2 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 min-h-[36px]">
                <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
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
                  className="bg-transparent dark:bg-slate-800 focus:outline-none cursor-pointer font-bold text-slate-900 dark:text-slate-100 text-xs"
                  aria-label="Select Regional Health Locale"
                >
                  {LOCALES.map((loc) => (
                    <option key={loc.code} value={loc.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      {loc.code.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 shrink-0 ${
                  mobileMenuOpen
                    ? 'bg-[#7334fd] text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200'
                }`}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-slide-menu"
              >
                <span className="sr-only">Toggle navigation menu</span>
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 transition-transform duration-200 rotate-0" />
                ) : (
                  <Menu className="w-5 h-5 transition-transform duration-200" />
                )}
              </button>
            </div>
          </div>

          {/* Top Search Bar for Quickly Finding Any of the 24 Calculators & Guides */}
          <div className="pb-1.5 pt-0">
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
        className={`lg:hidden fixed inset-x-0 top-24 sm:top-28 bottom-14 z-40 transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto visible'
            : 'opacity-0 pointer-events-none invisible'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Translucent Backdrop */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-slate-900/45 dark:bg-black/65 backdrop-blur-[2px] transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Slide-In Drawer Panel from Right */}
        <nav
          id="mobile-slide-menu"
          aria-label="Mobile Navigation Drawer"
          className={`relative ml-auto w-full max-w-sm h-full bg-white dark:bg-slate-900 border-l border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto px-4 py-4 transform transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Calculators &amp; Guides
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/80 px-2 py-0.5 rounded-md">
                Private on device
              </span>
            </div>

            <div className="space-y-1.5">
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
                    className={`group relative flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl border transition-all duration-200 min-h-[54px] ${
                      isActive
                        ? item.activeClass
                        : 'bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-200/80 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {/* Left Active Pill Indicator */}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className={`absolute left-1.5 top-3 bottom-3 w-1 rounded-full ${item.badgeColor}`}
                      />
                    )}

                    <div className="flex items-center gap-3 min-w-0 pl-1">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? `${item.badgeColor} text-white shadow-xs`
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700'
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-extrabold truncate">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isActive ? (
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md text-white ${item.badgeColor}`}
                        >
                          Active
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                      )}
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Clinical Medical Reviewer Card Item */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="px-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Medical Review &amp; Site Info
              </span>
              <button
                type="button"
                onClick={navigateReviewerProfile}
                aria-current={activeView === 'reviewer' ? 'page' : undefined}
                className={`w-full relative flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl border transition-all duration-200 min-h-[54px] text-left ${
                  activeView === 'reviewer'
                    ? 'bg-indigo-50/90 dark:bg-indigo-950/70 text-[#7334fd] dark:text-indigo-300 border-indigo-200/90 dark:border-indigo-800 shadow-2xs'
                    : 'bg-slate-50/80 dark:bg-slate-800/70 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border-slate-200/70 dark:border-slate-700/80 text-slate-800 dark:text-slate-100'
                }`}
              >
                {activeView === 'reviewer' && (
                  <span
                    aria-hidden="true"
                    className="absolute left-1.5 top-3 bottom-3 w-1 rounded-full bg-[#7334fd]"
                  />
                )}
                <div className="flex items-center gap-3 min-w-0 pl-1">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      activeView === 'reviewer'
                        ? 'bg-[#7334fd] text-white'
                        : 'bg-indigo-100 dark:bg-indigo-950 text-[#7334fd] dark:text-indigo-300'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-extrabold text-[#7334fd] dark:text-indigo-300 truncate">
                      Dr. Rekha Kumar, M.D., M.S.
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                      Lead Medical Reviewer • Weill Cornell Medicine
                    </div>
                  </div>
                </div>
                {activeView === 'reviewer' ? (
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md text-white bg-[#7334fd] shrink-0">
                    Active
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#7334fd] dark:text-indigo-400 shrink-0" />
                )}
              </button>

              {/* Quick Policy Pills */}
              <div className="grid grid-cols-3 gap-1.5 mt-2">
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
                      className={`min-h-[38px] px-2 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isInfoActive
                          ? 'bg-[#7334fd] text-white border-[#7334fd]'
                          : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700'
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
          <div className="pt-3 mt-4 border-t border-slate-200/80 dark:border-slate-800 px-1 flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Follow Us
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://x.com/weightlossperce"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X"
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
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
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-[#1877F2] dark:text-blue-400 flex items-center justify-center transition-colors"
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
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-pink-50 dark:hover:bg-slate-700 text-[#E1306C] dark:text-pink-400 flex items-center justify-center transition-colors"
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
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-slate-700 text-[#FF0000] dark:text-red-400 flex items-center justify-center transition-colors"
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4 space-y-5 sm:space-y-12">
        {activeView === 'reviewer' ? (
          <>
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
              onSelectCalculatorMode={(mode) => {
                setActiveToolMode(mode);
                setActiveBottomNav(mode);
                navigateHome();
              }}
            />
          </>
        ) : activeView === 'info' ? (
          <>
            <SiteInfoPages
              activePage={activeSitePage}
              onSelectPage={navigateSitePage}
              onOpenReviewerProfile={navigateReviewerProfile}
              onBackToCalculator={navigateHome}
            />
            <EEATFooter
              onOpenReviewerProfile={navigateReviewerProfile}
              onOpenSitePage={navigateSitePage}
              onSelectCalculatorMode={(mode) => {
                setActiveToolMode(mode);
                setActiveBottomNav(mode);
                navigateHome();
              }}
            />
          </>
        ) : (
          <>
            {/* Above-The-Fold: Main Heading, Concise Intro & Clinical Reviewer Byline */}
            <section className="space-y-1 sm:space-y-1.5 max-w-4xl">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium">
                <button
                  type="button"
                  onClick={navigateReviewerProfile}
                  className="inline-flex items-center gap-1.5 text-[#7334fd] dark:text-indigo-400 hover:underline font-bold"
                >
                  <span>{t.bylineReviewed}</span>
                </button>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span>{t.bylinePrivate}</span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span>{t.bylinePdf}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {t.heroTitle}
              </h1>

              {/* Intro text strictly under 45 words (37 words), warm and human-friendly with zero em dashes */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-snug font-normal">
                {t.heroIntro}
              </p>
            </section>

            {/* Visually Dominant Hero Tool Box */}
            <section id="calculator-hero" className="scroll-mt-20" aria-label="Interactive Weight Loss Percentage Calculator Tool">
              <HeroToolBox
                externalMode={activeToolMode}
                locale={selectedLocale}
                onModeChange={(m) => {
                  setActiveToolMode(m);
                  setActiveBottomNav(m);
                }}
              />
            </section>

            {/* Frequently Answered Clinical & Calculation Questions */}
            <FAQWithLabels locale={selectedLocale} />

            {/* Comprehensive 24 Calculators & Clinical Reference Guides */}
            <SiloContentSections
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
              locale={selectedLocale}
              onSelectToolMode={(mode) => {
                setActiveToolMode(mode);
                setActiveBottomNav(mode);
              }}
            />

            {/* Complete Medical Review & Trust Footer */}
            <EEATFooter
              onOpenReviewerProfile={navigateReviewerProfile}
              onOpenSitePage={navigateSitePage}
              onSelectCalculatorMode={(mode) => {
                setActiveToolMode(mode);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}
      </main>

      {/* Fixed Bottom Thumb-Zone Navigation Bar on Mobile (< lg) */}
      <nav
        aria-label="Mobile Quick Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 px-2 pb-safe shadow-lg transition-colors duration-200"
      >
        <div className="grid grid-cols-5 items-center h-14 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => handleBottomNavClick('adult')}
            aria-current={activeBottomNav === 'adult' && activeView === 'home' ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-all ${
              activeBottomNav === 'adult' && activeView === 'home'
                ? 'text-[#7334fd] dark:text-indigo-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {activeBottomNav === 'adult' && activeView === 'home' && (
              <span aria-hidden="true" className="absolute top-0 inset-x-3 h-0.5 rounded-b-full bg-[#7334fd] dark:bg-indigo-400" />
            )}
            <Scale className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight whitespace-nowrap">Weight %</span>
          </button>

          <button
            type="button"
            onClick={() => handleBottomNavClick('newborn')}
            aria-current={activeBottomNav === 'newborn' && activeView === 'home' ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-all ${
              activeBottomNav === 'newborn' && activeView === 'home'
                ? 'text-[#ca3500] dark:text-orange-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {activeBottomNav === 'newborn' && activeView === 'home' && (
              <span aria-hidden="true" className="absolute top-0 inset-x-3 h-0.5 rounded-b-full bg-[#ca3500] dark:bg-orange-400" />
            )}
            <Baby className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight whitespace-nowrap">Newborn</span>
          </button>

          <button
            type="button"
            onClick={() => handleBottomNavClick('bmr')}
            aria-current={activeBottomNav === 'bmr' && activeView === 'home' ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-all ${
              activeBottomNav === 'bmr' && activeView === 'home'
                ? 'text-[#4950fc] dark:text-sky-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {activeBottomNav === 'bmr' && activeView === 'home' && (
              <span aria-hidden="true" className="absolute top-0 inset-x-3 h-0.5 rounded-b-full bg-[#4950fc] dark:bg-sky-400" />
            )}
            <Flame className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight whitespace-nowrap">BMR/TDEE</span>
          </button>

          <button
            type="button"
            onClick={() => handleBottomNavClick('faq', 'faq-section')}
            aria-current={activeBottomNav === 'faq' && activeView === 'home' ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-all ${
              activeBottomNav === 'faq' && activeView === 'home'
                ? 'text-[#7334fd] dark:text-indigo-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {activeBottomNav === 'faq' && activeView === 'home' && (
              <span aria-hidden="true" className="absolute top-0 inset-x-3 h-0.5 rounded-b-full bg-[#7334fd] dark:bg-indigo-400" />
            )}
            <HelpCircle className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight whitespace-nowrap">FAQ</span>
          </button>

          <button
            type="button"
            onClick={() => handleBottomNavClick('silos', 'percentage')}
            aria-current={activeBottomNav === 'silos' && activeView === 'home' ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-all ${
              activeBottomNav === 'silos' && activeView === 'home'
                ? 'text-[#7334fd] dark:text-indigo-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {activeBottomNav === 'silos' && activeView === 'home' && (
              <span aria-hidden="true" className="absolute top-0 inset-x-3 h-0.5 rounded-b-full bg-[#7334fd] dark:bg-indigo-400" />
            )}
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight whitespace-nowrap">Guides</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;

