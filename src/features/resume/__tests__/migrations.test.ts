import { describe, it, expect } from 'vitest';
import { runMigrations } from '../migrations';
import { RESUME_SCHEMA_VERSION } from '../constants';

describe('runMigrations', () => {
  it('migrates legacy v0 array-shaped resumes into the v1 record shape', () => {
    const legacy = { resumes: [{ id: 'a', meta: { title: 'A' } }, { id: 'b' }] };
    const migrated = runMigrations(legacy, 0);

    expect(migrated.schemaVersion).toBe(RESUME_SCHEMA_VERSION);
    expect(migrated.order).toEqual(['a', 'b']);
    expect(migrated.resumes['a']).toBeDefined();
    expect(migrated.activeResumeId).toBe('a');
  });

  it('returns empty data for non-object input', () => {
    const migrated = runMigrations(null, 0);
    expect(migrated.order).toEqual([]);
    expect(migrated.resumes).toEqual({});
    expect(migrated.activeResumeId).toBeNull();
  });

  it('leaves already-current data structurally intact', () => {
    const current = {
      schemaVersion: RESUME_SCHEMA_VERSION,
      resumes: { a: { id: 'a' } },
      order: ['a'],
      activeResumeId: 'a',
    };
    const migrated = runMigrations(current, RESUME_SCHEMA_VERSION);
    expect(migrated.order).toEqual(['a']);
    expect(migrated.activeResumeId).toBe('a');
    expect(migrated.schemaVersion).toBe(RESUME_SCHEMA_VERSION);
  });
});
