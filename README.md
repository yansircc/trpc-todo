# TRPC Todo 应用

这是一个使用 tRPC v11 构建的示例项目，展示了最新版本 tRPC 的各种特性和最佳实践。同时，本项目也可作为开发新应用的脚手架使用。

## 项目概述

本项目是一个功能完整的待办事项(Todo)应用，具有以下特点：

- 基于 Next.js 14 App Router 架构
- 使用 tRPC v11 实现类型安全的前后端通信
- 支持用户认证（通过 Discord OAuth）
- 实现待办事项的增删改查功能
- 使用乐观更新提升用户体验
- 数据持久化存储

## 技术栈

- **前端**：React、TypeScript、Tailwind CSS、Shadcn UI
- **后端**：Next.js API Routes、tRPC v11
- **数据库**：SQLite (通过 Drizzle ORM)
- **认证**：NextAuth.js
- **状态管理**：TanStack Query (React Query)

## tRPC v11 新特性

项目展示了 tRPC v11 的多种新写法和特性：

1. **新的路由器创建方式**：
   ```typescript
   export const appRouter = createTRPCRouter({
     todos: todosRouter,
     users: usersRouter,
   });
   ```

2. **服务端调用工厂**：
   ```typescript
   export const createCaller = createCallerFactory(appRouter);
   ```

3. **React Server Components 集成**：
   ```typescript
   export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>();
   ```

4. **新的查询和变更 API**：
   ```typescript
   // 查询
   const todosQuery = useQuery(trpc.todos.getAll.queryOptions());
   
   // 预取
   void api.todos.getAll.prefetch();
   
   // 变更
   const createTodo = useMutation({
     mutationFn: trpc.todos.create.mutationOptions().mutationFn,
     // ...其他配置
   });
   ```

5. **流式批处理请求**：
   ```typescript
   httpBatchStreamLink({
     transformer: SuperJSON,
     url: `${getBaseUrl()}/api/trpc`,
     // ...
   })
   ```

6. **优化的上下文创建**：
   ```typescript
   export const createTRPCContext = async (opts: { headers: Headers }) => {
     const session = await auth();
     return { db, session, ...opts };
   };
   ```

## 安装与配置

1. 克隆项目

```bash
git clone <仓库地址>
cd trpc-todo
```

2. 安装依赖

```bash
bun install
```

3. 配置环境变量

创建 `.env` 文件并添加以下内容：

```
# 数据库
DATABASE_URL="file:./db.sqlite"

# Discord OAuth 认证（需要在 Discord 开发者平台创建应用）
AUTH_DISCORD_ID=""
AUTH_DISCORD_SECRET=""

# NextAuth 配置
AUTH_SECRET=""  # 可以使用 `openssl rand -base64 32` 生成
NEXTAUTH_URL="http://localhost:3000"
```

> 注意：需要在 [Discord 开发者平台](https://discord.com/developers/applications) 创建应用并获取 ID 和 Secret。

4. 初始化数据库

```bash
bun run db:push
```

## 运行项目

```bash
bun dev
```

访问 http://localhost:3000 查看应用。

## 项目结构

- `/src/app` - Next.js 应用页面和 API 路由
- `/src/components` - React 组件
- `/src/hooks` - 自定义 React Hooks
- `/src/server` - 服务端代码
  - `/api` - tRPC 路由和处理器
  - `/db` - 数据库模型和连接
  - `/auth` - 认证相关
- `/src/trpc` - tRPC 客户端配置
- `/src/utils` - 工具函数

## 主要功能

- **用户认证**：使用 Discord OAuth 登录
- **待办事项管理**：创建、查看、更新状态和删除待办事项
- **乐观更新**：操作立即反映在界面上，提升用户体验
- **类型安全**：前后端共享类型定义，减少错误

## 开发注意事项

- 本项目使用 Bun 作为包管理器和运行时，请不要使用 npm/yarn
- 遵循项目现有的代码风格和组织结构
- 遵循 TypeScript 类型定义，保持代码类型安全