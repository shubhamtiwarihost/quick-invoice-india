import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  format?: 'leaderboard' | 'rectangle' | 'horizontal';
  className?: string;
  adSlot?: string;
  adClient?: string;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({
  format = 'horizontal',
  className = '',
  adSlot,
  adClient,
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const isAdsenseEnabled = Boolean(adClient && adSlot);

  useEffect(() => {
    if (isAdsenseEnabled && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense display error:', err);
      }
    }
  }, [isAdsenseEnabled]);

  // Height configurations to guarantee zero Cumulative Layout Shift (CLS)
  const getFormatStyles = () => {
    switch (format) {
      case 'leaderboard':
        return 'min-h-[90px] sm:min-h-[100px] max-w-[728px]';
      case 'rectangle':
        return 'min-h-[250px] sm:min-h-[280px] max-w-[336px]';
      case 'horizontal':
      default:
        return 'min-h-[90px] max-w-4xl';
    }
  };

  return (
    <aside
      aria-label="Advertisement"
      className={`w-full mx-auto my-6 flex flex-col items-center justify-center transition-all ${className}`}
    >
      {/* Required AdSense Policy Label */}
      <div className="w-full flex justify-center mb-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 select-none">
          Advertisement
        </span>
      </div>

      <div
        className={`w-full ${getFormatStyles()} rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-2 flex items-center justify-center overflow-hidden transition-colors hover:border-slate-300`}
      >
        {isAdsenseEnabled ? (
          <ins
            ref={adRef}
            className="adsbygoogle block w-full"
            style={{ display: 'block' }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          /* Subtle CLS-safe monetization placeholder */
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
              <span>Responsive Ad Space</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {format === 'leaderboard'
                ? 'Standard 728×90 Leaderboard / 320×50 Mobile'
                : format === 'rectangle'
                ? 'Medium 300×250 / 336×280 Rectangle'
                : 'High-Impact Display Banner'}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
