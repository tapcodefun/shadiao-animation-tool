'use client';

import React from 'react';
import { Button } from '@/components/shared/Button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export default function PreviewPage() {
  const [projectData, setProjectData] = React.useState<Record<string, unknown> | null>(null);

  React.useEffect(() => {
    const data = localStorage.getItem('current-project');
    if (data) {
      try {
        setProjectData(JSON.parse(data));
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">预览</h2>
          <p className="text-zinc-400 mt-1 text-sm">
            在 Remotion Studio 中预览动画效果
          </p>
        </div>
      </div>

      {projectData ? (
        <div className="space-y-4">
          {/* 项目信息 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-3">📋 当前项目</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-zinc-500">名称：</span>
                <span className="text-white ml-2">{projectData.name as string}</span>
              </div>
              <div>
                <span className="text-zinc-500">风格：</span>
                <span className="text-white ml-2">
                  {projectData.style === 'shadiao-classic' ? '经典沙雕' : '萌系沙雕'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500">模板：</span>
                <span className="text-white ml-2">{projectData.templateId as string}</span>
              </div>
            </div>
          </div>

          {/* Remotion Studio 预览区 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="bg-zinc-800 px-4 py-2 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Remotion Studio</span>
              <span className="text-xs text-zinc-600">需要启动 remotion studio</span>
            </div>
            <div className="aspect-video bg-zinc-950 flex items-center justify-center">
              <div className="text-center text-zinc-600">
                <Play size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">预览区</p>
                <p className="text-xs mt-1">
                  运行 <code className="text-purple-400 bg-zinc-800 px-1.5 py-0.5 rounded text-xs">npx remotion studio</code> 启动预览
                </p>
              </div>
            </div>

            {/* 播放控制 */}
            <div className="bg-zinc-800 px-4 py-3 flex items-center justify-center gap-3">
              <button className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
                <SkipBack size={18} />
              </button>
              <button className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors">
                <Play size={20} />
              </button>
              <button className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
                <SkipForward size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-zinc-500">
          <Play size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">还没有项目</p>
          <p className="text-sm mt-1">请先在「动画编辑器」中创建项目</p>
        </div>
      )}
    </div>
  );
}
