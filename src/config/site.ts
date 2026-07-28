/**
 * Static, non-sensitive site metadata. No secrets here — this app has none.
 */
export const siteConfig = {
  name: 'CVPower',
  shortDescription: 'Free, private, in-browser resume optimizer.',
  description:
    'CVPower is the best free, privacy-first resume optimization platform. Match your resume to any job, fix what matters, and export an ATS-safe PDF — entirely in your browser.',
  url: 'https://cv-powe.vercel.app',
  repository: 'https://github.com/awt1998/CVPower',
  author: 'CVPower contributors',
  keywords: [
    'resume',
    'cv',
    'ats',
    'resume optimizer',
    'job search',
    'privacy',
    'free',
    'open source',
  ],
} as const;

export type SiteConfig = typeof siteConfig;
