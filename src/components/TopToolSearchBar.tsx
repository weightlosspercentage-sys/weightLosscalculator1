import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  Calculator,
  BookOpen,
  HelpCircle,
  ArrowRight,
  CornerDownLeft
} from 'lucide-react';
import { searchTools, SearchableToolItem, ALL_SEARCHABLE_TOOLS } from '../utils/toolSearch';
import { LOCALE_TRANSLATIONS } from '../data/localeStrings';

interface TopToolSearchBarProps {
  onSelectTool: (tool: SearchableToolItem) => void;
  query?: string;
  onQueryChange?: (q: string) => void;
  locale?: string;
}

const QUICK_FILTERS = [
  { label: 'Newborn', query: 'Newborn' },
  { label: 'Water Fast & OMAD', query: 'Water Fast' },
  { label: 'GLP-1 / Ozempic', query: 'GLP-1' },
  { label: 'BMR & TDEE', query: 'BMR' },
  { label: 'Bariatric & Sleeve', query: 'Gastric' },
  { label: 'Subway & McDonald’s', query: 'Subway' }
];

export const TopToolSearchBar: React.FC<TopToolSearchBarProps> = ({
  onSelectTool,
  query: controlledQuery,
  onQueryChange,
  locale = 'en'
}) => {
  const t = LOCALE_TRANSLATIONS[locale] || LOCALE_TRANSLATIONS.en;
  const [internalQuery, setInternalQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const query = controlledQuery !== undefined ? controlledQuery : internalQuery;
  const setQuery = (val: string) => {
    if (onQueryChange) onQueryChange(val);
    setInternalQuery(val);
  };

  const results = useMemo(() => searchTools(query), [query]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut: Cmd/Ctrl + K or '/' (when not focused in an input)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTypingInField =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === '/' && !isTypingInField) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleSelect = (tool: SearchableToolItem) => {
    setIsOpen(false);
    onSelectTool(tool);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      setHighlightedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      setHighlightedIndex((prev) =>
        results.length > 0 ? (prev - 1 + results.length) % results.length : 0
      );
    } else if (e.key === 'Enter') {
      if (isOpen && results[highlightedIndex]) {
        e.preventDefault();
        handleSelect(results[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const getCategoryBadge = (category: SearchableToolItem['category']) => {
    if (category === 'Calculator') {
      return {
        icon: <Calculator className="w-3 h-3" />,
        className:
          'bg-indigo-50 dark:bg-indigo-950/80 text-[#7334fd] dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/80'
      };
    }
    if (category === 'FAQ & Reference') {
      return {
        icon: <HelpCircle className="w-3 h-3" />,
        className:
          'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/80'
      };
    }
    return {
      icon: <BookOpen className="w-3 h-3" />,
      className:
        'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80'
    };
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Bar */}
      <div
        className={`relative flex items-center w-full rounded-xl border transition-all duration-150 bg-slate-50/90 dark:bg-slate-800/90 ${
          isOpen
            ? 'border-[#7334fd] dark:border-indigo-400 ring-2 ring-[#7334fd]/15 dark:ring-indigo-400/20 bg-white dark:bg-slate-900 shadow-sm'
            : 'border-slate-200/90 dark:border-slate-700/90 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
      >
        <Search
          className="w-4 h-4 ml-3.5 text-slate-400 dark:text-slate-400 shrink-0 pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id="top-calculator-search"
          type="search"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="calculator-search-results"
          aria-autocomplete="list"
          aria-label={`Search ${ALL_SEARCHABLE_TOOLS.length} calculators and clinical guides`}
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={t.searchPlaceholder}
          className="w-full py-2 pl-2.5 pr-20 bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none"
        />

        <div className="absolute right-2.5 flex items-center gap-1.5">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
                setIsOpen(true);
              }}
              aria-label="Clear search query"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd
              aria-hidden="true"
              className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-2xs select-none"
            >
              /
            </kbd>
          )}
        </div>
      </div>

      {/* Results Dropdown Panel */}
      {isOpen && (
        <div
          id="calculator-search-results"
          role="listbox"
          aria-label="Available calculators and clinical guides"
          className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/95 dark:border-slate-700 shadow-2xl z-50 overflow-hidden transition-all"
        >
          {/* Header & Quick Filter Chips */}
          <div className="px-3.5 py-2.5 bg-slate-50/90 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span>
                {query.trim()
                  ? `Matching Tools (${results.length} of ${ALL_SEARCHABLE_TOOLS.length})`
                  : `All ${ALL_SEARCHABLE_TOOLS.length} Calculators & Guides`}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {QUICK_FILTERS.map((chip) => {
                const isChipActive = query.trim().toLowerCase() === chip.query.toLowerCase();
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => {
                      setQuery(isChipActive ? '' : chip.query);
                      inputRef.current?.focus();
                    }}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition-colors cursor-pointer ${
                      isChipActive
                        ? 'bg-[#7334fd] text-white border-[#7334fd]'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#7334fd] dark:hover:border-indigo-400 hover:text-[#7334fd] dark:hover:text-indigo-300'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable List of Matching Calculators & Guides */}
          {results.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 p-1.5">
              {results.map((item, idx) => {
                const isHighlighted = idx === highlightedIndex;
                const badge = getCategoryBadge(item.category);
                return (
                  <li key={item.id} role="option" aria-selected={isHighlighted}>
                    <button
                      type="button"
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      onClick={() => handleSelect(item)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                        isHighlighted
                          ? 'bg-indigo-50/90 dark:bg-indigo-950/70'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                            {item.title}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.className}`}
                          >
                            {badge.icon}
                            <span>{item.category}</span>
                          </span>
                          {item.matchedKeyword && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              Matches: {item.matchedKeyword}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                          {item.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-[#7334fd] dark:text-indigo-400 shrink-0 self-center">
                        <span className="hidden sm:inline">Open</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-6 text-center space-y-2">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No calculator or guide matched “{query}”
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Try searching for Newborn, Water Fast, GLP-1, BMR, TDEE, Keto, Gastric Bypass, or Subway.
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#7334fd] text-white hover:bg-[#5f23e6] transition-colors cursor-pointer"
              >
                Show All {ALL_SEARCHABLE_TOOLS.length} Calculators &amp; Guides
              </button>
            </div>
          )}

          {/* Footer Keyboard Hint */}
          <div className="px-3.5 py-2 bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CornerDownLeft className="w-3 h-3" />
              <span>Press Enter to jump directly to the selected calculator or guide</span>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Close (Esc)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
