import { describe, it, expect } from 'vitest';
import { validateResume, validateBackup } from '../schema';
import { createResume, createEmptyResumeData } from '../factory';
import { createBackup } from '../serialization';

describe('resume schema', () => {
  it('accepts a freshly created resume', () => {
    const resume = createResume({ title: 'Developer' });
    expect(validateResume(resume).success).toBe(true);
  });

  it('accepts an empty-string email', () => {
    const resume = createResume();
    resume.basics.email = '';
    expect(validateResume(resume).success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const bad = { ...createResume(), basics: { fullName: '', links: [], email: 'not-an-email' } };
    expect(validateResume(bad).success).toBe(false);
  });

  it('rejects missing required fields', () => {
    expect(validateResume({ id: 'x' }).success).toBe(false);
  });

  it('validates a backup built from data', () => {
    const backup = createBackup(createEmptyResumeData());
    expect(validateBackup(backup).success).toBe(true);
  });

  it('rejects a backup with the wrong kind', () => {
    expect(validateBackup({ kind: 'other', schemaVersion: 1, exportedAt: 'x', resumes: [] }).success).toBe(
      false,
    );
  });
});
