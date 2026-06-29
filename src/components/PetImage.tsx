import { useState } from 'react';
import { convertFileSrc } from '@tauri-apps/api/core';

interface PetImageProps {
  path: string;
  onError: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function PetImage({ path, onError, className, style }: PetImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !path) {
    return null;
  }

  return (
    <img
      src={`${convertFileSrc(path)}?t=${Date.now()}`}
      alt="pet"
      className={className}
      style={style}
      onError={() => {
        console.error('Failed to load pet image:', path);
        setFailed(true);
        onError();
      }}
    />
  );
}
