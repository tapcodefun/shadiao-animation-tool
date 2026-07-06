import React from 'react';
import { useCurrentFrame } from 'remotion';

interface WiggleProps {
  children: React.ReactNode;
  startFrame?: number;
  duration?: number;
  intensity?: number;
  loop?: boolean;
}

/**
 * 扭动变形效果
 * 物体扭来扭去，适用于嘚瑟/搞笑场景
 */
export const Wiggle: React.FC<WiggleProps> = ({
  children,
  startFrame = 0,
  duration = 30,
  intensity = 0.7,
  loop = false,
}) => {
  const frame = useCurrentFrame();
  let localFrame = frame - startFrame;

  if (localFrame < 0) return <>{children}</>;
  if (loop && localFrame > duration) {
    localFrame = localFrame % duration;
  }
  if (!loop && localFrame > duration) return <>{children}</>;

  const rotateAmount = Math.sin(localFrame * 0.3) * 8 * intensity;
  const scaleX = 1 + Math.sin(localFrame * 0.4) * 0.1 * intensity;
  const scaleY = 1 + Math.cos(localFrame * 0.4) * 0.1 * intensity;
  const translateY = Math.sin(localFrame * 0.25) * 5 * intensity;

  return (
    <div
      style={{
        transform: `rotate(${rotateAmount}deg) scaleX(${scaleX}) scaleY(${scaleY}) translateY(${translateY}px)`,
      }}
    >
      {children}
    </div>
  );
};
