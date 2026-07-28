import { BACKUP_KIND, RESUME_SCHEMA_VERSION } from './constants';
import { validateBackup } from './schema';
import { mergeResumes, replaceAllResumes } from './operations';
import type { BackupFile, ImportMode, Resume, ResumeData } from './types';

/**
 * JSON backup import/export. Backups are the user's portable, on-device copy of
 * all their resumes — the only way data moves between devices (still no server).
 */

/** Build a backup object from the current store data. */
export function createBackup(data: ResumeData): BackupFile {
  const resumes = data.order
    .map((id) => data.resumes[id])
    .filter((resume): resume is Resume => Boolean(resume));

  return {
    kind: BACKUP_KIND,
    schemaVersion: RESUME_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    activeResumeId: data.activeResumeId,
    resumes,
  };
}

/** Serialize a backup to a pretty JSON string ready to download. */
export function serializeBackup(data: ResumeData): string {
  return JSON.stringify(createBackup(data), null, 2);
}

/** Thrown when a backup can't be parsed or doesn't match the expected schema. */
export class BackupParseError extends Error {
  readonly issues?: unknown;
  constructor(message: string, issues?: unknown) {
    super(message);
    this.name = 'BackupParseError';
    this.issues = issues;
  }
}

/** Parse and validate a backup from a JSON string (or an already-parsed value). */
export function parseBackup(input: string | unknown): BackupFile {
  let json: unknown = input;
  if (typeof input === 'string') {
    try {
      json = JSON.parse(input);
    } catch {
      throw new BackupParseError('Backup is not valid JSON.');
    }
  }

  const result = validateBackup(json);
  if (!result.success) {
    throw new BackupParseError('Backup does not match the expected format.', result.error.issues);
  }
  return result.data;
}

/** Apply a validated backup to existing data. */
export function applyBackup(
  data: ResumeData,
  backup: BackupFile,
  mode: ImportMode,
): ResumeData {
  return mode === 'replace'
    ? replaceAllResumes(data, backup.resumes)
    : mergeResumes(data, backup.resumes);
}

/** Parse, validate, and apply a backup in one step. Throws `BackupParseError` on bad input. */
export function importBackup(
  data: ResumeData,
  input: string | unknown,
  mode: ImportMode = 'replace',
): ResumeData {
  return applyBackup(data, parseBackup(input), mode);
}
