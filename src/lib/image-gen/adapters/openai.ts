import { BaseAdapter } from './base';
import { GenerateParams, GenerateResult, ModelInfo } from '../types';

/**
 * OpenAI 兼容适配器
 * 支持：OpenAI 官方、智谱 CogView、硅基流动 SiliconFlow、以及所有兼容 OpenAI 格式的服务
 */
export class OpenAICompatibleAdapter extends BaseAdapter {
  platform = 'openai';
  models: ModelInfo[] = [
    {
      id: 'dall-e-3',
      name: 'DALL-E 3',
      platform: 'openai',
      maxResolution: { width: 1792, height: 1024 },
      supportsReferenceImage: false,
      supportsNegativePrompt: false,
      strengths: ['高质量', '快速', '提示遵循度高'],
    },
    {
      id: 'gpt-image-1',
      name: 'GPT Image 1',
      platform: 'openai',
      maxResolution: { width: 4096, height: 4096 },
      supportsReferenceImage: true,
      supportsNegativePrompt: false,
      strengths: ['最高分辨率', '图片编辑', '多模态'],
    },
    {
      id: 'cogView-4-250304',
      name: 'CogView-4',
      platform: 'zhipu',
      maxResolution: { width: 2048, height: 2048 },
      supportsReferenceImage: false,
      supportsNegativePrompt: false,
      strengths: ['中文理解最优', '汉字渲染最强', '开源'],
    },
    {
      id: 'Kwai-Kolors/Kolors',
      name: 'Kolors (可图)',
      platform: 'siliconflow',
      maxResolution: { width: 2048, height: 2048 },
      supportsReferenceImage: false,
      supportsNegativePrompt: true,
      strengths: ['中文优化', '色彩丰富'],
    },
  ];

  async generate(params: GenerateParams): Promise<GenerateResult> {
    // 动态导入 openai 避免 edge runtime 问题
    const OpenAI = (await import('openai')).default;

    const baseURL = params.model.startsWith('cogView')
      ? 'https://open.bigmodel.cn/api/paas/v4/'
      : undefined;

    const client = new OpenAI({
      apiKey: process.env.TEMP_API_KEY || '',
      baseURL,
    });

    const response = await client.images.generate({
      model: params.model,
      prompt: params.prompt,
      n: params.numImages,
      size: this.pickSize(params.width, params.height),
      response_format: 'b64_json',
    });

    const images = (response.data || []).map((img) => ({
      base64: `data:image/png;base64,${img.b64_json || ''}`,
      url: img.url,
      width: params.width,
      height: params.height,
    }));

    return {
      images,
      modelUsed: params.model,
      cost: 0,
    };
  }

  async validateApiKey(apiKey: string, baseUrl?: string): Promise<boolean> {
    try {
      const OpenAI = (await import('openai')).default;
      const client = new OpenAI({
        apiKey,
        baseURL: baseUrl || undefined,
      });
      await client.models.list();
      return true;
    } catch {
      return false;
    }
  }

  private pickSize(
    width: number,
    height: number
  ): '1024x1024' | '1792x1024' | '1024x1792' {
    if (width > 1024 || height > 1024) {
      return width > height ? '1792x1024' : '1024x1792';
    }
    return '1024x1024';
  }
}
