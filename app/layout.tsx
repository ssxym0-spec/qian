import type { Metadata } from 'next'
import './globals.css'
import BottomNav from './components/BottomNav'

export const metadata: Metadata = {
  title: '云溯源 · 高端茶叶品牌',
  description: '看得见，才安心 - 呈现每一步，让您每一口都放心',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 从国内镜像加载 Google Fonts - 思源宋体和思源黑体 */}
        <link rel="preconnect" href="https://fonts.loli.net" />
        <link
          href="https://fonts.loli.net/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-white">
        {children}
        {/* 全局底部导航栏 - 在所有页面显示 */}
        <BottomNav />
      </body>
    </html>
  )
}
