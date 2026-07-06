import React from 'react';
import { useCurrentFrame } from 'remotion';

interface RotateLoopProps {
  children: React.ReactNode;
  startFrame?: number;
  intensity?: number;
  /** 每秒旋转圈数 */
  speed?: number;
  loop?: boolean;
}

/**
 * 旋转循环
 * 物体持续旋转，适用于魔性洗脑场景
 */
export const RotateLoop: React.FC<RotateLoopProps> = ({
  children,
  startFrame = 0,
  intensity = 0.7,
  speed = 0.5,
  loop = true,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0) return <>{children}</>;

  // 带弹性的旋转
  const baseRotation = localFrame * 6 * speed * intensity;
  const wobble = Math.sin(localFrame * 0.2) * 3 * intensity;
  const rotation = baseRotation + wobble;

  return (
    <div
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {children}
    </div>
  );
};
