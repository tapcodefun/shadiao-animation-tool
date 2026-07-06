import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { encrypt, decrypt } from '@/lib/crypto';
import { generateId } from '@/lib/utils';
import { validateApiKey } from '@/lib/image-gen/factory';
import type { Platform } from '@/lib/image-gen/factory';

// GET /api/keys - 获取所有 API Keys
export async function GET() {
  try {
    const db = getDb();
    const rows = db
      .prepare('SELECT id, platform, name, is_active, base_url, created_at, last_used_at FROM api_keys ORDER BY created_at DESC')
      .all() as Array<Record<string, unknown>>;

    // 不返回加密的 key，只返回元数据
    const keys = rows.map((row) => ({
      id: row.id,
      platform: row.platform,
      name: row.name,
      isActive: Boolean(row.is_active),
      baseUrl: row.base_url || null,
      createdAt: row.created_at,
      lastUsedAt: row.last_used_at || null,
      // 返回脱敏的 key 前缀
      keyPreview: '••••••••',
    }));

    return NextResponse.json({ keys });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch API keys', details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/keys - 创建新的 API Key
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, name, apiKey, baseUrl } = body;

    if (!platform || !name || !apiKey) {
      return NextResponse.json(
        { error: 'platform, name, and apiKey are required' },
        { status: 400 }
      );
    }

    const validPlatforms: Platform[] = ['wanxiang', 'cogview', 'openai', 'siliconflow', 'custom'];
    if (!validPlatforms.includes(platform as Platform)) {
      return NextResponse.json(
        { error: `Invalid platform. Must be one of: ${validPlatforms.join(', ')}` },
        { status: 400 }
      );
    }

    // 验证 API Key 有效性
    const isValid = await validateApiKey(platform as Platform, apiKey, baseUrl);
    if (!isValid) {
      return NextResponse.json(
        { error: 'API Key 验证失败，请检查 Key 是否正确' },
        { status: 400 }
      );
    }

    const id = generateId();
    const encrypted = encrypt(apiKey);
    const db = getDb();

    db.prepare(
      `INSERT INTO api_keys (id, platform, name, api_key_encrypted, base_url, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, 1, datetime('now'))`
    ).run(id, platform, name, encrypted, baseUrl || null);

    return NextResponse.json({
      key: {
        id,
        platform,
        name,
        isActive: true,
        baseUrl: baseUrl || null,
        keyPreview: '••••••••',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create API key', details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/keys - 删除 API Key
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const db = getDb();
    db.prepare('DELETE FROM api_keys WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete API key', details: String(error) },
      { status: 500 }
    );
  }
}

// PATCH /api/keys - 切换启用/禁用
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isActive } = body;

    if (!id || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'id and isActive are required' },
        { status: 400 }
      );
    }

    const db = getDb();
    db.prepare('UPDATE api_keys SET is_active = ? WHERE id = ?').run(
      isActive ? 1 : 0,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update API key', details: String(error) },
      { status: 500 }
    );
  }
}
