/** @type {import('next').NextConfig} */
// 从环境变量获取后端 API 服务器地址
const getApiServerUrl = () => {
  // 优先使用环境变量
  if (process.env.NEXT_PUBLIC_API_SERVER_URL) {
    return process.env.NEXT_PUBLIC_API_SERVER_URL;
  }
  // 开发环境默认值
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  // 生产环境后备值（如果未设置环境变量）
  return 'https://hou.goodcat.ggff.net';
};

// 从 URL 中提取 hostname
const getApiHostname = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
};

const apiServerUrl = getApiServerUrl();
const apiHostname = getApiHostname(apiServerUrl);

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
        destination: `${apiServerUrl}/api/:path*`,
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
      // 动态添加后端服务器域名（如果 hostname 存在）
      ...(apiHostname ? [{
        protocol: apiServerUrl.startsWith('https') ? 'https' : 'http',
        hostname: apiHostname,
      }] : []),
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
