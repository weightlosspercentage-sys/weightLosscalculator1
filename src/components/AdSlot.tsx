import { useEffect, useRef } from 'react';
import { AD_CLIENT } from '../config/adsense';

interface AdSlotProps {
  /** AdSense ad unit id (data-ad-slot). */
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  layoutKey?: string;
  className?: string;
  /** Reserved height in px so the ad never shifts the page (CLS). */
  minHeight?: number;
  label?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** Only these hosts serve ads. Previews, localhost and staging render nothing. */
const ALLOWED_HOSTS = ['weightlosspercentage.com', 'weightlosspercentage.pages.dev'];

const isAdServingHost = (): boolean => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  return ALLOWED_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
};

/**
 * Lazy, responsive AdSense unit.
 * - Pushes to adsbygoogle exactly once, when the slot scrolls into view
 * - Reserves vertical space to prevent layout shift
 * - Renders nothing outside production domains
 */
export const AdSlot = ({
  slot,
  format = 'auto',
  layoutKey,
  className = '',
  minHeight = 280,
  label = 'Advertisement',
}: AdSlotProps) => {
  const insRef = useRef<HTMLModElement | null>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!isAdServingHost()) return;
    const el = insRef.current;
    if (!el) return;

    const push = () => {
      if (pushed.current) return;
      pushed.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        /* AdSense script not ready yet */
      }
    };

    if (typeof IntersectionObserver === 'undefined') {
      push();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            push();
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!isAdServingHost()) return null;

  return (
    <div className={`w-full ${className}`}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <ins
        ref={insRef}
        className="adsbygoogle block w-full"
        style={{ display: 'block', minHeight: `${minHeight}px` }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
      />
    </div>
  );
};
