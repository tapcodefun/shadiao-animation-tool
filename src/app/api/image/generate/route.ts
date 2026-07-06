import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { decrypt } from '@/lib/crypto';
import { generateImage } from '@/lib/image-gen/factory';
import { generateId } from '@/lib/utils';
import type { Platform } from '@/lib/image-gen/factory';

// POST /api/image/generate - 生成图片
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKeyId, prompt, negativePrompt, model, width, height, style, referenceImages, numImages, saveToAsset, assetName, assetType, assetCategory } = body;

    if (!apiKeyId || !prompt || !model) {
      return NextResponse.json(
        { error: 'apiKeyId, prompt, and model are required' },
        { status: 400 }
      );
    }

    // 获取 API Key
    const db = getDb();
    const keyRow = db
      .prepare('SELECT * FROM api_keys WHERE id = ? AND is_active = 1')
      .get(apiKeyId) as Record<string, unknown> | undefined;

    if (!keyRow) {
      return NextResponse.json(
        { error: 'API Key not found or inactive' },
        { status: 404 }
      );
    }

    const apiKey = decrypt(keyRow.api_key_encrypted as string);
    const platform = keyRow.platform as Platform;
    const baseUrl = keyRow.base_url as string | undefined;

    // 更新最后使用时间
    db.prepare("UPDATE api_keys SET last_used_at = datetime('now') WHERE id = ?").run(apiKeyId);

    // 调用生成
    const result = await generateImage(platform, apiKey, {
      prompt,
      negativePrompt,
      model,
      width: width || 1024,
      height: height || 1024,
      style,
      referenceImages,
      numImages: numImages || 1,
    }, baseUrl);

    // 如果需要保存为素材
    if (saveToAsset && assetName && assetType) {
      const fs = await import('fs/promises');
      const path = await import('path');

      const assetId = generateId();
      const assetDir = path.join('assets', `${assetType}s`);
      const fileName = `${assetId}.png`;
      const filePath = path.join(assetDir, fileName);

      // 保存第一张图片
      const base64Data = result.images[0].base64.replace(/^data:image\/\w+;base64,/, '');
      const fullPath = path.join(process.cwd(), 'public', filePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, Buffer.from(base64Data, 'base64'));

      // 写入数据库
      db.prepare(
        `INSERT INTO assets (id, type, category, name, file_path, width, height, prompt, model_used, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        assetId,
        assetType,
        assetCategory || 'shadiao-classic',
        assetName,
        filePath,
        result.images[0].width || width || 1024,
        result.images[0].height || height || 1024,
        prompt,
        model,
        '[]'
      );

      return NextResponse.json({
        ...result,
        asset: {
          id: assetId,
          type: assetType,
          name: assetName,
          filePath,
        },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Image generation failed', details: String(error) },
      { status: 500 }
    );
  }
}
