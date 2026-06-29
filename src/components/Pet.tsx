import { useEffect, useRef, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import type { AppSettings } from '../types';
import { closeApp, hideWindow, uploadPetImage } from '../utils/storage';
import PetImage from './PetImage';

interface PetProps {
  settings: AppSettings;
  quotes: string[];
  onClick: () => void;
  onOpenSettings: () => void;
  onToggleTop: (value: boolean) => void;
  onOpacityChange: (value: number) => void;
  onDraggingChange: (dragging: boolean) => void;
  onImageError?: () => void;
}

interface PetProps {
  settings: AppSettings;
  quotes: string[];
  onClick: () => void;
  onOpenSettings: () => void;
  onToggleTop: (value: boolean) => void;
  onOpacityChange: (value: number) => void;
  onDraggingChange: (dragging: boolean) => void;
}

export default function Pet({
  settings,
  quotes,
  onClick,
  onOpenSettings,
  onToggleTop,
  onOpacityChange,
  onDraggingChange,
  onImageError,
}: PetProps) {
  const [bubble, setBubble] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!bubble) return;
    const t = setTimeout(() => setBubble(null), 3000);
    return () => clearTimeout(t);
  }, [bubble]);

  const handleMouseDown = async (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragStart.current = { x: e.clientX, y: e.clientY };
    onDraggingChange(false);
    const win = getCurrentWindow();
    await win.startDragging();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!dragStart.current) return;
    const dx = Math.abs(e.clientX - dragStart.current.x);
    const dy = Math.abs(e.clientY - dragStart.current.y);
    dragStart.current = null;
    if (dx < 4 && dy < 4) {
      showRandomQuote();
      onClick();
    } else {
      onDraggingChange(true);
      setTimeout(() => onDraggingChange(false), 50);
    }
  };

  const showRandomQuote = () => {
    if (quotes.length === 0) return;
    const idx = Math.floor(Math.random() * quotes.length);
    setBubble(quotes[idx]);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  const handleUpload = async () => {
    const path = await uploadPetImage();
    if (path) {
      // App.tsx will reload settings via data change if we update settings here,
      // but this component only reads settings. We'll emit a custom event.
      window.dispatchEvent(new CustomEvent('pet-image-uploaded', { detail: path }));
    }
    setMenuPos(null);
  };

  return (
    <div
      className="pet-container"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
    >
      {bubble && <div className="bubble">{bubble}</div>}
      <div className="pet-avatar">
        {settings.petImagePath ? (
          <PetImage
            path={settings.petImagePath}
            onError={() => onImageError?.()}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          '🐱'
        )}
      </div>
      <div className="pet-name">{settings.petName || '小伴'}</div>
      {menuPos && (
        <div
          className="context-menu"
          style={{ left: menuPos.x, top: menuPos.y }}
          onMouseLeave={() => setMenuPos(null)}
        >
          <button onClick={() => { onOpenSettings(); setMenuPos(null); }}>打开设置</button>
          <button onClick={() => { onToggleTop(!settings.alwaysOnTop); setMenuPos(null); }}>
            {settings.alwaysOnTop ? '取消置顶' : '窗口置顶'}
          </button>
          <button onClick={handleUpload}>上传桌宠形象</button>
          <button onClick={() => { onOpacityChange(Math.max(0.5, settings.opacity - 0.1)); setMenuPos(null); }}>
            降低透明度
          </button>
          <button onClick={() => { onOpacityChange(Math.min(1, settings.opacity + 0.1)); setMenuPos(null); }}>
            提高透明度
          </button>
          <button onClick={() => { hideWindow(); setMenuPos(null); }}>最小化到托盘</button>
          <button className="danger" onClick={() => { closeApp(); }}>退出</button>
        </div>
      )}
    </div>
  );
}
