import { describe, it, expect } from 'vitest';
import { createResumeStore } from '../store';
import { createMemoryStorage } from '../persistence';
import { createExperience } from '../factory';

let counter = 0;
function freshStore() {
  counter += 1;
  return createResumeStore({ storage: createMemoryStorage(), storageKey: `test:${counter}` });
}

describe('resume store', () => {
  it('creates a resume and sets it active', () => {
    const store = freshStore();
    const id = store.getState().createResume({ title: 'Dev' });
    const state = store.getState();

    expect(state.order).toEqual([id]);
    expect(state.activeResumeId).toBe(id);
    expect(state.getActiveResume()?.meta.title).toBe('Dev');
  });

  it('supports unlimited resumes, duplication, and deletion', () => {
    const store = freshStore();
    const ids = Array.from({ length: 30 }, () => store.getState().createResume());
    expect(store.getState().order).toHaveLength(30);

    const dupId = store.getState().duplicateResume(ids[0]!);
    expect(dupId).toBeTruthy();
    expect(store.getState().order).toHaveLength(31);

    store.getState().deleteResume(ids[0]!);
    expect(store.getState().order).toHaveLength(30);
    expect(store.getState().resumes[ids[0]!]).toBeUndefined();
  });

  it('edits basics and array items through the store', () => {
    const store = freshStore();
    const id = store.getState().createResume();

    store.getState().updateBasics(id, { fullName: 'Sara' });
    expect(store.getState().resumes[id]!.basics.fullName).toBe('Sara');

    const exp = createExperience({ company: 'ACME' });
    store.getState().addArrayItem(id, 'experience', exp);
    expect(store.getState().resumes[id]!.sections.experience[0]!.company).toBe('ACME');

    store.getState().updateArrayItem(id, 'experience', exp.id, { role: 'Engineer' });
    expect(store.getState().resumes[id]!.sections.experience[0]!.role).toBe('Engineer');

    store.getState().removeArrayItem(id, 'experience', exp.id);
    expect(store.getState().resumes[id]!.sections.experience).toHaveLength(0);
  });

  it('exports and imports JSON backups', () => {
    const source = freshStore();
    source.getState().createResume({ title: 'One' });
    source.getState().createResume({ title: 'Two' });
    const backupStr = source.getState().exportBackupString();

    const target = freshStore();
    target.getState().importBackup(backupStr, 'replace');
    expect(target.getState().order).toHaveLength(2);
  });

  it('persists to storage and rehydrates a new instance', () => {
    const storage = createMemoryStorage();
    const key = 'test:persist';
    const store = createResumeStore({ storage, storageKey: key });
    const id = store.getState().createResume({ title: 'Persisted' });

    expect(storage.getItem(key)).toContain(id);

    const rehydrated = createResumeStore({ storage, storageKey: key });
    expect(rehydrated.getState().order).toContain(id);
  });

  it('reset clears all data', () => {
    const store = freshStore();
    store.getState().createResume();
    store.getState().reset();
    expect(store.getState().order).toHaveLength(0);
    expect(store.getState().activeResumeId).toBeNull();
  });
});
