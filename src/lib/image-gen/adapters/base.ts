import { ImageGenAdapter, ModelInfo } from '../types';

/**
 * 基础适配器 - 提供通用的图片下载和 Base64 转换逻辑
 */
export abstract class BaseAdapter implements ImageGenAdapter {
  abstract platform: string;
  abstract models: ModelInfo[];
  abstract generate(params: import('../types').GenerateParams): Promise<import('../types').GenerateResult>;
  abstract validateApiKey(apiKey: string, baseUrl?: string): Promise<boolean>;

  protected async urlToBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return `data:${response.headers.get('content-type') || 'image/png'};base64,${buffer.toString('base64')}`;
  }

  protected async downloadAndSave(
    url: string,
    filePath: string
  ): Promise<void> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const fs = await import('fs/promises');
    const path = await import('path');
    const fullPath = path.join(process.cwd(), 'public', filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, Buffer.from(arrayBuffer));
  }

  protected base64ToBuffer(base64: string): Buffer {
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  }

  protected async saveBase64Image(
    base64: string,
    filePath: string
  ): Promise<void> {
    const buffer = this.base64ToBuffer(base64);
    const fs = await import('fs/promises');
    const path = await import('path');
    const fullPath = path.join(process.cwd(), 'public', filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, buffer);
  }
}
