import type { Resume, ResumeData } from './types';

/**
 * Pure selectors over the store state. Keep derived reads here so components and
 * future features share one definition instead of re-deriving state locally.
 */

export const selectResumeCount = (state: ResumeData): number => state.order.length;

export const selectHasResumes = (state: ResumeData): boolean => state.order.length > 0;

/** Resumes in their stored display order (skips any dangling ids defensively). */
export const selectOrderedResumes = (state: ResumeData): Resume[] =>
  state.order
    .map((id) => state.resumes[id])
    .filter((resume): resume is Resume => Boolean(resume));

export const selectActiveResume = (state: ResumeData): Resume | null =>
  state.activeResumeId ? (state.resumes[state.activeResumeId] ?? null) : null;

export const selectResumeById =
  (id: string) =>
  (state: ResumeData): Resume | null =>
    state.resumes[id] ?? null;
