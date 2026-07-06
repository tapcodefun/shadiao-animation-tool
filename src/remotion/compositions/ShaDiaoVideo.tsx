import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';
import { Background } from '../components/Background';
import { AnimatedChar } from '../components/AnimatedChar';
import { SpeechBubble } from '../components/SpeechBubble';
import { EmojiRain } from '../components/EmojiRain';
import { Shake } from '../components/Shake';

interface ShaDiaoVideoProps {
  backgroundSrc?: string;
  character1Src?: string;
  character2Src?: string;
  text1?: string;
  text2?: string;
  intensity?: number;
  speed?: number;
}

/**
 * 通用沙雕视频模板
 * 场景：背景 + 主角弹跳入场 + 对话 + 配角震动入场 + 表情雨
 */
export const ShaDiaoVideo: React.FC<ShaDiaoVideoProps> = ({
  backgroundSrc,
  character1Src,
  character2Src,
  text1 = '哈哈哈哈！',
  text2 = '这也太沙雕了吧！',
  intensity = 0.7,
  speed = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedDuration = (duration: number) => Math.round(duration / (0.5 + speed * 0.5));

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e' }}>
      {/* 背景 */}
      {backgroundSrc && <Background src={backgroundSrc} effect="zoom" intensity={intensity * 0.5} />}

      {/* 主角入场 */}
      <div
        style={{
          position: 'absolute',
          bottom: 50,
          left: '10%',
        }}
      >
        {character1Src && (
          <Sequence from={0} durationInFrames={adjustedDuration(90)}>
            <AnimatedChar
              src={character1Src}
              animation="bounceIn"
              intensity={intensity}
              width={350}
              height={500}
            />
          </Sequence>
        )}
      </div>

      {/* 配角入场 */}
      <div
        style={{
          position: 'absolute',
          bottom: 50,
          right: '10%',
        }}
      >
        {character2Src && (
          <Sequence from={adjustedDuration(30)} durationInFrames={adjustedDuration(90)}>
            <AnimatedChar
              src={character2Src}
              animation="bounceIn"
              intensity={intensity * 0.8}
              width={300}
              height={450}
            />
          </Sequence>
        )}
      </div>

      {/* 对话气泡 1 */}
      {text1 && (
        <Sequence from={adjustedDuration(20)} durationInFrames={adjustedDuration(60)}>
          <SpeechBubble
            text={text1}
            position="left"
            intensity={intensity}
          />
        </Sequence>
      )}

      {/* 对话气泡 2 */}
      {text2 && (
        <Sequence from={adjustedDuration(60)} durationInFrames={adjustedDuration(60)}>
          <SpeechBubble
            text={text2}
            position="right"
            intensity={intensity}
          />
        </Sequence>
      )}

      {/* 表情雨收尾 */}
      <Sequence from={adjustedDuration(100)} durationInFrames={adjustedDuration(50)}>
        <EmojiRain intensity={intensity} duration={adjustedDuration(50)} />
      </Sequence>
    </AbsoluteFill>
  );
};
