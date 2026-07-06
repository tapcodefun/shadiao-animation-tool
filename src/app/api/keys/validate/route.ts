import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { decrypt } from '@/lib/crypto';
import { validateApiKey } from '@/lib/image-gen/factory';
import type { Platform } from '@/lib/image-gen/factory';

// POST /api/keys/validate - 验证 API Key
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (id) {
      // 从数据库读取并验证
      const db = getDb();
      const row = db
        .prepare('SELECT * FROM api_keys WHERE id = ?')
        .get(id) as Record<string, unknown> | undefined;

      if (!row) {
        return NextResponse.json({ valid: false, error: 'Key not found' });
      }

      const apiKey = decrypt(row.api_key_encrypted as string);
      const valid = await validateApiKey(
        row.platform as Platform,
        apiKey,
        row.base_url as string | undefined
      );

      if (valid) {
        db.prepare("UPDATE api_keys SET last_used_at = datetime('now') WHERE id = ?").run(id);
      }

      return NextResponse.json({ valid });
    }

    // 直接验证提供的 key
    const { platform, apiKey, baseUrl } = body;
    if (!platform || !apiKey) {
      return NextResponse.json(
        { error: 'platform and apiKey are required' },
        { status: 400 }
      );
    }

    const valid = await validateApiKey(platform as Platform, apiKey, baseUrl);
    return NextResponse.json({ valid });
  } catch (error) {
    return NextResponse.json(
      { error: 'Validation failed', details: String(error) },
      { status: 500 }
    );
  }
}
