'use client';

import React, { useState } from 'react';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { Toast } from '@/components/shared/Toast';

interface ApiKeyData {
  id: string;
  platform: string;
  name: string;
  isActive: boolean;
  baseUrl: string | null;
  keyPreview: string;
  createdAt: string;
  lastUsedAt: string | null;
}

const PLATFORM_OPTIONS = [
  { value: 'wanxiang', label: '阿里万相', desc: '画质最高、4K、角色一致性最强' },
  { value: 'cogview', label: '智谱 CogView', desc: '中文理解最优、汉字渲染最强' },
  { value: 'siliconflow', label: '硅基流动', desc: '聚合平台、多模型切换' },
  { value: 'openai', label: 'OpenAI 兼容', desc: 'DALL-E 3 / GPT Image' },
  { value: 'custom', label: '自定义端点', desc: '任何 OpenAI 兼容 API' },
];

export function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKeyData[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // 表单状态
  const [formPlatform, setFormPlatform] = useState('wanxiang');
  const [formName, setFormName] = useState('');
  const [formApiKey, setFormApiKey] = useState('');
  const [formBaseUrl, setFormBaseUrl] = useState('');

  React.useEffect(() => {
    fetchKeys();
  }, []);

  async function fetchKeys() {
    try {
      const res = await fetch('/api/keys');
      const data = await res.json();
      setKeys(data.keys || []);
    } catch {
      // ignore
    }
  }

  async function handleAdd() {
    if (!formName.trim() || !formApiKey.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: formPlatform,
          name: formName.trim(),
          apiKey: formApiKey.trim(),
          baseUrl: formBaseUrl.trim() || undefined,
        }),
      });

      let data: { error?: string; key?: unknown };
      try {
        data = await res.json();
      } catch {
        setToast({ message: `服务器错误 (HTTP ${res.status})`, type: 'error' });
        return;
      }

      if (res.ok) {
        setToast({ message: 'API Key 添加成功！', type: 'success' });
        setShowAdd(false);
        setFormName('');
        setFormApiKey('');
        setFormBaseUrl('');
        fetchKeys();
      } else {
        setToast({ message: data.error || '添加失败', type: 'error' });
      }
    } catch (err) {
      setToast({ message: `网络错误: ${err instanceof Error ? err.message : '未知错误'}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/keys?id=${id}`, { method: 'DELETE' });
      setToast({ message: 'API Key 已删除', type: 'success' });
      fetchKeys();
    } catch {
      setToast({ message: '删除失败', type: 'error' });
    }
  }

  async function handleToggle(id: string, isActive: boolean) {
    try {
      await fetch('/api/keys', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !isActive }),
      });
      fetchKeys();
    } catch {
      // ignore
    }
  }

  const platformLabel = (p: string) => PLATFORM_OPTIONS.find((o) => o.value === p)?.label || p;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">API Key 管理</h2>
          <p className="text-zinc-400 mt-1 text-sm">
            管理你的大模型 API Key，支持阿里万相、智谱、硅基流动等平台
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)}>+ 添加 Key</Button>
      </div>

      {/* 平台说明卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {PLATFORM_OPTIONS.map((p) => (
          <div key={p.value} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h3 className="font-semibold text-white text-sm">{p.label}</h3>
            <p className="text-zinc-500 text-xs mt-1">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* API Key 列表 */}
      <div className="space-y-3">
        {keys.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <p className="text-lg">还没有添加 API Key</p>
            <p className="text-sm mt-1">点击「添加 Key」开始</p>
          </div>
        ) : (
          keys.map((key) => (
            <div
              key={key.id}
              className={`bg-zinc-900 border rounded-lg p-4 flex items-center justify-between ${
                key.isActive ? 'border-zinc-700' : 'border-zinc-800 opacity-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    key.isActive ? 'bg-green-500' : 'bg-zinc-600'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">{key.name}</span>
                    <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                      {platformLabel(key.platform)}
                    </span>
                  </div>
                  <div className="text-zinc-500 text-xs mt-1">
                    {key.keyPreview} · 创建于 {key.createdAt ? new Date(key.createdAt).toLocaleDateString('zh-CN') : '-'}
                    {key.lastUsedAt && ` · 最后使用 ${new Date(key.lastUsedAt).toLocaleDateString('zh-CN')}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(key.id, key.isActive)}
                  className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-zinc-800 transition-colors"
                >
                  {key.isActive ? '禁用' : '启用'}
                </button>
                <button
                  onClick={() => handleDelete(key.id)}
                  className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-zinc-800 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 添加 Key 弹窗 */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="添加 API Key">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">平台</label>
            <select
              value={formPlatform}
              onChange={(e) => setFormPlatform(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {PLATFORM_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">名称</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="如：我的万相Key"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-zinc-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">API Key</label>
            <input
              type="password"
              value={formApiKey}
              onChange={(e) => setFormApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-zinc-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Base URL <span className="text-zinc-500">(可选)</span>
            </label>
            <input
              type="text"
              value={formBaseUrl}
              onChange={(e) => setFormBaseUrl(e.target.value)}
              placeholder="留空使用默认地址"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-zinc-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowAdd(false)}>
              取消
            </Button>
            <Button onClick={handleAdd} loading={loading}>
              添加并验证
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
