# 🚀 部署检查清单

在部署到云服务器之前，请确保完成以下检查项目：

## ✅ 本地构建检查

- [ ] **构建成功**: `pnpm build` 无错误
- [ ] **Lint 检查**: `pnpm lint` 无警告
- [ ] **类型检查**: TypeScript 编译无错误
- [ ] **环境变量**: `.env.production` 文件已配置

## 🔧 配置文件检查

- [ ] **Dockerfile**: 已创建并配置正确
- [ ] **docker-compose.yml**: 服务配置正确
- [ ] **nginx.conf**: 反向代理配置（如需要）
- [ ] **deploy.sh**: 部署脚本有执行权限

## 🌐 服务器准备

- [ ] **服务器访问**: SSH 连接正常
- [ ] **Docker 安装**: Docker 和 Docker Compose 已安装
- [ ] **端口开放**: 80、443、22 端口已开放
- [ ] **域名解析**: A 记录指向服务器 IP（如有域名）

## 🔐 安全配置

- [ ] **环境变量**: 生产环境密钥已配置
- [ ] **防火墙**: 只开放必要端口
- [ ] **SSL 证书**: HTTPS 配置（推荐）
- [ ] **用户权限**: 非 root 用户运行

## 📋 部署步骤

### 1. 上传代码
```bash
# 方法一：Git
git clone https://github.com/your-repo/train-ticket-assistant.git

# 方法二：SCP
scp -r ./train-ticket-assistant user@server:/home/user/
```

### 2. 配置环境变量
```bash
cd train-ticket-assistant
nano .env.production

# 必填项目
DIFY_API_KEY=your_api_key
DIFY_APP_ID=91527c76-446a-4da1-9bfb-294f889be22d
NODE_ENV=production
```

### 3. 执行部署
```bash
chmod +x deploy.sh
./deploy.sh
```

### 4. 验证部署
```bash
# 检查容器状态
docker-compose ps

# 测试 API
curl http://localhost:3000/api/status

# 查看日志
docker-compose logs -f
```

## 🔍 部署后检查

- [ ] **服务运行**: 容器状态为 `Up`
- [ ] **API 响应**: `/api/status` 返回正常
- [ ] **页面访问**: 首页可以正常加载
- [ ] **聊天功能**: 可以发送和接收消息
- [ ] **Markdown 渲染**: AI 回复格式正确

## 🚨 常见问题

### 构建失败
```bash
# 清理缓存
pnpm clean
rm -rf .next node_modules
pnpm install
pnpm build
```

### 端口冲突
```bash
# 查看端口占用
sudo lsof -i :3000
sudo kill -9 <PID>
```

### 权限问题
```bash
# 修复文件权限
sudo chown -R $USER:$USER ./train-ticket-assistant
chmod +x deploy.sh
```

### Docker 问题
```bash
# 重启 Docker 服务
sudo systemctl restart docker

# 清理 Docker 缓存
docker system prune -a
```

## 📊 监控设置

### 日志监控
```bash
# 实时查看日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f train-ticket-assistant
```

### 性能监控
```bash
# 查看资源使用
docker stats

# 系统资源
htop
df -h
```

## 🔄 更新流程

```bash
# 1. 拉取最新代码
git pull

# 2. 重新部署
./deploy.sh

# 3. 验证更新
curl http://localhost:3000/api/status
```

## 📞 获取帮助

如果遇到问题，请检查：

1. **日志文件**: `docker-compose logs`
2. **系统资源**: 内存、磁盘空间
3. **网络连接**: 防火墙、端口配置
4. **环境变量**: 配置是否正确

---

**部署成功标志**: 
- ✅ 页面可以正常访问
- ✅ 聊天功能正常工作  
- ✅ AI 回复格式美观
- ✅ 移动端适配良好

🎉 **恭喜！你的火车票助手已成功部署！**
