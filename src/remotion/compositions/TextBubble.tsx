import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';
import { Background } from '../components/Background';
import { AnimatedChar } from '../components/AnimatedChar';
import { SpeechBubble } from '../components/SpeechBubble';

interface TextBubbleProps {
  backgroundSrc?: string;
  characterSrc?: string;
  text?: string;
  intensity?: number;
  speed?: number;
}

/**
 * 对话气泡模板
 * 场景：背景 + 人物轻微扭动 + 对话气泡打字机效果
 */
export const TextBubble: React.FC<TextBubbleProps> = ({
  backgroundSrc,
  characterSrc,
  text = '今天天气真好，我们去吃火锅吧！吃完再去唱K！',
  intensity = 0.7,
  speed = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedDuration = (duration: number) => Math.round(duration / (0.5 + speed * 0.5));

  // 对话持续帧数（根据文字长度）
  const textDuration = Math.max(adjustedDuration(60), text.length * 2);

  return (
    <AbsoluteFill style={{ backgroundColor: '#16213e' }}>
      {/* 背景 */}
      {backgroundSrc && <Background src={backgroundSrc} effect="parallax" intensity={intensity * 0.3} />}

      {/* 人物 */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {characterSrc && (
          <AnimatedChar
            src={characterSrc}
            animation="wiggle"
            intensity={intensity * 0.5}
            width={350}
            height={500}
          />
        )}
      </div>

      {/* 对话气泡 */}
      {text && (
        <Sequence from={adjustedDuration(15)} durationInFrames={textDuration}>
          <SpeechBubble
            text={text}
            position="center"
            intensity={intensity}
            duration={textDuration}
          />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
