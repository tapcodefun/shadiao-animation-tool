import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack 配置（Next.js 16 默认）
  turbopack: {},
  // 增加 API Route body 大小限制
  serverExternalPackages: ['better-sqlite3', '@remotion/bundler', '@remotion/renderer'],
  // 允许跨域访问素材
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
