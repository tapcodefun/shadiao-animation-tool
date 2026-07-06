import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';
import { AnimatedChar } from '../components/AnimatedChar';
import { Flash } from '../components/Flash';
import { Shake } from '../components/Shake';
import { RotateLoop } from '../components/RotateLoop';
import { Wiggle } from '../components/Wiggle';

interface MemeLoopProps {
  stickerSrc?: string;
  text1?: string;
  text2?: string;
  intensity?: number;
  speed?: number;
}

/**
 * 表情包循环模板
 * 场景：表情贴纸抖动 + 闪烁 + 文字交替变化
 */
export const MemeLoop: React.FC<MemeLoopProps> = ({
  stickerSrc,
  text1 = '我人傻了',
  text2 = '哈哈哈哈',
  intensity = 0.7,
  speed = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedDuration = (duration: number) => Math.round(duration / (0.5 + speed * 0.5));
  const cycleFrames = adjustedDuration(30);

  const cycle = Math.floor(frame / cycleFrames) % 2;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* 贴纸居中 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {stickerSrc && (
          <Sequence from={0} durationInFrames={adjustedDuration(120)}>
            <Shake intensity={intensity} duration={adjustedDuration(120)} frequency={6}>
              <Flash intensity={intensity * 0.5} duration={adjustedDuration(120)} blinks={8}>
                <img
                  src={stickerSrc}
                  style={{
                    width: 500,
                    height: 500,
                    objectFit: 'contain',
                  }}
                />
              </Flash>
            </Shake>
          </Sequence>
        )}
      </div>

      {/* 循环文字 */}
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <Wiggle intensity={intensity} duration={adjustedDuration(120)} loop>
          <p
            style={{
              fontSize: 60,
              fontWeight: 'bold',
              color: cycle === 0 ? '#ff6b6b' : '#ffd93d',
              textShadow: '0 0 20px rgba(255,107,107,0.5), 3px 3px 0 #000',
              fontFamily: 'system-ui, sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            {cycle === 0 ? text1 : text2}
          </p>
        </Wiggle>
      </div>
    </AbsoluteFill>
  );
};
