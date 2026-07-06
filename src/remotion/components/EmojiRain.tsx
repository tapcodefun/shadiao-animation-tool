import React from 'react';
import { useCurrentFrame } from 'remotion';

interface EmojiRainProps {
  emojis?: string[];
  startFrame?: number;
  duration?: number;
  intensity?: number;
  density?: number;
}

/**
 * 表情雨
 * 从画面上方掉落各种表情
 */
export const EmojiRain: React.FC<EmojiRainProps> = ({
  emojis = ['😂', '🤣', '💀', '🔥', '👏', '🎉', '😭', '😤'],
  startFrame = 0,
  duration = 60,
  intensity = 0.7,
  density = 15,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame > duration) return null;

  const drops = Array.from({ length: density }, (_, i) => {
    const emoji = emojis[i % emojis.length];
    const startX = (i / density) * 100 + (Math.sin(i * 3.7) * 10);
    const startY = -10;
    const speed = 1 + (i % 3) * 0.5 * intensity;
    const x = startX + Math.sin(localFrame * 0.05 + i) * 3;
    const y = startY + localFrame * speed * 2;
    const rotation = Math.sin(localFrame * 0.1 + i) * 30;
    const scale = 1 + (i % 3) * 0.5;
    const opacity = y > 90 ? Math.max(0, 1 - (y - 90) / 10) : 1;

    return { emoji, x, y, rotation, scale, opacity };
  });

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {drops.map((drop, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${drop.x}%`,
            top: `${drop.y}%`,
            fontSize: `${24 + (i % 4) * 12}px`,
            transform: `rotate(${drop.rotation}deg) scale(${drop.scale})`,
            opacity: drop.opacity,
          }}
        >
          {drop.emoji}
        </div>
      ))}
    </div>
  );
};
