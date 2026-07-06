import { registerRoot } from 'remotion';
import { RemotionVideo, compositions } from './index';
import React from 'react';
import { Composition } from 'remotion';

/**
 * Remotion 根组件
 * 注册所有 Composition 供 Remotion Studio 使用
 */
const Root: React.FC = () => {
  return (
    <>
      {compositions.map((comp) => (
        <Composition
          key={comp.id}
          id={comp.id}
          component={comp.component}
          width={comp.width}
          height={comp.height}
          fps={comp.fps}
          durationInFrames={comp.durationInFrames}
        />
      ))}
      <Composition
        id="dynamic-video"
        component={RemotionVideo}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={150}
        defaultProps={{
          templateId: 'shadiao-video',
          intensity: 0.7,
          speed: 0.5,
        }}
      />
    </>
  );
};

registerRoot(Root);
