import React from 'react';
import { useCurrentFrame, spring } from 'remotion';

interface SlideInProps {
  children: React.ReactNode;
  startFrame?: number;
  duration?: number;
  intensity?: number;
  direction?: 'left' | 'right' | 'top' | 'bottom';
}

/**
 * 滑入效果
 * 物体从画面边缘滑入
 */
export const SlideIn: React.FC<SlideInProps> = ({
  children,
  startFrame = 0,
  duration = 25,
  intensity = 0.7,
  direction = 'left',
}) => {
  const frame = useCurrentFrame();

  const slideProgress = spring({
    frame: frame - startFrame,
    fps: 30,
    config: {
      mass: 1,
      damping: 15 + (1 - intensity) * 3,
      stiffness: 60 + intensity * 40,
    },
  });

  const offset = (1 - slideProgress) * 500 * intensity;

  const transformMap: Record<string, string> = {
    left: `translateX(${-offset}px)`,
    right: `translateX(${offset}px)`,
    top: `translateY(${-offset}px)`,
    bottom: `translateY(${offset}px)`,
  };

  return (
    <div
      style={{
        transform: transformMap[direction],
        opacity: slideProgress,
      }}
    >
      {children}
    </div>
  );
};
