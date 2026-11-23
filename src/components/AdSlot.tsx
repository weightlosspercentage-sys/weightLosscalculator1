import React, { useEffect, useRef, useState } from 'react';
import { AD_CLIENT } from '../config/adsense';

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
    __loadAdSenseLazy?: () => void;
  }
}

export type AdSlotVariant = 'display' | 'in-article';

export interface AdSlotProps {
  slot: string;
  variant?: AdSlotVariant;
  className?: string;
}

/**
 * Checks whether the current browser hostname is an approved production domain
 * (ends with weightlosspercentage.com or pages.dev), skipping localhost and preview iframes.
 */
export function isProductionAdDomain(): boolean {
  if (typeof window === 'undefined' || !window.location) {
    return false;
  }
  const hostname = window.location.hostname.toLowerCase();
  return (
    hostname.endsWith('weightlosspercentage.com') ||
    hostname.endsWith('pages.dev')
  );
}

/**
 * Ensures the external AdSense script is injected lazily on demand when an ad unit
 * enters or approaches the viewport, avoiding render-blocking requests during FCP/LCP.
 */
export function ensureAdSenseScriptLoaded(): void {
  if (typeof window === 'undefined' || !isProductionAdDomain()) return;
  if (typeof window.__loadAdSenseLazy === 'function') {
    window.__loadAdSenseLazy();
    return;
  }
  const existing = document.querySelector(
    `script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]`
  );
  if (!existing) {
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`;
    document.head.appendChild(script);
  }
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slot,
  variant = 'display',
  className = ''
}) => {
  const [isProdDomain] = useState<boolean>(() => isProductionAdDomain());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const insRef = useRef<HTMLModElement | null>(null);
  const hasPushedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isProdDomain) return;
    const containerEl = containerRef.current;
    const insEl = insRef.current;
    if (!containerEl || !insEl) return;

    // Guard against duplicate pushes and React StrictMode double-mount
    if (
      hasPushedRef.current ||
      insEl.dataset.adPushed === 'true' ||
      insEl.getAttribute('data-adsbygoogle-status')
    ) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          observer.disconnect();

          if (
            hasPushedRef.current ||
            insEl.dataset.adPushed === 'true' ||
            insEl.getAttribute('data-adsbygoogle-status')
          ) {
            return;
          }

          hasPushedRef.current = true;
          insEl.dataset.adPushed = 'true';

          try {
            ensureAdSenseScriptLoaded();
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch {
            // Suppress errors if an ad blocker prevents adsbygoogle initialization
          }
          break;
        }
      },
      {
        rootMargin: '200px 0px',
        threshold: 0.01
      }
    );

    observer.observe(containerEl);

    return () => {
      observer.disconnect();
    };
  }, [isProdDomain, slot]);

  if (!isProdDomain) {
    return null;
  }

  return (
    <aside
      ref={containerRef}
      aria-label="Advertisement"
      className={`my-6 w-full max-w-7xl mx-auto clear-both ${className}`.trim()}
    >
      <div className="text-[11px] text-[#78716c] dark:text-[#8c857d] text-center mb-2 select-none font-normal">
        Advertisement
      </div>
      <div className="w-full min-h-[280px] md:min-h-[250px] flex items-center justify-center overflow-hidden rounded-xl bg-[#f3f1ed]/60 dark:bg-[#25221f]/50">
        <ins
          ref={insRef}
          className="adsbygoogle block w-full"
          data-ad-client={AD_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
          {...(variant === 'in-article' ? { 'data-ad-layout': 'in-article' } : {})}
        />
      </div>
    </aside>
  );
};

export default AdSlot;
