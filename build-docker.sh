#!/bin/bash

# Docker 构建脚本 - 使用国内镜像源

set -e

echo "🐳 开始构建 Docker 镜像..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请启动 Docker"
    exit 1
fi

# 设置镜像名称和标签
IMAGE_NAME="train-ticket-assistant"
TAG="latest"

echo "📦 镜像名称: ${IMAGE_NAME}:${TAG}"

# 构建镜像
echo "🔨 开始构建镜像..."
docker build \
    --tag ${IMAGE_NAME}:${TAG} \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    --progress=plain \
    .

# 检查构建结果
if [ $? -eq 0 ]; then
    echo "✅ 镜像构建成功！"
    echo "📊 镜像信息:"
    docker images ${IMAGE_NAME}:${TAG}
    
    echo ""
    echo "🚀 运行镜像:"
    echo "docker run -p 3000:3000 --env-file .env.production ${IMAGE_NAME}:${TAG}"
    
    echo ""
    echo "🐙 使用 Docker Compose:"
    echo "docker-compose up -d"
else
    echo "❌ 镜像构建失败"
    exit 1
fi
