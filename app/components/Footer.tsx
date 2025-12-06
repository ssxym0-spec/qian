'use client'

import Image from 'next/image'

// ==================== 导入本地 SVG 图标 ====================
// 从 app/assets/icons/ 目录导入 SVG 文件作为 React 组件
import WechatIcon from '../assets/icons/WeChat.svg'
import WeiboIcon from '../assets/icons/Weibo.svg'
import XiaohongshuIcon from '../assets/icons/xiaohongshu.svg'
import DouyinIcon from '../assets/icons/douyin.svg'

// ==================== 类型定义 ====================

interface SocialLink {
  platform: string  // 平台名称，如 "weibo", "xiaohongshu", "douyin", "wechat"
  url: string       // 链接地址
}

interface FooterData {
  logoUrl: string           // Logo 图片路径
  gardenName: string        // 茶园名称
  copyrightText: string     // 版权信息
  socialLinks: SocialLink[] // 社交媒体链接数组
}

interface FooterProps {
  footerData?: FooterData  // 可选，以支持优雅降级
}

// ==================== Footer 组件 ====================

export default function Footer({ footerData }: FooterProps) {
  // 创建"图标字典" - 将平台名称映射到导入的本地图标组件
  const socialIconMapping: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
    'weibo': WeiboIcon,
    'xiaohongshu': XiaohongshuIcon,
    'douyin': DouyinIcon,
    'wechat': WechatIcon,
  }

  // 每个社交平台对应的颜色样式
  const socialColorMapping: { [key: string]: string } = {
    'weibo': 'text-red-500 hover:text-red-600',
    'xiaohongshu': 'text-rose-500 hover:text-rose-600',
    'douyin': 'text-gray-800 hover:text-black',
    'wechat': 'text-green-500 hover:text-green-600',
  }

  // 健壮性处理：如果没有提供 footerData，使用默认备用数据
  const defaultFooterData: FooterData = {
    logoUrl: '',
    gardenName: '云溯源茶园',
    copyrightText: '© 2025 云溯源茶园. 保留所有权利.',
    socialLinks: []
  }

  // 使用提供的数据或默认数据
  const footer = footerData || defaultFooterData

  return (
    <footer className="bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-6">
        {/* Logo 和品牌名称 - 动态渲染 */}
        <div className="flex items-center gap-3">
          {/* Logo 图片 */}
          {footer.logoUrl ? (
            <div className="relative w-12 h-12">
              <Image
                src={footer.logoUrl}
                alt={`${footer.gardenName} Logo`}
                fill
                className="object-contain"
                sizes="48px"
                loading="lazy"
                quality={85}
              />
            </div>
          ) : (
            // 备用 Logo（如果没有提供图片）
            <div className="w-12 h-12 bg-gradient-to-br from-green-700 to-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">茶</span>
            </div>
          )}
          
          {/* 茶园名称 - 动态渲染 */}
          <span className="font-semibold text-gray-900 text-lg">
            {footer.gardenName}
          </span>
        </div>

        {/* 分割线 */}
        <div className="w-full max-w-sm h-px bg-gray-300" />

        {/* 社交媒体图标 - 动态渲染 */}
        {footer.socialLinks && footer.socialLinks.length > 0 && (
          <div className="flex items-center gap-6">
            {footer.socialLinks.map((social, index) => {
              // 从 socialIconMapping 中查找对应的图标组件
              const IconComponent = socialIconMapping[social.platform]
              // 获取对应的颜色样式
              const colorClass = socialColorMapping[social.platform] || 'text-gray-500 hover:text-amber-500'
              
              // 如果找不到对应的图标，跳过此项
              if (!IconComponent) return null

              return (
                <a 
                  key={index}
                  href={social.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors ${colorClass}`}
                  aria-label={`访问我们的${social.platform}`}
                >
                  <IconComponent className="w-6 h-6" />
                </a>
              )
            })}
          </div>
        )}

        {/* 版权信息 - 动态渲染 */}
        <p className="text-xs text-gray-500 leading-relaxed">
          {footer.copyrightText}
        </p>
      </div>
    </footer>
  )
}
