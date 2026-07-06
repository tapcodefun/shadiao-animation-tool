import type { Metadata } from "next";
import "./globals.css";
import { MainLayout } from "@/components/layout/MainLayout";

export const metadata: Metadata = {
  title: "沙雕动画开发工具",
  description: "基于 Remotion 的沙雕动画 AI 开发工具，支持大模型生成素材、模板化动画编辑、视频导出",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="h-full">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
