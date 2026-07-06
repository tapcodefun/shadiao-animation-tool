import React from 'react';
import { useCurrentFrame, spring } from 'remotion';

interface ZoomInProps {
  children: React.ReactNode;
  startFrame?: number;
  duration?: number;
  intensity?: number;
}

/**
 * 缩放入场 + 弹性效果
 * 物体从远处放大弹入
 */
export const ZoomIn: React.FC<ZoomInProps> = ({
  children,
  startFrame = 0,
  duration = 20,
  intensity = 0.7,
}) => {
  const frame = useCurrentFrame();

  const zoomProgress = spring({
    frame: frame - startFrame,
    fps: 30,
    config: {
      mass: 1,
      damping: 10 + (1 - intensity) * 4,
      stiffness: 70 + intensity * 50,
    },
  });

  return (
    <div
      style={{
        transform: `scale(${zoomProgress})`,
        opacity: zoomProgress,
      }}
    >
      {children}
    </div>
  );
};
