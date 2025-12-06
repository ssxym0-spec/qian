/** @type {import('next').NextConfig} */
const nextConfig = {
  // 防止 ChunkLoadError 的配置
  onDemandEntries: {
    // 页面在内存中保留的时间（毫秒）
    maxInactiveAge: 60 * 1000,
    // 同时保留的页面数量
    pagesBufferLength: 5,
  },
  // 开发环境优化
  reactStrictMode: true,
  // 生产环境优化
  productionBrowserSourceMaps: false,
  // API 代理配置 - 解决 CORS 跨域问题
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://hou.goodcat.ggff.net/api/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'hou.goodcat.ggff.net', // 后端服务器域名
      },
      {
        protocol: 'https',
        hostname: '**', // 允许所有 HTTPS 域名（开发环境）
      },
    ],
    // 图片优化配置
    formats: ['image/webp', 'image/avif'], // 使用现代图片格式，大幅减小文件体积
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // 响应式图片尺寸
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // 小图标尺寸
    minimumCacheTTL: 60 * 60 * 24 * 30, // 缓存30天，减少重复加载
  },
  webpack(config, { isServer }) {
    // 支持导入 SVG 作为 React 组件
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // 优化 webpack 配置以防止 chunk 加载问题
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
            },
          },
        },
      };
    }

    return config;
  },
}

module.exports = nextConfig
