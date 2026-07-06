import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '@/lib/utils';

// POST /api/media/upload - 上传文件
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string;
    const category = formData.get('category') as string;
    const name = formData.get('name') as string;

    if (!file || !type || !name) {
      return NextResponse.json(
        { error: 'file, type, and name are required' },
        { status: 400 }
      );
    }

    const assetId = generateId();
    const ext = file.name.split('.').pop() || 'png';
    const fileName = `${assetId}.${ext}`;
    const assetDir = `assets/${type}s`;
    const filePath = `${assetDir}/${fileName}`;

    const fs = await import('fs/promises');
    const path = await import('path');
    const fullPath = path.join(process.cwd(), 'public', filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(fullPath, buffer);

    // 保存到数据库
    const { getDb } = await import('@/lib/db');
    const db = getDb();

    db.prepare(
      `INSERT INTO assets (id, type, category, name, file_path, width, height, prompt, model_used, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(assetId, type, category || 'shadiao-classic', name, filePath, 0, 0, 'uploaded', 'upload', '[]');

    return NextResponse.json({
      asset: {
        id: assetId,
        type,
        name,
        filePath,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Upload failed', details: String(error) },
      { status: 500 }
    );
  }
}
