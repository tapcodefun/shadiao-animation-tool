import React from 'react';
import { useCurrentFrame, interpolate, spring } from 'remotion';
import { calcAnimationValue } from '../utils/easing';

interface BounceInProps {
  children: React.ReactNode;
  startFrame?: number;
  duration?: number;
  intensity?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * 弹跳入场动画
 * 物体从指定方向弹跳进入画面
 */
export const BounceIn: React.FC<BounceInProps> = ({
  children,
  startFrame = 0,
  duration = 20,
  intensity = 0.7,
  direction = 'down',
}) => {
  const frame = useCurrentFrame();

  const bounceProgress = spring({
    frame: frame - startFrame,
    fps: 30,
    config: {
      mass: 1,
      damping: 10 + (1 - intensity) * 5,
      stiffness: 80 + intensity * 60,
    },
  });

  const getTransform = (): string => {
    const offset = (1 - bounceProgress) * 100 * intensity;
    switch (direction) {
      case 'up':
        return `translateY(${offset}px)`;
      case 'down':
        return `translateY(${-offset}px)`;
      case 'left':
        return `translateX(${offset}px)`;
      case 'right':
        return `translateX(${-offset}px)`;
      default:
        return `translateY(${-offset}px)`;
    }
  };

  const scale = interpolate(bounceProgress, [0, 0.6, 1], [0.3, 1.15, 1]);

  return (
    <div
      style={{
        transform: `${getTransform()} scale(${scale})`,
        opacity: bounceProgress,
      }}
    >
      {children}
    </div>
  );
};
