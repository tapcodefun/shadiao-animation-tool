import { BaseAdapter } from './base';
import { GenerateParams, GenerateResult, ModelInfo } from '../types';

/**
 * 阿里云万相（通义万相）适配器
 * 通过 DashScope API 调用
 * API: POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis
 */
export class WanxiangAdapter extends BaseAdapter {
  platform = 'wanxiang';
  models: ModelInfo[] = [
    {
      id: 'wan2.7-image-pro',
      name: '万相 2.7 Pro',
      platform: 'wanxiang',
      maxResolution: { width: 4096, height: 4096 },
      supportsReferenceImage: true,
      supportsNegativePrompt: true,
      strengths: ['4K 原生', '角色一致性最强', '编辑能力最全面', '12语言文字渲染'],
    },
    {
      id: 'wan2.7-image',
      name: '万相 2.7',
      platform: 'wanxiang',
      maxResolution: { width: 2048, height: 2048 },
      supportsReferenceImage: true,
      supportsNegativePrompt: true,
      strengths: ['2K 画质', '角色一致性', '编辑能力'],
    },
    {
      id: 'wan2.6-image',
      name: '万相 2.6',
      platform: 'wanxiang',
      maxResolution: { width: 2048, height: 2048 },
      supportsReferenceImage: true,
      supportsNegativePrompt: false,
      strengths: ['稳定', '性价比高'],
    },
  ];

  async generate(params: GenerateParams): Promise<GenerateResult> {
    const apiKey = process.env.TEMP_API_KEY;
    if (!apiKey) throw new Error('API Key not configured');

    const body: Record<string, unknown> = {
      model: params.model,
      input: {
        prompt: params.prompt,
        negative_prompt: params.negativePrompt,
      },
      parameters: {
        size: `${params.width}*${params.height}`,
        n: params.numImages,
      },
    };

    if (params.referenceImages && params.referenceImages.length > 0) {
      (body.input as Record<string, unknown>).ref_images = params.referenceImages;
    }

    const response = await fetch(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'X-DashScope-Async': 'enable',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json() as Record<string, unknown>;

    if (data.code && String(data.code) !== '') {
      throw new Error(`万相 API 错误: ${data.message || data.code}`);
    }

    // 处理异步任务
    const output = data.output as Record<string, unknown> | undefined;
    const taskId = output?.task_id as string | undefined;
    if (taskId) {
      const result = await this.pollTask(taskId, apiKey);
      return result;
    }

    // 同步返回
    const results = output?.results as Array<{ url: string }> | undefined;
    if (!results || results.length === 0) {
      throw new Error('万相 API 未返回图片');
    }

    const images = await Promise.all(
      results.map(async (r) => ({
        base64: await this.urlToBase64(r.url),
        url: r.url,
        width: params.width,
        height: params.height,
      }))
    );

    return {
      images,
      modelUsed: params.model,
      cost: 0,
    };
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'wan2.6-image',
            input: { prompt: 'test' },
            parameters: { size: '256*256', n: 1 },
          }),
        }
      );
      const data = await response.json() as Record<string, unknown>;
      return !data.code || data.code === '';
    } catch {
      return false;
    }
  }

  private async pollTask(
    taskId: string,
    apiKey: string,
    maxRetries = 60
  ): Promise<GenerateResult> {
    for (let i = 0; i < maxRetries; i++) {
      await new Promise((r) => setTimeout(r, 2000));

      const response = await fetch(
        `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      );

      const data = await response.json() as Record<string, unknown>;
      const output = data.output as Record<string, unknown> | undefined;
      const status = output?.task_status as string | undefined;

      if (status === 'SUCCEEDED') {
        const results = output?.results as Array<{ url: string }> | undefined;
        if (!results || results.length === 0) {
          throw new Error('万相 API 任务完成但无图片');
        }

        const images = await Promise.all(
          results.map(async (r) => ({
            base64: await this.urlToBase64(r.url),
            url: r.url,
            width: 0,
            height: 0,
          }))
        );

        return { images, modelUsed: 'wanxiang', cost: 0 };
      }

      if (status === 'FAILED') {
        throw new Error(`万相 API 任务失败: ${output?.message || '未知错误'}`);
      }
    }
    throw new Error('万相 API 任务超时');
  }
}
