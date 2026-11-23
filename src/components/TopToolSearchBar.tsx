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

  const getCategoryIcon = (category: SearchableToolItem['category']) => {
    if (category === 'Calculator') {
      return <Calculator className="w-4 h-4 shrink-0 text-[#78716c] dark:text-[#8c857d]" strokeWidth={1.75} />;
    }
    if (category === 'FAQ & Reference') {
      return <HelpCircle className="w-4 h-4 shrink-0 text-[#78716c] dark:text-[#8c857d]" strokeWidth={1.75} />;
    }
    return <BookOpen className="w-4 h-4 shrink-0 text-[#78716c] dark:text-[#8c857d]" strokeWidth={1.75} />;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Bar */}
      <div
        className={`relative flex items-center w-full rounded-[10px] border transition-colors duration-150 bg-[#f3f1ed] dark:bg-[#25221f] ${
          isOpen
            ? 'border-[#1c1917] dark:border-[#b5afa6] bg-white dark:bg-[#1c1917]'
            : 'border-[#e5e1d8] dark:border-[#332f2b] hover:border-[#d6d0c4] dark:hover:border-[#4a443e]'
        }`}
      >
        <Search
          className="w-4 h-4 ml-3 text-[#78716c] dark:text-[#8c857d] shrink-0 pointer-events-none"
          strokeWidth={1.75}
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
          className="w-full py-2 pl-2 pr-16 bg-transparent text-xs sm:text-sm font-normal text-[#1c1917] dark:text-[#f5f3ef] placeholder:text-[#78716c] dark:placeholder:text-[#8c857d] focus:outline-none"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
                setIsOpen(true);
              }}
              aria-label="Clear search query"
              className="p-1 rounded-lg text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f5f3ef] hover:bg-[#e5e1d8]/60 dark:hover:bg-[#332f2b] transition-colors duration-150 cursor-pointer"
            >
              <X className="w-4 h-4" strokeWidth={1.75} />
            </button>
          ) : (
            <kbd
              aria-hidden="true"
              className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium text-[#78716c] dark:text-[#8c857d] bg-white dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-md select-none"
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
          className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#1c1917] rounded-xl border border-[#e5e1d8] dark:border-[#332f2b] shadow-sm z-50 overflow-hidden"
        >
          {/* Header & Quick Filter Chips */}
          <div className="px-4 py-3 bg-[#faf9f7] dark:bg-[#141210] border-b border-[#edeae3] dark:border-[#2a2623] flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-medium text-[#57534e] dark:text-[#b5afa6] tabular-nums">
              {query.trim()
                ? `Matching tools (${results.length} of ${ALL_SEARCHABLE_TOOLS.length})`
                : `All ${ALL_SEARCHABLE_TOOLS.length} calculators and guides`}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
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
                    className={`px-2 py-1 rounded-lg text-xs font-medium border transition-colors duration-150 cursor-pointer ${
                      isChipActive
                        ? 'bg-[#1c1917] text-[#faf9f7] border-[#1c1917] dark:bg-[#f5f3ef] dark:text-[#1c1917] dark:border-[#f5f3ef]'
                        : 'bg-white dark:bg-[#1c1917] text-[#57534e] dark:text-[#b5afa6] border-[#e5e1d8] dark:border-[#332f2b] hover:border-[#1c1917] dark:hover:border-[#b5afa6] hover:text-[#1c1917] dark:hover:text-[#f5f3ef]'
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
            <ul className="max-h-80 overflow-y-auto divide-y divide-[#edeae3] dark:divide-[#2a2623] p-2">
              {results.map((item, idx) => {
                const isHighlighted = idx === highlightedIndex;
                return (
                  <li key={item.id} role="option" aria-selected={isHighlighted}>
                    <button
                      type="button"
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      onClick={() => handleSelect(item)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start justify-between gap-3 transition-colors duration-150 cursor-pointer ${
                        isHighlighted
                          ? 'bg-[#f3f1ed] dark:bg-[#25221f]'
                          : 'hover:bg-[#faf9f7] dark:hover:bg-[#25221f]/60'
                      }`}
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {getCategoryIcon(item.category)}
                          <span className="text-xs sm:text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef]">
                            {item.title}
                          </span>
                          <span className="text-xs text-[#78716c] dark:text-[#8c857d]">
                            · {item.category}
                          </span>
                          {item.matchedKeyword && (
                            <span className="text-[11px] text-[#57534e] dark:text-[#b5afa6]">
                              · Matches: {item.matchedKeyword}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#57534e] dark:text-[#b5afa6] line-clamp-1 pl-6">
                          {item.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-medium text-[#57534e] dark:text-[#b5afa6] shrink-0 self-center">
                        <span className="hidden sm:inline">Open</span>
                        <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-6 text-center space-y-2">
              <p className="text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef]">
                No calculator or guide matched “{query}”
              </p>
              <p className="text-xs text-[#57534e] dark:text-[#b5afa6]">
                Try searching for Newborn, Water Fast, GLP-1, BMR, TDEE, Keto, Gastric Bypass, or Subway.
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-[#1c1917] text-[#faf9f7] dark:bg-[#f5f3ef] dark:text-[#1c1917] hover:opacity-90 transition-opacity duration-150 cursor-pointer"
              >
                Show all {ALL_SEARCHABLE_TOOLS.length} calculators and guides
              </button>
            </div>
          )}

          {/* Footer Keyboard Hint */}
          <div className="px-4 py-2 bg-[#faf9f7] dark:bg-[#141210] border-t border-[#edeae3] dark:border-[#2a2623] flex items-center justify-between text-xs text-[#78716c] dark:text-[#8c857d]">
            <span className="flex items-center gap-2">
              <CornerDownLeft className="w-4 h-4" strokeWidth={1.75} />
              <span>Press Enter to jump directly to the selected calculator or guide</span>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="font-medium text-[#57534e] dark:text-[#b5afa6] hover:text-[#1c1917] dark:hover:text-[#f5f3ef] cursor-pointer"
            >
              Close (Esc)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
