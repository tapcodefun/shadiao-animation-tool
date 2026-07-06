'use client';

import React, { useState } from 'react';
import { Button } from '@/components/shared/Button';
import { Toast } from '@/components/shared/Toast';
import { Download, FileVideo } from 'lucide-react';

export default function ExportPage() {
  const [projectData, setProjectData] = useState<Record<string, unknown> | null>(null);
  const [resolution, setResolution] = useState('1920x1080');
  const [fps, setFps] = useState(30);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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

  const resolutions = [
    { value: '1920x1080', label: '1080p (1920×1080)', w: 1920, h: 1080 },
    { value: '1280x720', label: '720p (1280×720)', w: 1280, h: 720 },
    { value: '1080x1080', label: '正方形 (1080×1080)', w: 1080, h: 1080 },
    { value: '1080x1920', label: '竖屏 (1080×1920)', w: 1080, h: 1920 },
  ];

  async function handleExport() {
    if (!projectData) return;

    setExporting(true);
    setProgress(0);

    try {
      // 模拟渲染进度
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      const selectedRes = resolutions.find((r) => r.value === resolution)!;

      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectData,
          resolution: { width: selectedRes.w, height: selectedRes.h },
          fps,
        }),
      });

      clearInterval(progressInterval);

      const data = await res.json();

      if (res.ok) {
        setProgress(100);
        setToast({ message: '视频导出成功！', type: 'success' });
      } else {
        setToast({ message: data.error || '导出失败', type: 'error' });
      }
    } catch {
      setToast({ message: '导出失败', type: 'error' });
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">导出视频</h2>
          <p className="text-zinc-400 mt-1 text-sm">配置导出参数，渲染 MP4 视频</p>
        </div>
      </div>

      {projectData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 导出参数 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-5">
            <h3 className="text-lg font-semibold text-white">⚙️ 导出参数</h3>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">分辨率</label>
              <div className="grid grid-cols-2 gap-2">
                {resolutions.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setResolution(r.value)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      resolution === r.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                帧率：<span className="text-purple-400">{fps} FPS</span>
              </label>
              <div className="flex gap-2">
                {[24, 30, 60].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFps(f)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      fps === f
                        ? 'bg-purple-600 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                    }`}
                  >
                    {f} FPS
                  </button>
                ))}
              </div>
            </div>

            {/* 渲染进度 */}
            {exporting && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-zinc-300">渲染进度</label>
                  <span className="text-sm text-purple-400">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <Button onClick={handleExport} loading={exporting} size="lg" className="w-full">
              <Download size={18} />
              {exporting ? '渲染中...' : '开始导出'}
            </Button>
          </div>

          {/* 项目信息 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">📋 项目信息</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">名称</span>
                <span className="text-white">{projectData.name as string}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">模板</span>
                <span className="text-white">{projectData.templateId as string}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">风格</span>
                <span className="text-white">
                  {projectData.style === 'shadiao-classic' ? '经典沙雕' : '萌系沙雕'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">动画强度</span>
                <span className="text-white">
                  {projectData.animation
                    ? `${Math.round(((projectData.animation as Record<string, unknown>).intensity as number || 0) * 100)}%`
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">动画速度</span>
                <span className="text-white">
                  {projectData.animation
                    ? `${Math.round(((projectData.animation as Record<string, unknown>).speed as number || 0) * 100)}%`
                    : '-'}
                </span>
              </div>

              {/* 素材列表 */}
              {(projectData.slots as Record<string, string>) && (
                <div className="pt-3 border-t border-zinc-800">
                  <h4 className="text-sm font-medium text-zinc-400 mb-2">素材列表</h4>
                  {Object.entries(projectData.slots as Record<string, string>)
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs py-1">
                        <span className="text-zinc-500">{k}</span>
                        <span className="text-zinc-300 truncate ml-4 max-w-[200px]">{String(v)}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-zinc-500">
          <FileVideo size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">还没有项目</p>
          <p className="text-sm mt-1">请先在「动画编辑器」中创建项目</p>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          visible={true}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
