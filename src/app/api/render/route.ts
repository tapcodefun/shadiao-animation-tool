import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// POST /api/render - 渲染视频
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectData, resolution, fps } = body;

    if (!projectData) {
      return NextResponse.json({ error: 'projectData is required' }, { status: 400 });
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const outputFileName = `shadiao-${timestamp}.mp4`;
    const outputPath = path.join(process.cwd(), 'output', outputFileName);

    // 确保输出目录存在
    await fs.promises.mkdir(path.join(process.cwd(), 'output'), { recursive: true });

    // 构建 inputProps
    const inputProps = {
      templateId: projectData.templateId || 'shadiao-video',
      slots: projectData.slots || {},
      animation: projectData.animation || { intensity: 0.7, speed: 0.5 },
    };

    const width = resolution?.width || 1920;
    const height = resolution?.height || 1080;
    const frameFps = fps || 30;

    // 使用 Remotion 渲染
    // 注意：渲染需要 Chromium，在沙箱环境中需要额外配置
    const { bundle } = await import('@remotion/bundler');
    const { renderMedia, selectComposition } = await import('@remotion/renderer');

    const bundleLocation = await bundle({
      entryPoint: path.join(process.cwd(), 'src', 'remotion', 'Root.tsx'),
      webpackOverride: (config) => config,
    });

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'dynamic-video',
      inputProps,
    });

    await renderMedia({
      composition: {
        ...composition,
        width,
        height,
        fps: frameFps,
      },
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps,
    });

    return NextResponse.json({
      success: true,
      outputPath: `/output/${outputFileName}`,
      message: '视频渲染完成',
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Render failed',
        details: String(error),
        hint: '视频渲染需要 Chromium 和 FFmpeg。请确保环境配置正确。',
      },
      { status: 500 }
    );
  }
}

// GET /api/render - 获取导出历史
export async function GET() {
  try {
    const outputDir = path.join(process.cwd(), 'output');
    await fs.promises.mkdir(outputDir, { recursive: true });

    const files = await fs.promises.readdir(outputDir);
    const history = files
      .filter((f) => f.endsWith('.mp4'))
      .map((f) => {
        const filePath = path.join(outputDir, f);
        const stats = fs.statSync(filePath);
        return {
          name: f,
          path: `/output/${f}`,
          size: stats.size,
          createdAt: stats.birthtime,
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({ history });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get export history', details: String(error) },
      { status: 500 }
    );
  }
}
