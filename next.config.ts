import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 启用 standalone 模式，用于 Docker 部署
  output: 'standalone',

  // 其他配置选项
  experimental: {
    // 优化打包大小
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
