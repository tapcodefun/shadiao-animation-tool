'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { Film, Key, Image, PenTool, Play, Download, ArrowRight } from 'lucide-react';

const QUICK_START_STEPS = [
  {
    icon: Key,
    title: '1. 添加 API Key',
    desc: '配置大模型 API Key，支持阿里万相、智谱等平台',
    href: '/keys',
  },
  {
    icon: Image,
    title: '2. 生成素材',
    desc: '用 AI 生成沙雕风格的背景、人物和表情包',
    href: '/assets',
  },
  {
    icon: PenTool,
    title: '3. 编辑动画',
    desc: '选择模板，拖入素材，调整参数',
    href: '/editor',
  },
  {
    icon: Play,
    title: '4. 预览',
    desc: '在 Remotion Studio 中预览动画效果',
    href: '/preview',
  },
  {
    icon: Download,
    title: '5. 导出视频',
    desc: '渲染并导出 MP4 视频文件',
    href: '/export',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* 欢迎区域 */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-white mb-3">
          🎬 沙雕动画开发工具
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          基于 <span className="text-purple-400 font-semibold">Remotion</span> +{' '}
          <span className="text-purple-400 font-semibold">大模型 AI</span> 的沙雕动画创作平台
          — 选择模板、AI 生成素材、一键导出视频
        </p>
      </div>

      {/* 快速开始 */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">🚀 快速开始</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_START_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                key={step.title}
                href={step.href}
                className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/50 hover:bg-zinc-800/50 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                    <Icon size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{step.title}</h3>
                    <p className="text-zinc-500 text-xs mt-1">{step.desc}</p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-zinc-600 group-hover:text-purple-400 ml-auto mt-1 transition-colors"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 功能特性 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-3">🤖 AI 模型能力</h3>
          <div className="space-y-2 text-sm text-zinc-400">
            <p>• <span className="text-purple-400 font-medium">阿里万相 2.7 Pro</span> — 4K 原生画质、角色一致性最强</p>
            <p>• <span className="text-purple-400 font-medium">智谱 CogView-4</span> — 中文理解最优、汉字渲染最佳</p>
            <p>• <span className="text-purple-400 font-medium">硅基流动</span> — 聚合多模型、统一入口</p>
            <p>• <span className="text-purple-400 font-medium">OpenAI 兼容</span> — 支持所有兼容格式 API</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-3">🎨 动画风格</h3>
          <div className="space-y-2 text-sm text-zinc-400">
            <p>• <span className="text-orange-400 font-medium">经典沙雕</span> — 夸张表情、粗犷画风、魔性循环</p>
            <p>• <span className="text-pink-400 font-medium">萌系沙雕</span> — Q版可爱、圆润造型、柔和配色</p>
            <p>• <span className="text-purple-400 font-medium">弹跳入场</span> — 震动、扭动、闪烁、旋转等 10+ 动画效果</p>
            <p>• <span className="text-purple-400 font-medium">模板驱动</span> — 选择模板 → 拖入素材 → 一键导出</p>
          </div>
        </div>
      </div>

      {/* 开始按钮 */}
      <div className="text-center pt-4">
        <Link href="/keys">
          <Button size="lg">
            <Key size={18} />
            添加 API Key，开始创作
          </Button>
        </Link>
      </div>
    </div>
  );
}
