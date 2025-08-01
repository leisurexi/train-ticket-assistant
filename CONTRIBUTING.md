# 贡献指南

感谢您对火车票助手项目的关注！我们欢迎各种形式的贡献。

## 🚀 快速开始

1. Fork 这个仓库
2. 克隆到本地：`git clone https://github.com/your-username/train-ticket-assistant.git`
3. 安装依赖：`pnpm install`
4. 启动开发服务器：`pnpm dev`

## 📝 开发规范

### 代码风格

- 使用 TypeScript 进行开发
- 遵循 ESLint 配置的代码规范
- 使用 Prettier 进行代码格式化
- 组件必须添加 JSDoc 注释

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

示例：
```
feat: 添加语音输入功能
fix: 修复移动端滚动问题
docs: 更新API文档
```

### 分支管理

- `main` - 主分支，用于生产环境
- `develop` - 开发分支
- `feature/*` - 功能分支
- `fix/*` - 修复分支

## 🛠 开发流程

1. 从 `develop` 分支创建功能分支
2. 在功能分支上进行开发
3. 确保代码通过 lint 检查：`pnpm lint`
4. 提交代码并推送到远程仓库
5. 创建 Pull Request 到 `develop` 分支

## 📋 Issue 模板

### Bug 报告

- 描述问题
- 复现步骤
- 期望行为
- 实际行为
- 环境信息（浏览器、设备等）

### 功能请求

- 功能描述
- 使用场景
- 预期效果
- 可能的实现方案

## 🧪 测试

目前项目还没有完整的测试套件，我们欢迎贡献测试相关的代码：

- 单元测试
- 集成测试
- E2E 测试

## 📚 文档

- 更新 README.md
- 添加组件文档
- 完善 API 文档
- 翻译文档

## 🤝 行为准则

- 尊重他人
- 友善交流
- 建设性反馈
- 包容不同观点

## 📞 联系方式

如有任何问题，请通过以下方式联系：

- 创建 Issue
- 发起 Discussion
- 发送邮件（如果有的话）

再次感谢您的贡献！🎉
