import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateId } from '@/lib/utils';

// GET /api/media - 获取素材列表
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = 'SELECT * FROM assets WHERE 1=1';
    const params: unknown[] = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND (name LIKE ? OR prompt LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const db = getDb();
    const rows = db.prepare(query).all(...params) as Array<Record<string, unknown>>;

    const assets = rows.map((row) => ({
      id: row.id,
      type: row.type,
      category: row.category,
      name: row.name,
      filePath: row.file_path,
      thumbnailPath: row.thumbnail_path || row.file_path,
      width: row.width,
      height: row.height,
      prompt: row.prompt,
      modelUsed: row.model_used,
      tags: JSON.parse(row.tags as string || '[]'),
      createdAt: row.created_at,
    }));

    return NextResponse.json({ assets });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch assets', details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/media - 删除素材
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const db = getDb();
    const row = db.prepare('SELECT file_path FROM assets WHERE id = ?').get(id) as Record<string, unknown> | undefined;

    if (row) {
      // 删除文件
      const fs = await import('fs/promises');
      const path = await import('path');
      const fullPath = path.join(process.cwd(), 'public', row.file_path as string);
      try {
        await fs.unlink(fullPath);
      } catch { /* 文件可能已不存在 */ }
    }

    db.prepare('DELETE FROM assets WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete asset', details: String(error) },
      { status: 500 }
    );
  }
}

// PATCH /api/media - 更新素材信息
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, tags } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const db = getDb();

    if (name) {
      db.prepare('UPDATE assets SET name = ? WHERE id = ?').run(name, id);
    }
    if (tags) {
      db.prepare('UPDATE assets SET tags = ? WHERE id = ?').run(JSON.stringify(tags), id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update asset', details: String(error) },
      { status: 500 }
    );
  }
}
