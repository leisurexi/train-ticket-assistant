# 🚀 部署指南

本文档详细介绍如何将火车票助手部署到云服务器上。

## 📋 部署前准备

### 1. 服务器要求

- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **内存**: 至少 1GB RAM（推荐 2GB+）
- **存储**: 至少 10GB 可用空间
- **网络**: 公网 IP 地址
- **端口**: 开放 80、443、22 端口

### 2. 域名配置（可选）

如果你有域名，请将 A 记录指向你的服务器 IP 地址。

## 🐳 方法一：Docker 部署（推荐）

### 步骤 1: 安装 Docker

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 将用户添加到 docker 组
sudo usermod -aG docker $USER

# 重新登录或执行
newgrp docker
```

### 步骤 2: 上传项目文件

```bash
# 方法一：使用 git clone
git clone https://github.com/your-username/train-ticket-assistant.git
cd train-ticket-assistant

# 方法二：使用 scp 上传
# 在本地执行
scp -r ./train-ticket-assistant user@your-server-ip:/home/user/
```

### 步骤 3: 配置环境变量

```bash
# 编辑生产环境配置
nano .env.production

# 填入以下内容（替换为你的真实值）
DIFY_API_KEY=your_real_dify_api_key
DIFY_BASE_URL=https://api.dify.ai/v1
DIFY_APP_ID=91527c76-446a-4da1-9bfb-294f889be22d
NODE_ENV=production
```

### 步骤 4: 执行部署

```bash
# 给部署脚本执行权限
chmod +x deploy.sh

# 执行部署
./deploy.sh
```

### 步骤 5: 验证部署

```bash
# 检查容器状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 测试访问
curl http://localhost:3000/api/status
```

## 🔧 方法二：PM2 部署

### 步骤 1: 安装 Node.js 环境

```bash
# 安装 Node.js 18
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.bashrc
fnm use --install-if-missing 18

# 安装 pnpm 和 PM2
npm install -g pnpm pm2
```

### 步骤 2: 构建和启动应用

```bash
# 安装依赖
pnpm install

# 构建应用
pnpm build

# 创建日志目录
mkdir -p logs

# 使用 PM2 启动
pm2 start ecosystem.config.js --env production

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

## 🌐 Nginx 反向代理配置

### 安装 Nginx

```bash
sudo apt install nginx -y
```

### 配置 Nginx

```bash
# 创建配置文件
sudo nano /etc/nginx/sites-available/train-ticket-assistant

# 添加以下内容
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# 启用站点
sudo ln -s /etc/nginx/sites-available/train-ticket-assistant /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

## 🔒 SSL 证书配置

### 使用 Let's Encrypt

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 设置自动续期
sudo crontab -e
# 添加以下行
0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 监控和维护

### 查看应用状态

```bash
# Docker 方式
docker-compose ps
docker-compose logs -f

# PM2 方式
pm2 status
pm2 logs
pm2 monit
```

### 更新应用

```bash
# Docker 方式
git pull
./deploy.sh

# PM2 方式
git pull
pnpm install
pnpm build
pm2 restart train-ticket-assistant
```

### 备份和恢复

```bash
# 备份配置文件
tar -czf backup-$(date +%Y%m%d).tar.gz .env.production docker-compose.yml

# 恢复（如需要）
tar -xzf backup-20240101.tar.gz
```

## 🔥 防火墙配置

```bash
# Ubuntu/Debian
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## 🚨 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **权限问题**
   ```bash
   sudo chown -R $USER:$USER /path/to/project
   ```

3. **内存不足**
   ```bash
   # 创建交换文件
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

4. **Docker 构建失败**
   ```bash
   # 清理 Docker 缓存
   docker system prune -a
   ```

### 日志查看

```bash
# 系统日志
sudo journalctl -u nginx
sudo journalctl -u docker

# 应用日志
tail -f logs/combined.log
```

## 📈 性能优化

### 1. 启用 Gzip 压缩

在 Nginx 配置中添加：
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### 2. 设置缓存

```nginx
location /_next/static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. 限制请求频率

```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api/ {
    limit_req zone=api burst=20 nodelay;
}
```

## 🎉 部署完成

部署成功后，你可以通过以下方式访问应用：

- **HTTP**: http://your-domain.com 或 http://your-server-ip
- **HTTPS**: https://your-domain.com（如果配置了 SSL）

现在你的火车票助手已经成功部署到云服务器上了！🚀
