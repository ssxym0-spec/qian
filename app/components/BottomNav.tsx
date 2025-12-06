'use client';

import { usePathname } from 'next/navigation';

/**
 * 全局底部导航栏组件
 * 使用 usePathname 实现基于当前路由的激活状态高亮
 */
export default function BottomNav() {
  // 获取当前路径，用于判断哪个导航项应该被激活
  const pathname = usePathname();

  const navItems = [
    { id: 'home', label: '首页', icon: 'home', href: '/' },
    { id: 'growth', label: '生长', icon: 'growth', href: '/shengzhang' },
    { id: 'trace', label: '溯源', icon: 'trace', href: '/suyuan?index=0' },
    { id: 'adopt', label: '认养', icon: 'adopt', href: '/yunyang' },
  ];

  /**
   * 根据图标名称和激活状态返回对应的 SVG 图标
   * 所有图标均为线形风格
   */
  const getNavIcon = (iconName: string, isActive: boolean) => {
    const color = isActive ? 'text-orange-500' : 'text-gray-600';
    
    switch (iconName) {
      case 'home':
        return (
          <svg className={`w-6 h-6 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'trace':
        return (
          <svg className={`w-6 h-6 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'growth':
        return (
          <svg className={`w-6 h-6 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'adopt':
        return (
          <svg className={`w-6 h-6 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/75 backdrop-blur-md border-t border-gray-200 z-50">
      <div className="h-full flex justify-around items-center">
        {navItems.map((item) => {
          // 判断当前路径是否匹配该导航项
          // 对于溯源页，匹配所有 /suyuan 开头的路径
          const isActive = item.id === 'trace' 
            ? pathname.startsWith('/suyuan')
            : pathname === item.href;

          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors duration-200 ${
                isActive ? '' : ''
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {getNavIcon(item.icon, isActive)}
              <span className={`text-xs font-medium ${
                isActive ? 'text-orange-500' : 'text-gray-600'
              }`}>
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

