#!/bin/bash

# 火车票助手部署脚本

set -e

echo "🚀 开始部署火车票助手..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 检查环境变量文件
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production 文件不存在，请先创建并配置环境变量"
    exit 1
fi

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down

# 构建新镜像
echo "🔨 构建 Docker 镜像..."
docker-compose build --no-cache

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
if curl -f http://localhost:3000/api/status > /dev/null 2>&1; then
    echo "✅ 部署成功！服务正在运行"
    echo "🌐 访问地址: http://localhost:3000"
else
    echo "❌ 服务启动失败，请检查日志"
    docker-compose logs
    exit 1
fi

# 显示运行状态
echo "📊 容器状态:"
docker-compose ps

echo "🎉 部署完成！"
