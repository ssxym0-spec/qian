'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { BatchListItem } from '../types';
import { getFullImageUrl, isVideoUrl } from '../utils/imageUtils';

/**
 * 批次卡片组件
 * 展示单个批次的核心信息，整个卡片可点击跳转到详情页
 */

interface BatchCardProps {
  batch: BatchListItem;
  /** 卡片是否处于激活状态（带流光边框） */
  isActive?: boolean;
  /** 点击回调，用于设置激活状态 */
  onCardClick?: () => void;
}

/**
 * 将任意后端字段安全地转换为可渲染的字符串，防止
 * "Objects are not valid as a React child" 错误。
 */
function toDisplayText(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) return fallback;
  const type = typeof value;
  if (type === 'string' || type === 'number' || type === 'boolean') {
    return String(value);
  }
  try {
    // 兜底：把对象/数组转成 JSON 字符串，避免直接作为 React 子元素
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

// 等级徽章配置（回退方案，当没有 badge_url 时使用）
const GRADE_BADGES: Record<string, { label: string; color: string }> = {
  '臻': { label: '臻', color: 'bg-gradient-to-br from-yellow-400 to-amber-600' },
  '匠': { label: '匠', color: 'bg-gradient-to-br from-purple-400 to-purple-700' },
  '优': { label: '优', color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
};

export default function BatchCard({ batch, isActive = false, onCardClick }: BatchCardProps) {
  const [imageError, setImageError] = useState(false);
  const [badgeError, setBadgeError] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  
  // ==================== 等级信息（直接从 batch.grade_id 读取） ====================
  // 优先使用新的 grade_id 对象，回退到旧的 grade 字段
  const rawGradeName = batch.grade_id?.name ?? batch.grade;
  const gradeName = typeof rawGradeName === 'string' ? rawGradeName : '';
  // 徽章图片 URL：明确从 batch.grade_id.badge_url 读取，必要时兼容嵌套 badge 对象
  const gradeBadgeUrl =
    batch.grade_id?.badge_url ||
    // 兼容部分后端：grade_id.badge.image_url / badge.url 等
    (batch.grade_id as any)?.badge?.image_url ||
    (batch.grade_id as any)?.badge?.url ||
    undefined;
  
  // 回退方案配置（保证 label 始终为字符串）
  const gradeKey = gradeName || '优';
  const gradeConfig = GRADE_BADGES[gradeKey] || { label: gradeKey, color: 'bg-gray-500' }; // 默认等级

  // 处理图片 URL：如果是相对路径，添加后端服务器地址
  const coverImageUrl = getFullImageUrl(batch.cover_image_url);

  // 判断媒体类型
  const isVideo = isVideoUrl(coverImageUrl);

  // 安全的文案字段（后端可能返回对象，如 { name, badge_url } 等）
  const titleText = useMemo(
    () => toDisplayText(batch.title, ''),
    [batch.title]
  );

  const summaryText = useMemo(
    () => toDisplayText(batch.summary ?? batch.notes, ''),
    [batch.summary, batch.notes]
  );

  const coreCraftText = useMemo(
    () => toDisplayText(batch.core_craft, ''),
    [batch.core_craft]
  );

  const flavorProfileText = useMemo(
    () => toDisplayText(batch.flavor_profile, ''),
    [batch.flavor_profile]
  );

  // 处理徽章点击事件
  const handleBadgeClick = (e: React.MouseEvent) => {
    e.preventDefault(); // 阻止链接跳转
    e.stopPropagation(); // 阻止事件冒泡
    setShowBadgeModal(true);
  };

  return (
    <>
    <Link 
      href={`/suyuan/batch/${batch._id}`}
      onClick={onCardClick}
      className={`
        block bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 
        transition-transform duration-300 overflow-hidden group
        ${isActive ? 'active-card-border' : 'active-card-border-default'}
      `}
    >
      {/* 主视觉媒体 */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-gray-100">
        {coverImageUrl && !imageError ? (
          isVideo ? (
            <video
              src={coverImageUrl}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              muted
              loop
              playsInline
              onError={() => {
                console.error('Video failed to load:', coverImageUrl);
                setImageError(true);
              }}
            />
          ) : (
            <Image
              src={coverImageUrl}
              alt={batch.batch_number}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                console.error('Image failed to load:', coverImageUrl);
                setImageError(true);
              }}
              quality={75}
              loading="lazy"
            />
          )
        ) : (
          // 占位符 - 当没有媒体或加载失败时显示
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {imageError && (
              <p className="text-xs text-gray-400">图片加载失败</p>
            )}
          </div>
        )}
        
        {/* 等级徽章 - 优先显示徽章图片，回退显示文字，当等级为"无等级"时不显示 */}
        {(gradeBadgeUrl || gradeName) && gradeName !== '无等级' && (
          <div className="absolute top-3 right-3">
            {gradeBadgeUrl && !badgeError ? (
              // 显示徽章图片
              <div 
                className="w-16 h-16 cursor-pointer hover:scale-110 transition-transform duration-300 badge-breathe"
                onClick={handleBadgeClick}
              >
                <Image
                  src={getFullImageUrl(gradeBadgeUrl)}
                  alt={gradeName || '等级徽章'}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain drop-shadow-lg"
                  sizes="64px"
                  onError={() => {
                    console.error('Badge image failed to load:', gradeBadgeUrl);
                    setBadgeError(true);
                  }}
                  quality={85}
                />
              </div>
            ) : (
              // 回退：显示文字徽章
              <div className={`
                ${gradeConfig.color} 
                text-white font-bold text-lg
                w-14 h-14 rounded-full
                flex items-center justify-center
                shadow-lg
                border-2 border-white
                badge-breathe
              `}>
                {gradeConfig.label}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 内容区 */}
      <div className="p-5">
        {/* 品类与批次号 */}
        <div className="mb-3">
          <h3 className="font-serif text-lg md:text-xl font-bold text-gray-900 mb-1">
            {batch.category_name} · 批次{' '}
            {typeof batch.batch_number === 'string'
              ? batch.batch_number.replace(/^.*?([A-Z]{2}-\d{8}(?:-\d+)?).*$/, '$1')
              : '—'}
          </h3>
          {titleText && (
            <p className="text-sm text-amber-600 font-medium italic">
              {titleText}
            </p>
          )}
        </div>

        {/* 摘要 */}
        {summaryText && (
          <p className="text-sm text-gray-600 mb-4 whitespace-pre-line">
            {summaryText}
          </p>
        )}

        {/* 核心工艺与风味特征 */}
        <div className="space-y-2 mb-4">
          {coreCraftText && (
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-gray-700">
                <strong>工艺：</strong>{coreCraftText}
              </span>
            </div>
          )}
          {flavorProfileText && (
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5" />
              </svg>
              <span className="text-xs text-gray-700">
                <strong>风味：</strong>{flavorProfileText}
              </span>
            </div>
          )}
        </div>

        {/* 制茶师信息和右箭头 */}
        {(() => {
          // 明确从 batch.tea_master 读取制茶师信息
          const teaMaster = batch.tea_master as any;
          
          if (!teaMaster) return null;
          
          // 头像 URL：直接从 tea_master.avatar_url 读取，并对常见变体做兜底
          const avatarUrl =
            teaMaster.avatar_url ||
            teaMaster.avatarUrl ||
            (teaMaster.avatar && (teaMaster.avatar.full_url || teaMaster.avatar.url || teaMaster.avatar.image_url)) ||
            undefined;
          
          return (
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              {/* 左侧：制茶师信息 */}
              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={getFullImageUrl(avatarUrl)}
                      alt={teaMaster.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      quality={70}
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium flex-shrink-0">
                    {teaMaster.name?.[0] || '师'}
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">制茶师</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {teaMaster.name}
                  </p>
                </div>
                {/* 经验年份 */}
                {teaMaster.experience_years && (
                  <div className="ml-2 text-center">
                    <p className="text-xs text-gray-500 leading-tight">经验年份</p>
                    <p className="text-sm font-bold text-amber-600 leading-tight">
                      {teaMaster.experience_years}年
                    </p>
                  </div>
                )}
              </div>
              
              {/* 右侧：箭头指引 - 带呼吸效果 */}
              <div className="flex-shrink-0">
                <svg 
                  className="w-5 h-5 text-amber-600 arrow-breathe" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          );
        })()}
      </div>
    </Link>

    {/* 徽章大图模态框 */}
    {showBadgeModal && gradeBadgeUrl && (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
        onClick={() => setShowBadgeModal(false)}
      >
        <div 
          className="relative max-w-2xl max-h-[90vh] bg-white rounded-2xl p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 关闭按钮 */}
          <button
            onClick={() => setShowBadgeModal(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
            aria-label="关闭"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* 徽章信息 */}
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {(gradeName || '优').replace(/级$/, '')}级徽章
            </h3>
            <p className="text-sm text-gray-600">
              批次：{batch.batch_number}
            </p>
          </div>

          {/* 大图显示 */}
          <div className="flex items-center justify-center">
            <div className="relative w-96 h-96">
              <Image
                src={getFullImageUrl(gradeBadgeUrl)}
                alt={gradeName || '等级徽章'}
                fill
              className="object-contain"
              sizes="(max-width: 768px) 80vw, 384px"
                quality={85}
              />
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
