import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 品牌色系
        'ink-black': '#333333',           // 墨石黑
        'deep-olive': '#4A5D23',          // 深橄榄绿
        'mountain-gray': '#6B7280',       // 远山灰
        'grain-rain-gold': '#F59E0B',     // 谷雨金（琥珀色）
        
        // 产量占比渐变色
        'gold-start': '#F59E0B',          // 金色渐变起点
        'gold-end': '#FBBF24',            // 金色渐变终点
        'purple-start': '#9333EA',        // 紫色渐变起点
        'purple-end': '#C084FC',          // 紫色渐变终点
        'teal-start': '#14B8A6',          // 绿松石色渐变起点
        'teal-end': '#5EEAD4',            // 绿松石色渐变终点
        'orange-start': '#F97316',        // 红橙色渐变起点
        'orange-end': '#FB923C',          // 红橙色渐变终点
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // 品质辉光渐变（粉色到橙色）
        'quality-glow': 'linear-gradient(to right, #DD2A7B, #F58529)',
        // 产量占比渐变 - 珍稀宝石色系
        'mingqian-gradient': 'linear-gradient(to right, #ca8a04, #fbbf24)',   // 明前茶：黄金色（最珍贵）
        'yuqian-gradient': 'linear-gradient(to right, #059669, #4ade80)',     // 雨前茶：翡翠绿（次珍贵）
        'chuncha-gradient': 'linear-gradient(to right, #0d9488, #22d3ee)',    // 春茶：青瓷色（优质）
        'xiacha-gradient': 'linear-gradient(to right, #ea580c, #fbbf24)',     // 夏茶：琥珀色（普通）
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'serif'],
        sans: ['Noto Sans SC', 'sans-serif'],
      },
      animation: {
        'breathe': 'breathe 2.5s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { 
            transform: 'scale(1)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          },
          '50%': { 
            transform: 'scale(1.05)',
            boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.3), 0 10px 10px -5px rgba(245, 158, 11, 0.2)'
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
