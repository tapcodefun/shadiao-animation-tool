import { NextResponse } from 'next/server';
import { getPlatformModels } from '@/lib/image-gen/factory';
import type { Platform } from '@/lib/image-gen/factory';

// GET /api/image/models - 获取可用模型列表
export async function GET() {
  const platforms: Platform[] = ['wanxiang', 'cogview', 'openai', 'siliconflow'];

  const allModels = platforms.flatMap((platform) => {
    try {
      return getPlatformModels(platform);
    } catch {
      return [];
    }
  });

  return NextResponse.json({
    models: allModels,
    platforms: platforms.map((p) => ({
      id: p,
      name: getPlatformDisplayName(p),
      description: getPlatformDescription(p),
    })),
  });
}

function getPlatformDisplayName(platform: Platform): string {
  const names: Record<Platform, string> = {
    wanxiang: '阿里万相',
    cogview: '智谱 CogView',
    openai: 'OpenAI',
    siliconflow: '硅基流动',
    custom: '自定义',
  };
  return names[platform];
}

function getPlatformDescription(platform: Platform): string {
  const descs: Record<Platform, string> = {
    wanxiang: '画质最高、角色一致性最强、4K 原生输出、编辑能力最全面',
    cogview: '中文理解最优、汉字渲染最强、开源模型',
    openai: '最成熟的图片生成 API，支持 DALL-E 3 和 GPT Image',
    siliconflow: '聚合平台，统一入口，多模型切换，OpenAI 兼容',
    custom: '自定义 OpenAI 兼容端点',
  };
  return descs[platform];
}
