import React from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'responsive';
  className?: string;
}

/**
 * AdSlot component designed strictly to comply with Google AdSense policies:
 * 1. Clear "ADVERTISEMENT" label to prevent deceptive placement.
 * 2. Adequate spacing from interactive buttons and controls to prevent accidental clicks.
 * 3. Responsive container sizing matching standard IAB display formats.
 * 4. Graceful placeholder display in development/preview mode before live AdSense client ID is attached.
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  slotId = 'default-slot',
  format = 'responsive',
  className = '',
}) => {
  return (
    <div className={`w-full my-6 flex flex-col items-center justify-center ${className}`}>
      {/* Policy-compliant Ad label */}
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 select-none">
        Advertisement
      </span>

      {/* Ad Container */}
      <div
        id={`ad-container-${slotId}`}
        className={`w-full max-w-4xl rounded-xl border border-slate-800/80 bg-slate-900/30 flex flex-col items-center justify-center p-4 min-h-[90px] text-center transition-all ${
          format === 'horizontal'
            ? 'h-[90px]'
            : format === 'rectangle'
            ? 'h-[250px] max-w-sm'
            : 'min-h-[100px] py-6'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
          <span className="text-xs font-medium text-slate-400">Sponsored Ad Space</span>
          <span className="text-[11px] text-slate-600 max-w-md">
            Relevant, high-quality advertisements help keep this free temporary email service fast and accessible for everyone.
          </span>
        </div>
      </div>
    </div>
  );
};
