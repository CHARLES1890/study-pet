import type { Todo, TimerSession } from '../types';

interface StatsProps {
  sessions: TimerSession[];
  todos: Todo[];
}

export default function Stats({ sessions, todos }: StatsProps) {
  const today = new Date().toISOString().split('T')[0];
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const todayMinutes = sessions
    .filter((s) => s.completedAt.startsWith(today))
    .reduce((sum, s) => sum + s.duration, 0);

  const weekMinutes = sessions
    .filter((s) => s.completedAt >= `${sevenDaysAgo}T00:00:00.000Z`)
    .reduce((sum, s) => sum + s.duration, 0);

  const completedTodos = todos.filter((t) => t.completed).length;
  const totalTodos = todos.length;
  const completionRate = totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);

  return (
    <div>
      <h3>数据统计</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="value">{todayMinutes}</div>
          <div className="label">今日专注(分)</div>
        </div>
        <div className="stat-card">
          <div className="value">{weekMinutes}</div>
          <div className="label">近7天专注(分)</div>
        </div>
        <div className="stat-card">
          <div className="value">{sessions.length}</div>
          <div className="label">专注次数</div>
        </div>
        <div className="stat-card">
          <div className="value">{completionRate}%</div>
          <div className="label">待办完成率</div>
        </div>
      </div>
      <p className="hint">数据自动保存到本地，可随时备份导出。</p>
    </div>
  );
}
