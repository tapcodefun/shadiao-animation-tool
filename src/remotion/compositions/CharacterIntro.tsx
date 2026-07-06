import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';
import { Background } from '../components/Background';
import { AnimatedChar } from '../components/AnimatedChar';
import { ZoomIn } from '../components/ZoomIn';
import { BounceIn } from '../components/BounceIn';

interface CharacterIntroProps {
  backgroundSrc?: string;
  characterSrc?: string;
  name?: string;
  tag?: string;
  intensity?: number;
  speed?: number;
}

/**
 * 人物介绍模板
 * 场景：背景 + 人物弹跳入场 + 名字缩放展示 + 标签
 */
export const CharacterIntro: React.FC<CharacterIntroProps> = ({
  backgroundSrc,
  characterSrc,
  name = '神秘角色',
  tag = '搞笑担当',
  intensity = 0.7,
  speed = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedDuration = (duration: number) => Math.round(duration / (0.5 + speed * 0.5));

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f0f23' }}>
      {/* 背景 */}
      {backgroundSrc && <Background src={backgroundSrc} effect="pan" intensity={intensity * 0.3} />}

      {/* 人物居中 */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {characterSrc && (
          <Sequence from={0} durationInFrames={adjustedDuration(60)}>
            <BounceIn intensity={intensity} duration={adjustedDuration(25)}>
              <img
                src={characterSrc}
                style={{
                  width: 450,
                  height: 650,
                  objectFit: 'contain',
                }}
              />
            </BounceIn>
          </Sequence>
        )}
      </div>

      {/* 名字 */}
      {name && (
        <Sequence from={adjustedDuration(25)} durationInFrames={adjustedDuration(50)}>
          <div
            style={{
              position: 'absolute',
              top: '15%',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <ZoomIn intensity={intensity} duration={adjustedDuration(20)}>
              <h1
                style={{
                  fontSize: 72,
                  fontWeight: 'bold',
                  color: '#ffffff',
                  textShadow: '0 4px 20px rgba(168, 85, 247, 0.6), 2px 2px 0 #000',
                  fontFamily: 'system-ui, sans-serif',
                  letterSpacing: 8,
                }}
              >
                {name}
              </h1>
            </ZoomIn>
          </div>
        </Sequence>
      )}

      {/* 标签 */}
      {tag && (
        <Sequence from={adjustedDuration(45)} durationInFrames={adjustedDuration(40)}>
          <div
            style={{
              position: 'absolute',
              top: '32%',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <ZoomIn intensity={intensity} duration={adjustedDuration(15)}>
              <span
                style={{
                  fontSize: 32,
                  color: '#fbbf24',
                  background: 'rgba(0,0,0,0.7)',
                  padding: '8px 32px',
                  borderRadius: 30,
                  border: '2px solid rgba(251, 191, 36, 0.5)',
                }}
              >
                {tag}
              </span>
            </ZoomIn>
          </div>
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
