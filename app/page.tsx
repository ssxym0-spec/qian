'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { getApiUrl } from './utils/apiConfig'
import { 
  Tag, 
  MapPin, 
  Leaf, 
  Maximize, 
  Mountain, 
  Layers, 
  Sun, 
  CloudRain, 
  Droplet,
  User, 
  HelpCircle
} from 'lucide-react'
import { useActiveCard } from './hooks/useActiveCard'

// 懒加载 Footer 组件（在页面底部，不需要立即加载）
const Footer = dynamic(() => import('./components/Footer'), {
  loading: () => (
    <div className="h-32 bg-gray-100 animate-pulse" />
  ),
  ssr: true, // Footer 可以服务端渲染
})

// ==================== 类型定义 ====================

interface InfoItem {
  label: string
  value: string
  icon: string
  sub_text?: string
}

interface PlotData {
  name: string
  carousel_images: string[]
  info_list: InfoItem[]
  value_summary?: string
}

interface Category {
  name: string
  image_url: string
  description: string
  yield_percentage: number
  picking_period: string
}

interface SocialLink {
  platform: string
  url: string
}

interface FooterData {
  logoUrl: string
  gardenName: string
  copyrightText: string
  socialLinks: SocialLink[]
}

interface LandingPageData {
  plot: PlotData
  categories: Category[]
  cta_bg: string
  footer: FooterData
}

// ==================== 工具函数 ====================

// 检查是否为旧的图标名称（需要转换为图标组件）
const isLegacyIconName = (iconName: string): boolean => {
  const legacyNames = [
    'tag', 'location', 'leaf', 'expand', 'maximize', 
    'mountain', 'layers', 'sun', 'droplet', 'cloud-rain', 'user'
  ]
  return legacyNames.includes(iconName?.toLowerCase() || '')
}

// 获取图标的渲染结果（Emoji 或 SVG 组件）
const getIconDisplay = (iconName: string) => {
  // 如果是旧的图标名称，转换为对应的图标组件（向后兼容）
  if (isLegacyIconName(iconName)) {
    const legacyIconMap: { [key: string]: JSX.Element } = {
      'tag': <Tag className="w-4 h-4 flex-shrink-0 text-gray-500" />,
      'location': <MapPin className="w-4 h-4 flex-shrink-0 text-blue-500" />,
      'leaf': <Leaf className="w-4 h-4 flex-shrink-0 text-teal-500" />,
      'expand': <Maximize className="w-4 h-4 flex-shrink-0 text-orange-500" />,
      'maximize': <Maximize className="w-4 h-4 flex-shrink-0 text-orange-500" />,
      'mountain': <Mountain className="w-4 h-4 flex-shrink-0 text-green-600" />,
      'layers': <Layers className="w-4 h-4 flex-shrink-0 text-amber-700" />,
      'sun': <Sun className="w-4 h-4 flex-shrink-0 text-yellow-500" />,
      'droplet': <Droplet className="w-4 h-4 flex-shrink-0 text-sky-500" />,
      'cloud-rain': <CloudRain className="w-4 h-4 flex-shrink-0 text-sky-500" />,
      'user': <User className="w-4 h-4 flex-shrink-0 text-indigo-500" />,
    }
    return legacyIconMap[iconName.toLowerCase()] || <HelpCircle className="w-4 h-4 flex-shrink-0 text-gray-400" />
  }
  
  // 否则直接显示 emoji（或任何其他字符）
  return (
    <span className="text-xl flex-shrink-0" style={{ minWidth: '20px', lineHeight: '1' }}>
      {iconName}
    </span>
  )
}

// 获取产量占比的渐变样式 - 珍稀宝石色系
const getPercentageGradient = (categoryName: string): string => {
  const gradientMap: { [key: string]: string } = {
    '明前茶': 'bg-mingqian-gradient',   // 黄金色：珍贵如金，最稀有
    '雨前茶': 'bg-yuqian-gradient',     // 翡翠绿：贵重宝石，次珍贵
    '春茶': 'bg-chuncha-gradient',      // 青瓷色：雅致青玉，优质
    '夏茶': 'bg-xiacha-gradient',       // 琥珀色：温暖宝石，普通
  }
  return gradientMap[categoryName] || 'bg-gradient-to-r from-green-600 to-green-400'
}

const resolveValueFromSources = (
  sources: Array<Record<string, unknown> | undefined>,
  keys: string[]
): unknown => {
  for (const source of sources) {
    if (!source) continue
    for (const key of keys) {
      const value = (source as Record<string, unknown>)[key]
      if (value !== undefined && value !== null) {
        return value
      }
    }
  }
  return undefined
}

const parsePercentageValue = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string') {
    const numeric = parseFloat(value.replace(/[^\d.-]/g, ''))
    if (!Number.isNaN(numeric)) {
      return numeric
    }
  }
  return undefined
}

const stringifyPickingPeriod = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    return value.filter(Boolean).join('，')
  }
  return undefined
}

const normalizeCategoryData = (category: any): Category => {
  const statsSource = category?.stats || category?.statistics || category?.metrics
  const scheduleSource =
    category?.schedule ||
    category?.harvest_schedule ||
    category?.harvestSchedule ||
    category?.timeline ||
    category?.season

  const yieldValue = resolveValueFromSources(
    [category, statsSource],
    [
      'yield_percentage',
      'yieldPercentage',
      'yield_percent',
      'yieldPercent',
      'yield_ratio',
      'yieldRatio',
      'yield_rate',
      'yieldRate',
      'percentage',
      'share',
      'ratio',
    ]
  )
  const pickingValue = resolveValueFromSources(
    [category, scheduleSource],
    [
      'picking_period',
      'pickingPeriod',
      'harvest_period',
      'harvestPeriod',
      'harvest_window',
      'harvestWindow',
      'harvest_timeframe',
      'harvestTimeframe',
      'harvest_dates',
      'harvestDates',
      'picking_window',
      'pickingWindow',
    ]
  )

  const normalized: Category = {
    name: category?.name || category?.title || '未知品类',
    image_url: category?.image_url || category?.imageUrl || '',
    description: category?.description || category?.desc || category?.summary || '',
    yield_percentage: parsePercentageValue(yieldValue) ?? 0,
    picking_period: stringifyPickingPeriod(pickingValue) || '待更新',
  }

  return {
    ...category,
    ...normalized,
  }
}

// ==================== InteractiveImage 组件 ====================

interface InteractiveImageProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
}

function InteractiveImage({ 
  src, 
  alt, 
  className = '', 
  fill = false,
  width,
  height,
  priority = false,
  sizes
}: InteractiveImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const fallbackImage = 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80'

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      priority={priority}
      sizes={sizes}
      quality={85}
      loading={priority ? 'eager' : 'lazy'} // 优先级图片立即加载，其他延迟加载
      onError={() => setImgSrc(fallbackImage)}
    />
  )
}

// ==================== 欢迎词组件 ====================

function WelcomeSection() {
  return (
    <section className="text-center pt-12 pb-6 px-4">
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink-black mb-4">
        看得见 才
        <span className="bg-quality-glow bg-clip-text text-transparent">
          安心
        </span>
      </h1>
      <p className="font-sans text-lg md:text-xl text-deep-olive">
        我们呈现每一步 只为让您每一口都放心
      </p>
    </section>
  )
}

// ==================== 图片轮播组件 ====================

interface ImageCarouselProps {
  images: string[]
}

function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // 判断是否为视频文件
  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov']
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext))
  }

  // 自动轮播（仅在当前项不是视频时自动切换）
  useEffect(() => {
    if (!images || images.length <= 1) return

    // 如果当前项是视频，不自动切换
    if (images[currentIndex] && isVideo(images[currentIndex])) {
      return
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (images?.length || 1))
    }, 5000)

    return () => clearInterval(timer)
  }, [images?.length, currentIndex, images])

  // 当切换轮播项时，重置视频播放状态
  useEffect(() => {
    setIsVideoPlaying(false)
  }, [currentIndex])

  // 触摸事件处理
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const minSwipeDistance = 50

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // 向左滑动
        setCurrentIndex((prev) => (prev + 1) % (images?.length || 1))
      } else {
        // 向右滑动
        setCurrentIndex((prev) => (prev - 1 + (images?.length || 1)) % (images?.length || 1))
      }
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  if (!images || images.length === 0) return null

  return (
    <div className="relative w-full h-64 md:h-80 rounded-t-2xl overflow-hidden">
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images?.map((img, idx) => (
          <div key={idx} className="min-w-full h-full relative">
            {isVideo(img) ? (
              <>
                <video
                  id={`carousel-video-${idx}`}
                  src={img}
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  loop
                  onPlay={() => idx === currentIndex && setIsVideoPlaying(true)}
                  onPause={() => idx === currentIndex && setIsVideoPlaying(false)}
                  onEnded={() => idx === currentIndex && setIsVideoPlaying(false)}
                >
                  您的浏览器不支持视频播放
                </video>
                
                {/* 中央播放/暂停按钮 - 始终显示但播放时透明 */}
                {idx === currentIndex && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ paddingBottom: '60px' }} // 为底部控制条留出空间
                  >
                    <button
                      className={`pointer-events-auto rounded-full p-6 transition-all duration-300 hover:scale-110 shadow-2xl ${
                        isVideoPlaying 
                          ? 'bg-transparent hover:bg-black/20' 
                          : 'bg-black/60 hover:bg-black/80'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        const video = document.getElementById(`carousel-video-${idx}`) as HTMLVideoElement
                        if (video) {
                          if (video.paused) {
                            video.play()
                          } else {
                            video.pause()
                          }
                        }
                      }}
                    >
                      {!isVideoPlaying && (
                        <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                      {isVideoPlaying && (
                        <div className="w-16 h-16"></div>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <InteractiveImage
                src={img}
                alt={`地块图片 ${idx + 1}`}
                fill
                className="object-cover"
                priority={idx === 0}
                sizes="(max-width: 768px) 100vw, 800px"
              />
            )}
          </div>
        ))}
      </div>
      
      {/* 指示点 */}
      {images && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images?.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/50'
              }`}
              aria-label={`切换到图片 ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== 地块信息组件 ====================

interface PlotInfoProps {
  plot: PlotData
}

function PlotInfo({ plot }: PlotInfoProps) {
  if (!plot) return null
  
  return (
    <section className="px-4 pt-2 pb-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* 图片轮播 */}
        <ImageCarousel images={plot?.carousel_images || []} />
        
        {/* 信息列表 */}
        <div className="p-6">
          <h2 className="font-sans text-2xl font-bold text-ink-black mb-6">
            地块信息
          </h2>
          
          <div className="space-y-2 md:space-y-4">
            {plot.info_list?.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between py-1.5 md:py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  {getIconDisplay(item.icon)}
                  <span className="font-medium text-mountain-gray">{item.label}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-ink-black">{item.value}</span>
                  {item.sub_text && (
                    <p className="text-sm text-mountain-gray mt-1">{item.sub_text}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 价值点总结 */}
          {plot.value_summary && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-deep-olive leading-relaxed">
                {plot.value_summary}
              </p>
            </div>
          )}

          {/* CTA 按钮 */}
          <div className="mt-6 flex justify-center">
            <a
              href="/shengzhang"
              className="inline-block px-8 py-3 bg-gradient-to-r from-grain-rain-gold to-yellow-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-breathe"
            >
              查看生长历程
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ==================== 品类信息组件 ====================

interface CategoryListProps {
  categories: Category[]
}

function CategoryList({ categories }: CategoryListProps) {
  // 导入激活卡片状态管理（需要在文件顶部导入 useActiveCard）
  const { isCardActive, setActiveCard } = useActiveCard('category-cards');
  
  if (!categories || categories.length === 0) return null
  
  return (
    <section className="px-2 md:px-4 py-8 max-w-6xl mx-auto">
      {/* 标题 */}
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl font-bold text-ink-black mb-2">
          四季甄选 · 品类一览
        </h2>
        <p className="text-mountain-gray">
          源于同一片沃土，呈现四季的不同风味。
        </p>
      </div>

      {/* 品类网格 */}
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        {categories?.map((category, idx) => {
          const cardId = `category-${idx}`;
          
          return (
            <a
              key={idx}
              href={`/suyuan?index=${idx}`}
              data-category-index={idx}
              onClick={() => setActiveCard(cardId)}
              className={`
                bg-white rounded-xl shadow-md overflow-hidden 
                hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 group
                ${isCardActive(cardId) ? 'active-card-border' : 'active-card-border-default'}
              `}
            >
            {/* 品类图片 */}
            <div className="relative h-40 md:h-48 overflow-hidden">
              <InteractiveImage
                src={category?.image_url || ''}
                alt={category?.name || '品类'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>

            {/* 内容区 */}
            <div className="p-4">
              {/* 品类名称 */}
              <h3 className="font-sans text-lg md:text-xl font-bold text-ink-black mb-2">
                {category?.name || ''}
              </h3>

              {/* 描述 */}
              <p className="text-sm text-mountain-gray mb-3 line-clamp-2">
                {category?.description || ''}
              </p>

              {/* 产量占比 */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-mountain-gray">产量占比</span>
                  <span className="text-sm font-bold text-ink-black">{category?.yield_percentage || 0}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getPercentageGradient(category?.name || '')} transition-all duration-1000`}
                    style={{ width: `${category?.yield_percentage || 0}%` }}
                  />
                </div>
              </div>

              {/* 采摘期与箭头 */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-deep-olive/30 text-deep-olive text-xs rounded-full bg-deep-olive/5">
                  <svg className="w-3.5 h-3.5 text-grain-rain-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">采摘期：{category?.picking_period || ''}</span>
                </div>
                <svg className="w-5 h-5 text-grain-rain-gold flex-shrink-0 arrow-breathe" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>
          );
        })}
      </div>
    </section>
  )
}

// ==================== 云养茶园CTA组件 ====================

interface CloudTeaGardenCTAProps {
  backgroundImage: string
}

function CloudTeaGardenCTA({ backgroundImage }: CloudTeaGardenCTAProps) {
  if (!backgroundImage) return null
  
  return (
    <section className="px-4 py-8 max-w-4xl mx-auto">
      <a
        href="/yunyang"
        className="block relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl group"
      >
        {/* 背景图片 */}
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
          <InteractiveImage
            src={backgroundImage || ''}
            alt="云养茶园"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>

        {/* 渐变叠加层 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* 内容 */}
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
            成为这片土地的主人
          </h2>
          <p className="text-lg md:text-xl mb-6 opacity-90">
            认养一块属于您的茶地，亲身参与它的成长故事。
          </p>
          
          {/* CTA按钮 */}
          <button className="px-8 py-3 bg-grain-rain-gold hover:bg-yellow-600 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-breathe">
            了解云养茶园
          </button>
        </div>
      </a>
    </section>
  )
}

// ==================== 主页面组件 ====================

export default function Home() {
  const [data, setData] = useState<LandingPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取数据
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(getApiUrl('/api/public/landing-page'), {
          cache: 'no-store',
        })
        
        if (!response.ok) {
          throw new Error('数据加载失败')
        }

        const result = await response.json()
        
        // 修复图片字段映射：支持 image_url 和 imageUrl 两种字段名
        if (result.categories && Array.isArray(result.categories)) {
          result.categories = result.categories.map((cat: any) => normalizeCategoryData(cat))
        }
        
        // 修复地块数据字段映射
        if (result.plot) {
          result.plot = {
            ...result.plot,
            // 修复图片字段
            carousel_images: result.plot.carousel_images || result.plot.carouselImages || result.plot.images || [],
            // 修复信息列表字段
            info_list: result.plot.info_list || result.plot.infoList || result.plot.info || [],
            // 修复价值总结字段
            value_summary: result.plot.value_summary || result.plot.valueSummary || result.plot.summary || '',
            // 确保地块名称存在
            name: result.plot.name || result.plot.plot_name || '未知地块',
          }
        }
        
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : '发生未知错误')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 加载状态 - 骨架屏
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4 space-y-8 animate-pulse">
          <div className="h-32 bg-gray-200 rounded-xl" />
          <div className="h-96 bg-gray-200 rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  // 错误状态
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-ink-black mb-2">加载失败</h2>
          <p className="text-mountain-gray mb-6">{error || '无法获取数据'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-grain-rain-gold text-white rounded-full hover:bg-yellow-600 transition-colors"
          >
            点击重试
          </button>
        </div>
      </div>
    )
  }

  // 正常渲染
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-16">
      <WelcomeSection />
      {data?.plot && <PlotInfo plot={data.plot} />}
      {data?.categories && <CategoryList categories={data.categories} />}
      {data?.cta_bg && <CloudTeaGardenCTA backgroundImage={data.cta_bg} />}
      {data?.footer && <Footer footerData={data.footer} />}
      {/* BottomNav 现在是全局组件，已在 layout.tsx 中渲染 */}
    </main>
  )
}
