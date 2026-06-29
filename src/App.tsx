import { useEffect, useState, useCallback } from 'react';
import Pet from './components/Pet';
import PetImage from './components/PetImage';
import SettingsPanel from './components/SettingsPanel';
import Timer from './components/Timer';
import TodoList from './components/TodoList';
import Reminders from './components/Reminders';
import Quotes from './components/Quotes';
import Stats from './components/Stats';
import { useStorage } from './hooks/useStorage';
import { backupData, restoreData, setAlwaysOnTop, syncReminders, uploadPetImage } from './utils/storage';
import type { ViewTab } from './types';

function App() {
  const { data, setData, loaded } = useStorage();
  const [activeTab, setActiveTab] = useState<ViewTab>('timer');
  const [showPanel, setShowPanel] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (data?.settings) {
      setAlwaysOnTop(data.settings.alwaysOnTop);
    }
  }, [data?.settings.alwaysOnTop]);

  useEffect(() => {
    if (data?.reminders) {
      syncReminders(data.reminders);
    }
  }, [data?.reminders]);

  const handleShowSettings = useCallback(() => {
    setActiveTab('settings');
    setShowPanel(true);
  }, []);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__showSettings = handleShowSettings;
  }, [handleShowSettings]);

  useEffect(() => {
    const handler = (e: Event) => {
      const path = (e as CustomEvent).detail as string;
      setData((d) => ({ ...d, settings: { ...d.settings, petImagePath: path } }));
    };
    window.addEventListener('pet-image-uploaded', handler);
    return () => window.removeEventListener('pet-image-uploaded', handler);
  }, [setData]);

  const handlePetClick = () => {
    if (dragging) return;
    setShowPanel((s) => !s);
  };

  if (!loaded || !data) {
    return <div className="loading">加载中…</div>;
  }

  return (
    <div className="app" style={{ opacity: data.settings.opacity }}>
      <Pet
        settings={data.settings}
        quotes={[...data.quotes, ...data.customQuotes]}
        onClick={handlePetClick}
        onOpenSettings={() => {
          setActiveTab('settings');
          setShowPanel(true);
        }}
        onToggleTop={(v) => setData((d) => ({ ...d, settings: { ...d.settings, alwaysOnTop: v } }))}
        onOpacityChange={(v) => setData((d) => ({ ...d, settings: { ...d.settings, opacity: v } }))}
        onDraggingChange={setDragging}
        onImageError={() => {
          setData((d) => ({ ...d, settings: { ...d.settings, petImagePath: '' } }));
          console.warn('Pet image failed to load, falling back to default');
        }}
      />
      {showPanel && (
        <SettingsPanel
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClose={() => setShowPanel(false)}
        >
          {activeTab === 'timer' && (
            <Timer
              sessions={data.timerSessions}
              onUpdate={(sessions) => setData((d) => ({ ...d, timerSessions: sessions }))}
            />
          )}
          {activeTab === 'todo' && (
            <TodoList
              todos={data.todos}
              onUpdate={(todos) => setData((d) => ({ ...d, todos }))}
            />
          )}
          {activeTab === 'reminder' && (
            <Reminders
              reminders={data.reminders}
              onUpdate={(reminders) => setData((d) => ({ ...d, reminders }))}
            />
          )}
          {activeTab === 'quotes' && (
            <Quotes
              customQuotes={data.customQuotes}
              onUpdate={(customQuotes) => setData((d) => ({ ...d, customQuotes }))}
            />
          )}
          {activeTab === 'stats' && (
            <Stats sessions={data.timerSessions} todos={data.todos} />
          )}
          {activeTab === 'settings' && (
            <div className="settings-tab">
              <h3>个性化</h3>
              <label>
                桌宠名称
                <input
                  type="text"
                  value={data.settings.petName}
                  onChange={(e) =>
                    setData((d) => ({ ...d, settings: { ...d.settings, petName: e.target.value } }))
                  }
                />
              </label>

              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>桌宠形象预览</p>
                <div style={{
                  width: 100, height: 100,
                  borderRadius: 12,
                  border: '2px dashed #ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                  overflow: 'hidden',
                  background: '#f9f9f9'
                }}>
                  {data.settings.petImagePath ? (
                    <PetImage
                      path={data.settings.petImagePath}
                      onError={() => {
                        setData((d) => ({ ...d, settings: { ...d.settings, petImagePath: '' } }));
                        console.warn('Settings preview image failed to load, falling back to default');
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: 48 }}>🐱</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button
                    className="primary"
                    onClick={async () => {
                      const path = await uploadPetImage();
                      if (path) {
                        setData((d) => ({ ...d, settings: { ...d.settings, petImagePath: path } }));
                        alert('形象已更换');
                      }
                    }}
                  >
                    上传新形象
                  </button>
                  {data.settings.petImagePath && (
                    <button
                      className="small"
                      onClick={() => {
                        setData((d) => ({ ...d, settings: { ...d.settings, petImagePath: '' } }));
                        alert('已恢复默认形象');
                      }}
                    >
                      恢复默认
                    </button>
                  )}
                </div>
                <p className="hint" style={{ marginTop: 6 }}>
                  支持 PNG / JPG / JPEG，也可右键桌宠上传
                </p>
              </div>

              <label style={{ marginTop: 14 }}>
                透明度 {Math.round(data.settings.opacity * 100)}%
                <input
                  type="range"
                  min={0.5}
                  max={1}
                  step={0.05}
                  value={data.settings.opacity}
                  onChange={(e) =>
                    setData((d) => ({ ...d, settings: { ...d.settings, opacity: Number(e.target.value) } }))
                  }
                />
              </label>
              <label>
                窗口置顶
                <input
                  type="checkbox"
                  checked={data.settings.alwaysOnTop}
                  onChange={(e) =>
                    setData((d) => ({ ...d, settings: { ...d.settings, alwaysOnTop: e.target.checked } }))
                  }
                />
              </label>
              <h3 style={{ marginTop: 16 }}>数据管理</h3>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="primary" onClick={async () => { await backupData(); alert('备份成功'); }}>
                  备份数据
                </button>
                <button
                  className="small"
                  onClick={async () => {
                    const d = await restoreData();
                    setData(() => d);
                    alert('恢复成功');
                  }}
                >
                  恢复数据
                </button>
              </div>
            </div>
          )}
        </SettingsPanel>
      )}
    </div>
  );
}

export default App;
