import * as React from 'react';
import { cn } from '@/lib/utils';

/** Centered max-width content wrapper used across pages. */
export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-6xl px-6', className)} {...props} />;
}
