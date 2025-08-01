# 🚄 火车票助手 AI

一个基于 Next.js 和 AI 的智能火车票查询助手，支持自然语言输入，提供流式对话体验。

## ✨ 功能特性

- 🤖 **智能对话**: 支持自然语言输入查询火车票信息
- 📱 **移动端优化**: 响应式设计，完美适配手机和平板
- ⚡ **流式输出**: 实时流式显示AI回复，提升用户体验
- 🎨 **现代UI**: 基于 Shadcn UI 的精美界面设计
- 🌙 **深色模式**: 支持明暗主题切换
- 🔍 **智能解析**: 自动识别出发地、目的地和日期信息

## 🛠 技术栈

- **框架**: Next.js 15.4.5 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS v4
- **UI组件**: Shadcn UI
- **图标**: Lucide React
- **字体**: Geist (Vercel)

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm (推荐) / npm / yarn

### 安装依赖

```bash
pnpm install
```

### 配置 AI 服务 (可选)

支持集成 Dify AI 获得真实的 AI 对话体验：

1. 复制环境变量模板：

```bash
cp .env.example .env.local
```

1. 编辑 `.env.local` 文件，填入你的 Dify AI 配置：

```env
DIFY_API_KEY=your_dify_api_key_here
DIFY_BASE_URL=https://api.dify.ai/v1
DIFY_APP_ID=your_dify_app_id_here
```

> 📖 详细配置说明请查看 [Dify 集成指南](docs/DIFY_INTEGRATION.md)

### 启动开发服务器

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📱 使用说明

### 输入示例

在聊天框中输入以下格式的查询：

- `北京到上海，明天`
- `广州南到深圳北，2024年1月15日`
- `杭州东到南京南，下周五`

### 功能说明

1. **智能识别**: 自动解析出发地和目的地
2. **日期解析**: 支持相对日期（明天、下周五）和绝对日期
3. **实时查询**: 流式显示查询结果
4. **移动优化**: 触摸友好的界面设计

## 📁 项目结构

```text
src/
├── app/                    # Next.js App Router
│   ├── api/chat/          # 聊天API路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页
├── components/            # React组件
│   ├── chat/             # 聊天相关组件
│   └── ui/               # Shadcn UI组件
├── lib/                  # 工具函数
├── types/                # TypeScript类型定义
└── ...
```

## 🔧 开发指南

### 添加新的UI组件

```bash
pnpm dlx shadcn@latest add [component-name]
```

### 自定义样式

项目使用 Tailwind CSS v4，样式配置在 `src/app/globals.css` 中。

### API扩展

聊天API位于 `src/app/api/chat/route.ts`，可以在此集成真实的大模型API。

## 🚀 部署

### Vercel (推荐)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/train-ticket-assistant)

### 其他平台

```bash
pnpm build
pnpm start
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
