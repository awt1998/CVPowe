import { describe, it, expect } from 'vitest';
import {
  BackupParseError,
  createBackup,
  importBackup,
  parseBackup,
  serializeBackup,
} from '../serialization';
import * as ops from '../operations';
import { createEmptyResumeData } from '../factory';

function seededData() {
  let data = createEmptyResumeData();
  data = ops.createResume(data, { title: 'One' }).data;
  data = ops.createResume(data, { title: 'Two' }).data;
  return data;
}

describe('serialization', () => {
  it('round-trips export -> import (replace)', () => {
    const json = serializeBackup(seededData());
    const imported = importBackup(createEmptyResumeData(), json, 'replace');

    expect(imported.order).toHaveLength(2);
    expect(imported.resumes[imported.order[0]!]!.meta.title).toBe('One');
    expect(imported.activeResumeId).toBe(imported.order[0]);
  });

  it('throws BackupParseError on invalid JSON', () => {
    expect(() => parseBackup('{ not valid json')).toThrow(BackupParseError);
  });

  it('throws BackupParseError on schema mismatch', () => {
    expect(() => parseBackup({ kind: 'nope' })).toThrow(BackupParseError);
  });

  it('merge appends imported resumes with fresh, collision-free ids', () => {
    const data = seededData();
    const backup = createBackup(data);
    const merged = importBackup(data, backup, 'merge');

    expect(merged.order).toHaveLength(4);
    expect(new Set(merged.order).size).toBe(4);
  });
});
