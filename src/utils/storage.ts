import { WeightLogEntry, ChallengeParticipant, Unit } from '../types';
import { convertToLbs } from './calculations';

const LOG_STORAGE_KEY = 'wl_calc_entries_v1';
const PARTICIPANTS_STORAGE_KEY = 'wl_calc_participants_v1';

export const INITIAL_DEMO_LOGS: WeightLogEntry[] = [
  { id: '1', date: '2026-08-01', weight: 215, unit: 'lbs', weightInLbs: 215, notes: 'Baseline weigh-in (morning, fasted)' },
  { id: '2', date: '2026-08-15', weight: 211.4, unit: 'lbs', weightInLbs: 211.4, notes: 'Week 2 check-in. Cut back on sugary drinks.' },
  { id: '3', date: '2026-09-01', weight: 207.8, unit: 'lbs', weightInLbs: 207.8, notes: '1 Month! Hit 5,000 steps daily average.' },
  { id: '4', date: '2026-09-15', weight: 204.2, unit: 'lbs', weightInLbs: 204.2, notes: 'Hit 5% clinical landmark! Blood pressure improved.' },
  { id: '5', date: '2026-10-01', weight: 200.5, unit: 'lbs', weightInLbs: 200.5, notes: 'Broke through the 205 lb plateau.' },
  { id: '6', date: '2026-10-15', weight: 197.0, unit: 'lbs', weightInLbs: 197.0, notes: 'Under 200 lbs milestone! Celebrated with new gym shoes.' },
  { id: '7', date: '2026-11-01', weight: 193.5, unit: 'lbs', weightInLbs: 193.5, notes: 'Current weigh-in. Reached 10% milestone (21.5 lbs lost)!' },
];

export const INITIAL_DEMO_PARTICIPANTS: ChallengeParticipant[] = [
  { id: 'p1', name: 'Sarah M.', startWeight: 176, currentWeight: 158.4, unit: 'lbs', avatarColor: 'bg-emerald-500' },
  { id: 'p2', name: 'David K.', startWeight: 242, currentWeight: 220.2, unit: 'lbs', avatarColor: 'bg-sky-500' },
  { id: 'p3', name: 'Elena R.', startWeight: 154, currentWeight: 141.6, unit: 'lbs', avatarColor: 'bg-purple-500' },
  { id: 'p4', name: 'Marcus T.', startWeight: 210, currentWeight: 197.4, unit: 'lbs', avatarColor: 'bg-amber-500' },
  { id: 'p5', name: 'Chloe B.', startWeight: 165, currentWeight: 158.4, unit: 'lbs', avatarColor: 'bg-rose-500' },
];

export function getStoredLogs(): WeightLogEntry[] {
  try {
    const raw = localStorage.getItem(LOG_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read logs from localStorage', e);
  }
  return INITIAL_DEMO_LOGS;
}

export function saveStoredLogs(logs: WeightLogEntry[]): void {
  try {
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save logs to localStorage', e);
  }
}

export function getStoredParticipants(): ChallengeParticipant[] {
  try {
    const raw = localStorage.getItem(PARTICIPANTS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read participants from localStorage', e);
  }
  return INITIAL_DEMO_PARTICIPANTS;
}

export function saveStoredParticipants(participants: ChallengeParticipant[]): void {
  try {
    localStorage.setItem(PARTICIPANTS_STORAGE_KEY, JSON.stringify(participants));
  } catch (e) {
    console.error('Failed to save participants to localStorage', e);
  }
}
