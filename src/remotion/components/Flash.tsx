import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface FlashProps {
  children: React.ReactNode;
  startFrame?: number;
  duration?: number;
  intensity?: number;
  /** 闪烁次数 */
  blinks?: number;
  colors?: string[];
}

/**
 * 闪烁/变色效果
 * 物体快速闪烁或变换颜色，适用于强调/魔性循环
 */
export const Flash: React.FC<FlashProps> = ({
  children,
  startFrame = 0,
  duration = 20,
  intensity = 0.7,
  blinks = 3,
  colors,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame > duration) {
    return <>{children}</>;
  }

  const blinkDuration = duration / blinks;
  const blinkProgress = (localFrame % blinkDuration) / blinkDuration;
  const isOn = blinkProgress < 0.5;

  const opacity = isOn ? 1 : 0.2 + (1 - intensity) * 0.5;

  let filter = '';
  if (colors && colors.length > 0) {
    const colorIndex = Math.floor(localFrame / blinkDuration) % colors.length;
    const hueRotate = localFrame * 5;
    filter = `hue-rotate(${hueRotate}deg) saturate(${1 + intensity})`;
  } else {
    const brightness = isOn ? 1 + intensity * 0.5 : 0.5;
    filter = `brightness(${brightness})`;
  }

  return (
    <div
      style={{
        opacity,
        filter,
      }}
    >
      {children}
    </div>
  );
};
