import { useEffect, useRef, useState } from 'react';
import type { TimerSession } from '../types';
import { sendNotification } from '../utils/storage';

interface TimerProps {
  sessions: TimerSession[];
  onUpdate: (sessions: TimerSession[]) => void;
}

const presets = [15, 25, 45, 60, 90];

export default function Timer({ sessions, onUpdate }: TimerProps) {
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            completeTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [running]);

  const completeTimer = () => {
    setRunning(false);
    const completed: TimerSession = {
      id: Date.now().toString(),
      duration: minutes,
      completedAt: new Date().toISOString(),
    };
    onUpdate([completed, ...sessions]);
    sendNotification('专注完成', `恭喜你完成了 ${minutes} 分钟专注学习！`);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const selectPreset = (m: number) => {
    if (running) return;
    setMinutes(m);
    setSecondsLeft(m * 60);
  };

  const totalFocusMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div>
      <h3>专注计时</h3>
      <div className="timer-display">{formatTime(secondsLeft)}</div>
      <div className="timer-controls">
        <button className="primary" onClick={() => setRunning(!running)}>
          {running ? '暂停' : secondsLeft === minutes * 60 ? '开始' : '继续'}
        </button>
        <button className="small" onClick={() => { setRunning(false); setSecondsLeft(minutes * 60); }}>
          重置
        </button>
      </div>
      <div className="timer-presets">
        {presets.map((m) => (
          <button
            key={m}
            className={minutes === m && !running ? 'active' : ''}
            onClick={() => selectPreset(m)}
          >
            {m}分
          </button>
        ))}
      </div>
      <div className="timer-total">累计专注 {totalFocusMinutes} 分钟</div>
    </div>
  );
}
