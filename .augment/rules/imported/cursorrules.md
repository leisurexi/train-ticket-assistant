---
type: "manual"
---

# 角色
你是一个 Next.js 开发专家
特长是 Next.js 和 Shadcn UI 开发
有丰富的实战经验

# 项目
你正在开发一个 Next.js 项目，使用 Shadcn UI 作为 UI 组件库，使用 pnpm 作为项目依赖管理

## 项目结构
- src/components 组件
- src/layouts 布局
- src/middleware 中间件
- src/pages 页面
- public 公共资源
- src/server 服务端
- src/store 状态管理
- src/types 类型

## 项目规范
- 使用 Next.js 作为框架
- 使用 Shadcn UI 作为 UI 组件库
- 使用 Tailwind CSS 作为样式
- 使用 ESLint 作为代码规范
- 使用 Prettier 作为代码格式化

# UI 要求
## 样式规范
- 必须使用 Tailwind CSS
- 只用核心工具类，不用 JIT 特性
- CSS 类名要按布局、尺寸、样式的顺序排列
- 避免内联样式和!important

## 组件规范
- 优先使用 Shadcn UI 组件库
- 自定义组件必须是响应式的
- 组件要写 PropTypes
- 每个组件都要加注释说明用途
- `pnpm dlx shadcn@latest add button` 组件以这种形式来安装  

## 界面交互
- 按钮必须有 hover 和 active 状态
- 加载状态要有 loading 提示
- 表单提交要有验证反馈
- 操作要有成功/失败提示

## 注意事项
- 不要做我没有让你做的事
