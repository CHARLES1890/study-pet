import type { ReactNode } from 'react';
import type { ViewTab } from '../types';

const tabs: { key: ViewTab; label: string }[] = [
  { key: 'timer', label: '专注' },
  { key: 'todo', label: '待办' },
  { key: 'reminder', label: '提醒' },
  { key: 'quotes', label: '语录' },
  { key: 'stats', label: '统计' },
  { key: 'settings', label: '设置' },
];

interface SettingsPanelProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onClose: () => void;
  children: ReactNode;
}

export default function SettingsPanel({ activeTab, onTabChange, onClose, children }: SettingsPanelProps) {
  return (
    <div className="panel-overlay">
      <div className="panel-header">
        <span className="panel-title">伴学助手</span>
        <button className="panel-close" onClick={onClose}>×</button>
      </div>
      <div className="panel-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={activeTab === t.key ? 'active' : ''}
            onClick={() => onTabChange(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="panel-content">{children}</div>
    </div>
  );
}
