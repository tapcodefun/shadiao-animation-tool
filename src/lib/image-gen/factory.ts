import { ImageGenAdapter, GenerateParams, GenerateResult } from './types';
import { OpenAICompatibleAdapter } from './adapters/openai';
import { WanxiangAdapter } from './adapters/wanxiang';

export type Platform = 'wanxiang' | 'cogview' | 'openai' | 'siliconflow' | 'custom';

/**
 * 适配器工厂 - 根据平台和配置创建对应的适配器
 */
export function createAdapter(
  platform: Platform,
  apiKey: string,
  baseUrl?: string
): ImageGenAdapter {
  switch (platform) {
    case 'wanxiang':
      return new WanxiangAdapter();

    case 'cogview':
    case 'openai':
    case 'siliconflow':
    case 'custom':
      // 这些平台都兼容 OpenAI 格式
      // 智谱: baseUrl = https://open.bigmodel.cn/api/paas/v4/
      // 硅基流动: baseUrl = https://api.siliconflow.cn/v1
      return new OpenAICompatibleAdapter();

    default:
      return new OpenAICompatibleAdapter();
  }
}

/**
 * 获取平台对应的默认 base URL
 */
export function getDefaultBaseUrl(platform: Platform): string | undefined {
  switch (platform) {
    case 'cogview':
      return 'https://open.bigmodel.cn/api/paas/v4/';
    case 'siliconflow':
      return 'https://api.siliconflow.cn/v1';
    case 'openai':
      return 'https://api.openai.com/v1';
    default:
      return undefined;
  }
}

/**
 * 获取平台的所有可用模型信息
 */
export function getPlatformModels(platform: Platform) {
  const tempAdapter = createAdapter(platform, '');
  return tempAdapter.models;
}

/**
 * 执行图片生成
 */
export async function generateImage(
  platform: Platform,
  apiKey: string,
  params: GenerateParams,
  baseUrl?: string
): Promise<GenerateResult> {
  // 设置临时 API Key（避免修改全局变量）
  process.env.TEMP_API_KEY = apiKey;

  try {
    const adapter = createAdapter(platform, apiKey, baseUrl);
    return await adapter.generate(params);
  } finally {
    delete process.env.TEMP_API_KEY;
  }
}

/**
 * 验证 API Key
 */
export async function validateApiKey(
  platform: Platform,
  apiKey: string,
  baseUrl?: string
): Promise<boolean> {
  const adapter = createAdapter(platform, apiKey, baseUrl);
  return adapter.validateApiKey(apiKey, baseUrl);
}
