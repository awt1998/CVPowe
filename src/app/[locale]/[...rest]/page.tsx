import { notFound } from 'next/navigation';

/**
 * Catch-all for unmatched paths under a valid locale (e.g. /ar/builder before
 * that route exists). Triggers the localized, styled `not-found.tsx` instead of
 * Next.js's default unstyled 404. This is the recommended next-intl pattern.
 */
export default function CatchAllPage() {
  notFound();
}
