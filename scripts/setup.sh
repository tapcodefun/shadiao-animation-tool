#!/bin/bash
# 沙雕动画开发工具 - 初始化脚本

echo "🎬 沙雕动画开发工具 - 初始化..."
echo ""

# 创建必要的目录
mkdir -p public/assets/backgrounds
mkdir -p public/assets/characters
mkdir -p public/assets/stickers
mkdir -p output
mkdir -p data

# 生成加密密钥（如果不存在）
if [ ! -f .env.local ]; then
  ENCRYPTION_KEY=$(openssl rand -hex 32)
  echo "ENCRYPTION_KEY=${ENCRYPTION_KEY}" > .env.local
  echo "✅ 已生成加密密钥"
else
  echo "✅ 加密密钥已存在"
fi

# 安装依赖
echo ""
echo "📦 安装依赖..."
pnpm install

echo ""
echo "✅ 初始化完成！"
echo ""
echo "启动开发服务器："
echo "  pnpm dev"
echo ""
echo "启动 Remotion Studio："
echo "  npx remotion studio"
