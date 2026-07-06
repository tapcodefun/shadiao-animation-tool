import React from 'react';
import { useCurrentFrame, interpolate, Img, staticFile } from 'remotion';

interface BackgroundProps {
  src: string;
  effect?: 'none' | 'zoom' | 'pan' | 'parallax';
  intensity?: number;
}

/**
 * 背景组件
 * 支持缩放、平移、视差效果
 */
export const Background: React.FC<BackgroundProps> = ({
  src,
  effect = 'none',
  intensity = 0.5,
}) => {
  const frame = useCurrentFrame();

  let transform = '';

  switch (effect) {
    case 'zoom':
      const zoomScale = 1 + (frame / 150) * 0.15 * intensity;
      transform = `scale(${zoomScale})`;
      break;
    case 'pan':
      const panX = Math.sin(frame * 0.01) * 5 * intensity;
      const panY = Math.cos(frame * 0.008) * 3 * intensity;
      transform = `translate(${panX}%, ${panY}%) scale(1.1)`;
      break;
    case 'parallax':
      const paraScale = 1 + intensity * 0.2;
      const paraX = frame * 0.05 * intensity;
      transform = `scale(${paraScale}) translateX(${paraX}%)`;
      break;
    default:
      transform = 'scale(1)';
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}
    >
      <img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform,
          transformOrigin: 'center center',
        }}
      />
      {/* 暗色遮罩 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.15)',
        }}
      />
    </div>
  );
};
