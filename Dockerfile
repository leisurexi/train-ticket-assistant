# 简化版 Dockerfile - 使用国内镜像源

# 使用阿里云镜像源的 Node.js 镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 配置 npm 和 pnpm 国内镜像源
RUN npm config set registry https://registry.npmmirror.com/ && \
    npm install -g pnpm && \
    pnpm config set registry https://registry.npmmirror.com/

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 启动应用
CMD ["pnpm", "start"]
