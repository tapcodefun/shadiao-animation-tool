import React from 'react';
import { Img } from 'remotion';
import { BounceIn } from './BounceIn';
import { Wiggle } from './Wiggle';

interface AnimatedCharProps {
  src: string;
  animation?: 'bounceIn' | 'wiggle' | 'none';
  startFrame?: number;
  intensity?: number;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

/**
 * 动画人物组件
 * 封装人物图片 + 动画效果
 */
export const AnimatedChar: React.FC<AnimatedCharProps> = ({
  src,
  animation = 'bounceIn',
  startFrame = 0,
  intensity = 0.7,
  width = 400,
  height = 600,
  style,
}) => {
  const imgElement = (
    <img
      src={src}
      style={{
        width,
        height,
        objectFit: 'contain',
        ...style,
      }}
    />
  );

  switch (animation) {
    case 'bounceIn':
      return (
        <BounceIn startFrame={startFrame} intensity={intensity}>
          {imgElement}
        </BounceIn>
      );
    case 'wiggle':
      return (
        <Wiggle startFrame={startFrame} intensity={intensity} loop>
          {imgElement}
        </Wiggle>
      );
    default:
      return imgElement;
  }
};
