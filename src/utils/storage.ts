import { invoke } from '@tauri-apps/api/core';
import type { AppData, Reminder } from '../types';
import { getDefaultData } from './defaultData';

const DATA_FILE = 'study-pet-data.json';

export async function loadData(): Promise<AppData> {
  try {
    const raw = await invoke<string>('read_app_data', { file_name: DATA_FILE });
    const parsed = raw ? JSON.parse(raw) : {};
    return mergeWithDefaults(parsed);
  } catch (e) {
    console.error('Failed to load data:', e);
    return getDefaultData();
  }
}

export async function saveData(data: AppData): Promise<void> {
  try {
    await invoke('write_app_data', { file_name: DATA_FILE, content: JSON.stringify(data, null, 2) });
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

export async function backupData(): Promise<void> {
  await invoke('backup_data', { file_name: DATA_FILE });
}

export async function restoreData(): Promise<AppData> {
  await invoke('restore_data', { file_name: DATA_FILE });
  return loadData();
}

export async function uploadPetImage(): Promise<string | null> {
  try {
    const path = await invoke<string>('upload_pet_image');
    return path;
  } catch (e) {
    console.error('Failed to upload pet image:', e);
    return null;
  }
}

export async function sendNotification(title: string, body: string): Promise<void> {
  try {
    await invoke('send_notification', { title, body });
  } catch (e) {
    console.error('Failed to send notification:', e);
  }
}

export async function setAlwaysOnTop(value: boolean): Promise<void> {
  await invoke('set_always_on_top', { always_on_top: value });
}

export async function hideWindow(): Promise<void> {
  await invoke('hide_window');
}

export async function showWindow(): Promise<void> {
  await invoke('show_window');
}

export async function closeApp(): Promise<void> {
  await invoke('close_app');
}

export async function syncReminders(reminders: Reminder[]): Promise<void> {
  await invoke('sync_reminders', {
    reminders: reminders.map((r) => ({
      id: r.id,
      title: r.title,
      hour: r.hour,
      minute: r.minute,
      repeat_days: r.repeatDays,
      enabled: r.enabled,
    })),
  });
}

function mergeWithDefaults(data: Partial<AppData>): AppData {
  const defaults = getDefaultData();
  return {
    todos: data.todos ?? defaults.todos,
    timerSessions: data.timerSessions ?? defaults.timerSessions,
    reminders: data.reminders ?? defaults.reminders,
    quotes: data.quotes ?? defaults.quotes,
    customQuotes: data.customQuotes ?? defaults.customQuotes,
    settings: { ...defaults.settings, ...(data.settings || {}) },
  };
}
