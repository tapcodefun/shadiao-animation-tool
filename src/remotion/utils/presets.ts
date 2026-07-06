/**
 * 预设动画配置
 */
export interface AnimationPreset {
  name: string;
  duration: number;
  easing: 'easeInOut' | 'easeOut' | 'easeIn' | 'linear' | 'spring';
  intensity: number;
  description: string;
}

export const PRESETS: Record<string, AnimationPreset> = {
  gentle: {
    name: '温和',
    duration: 30,
    easing: 'easeOut',
    intensity: 0.5,
    description: '柔和的出场动画',
  },
  normal: {
    name: '标准',
    duration: 20,
    easing: 'easeInOut',
    intensity: 0.7,
    description: '标准的动画效果',
  },
  exaggerated: {
    name: '夸张',
    duration: 15,
    easing: 'spring',
    intensity: 1.0,
    description: '沙雕风格夸张动画',
  },
  crazy: {
    name: '疯狂',
    duration: 10,
    easing: 'spring',
    intensity: 1.5,
    description: '极致夸张的魔性动画',
  },
  slowDramatic: {
    name: '慢速戏剧',
    duration: 45,
    easing: 'easeInOut',
    intensity: 0.8,
    description: '慢动作戏剧效果',
  },
};

/** 默认视频配置 */
export const DEFAULT_VIDEO_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 150, // 5 秒
};
