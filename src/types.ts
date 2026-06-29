export interface Todo {
  id: string;
  title: string;
  deadline: string;
  completed: boolean;
  createdAt: string;
}

export interface TimerSession {
  id: string;
  duration: number; // minutes
  completedAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  hour: number;
  minute: number;
  repeatDays: number[];
  enabled: boolean;
}

export interface AppSettings {
  alwaysOnTop: boolean;
  opacity: number;
  petImagePath: string | null;
  petName: string;
}

export interface AppData {
  todos: Todo[];
  timerSessions: TimerSession[];
  reminders: Reminder[];
  quotes: string[];
  customQuotes: string[];
  settings: AppSettings;
}

export type ViewTab = 'timer' | 'todo' | 'reminder' | 'quotes' | 'stats' | 'settings';
