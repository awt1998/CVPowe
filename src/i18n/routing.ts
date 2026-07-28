import { defineRouting } from 'next-intl/routing';

/**
 * Central locale configuration.
 * Add a locale here + a matching file in `/messages` to support a new language.
 */
export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];

/**
 * Type guard for validating an unknown value against the configured locales.
 * Replaces next-intl v4's `hasLocale` so we stay compatible with next-intl v3.
 */
export function isValidLocale(value: unknown): value is Locale {
  return (
    typeof value === 'string' && (routing.locales as readonly string[]).includes(value)
  );
}

/** Locales that render right-to-left. */
export const RTL_LOCALES: readonly Locale[] = ['ar'];

export function getDirection(locale: string): 'rtl' | 'ltr' {
  return RTL_LOCALES.includes(locale as Locale) ? 'rtl' : 'ltr';
}
