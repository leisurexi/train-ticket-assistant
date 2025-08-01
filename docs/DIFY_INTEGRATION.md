# Dify AI 集成指南

本文档介绍如何将 Dify AI 集成到火车票助手项目中。

## 🚀 快速开始

### 1. 获取 Dify AI 配置信息

1. 访问 [Dify AI 平台](https://cloud.dify.ai/)
2. 登录并创建或选择你的应用
3. 在应用设置中获取以下信息：
   - **API Key**: 用于身份验证
   - **App ID**: 应用标识符
   - **Base URL**: API 基础地址（通常是 `https://api.dify.ai/v1`）

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填入你的配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件：

```env
# Dify AI 配置
DIFY_API_KEY=your_dify_api_key_here
DIFY_BASE_URL=https://api.dify.ai/v1
DIFY_APP_ID=your_dify_app_id_here
```

### 3. 重启开发服务器

```bash
pnpm dev
```

## 🔧 配置说明

### 环境变量详解

| 变量名 | 必需 | 说明 | 示例值 |
|--------|------|------|--------|
| `DIFY_API_KEY` | ✅ | Dify AI API 密钥 | `app-xxx...` |
| `DIFY_BASE_URL` | ❌ | API 基础地址 | `https://api.dify.ai/v1` |
| `DIFY_APP_ID` | ✅ | 应用 ID，用于定位具体的 Agent | `91527c76-446a-4da1-9bfb-294f889be22d` |

### App ID 的作用

**App ID 是如何定位到你的 Agent 的关键**：

1. **唯一标识符**：每个 Dify 应用都有唯一的 App ID
2. **API 路由**：API 请求会发送到 `/apps/{app_id}/chat-messages` 端点
3. **应用隔离**：确保请求只会访问你指定的 Agent，不会混淆
4. **权限控制**：API Key 必须有访问该特定应用的权限

### 获取配置信息的步骤

1. **登录 Dify 平台**
   - 访问 https://cloud.dify.ai/
   - 使用你的账号登录

2. **选择应用**
   - 在应用列表中选择你的火车票助手应用
   - 或创建一个新的聊天助手应用

3. **获取 API Key**
   - 进入应用的 "API Access" 或"API 访问"页面
   - 复制 API Key

4. **获取 App ID**
   - 从应用 URL 中提取，例如：
   - URL: `https://cloud.dify.ai/app/91527c76-446a-4da1-9bfb-294f889be22d/develop`
   - App ID: `91527c76-446a-4da1-9bfb-294f889be22d`

## 🛠 技术实现

### API 端点结构

Dify AI 使用应用特定的 API 端点，格式为：

```text
https://api.dify.ai/v1/apps/{app_id}/chat-messages
```

其中 `{app_id}` 就是你的应用 ID：`91527c76-446a-4da1-9bfb-294f889be22d`

### 流式响应支持

项目支持 Dify AI 的流式响应，提供实时的对话体验：

```typescript
// 使用正确的 API 端点
const response = await fetch(`${baseUrl}/apps/${appId}/chat-messages`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    inputs: {},
    query: message,
    response_mode: 'streaming',
    conversation_id: conversationId,
    user: userId
  })
});
```

### 错误处理

- 如果 Dify 配置不完整，系统会自动回退到模拟响应
- 网络错误会显示友好的错误提示
- 支持重试机制

### 会话管理

支持 Dify 的会话管理功能：

```typescript
// 传递会话 ID 以保持上下文
const response = await difyClient.streamChat(
  message,
  conversationId, // 可选的会话 ID
  userId          // 用户标识
);
```

## 🎯 应用配置建议

### Dify 应用设置

1. **应用类型**: 选择"聊天助手"
2. **模型选择**: 推荐使用 GPT-4 或 Claude 3.5
3. **系统提示词**: 设置为火车票查询专家角色
4. **知识库**: 可添加火车票相关的知识库

### 示例提示词

```
你是一个专业的火车票查询助手，具有以下能力：

1. 智能解析用户的出行需求（出发地、目的地、日期）
2. 提供详细的火车票信息（车次、时间、价格）
3. 给出实用的购票建议
4. 支持自然语言交互

请用友好、专业的语气回答用户问题，并尽可能提供准确、有用的信息。
```

## 🔍 调试和测试

### 检查配置

```bash
# 检查环境变量是否正确加载
node -e "console.log(process.env.DIFY_API_KEY ? '✅ API Key 已配置' : '❌ API Key 未配置')"
```

### 测试 API 连接

#### 方法一：使用测试脚本

项目提供了专门的测试脚本来验证 Dify 连接：

```bash
# 确保已配置环境变量
pnpm run test:dify
```

测试脚本会：
- 检查环境变量配置
- 发送测试请求到你的 Dify 应用
- 显示详细的连接状态和错误信息

#### 方法二：查看应用启动日志

项目会在启动时自动检测 Dify 配置，查看控制台输出：

```text
✅ Dify AI 配置完成，使用真实 AI 服务
❌ Dify 配置不完整，使用模拟响应
```

## 🚨 常见问题

### Q: API Key 无效
**A**: 检查 API Key 是否正确复制，确保没有多余的空格

### Q: 应用 ID 错误
**A**: 从浏览器地址栏复制完整的应用 ID

### Q: 网络连接问题
**A**: 检查网络连接，确认可以访问 Dify API 服务

### Q: 响应速度慢
**A**: 这是正常现象，AI 生成需要时间，流式响应会逐步显示结果

## 📚 相关资源

- [Dify 官方文档](https://docs.dify.ai/)
- [Dify API 文档](https://docs.dify.ai/api-reference)
- [项目 GitHub 仓库](https://github.com/your-username/train-ticket-assistant)
