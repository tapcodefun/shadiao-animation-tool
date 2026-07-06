'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { Toast } from '@/components/shared/Toast';
import { Spinner } from '@/components/shared/Spinner';

interface Asset {
  id: string;
  type: string;
  category: string;
  name: string;
  filePath: string;
  width: number;
  height: number;
  prompt: string;
  modelUsed: string;
  tags: string[];
  createdAt: string;
}

interface ApiKeyData {
  id: string;
  platform: string;
  name: string;
  isActive: boolean;
}

type AssetTab = 'background' | 'character' | 'sticker';
type StyleCategory = 'shadiao-classic' | 'moe-cute';

const ASSET_TABS: { key: AssetTab; label: string }[] = [
  { key: 'background', label: '背景图片' },
  { key: 'character', label: '人物角色' },
  { key: 'sticker', label: '表情贴纸' },
];

const STYLE_CATEGORIES: { key: StyleCategory; label: string }[] = [
  { key: 'shadiao-classic', label: '经典沙雕' },
  { key: 'moe-cute', label: '萌系沙雕' },
];

export function AssetManager() {
  const [activeTab, setActiveTab] = useState<AssetTab>('background');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [keys, setKeys] = useState<ApiKeyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // 生成弹窗
  const [showGenerate, setShowGenerate] = useState(false);
  const [genStyle, setGenStyle] = useState<StyleCategory>('shadiao-classic');
  const [genKeyId, setGenKeyId] = useState('');
  const [genPrompt, setGenPrompt] = useState('');
  const [genName, setGenName] = useState('');
  const [genModel, setGenModel] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchAssets();
    fetchKeys();
  }, [activeTab]);

  async function fetchAssets() {
    setLoading(true);
    try {
      const res = await fetch(`/api/media?type=${activeTab}`);
      const data = await res.json();
      setAssets(data.assets || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function fetchKeys() {
    try {
      const res = await fetch('/api/keys');
      const data = await res.json();
      setKeys((data.keys || []).filter((k: ApiKeyData) => k.isActive));
    } catch {
      // ignore
    }
  }

  function getPromptPlaceholder(): string {
    const tabMap: Record<AssetTab, string> = {
      background: '描述场景，如：沙漠中的搞笑骆驼派对',
      character: '描述人物，如：一个戴着墨镜的沙雕熊猫',
      sticker: '描述表情，如：震惊到脸变形的表情',
    };
    return tabMap[activeTab];
  }

  function getPromptTemplate(): string {
    const prefix = activeTab === 'sticker' ? 'sticker' : activeTab === 'background' ? 'bg' : 'char';
    if (genStyle === 'shadiao-classic') {
      const templates: Record<string, string> = {
        background: '夸张搞笑的卡通背景，鲜艳配色，粗犷线条，',
        character: '沙雕风格卡通人物，夸张表情，暴走漫画风格，粗线条，高饱和度，白色背景，',
        sticker: '沙雕表情包贴纸，夸张魔性，暴走漫画风格，白底，高清，',
      };
      return templates[activeTab] || '';
    } else {
      const templates: Record<string, string> = {
        background: '可爱Q版卡通场景，柔和配色，圆润造型，',
        character: 'Q版可爱卡通角色，圆润可爱，柔和配色，简单干净，白色背景，',
        sticker: '可爱表情贴纸，Q版萌系，柔和配色，白底，高清，',
      };
      return templates[activeTab] || '';
    }
  }

  function fillTemplate() {
    setGenPrompt(getPromptTemplate());
  }

  async function handleGenerate() {
    if (!genKeyId || !genPrompt.trim() || !genName.trim()) {
      setToast({ message: '请填写完整信息', type: 'error' });
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKeyId: genKeyId,
          prompt: genPrompt.trim(),
          model: genModel || undefined,
          width: 1024,
          height: 1024,
          numImages: 1,
          saveToAsset: true,
          assetName: genName.trim(),
          assetType: activeTab,
          assetCategory: genStyle,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({ message: '图片生成成功！', type: 'success' });
        setShowGenerate(false);
        setGenName('');
        setGenPrompt('');
        fetchAssets();
      } else {
        setToast({ message: data.error || '生成失败', type: 'error' });
      }
    } catch {
      setToast({ message: '网络错误', type: 'error' });
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
      setToast({ message: '素材已删除', type: 'success' });
      fetchAssets();
    } catch {
      setToast({ message: '删除失败', type: 'error' });
    }
  }

  const typeLabel = (t: string) => {
    const map: Record<string, string> = { background: '背景', character: '人物', sticker: '贴纸' };
    return map[t] || t;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">素材管理</h2>
          <p className="text-zinc-400 mt-1 text-sm">AI 生成和管理沙雕动画素材</p>
        </div>
        <Button onClick={() => setShowGenerate(true)}>🤖 AI 生成素材</Button>
      </div>

      {/* 标签切换 */}
      <div className="flex gap-2 border-b border-zinc-800 pb-0">
        {ASSET_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.key
                ? 'bg-zinc-900 text-white border border-zinc-800 border-b-zinc-900 -mb-px'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 素材网格 */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8 text-purple-500" />
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-lg">还没有{typeLabel(activeTab)}素材</p>
          <p className="text-sm mt-1">点击「AI 生成素材」开始创建</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="group bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-colors"
            >
              <div className="aspect-square bg-zinc-800 relative overflow-hidden">
                <img
                  src={`/${asset.filePath}`}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm text-white font-medium truncate">{asset.name}</p>
                <p className="text-xs text-zinc-500 mt-1 truncate">{asset.prompt}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                    {typeLabel(asset.type)}
                  </span>
                  <span className="text-xs text-zinc-600">{asset.modelUsed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 生成弹窗 */}
      <Modal open={showGenerate} onClose={() => setShowGenerate(false)} title="AI 生成素材" maxWidth="max-w-xl">
        <div className="space-y-4">
          {/* 风格选择 */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">风格</label>
            <div className="flex gap-2">
              {STYLE_CATEGORIES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setGenStyle(s.key)}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    genStyle === s.key
                      ? 'bg-purple-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* API Key 选择 */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">使用 API Key</label>
            {keys.length === 0 ? (
              <p className="text-sm text-zinc-500">
                请先在「API Key 管理」页面添加可用的 Key
              </p>
            ) : (
              <select
                value={genKeyId}
                onChange={(e) => setGenKeyId(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">选择 API Key</option>
                {keys.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name} ({k.platform})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 素材名称 */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">素材名称</label>
            <input
              type="text"
              value={genName}
              onChange={(e) => setGenName(e.target.value)}
              placeholder={`如：沙漠派对背景`}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-zinc-500"
            />
          </div>

          {/* Prompt */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-zinc-300">Prompt</label>
              <button
                onClick={fillTemplate}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                填入模板
              </button>
            </div>
            <textarea
              value={genPrompt}
              onChange={(e) => setGenPrompt(e.target.value)}
              placeholder={getPromptPlaceholder()}
              rows={4}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-zinc-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowGenerate(false)}>
              取消
            </Button>
            <Button onClick={handleGenerate} loading={generating}>
              🚀 生成
            </Button>
          </div>
        </div>
      </Modal>

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
