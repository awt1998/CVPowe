'use client';

import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/** Always-visible reassurance that data stays on-device. */
export function PrivacyBadge() {
  const t = useTranslations('privacy');
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="cursor-default gap-1.5 py-1">
            <ShieldCheck className="size-3.5 text-success" />
            {t('badge')}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>{t('tooltip')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
