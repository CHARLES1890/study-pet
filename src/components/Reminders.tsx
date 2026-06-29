import { useState } from 'react';
import type { Reminder } from '../types';

interface RemindersProps {
  reminders: Reminder[];
  onUpdate: (reminders: Reminder[]) => void;
}

const dayLabels = ['日', '一', '二', '三', '四', '五', '六'];

export default function Reminders({ reminders, onUpdate }: RemindersProps) {
  const [title, setTitle] = useState('');
  const [hour, setHour] = useState(21);
  const [minute, setMinute] = useState(0);
  const [repeatDays, setRepeatDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  const toggleDay = (d: number) => {
    setRepeatDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()
    );
  };

  const addReminder = () => {
    if (!title.trim()) return;
    const newReminder: Reminder = {
      id: Date.now().toString(),
      title: title.trim(),
      hour,
      minute,
      repeatDays,
      enabled: true,
    };
    onUpdate([...reminders, newReminder]);
    setTitle('');
  };

  const toggleEnabled = (id: string) => {
    onUpdate(reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const deleteReminder = (id: string) => {
    onUpdate(reminders.filter((r) => r.id !== id));
  };

  return (
    <div>
      <h3>定时提醒</h3>
      <div className="reminder-form">
        <input
          type="text"
          placeholder="提醒内容，如「20:00 刷题」"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="row">
          <input
            type="number"
            min={0}
            max={23}
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
          />
          <span style={{ paddingTop: 8 }}>:</span>
          <input
            type="number"
            min={0}
            max={59}
            value={minute}
            onChange={(e) => setMinute(Number(e.target.value))}
          />
        </div>
        <div className="day-tags">
          {dayLabels.map((label, idx) => (
            <button
              key={idx}
              className={repeatDays.includes(idx) ? 'active' : ''}
              onClick={() => toggleDay(idx)}
            >
              {label}
            </button>
          ))}
        </div>
        <button className="primary" onClick={addReminder}>添加提醒</button>
      </div>
      <div>
        {reminders.map((r) => (
          <div key={r.id} className="reminder-item">
            <div>
              <div>{r.title}</div>
              <small style={{ color: '#999' }}>
                {String(r.hour).padStart(2, '0')}:{String(r.minute).padStart(2, '0')}
                {' '}
                {r.repeatDays.length === 7 ? '每天' : r.repeatDays.map((d) => dayLabels[d]).join(' ')}
              </small>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="small" onClick={() => toggleEnabled(r.id)}>
                {r.enabled ? '禁用' : '启用'}
              </button>
              <button className="danger" onClick={() => deleteReminder(r.id)}>删除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
