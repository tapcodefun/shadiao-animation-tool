import { Easing } from 'remotion';

/**
 * 扩展缓动函数集
 */

/** 弹性缓出（更强的回弹） */
function elasticOut(t: number): number {
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -10 * t) * Math.sin((t - 1) * (2 * Math.PI) / 0.3) + 1;
}

/** 弹跳缓出 */
function bounceOut(t: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  else return n1 * (t -= 2.625 / d1) * t + 0.984375;
}

/**
 * 根据名称获取缓动函数
 */
export function getEasing(
  name: 'easeInOut' | 'easeOut' | 'easeIn' | 'linear' | 'spring'
): (t: number) => number {
  switch (name) {
    case 'easeInOut':
      return Easing.ease;
    case 'easeOut':
      return Easing.ease;
    case 'easeIn':
      return Easing.ease;
    case 'linear':
      return (t: number) => t;
    case 'spring':
      return elasticOut;
    default:
      return (t: number) => t;
  }
}

/**
 * 计算动画值（通用）
 * frame: 当前帧
 * startFrame: 动画起始帧
 * duration: 动画持续帧数
 * easing: 缓动函数名
 * outputRange: [起始值, 结束值]
 * intensity: 强度 0-1
 */
export function calcAnimationValue(
  frame: number,
  startFrame: number,
  duration: number,
  easingName: 'easeInOut' | 'easeOut' | 'easeIn' | 'linear' | 'spring',
  outputRange: [number, number],
  intensity: number = 1
): number {
  const progress = (frame - startFrame) / duration;
  const clampedProgress = Math.max(0, Math.min(1, progress));

  const easingFn = getEasing(easingName);
  const easedProgress = easingFn(clampedProgress);

  const range = outputRange[1] - outputRange[0];
  const adjustedRange = range * intensity;

  return outputRange[0] + easedProgress * adjustedRange;
}
