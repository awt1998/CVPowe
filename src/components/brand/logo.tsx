import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

/** CVPower brand mark: a rising-bar glyph inside a rounded square + wordmark. */
export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        aria-hidden
        className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M5 18V13" />
          <path d="M12 18V8" />
          <path d="M19 18V4" />
        </svg>
      </span>
      {showWordmark && (
        <span className="text-base font-semibold tracking-tight">{siteConfig.name}</span>
      )}
    </span>
  );
}
