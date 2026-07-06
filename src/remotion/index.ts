import React from 'react';
import { Composition } from 'remotion';
import { ShaDiaoVideo } from './compositions/ShaDiaoVideo';
import { CharacterIntro } from './compositions/CharacterIntro';
import { MemeLoop } from './compositions/MemeLoop';
import { TextBubble } from './compositions/TextBubble';
import { DEFAULT_VIDEO_CONFIG } from './utils/presets';

/**
 * 所有 Composition 定义
 */
export const compositions = [
  {
    id: 'shadiao-video',
    component: ShaDiaoVideo,
    ...DEFAULT_VIDEO_CONFIG,
  },
  {
    id: 'character-intro',
    component: CharacterIntro,
    ...DEFAULT_VIDEO_CONFIG,
  },
  {
    id: 'meme-loop',
    component: MemeLoop,
    width: 1080,
    height: 1080,
    fps: 30,
    durationInFrames: 120,
  },
  {
    id: 'text-bubble',
    component: TextBubble,
    ...DEFAULT_VIDEO_CONFIG,
  },
];

/**
 * Remotion 视频组件
 * 根据 inputProps 动态选择模板
 */
export const RemotionVideo: React.FC<Record<string, unknown>> = (props) => {
  const templateId = props.templateId as string;
  const slots = props.slots as Record<string, string> | undefined;
  const animation = props.animation as Record<string, unknown> | undefined;

  const commonProps = {
    intensity: (animation?.intensity as number) || 0.7,
    speed: (animation?.speed as number) || 0.5,
  };

  const videoProps = {
    ...commonProps,
    backgroundSrc: slots?.bg ? `/${slots.bg}` : undefined,
    characterSrc: slots?.char ? `/${slots.char}` : undefined,
    character1Src: slots?.char1 ? `/${slots.char1}` : undefined,
    character2Src: slots?.char2 ? `/${slots.char2}` : undefined,
    stickerSrc: slots?.sticker ? `/${slots.sticker}` : undefined,
    text: slots?.text,
    text1: slots?.text1,
    text2: slots?.text2,
    name: slots?.name,
    tag: slots?.tag,
  };

  switch (templateId) {
    case 'shadiao-video':
      return React.createElement(ShaDiaoVideo, videoProps);
    case 'character-intro':
      return React.createElement(CharacterIntro, videoProps);
    case 'meme-loop':
      return React.createElement(MemeLoop, videoProps);
    case 'text-bubble':
      return React.createElement(TextBubble, videoProps);
    default:
      return React.createElement(ShaDiaoVideo, commonProps);
  }
};
