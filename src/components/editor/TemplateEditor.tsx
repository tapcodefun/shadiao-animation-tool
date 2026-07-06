'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/shared/Button';
import { Toast } from '@/components/shared/Toast';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  style: 'shadiao-classic' | 'moe-cute';
  slots: TemplateSlot[];
}

interface TemplateSlot {
  id: string;
  label: string;
  type: 'background' | 'character' | 'sticker' | 'text' | 'audio';
  required: boolean;
}

interface Asset {
  id: string;
  type: string;
  name: string;
  filePath: string;
}

interface AnimationParams {
  intensity: number;  // 0-1
  speed: number;      // 0-1
  loop: boolean;
}

const TEMPLATES: Template[] = [
  {
    id: 'shadiao-video',
    name: '沙雕视频',
    description: '经典沙雕动画：背景 + 人物登场 + 对话气泡 + 特效',
    icon: '🤪',
    style: 'shadiao-classic',
    slots: [
      { id: 'bg', label: '背景图片', type: 'background', required: true },
      { id: 'char1', label: '主角', type: 'character', required: true },
      { id: 'char2', label: '配角（可选）', type: 'character', required: false },
      { id: 'text1', label: '台词 1', type: 'text', required: true },
      { id: 'text2', label: '台词 2（可选）', type: 'text', required: false },
    ],
  },
  {
    id: 'character-intro',
    name: '人物介绍',
    description: '弹跳入场 + 名字展示 + 标签效果',
    icon: '✨',
    style: 'shadiao-classic',
    slots: [
      { id: 'bg', label: '背景图片', type: 'background', required: true },
      { id: 'char', label: '人物', type: 'character', required: true },
      { id: 'name', label: '人物名字', type: 'text', required: true },
      { id: 'tag', label: '标签（如：搞笑担当）', type: 'text', required: false },
    ],
  },
  {
    id: 'meme-loop',
    name: '表情包循环',
    description: '抖动 + 闪烁 + 循环文字变化',
    icon: '🔄',
    style: 'moe-cute',
    slots: [
      { id: 'sticker', label: '表情贴纸', type: 'sticker', required: true },
      { id: 'text1', label: '循环文字 1', type: 'text', required: true },
      { id: 'text2', label: '循环文字 2（可选）', type: 'text', required: false },
    ],
  },
  {
    id: 'text-bubble',
    name: '对话气泡',
    description: '气泡弹出 + 打字机效果',
    icon: '💬',
    style: 'moe-cute',
    slots: [
      { id: 'bg', label: '背景图片', type: 'background', required: true },
      { id: 'char', label: '说话人物', type: 'character', required: true },
      { id: 'text', label: '对话内容', type: 'text', required: true },
    ],
  },
];

export function TemplateEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [slotValues, setSlotValues] = useState<Record<string, string>>({});
  const [assets, setAssets] = useState<Asset[]>([]);
  const [animParams, setAnimParams] = useState<AnimationParams>({
    intensity: 0.7,
    speed: 0.5,
    loop: false,
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  async function fetchAssets() {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      setAssets(data.assets || []);
    } catch {
      // ignore
    }
  }

  function selectTemplate(template: Template) {
    setSelectedTemplate(template);
    // 初始化 slot 值
    const initial: Record<string, string> = {};
    template.slots.forEach((s) => {
      initial[s.id] = '';
    });
    setSlotValues(initial);
  }

  function getAssetsByType(type: string): Asset[] {
    return assets.filter((a) => a.type === type);
  }

  async function handleExport() {
    if (!selectedTemplate) return;

    // 检查必填项
    const missing = selectedTemplate.slots
      .filter((s) => s.required && !slotValues[s.id])
      .map((s) => s.label);

    if (missing.length > 0) {
      setToast({ message: `请填写：${missing.join('、')}`, type: 'error' });
      return;
    }

    // 构建项目数据
    const projectData = {
      name: `${selectedTemplate.name} - ${new Date().toLocaleString('zh-CN')}`,
      style: selectedTemplate.style,
      templateId: selectedTemplate.id,
      slots: slotValues,
      animation: animParams,
    };

    // 保存到 localStorage 供预览/导出页面使用
    localStorage.setItem('current-project', JSON.stringify(projectData));
    setToast({ message: '项目已保存！可前往预览或导出', type: 'success' });
  }

  const styleLabel = (s: string) => (s === 'shadiao-classic' ? '经典沙雕' : '萌系沙雕');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">动画编辑器</h2>
          <p className="text-zinc-400 mt-1 text-sm">选择模板，填入素材，快速生成沙雕动画</p>
        </div>
        <Button onClick={handleExport} disabled={!selectedTemplate}>
          💾 保存项目
        </Button>
      </div>

      {/* 模板选择 */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">选择模板</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => selectTemplate(tpl)}
              className={`text-left p-4 rounded-xl border transition-all ${
                selectedTemplate?.id === tpl.id
                  ? 'border-purple-500 bg-purple-500/10 ring-1 ring-purple-500'
                  : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800'
              }`}
            >
              <div className="text-3xl mb-2">{tpl.icon}</div>
              <h4 className="text-white font-semibold text-sm">{tpl.name}</h4>
              <p className="text-zinc-500 text-xs mt-1">{tpl.description}</p>
              <span className="inline-block mt-2 text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                {styleLabel(tpl.style)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 素材配置 */}
      {selectedTemplate && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 素材槽位 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
            <h3 className="text-lg font-semibold text-white">
              📦 素材配置
              <span className="text-sm font-normal text-zinc-500 ml-2">
                {selectedTemplate.name}
              </span>
            </h3>

            {selectedTemplate.slots.map((slot) => (
              <div key={slot.id}>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  {slot.label}
                  {slot.required && <span className="text-red-400 ml-1">*</span>}
                </label>

                {slot.type === 'text' ? (
                  <input
                    type="text"
                    value={slotValues[slot.id] || ''}
                    onChange={(e) =>
                      setSlotValues({ ...slotValues, [slot.id]: e.target.value })
                    }
                    placeholder={`输入${slot.label}`}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-zinc-500"
                  />
                ) : (
                  <select
                    value={slotValues[slot.id] || ''}
                    onChange={(e) =>
                      setSlotValues({ ...slotValues, [slot.id]: e.target.value })
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">选择{slot.label}</option>
                    {getAssetsByType(slot.type).map((asset) => (
                      <option key={asset.id} value={asset.filePath}>
                        {asset.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>

          {/* 动画参数 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-5">
            <h3 className="text-lg font-semibold text-white">🎯 动画参数</h3>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-zinc-300">动画强度</label>
                <span className="text-xs text-zinc-500">{Math.round(animParams.intensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(animParams.intensity * 100)}
                onChange={(e) =>
                  setAnimParams({ ...animParams, intensity: Number(e.target.value) / 100 })
                }
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-zinc-600 mt-1">
                <span>温和</span>
                <span>夸张</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-zinc-300">动画速度</label>
                <span className="text-xs text-zinc-500">{Math.round(animParams.speed * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(animParams.speed * 100)}
                onChange={(e) =>
                  setAnimParams({ ...animParams, speed: Number(e.target.value) / 100 })
                }
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-zinc-600 mt-1">
                <span>慢速</span>
                <span>快速</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">循环播放</label>
              <button
                onClick={() => setAnimParams({ ...animParams, loop: !animParams.loop })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  animParams.loop ? 'bg-purple-600' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    animParams.loop ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* 预览区 */}
            <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
              <h4 className="text-sm font-medium text-zinc-400 mb-3">素材预览</h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedTemplate.slots
                  .filter((s) => s.type !== 'text' && slotValues[s.id])
                  .map((s) => (
                    <div key={s.id} className="aspect-square bg-zinc-700 rounded-lg overflow-hidden">
                      <img
                        src={`/${slotValues[s.id]}`}
                        alt={s.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
              </div>
              {selectedTemplate.slots
                .filter((s) => s.type === 'text' && slotValues[s.id])
                .map((s) => (
                  <p key={s.id} className="text-sm text-zinc-300 mt-2">
                    💬 {slotValues[s.id]}
                  </p>
                ))}
            </div>
          </div>
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
