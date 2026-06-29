import type { AppData } from '../types';

export const defaultQuotes: string[] = [
  '再坚持一下，你比你想象的更强大。',
  '每一个专注的当下，都是未来的礼物。',
  '慢慢来，比较快。',
  '今天的努力，是明天的底气。',
  '专注一件事，做到极致。',
  '学习很苦，但坚持很酷。',
  '你今天的日积月累，早晚会成为别人的望尘莫及。',
  '哪怕每天进步一点点，也很了不起。',
  '放下手机，世界会更清晰。',
  '相信自己，你可以做到。',
  '时间看得见。',
  '不要假装努力，结果不会陪你演戏。',
  '星光不问赶路人，时光不负有心人。',
  '现在的拼搏，是为了将来的自由。',
  '把焦虑转化为行动。',
  '种一棵树最好的时间是十年前，其次是现在。',
  '你的未来藏在你现在的努力里。',
  '熬过这段日子，你会感谢现在的自己。',
  '不积跬步，无以至千里。',
  '保持热爱，奔赴山海。',
];

export const defaultTodos = [
  { id: 't1', title: '完成算法题 5 道', deadline: '2026-06-30', completed: false, createdAt: '2026-06-29' },
  { id: 't2', title: '复习 React Hooks 核心原理', deadline: '2026-06-30', completed: false, createdAt: '2026-06-29' },
  { id: 't3', title: '整理今日学习笔记', deadline: '2026-06-29', completed: false, createdAt: '2026-06-29' },
  { id: 't4', title: '背 30 个英语单词', deadline: '2026-06-30', completed: true, createdAt: '2026-06-29' },
];

export const defaultReminders = [
  { id: 'r1', title: '每日 21:00 复盘当日学习内容', hour: 21, minute: 0, repeatDays: [0, 1, 2, 3, 4, 5, 6], enabled: true },
];

export const defaultSettings = {
  alwaysOnTop: true,
  opacity: 1,
  petImagePath: null,
  petName: '小伴',
};

export function getDefaultData(): AppData {
  return {
    todos: defaultTodos,
    timerSessions: [],
    reminders: defaultReminders,
    quotes: defaultQuotes,
    customQuotes: [],
    settings: defaultSettings,
  };
}
