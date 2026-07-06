'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Key,
  Image,
  PenTool,
  Play,
  Download,
  ChevronLeft,
  Menu,
} from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: '首页' },
  { href: '/keys', icon: Key, label: 'API Key' },
  { href: '/assets', icon: Image, label: '素材管理' },
  { href: '/editor', icon: PenTool, label: '动画编辑' },
  { href: '/preview', icon: Play, label: '预览' },
  { href: '/export', icon: Download, label: '导出' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={`flex flex-col bg-zinc-900 border-r border-zinc-800 transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        {!collapsed && (
          <h1 className="text-lg font-bold text-white">
            🎬 沙雕动画
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon size={20} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500">
          沙雕动画工具 v0.1
        </div>
      )}
    </aside>
  );
}
