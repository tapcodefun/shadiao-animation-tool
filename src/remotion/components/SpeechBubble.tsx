import React from 'react';
import { useCurrentFrame, spring } from 'remotion';

interface SpeechBubbleProps {
  text: string;
  startFrame?: number;
  duration?: number;
  intensity?: number;
  position?: 'left' | 'right' | 'center';
  color?: string;
}

/**
 * 对话气泡组件
 * 气泡弹出 + 文字显示
 */
export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  text,
  startFrame = 0,
  duration = 40,
  intensity = 0.7,
  position = 'center',
  color = '#ffffff',
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0) return null;

  // 气泡弹入
  const bubbleScale = spring({
    frame: localFrame,
    fps: 30,
    config: {
      mass: 1.2,
      damping: 12,
      stiffness: 100,
    },
  });

  // 文字逐个显示
  const charsPerFrame = 1.5;
  const visibleChars = Math.floor(localFrame * charsPerFrame);
  const displayText = text.slice(0, visibleChars);

  const positionStyles: Record<string, React.CSSProperties> = {
    left: { left: 0, alignItems: 'flex-start' },
    right: { right: 0, alignItems: 'flex-end' },
    center: { left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 40,
        display: 'flex',
        flexDirection: 'column',
        ...positionStyles[position],
      }}
    >
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          color,
          padding: '16px 24px',
          borderRadius: 20,
          fontSize: 36,
          fontWeight: 'bold',
          maxWidth: 600,
          transform: `scale(${bubbleScale})`,
          transformOrigin: position === 'left' ? 'bottom left' : position === 'right' ? 'bottom right' : 'bottom center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          border: '3px solid rgba(255,255,255,0.2)',
        }}
      >
        {displayText}
        {localFrame < text.length / charsPerFrame && (
          <span style={{ animation: 'blink 0.5s infinite' }}>|</span>
        )}
      </div>
    </div>
  );
};
