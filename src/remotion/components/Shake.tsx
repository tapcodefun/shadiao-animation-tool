import React from 'react';
import { useCurrentFrame } from 'remotion';

interface ShakeProps {
  children: React.ReactNode;
  startFrame?: number;
  duration?: number;
  intensity?: number;
  /** 每秒震动次数 */
  frequency?: number;
}

/**
 * 震动效果
 * 物体左右快速抖动，适用于生气/震惊场景
 */
export const Shake: React.FC<ShakeProps> = ({
  children,
  startFrame = 0,
  duration = 15,
  intensity = 0.7,
  frequency = 8,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame > duration) {
    return <>{children}</>;
  }

  const progress = localFrame / duration;
  // 逐渐衰减
  const decay = 1 - progress;
  const shakeAmount = Math.sin(localFrame * frequency * 0.5) * 15 * intensity * decay;

  return (
    <div
      style={{
        transform: `translateX(${shakeAmount}px)`,
      }}
    >
      {children}
    </div>
  );
};
