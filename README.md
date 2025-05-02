# TRPC Todo 应用

这是一个使用 tRPC v11 构建的示例项目，展示了最新版本 tRPC 的各种特性和最佳实践。同时，本项目也可作为开发新应用的脚手架使用。

## 项目概述

本项目是一个功能完整的待办事项(Todo)应用，具有以下特点：

- 基于 Next.js 15 App Router 架构
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

## tRPC 的核心优势

选择 tRPC 为本项目带来了诸多显著的好处：

1.  **🚀 端到端类型安全 (End-to-end Typesafety):** 这是 tRPC 最核心的价值。后端 API 的类型定义（输入、输出）可以直接在前端被 TypeScript 推断和使用，无需手动同步类型或生成代码。这大大减少了前后端集成时的潜在错误，并在编译阶段就能捕获类型不匹配问题。
2.  **⚡️ 极佳的开发者体验 (Excellent DX):**
    *   **自动补全**: 在前端调用 API 时，可以获得和调用本地 TypeScript 函数一样的自动补全体验，包括函数名、输入参数和返回值类型。
    *   **轻松重构**: 当你在后端修改 API 的名称、参数或返回值时，TypeScript 会立即在所有前端调用处提示错误，使得重构变得安全、快速和可靠。
    *   **无需代码生成**: 与 GraphQL 或 OpenAPI 不同，tRPC 不需要额外的代码生成步骤来同步类型，简化了开发流程和构建配置。
3.  **💨 简化 API 开发流程 (Simplified API Workflow):**
    *   **无需定义 API 路由**: 你只需要在后端定义 tRPC 路由 (router) 和过程 (procedure)，前端就可以直接调用，无需像 RESTful API 那样手动管理路由、HTTP 方法和状态码。
    *   **前端调用如同本地函数**: 前端使用 `trpc` 客户端调用后端 API，感觉就像调用一个异步的本地函数，心智负担更小。
4.  **✨ 与 React/Next.js 生态无缝集成 (Seamless Integration):**
    *   tRPC 提供了官方的 React Query (`@trpc/react-query`) 和 Next.js (`@trpc/next`) 适配器，可以非常方便地与这些流行框架集成。
    *   利用 React Query 的强大功能，如缓存、请求状态管理、乐观更新、预取等，进一步提升了数据获取和变更的用户体验。
5.  **✅ 减少模板代码 (Reduced Boilerplate):** 相较于手动编写 API 请求函数、定义接口、处理请求/响应状态和错误，tRPC 及其适配器提供了更高层次的抽象，显著减少了重复性代码。
6.  **🔗 类型共享，单一事实来源 (Shared Types, Single Source of Truth):** 前后端共享同一套 TypeScript 类型定义，确保了数据结构的一致性，后端即是 API 的唯一事实来源。

总之，tRPC 使得构建全栈 TypeScript 应用变得更加高效、健壮和愉快。

## tRPC v11 新特性

项目展示了 tRPC v11 的多种新写法和特性：

1.  **新的路由器创建方式**：
    ```typescript
    export const appRouter = createTRPCRouter({
      todos: todosRouter,
      users: usersRouter,
    });
    ```

2.  **服务端调用工厂**：
    ```typescript
    export const createCaller = createCallerFactory(appRouter);
    ```

3.  **React Server Components 集成**：
    ```typescript
    export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>();
    ```

4.  **新的查询和变更 API (与 React Query 集成更紧密)**：
    ```typescript
    import { useQuery, useMutation } from "@tanstack/react-query";
    import { trpc } from "@/trpc/client"; // 假设这是你的 tRPC 客户端实例

    // 查询 (v11 推荐方式，利用 queryOptions 封装)
    const todosQuery = useQuery(trpc.todos.getAll.queryOptions());
    
    // 或者直接在 useQuery 中使用
    const todosQueryDirect = useQuery({
        queryKey: trpc.todos.getAll.queryKey(),
        queryFn: () => trpc.todos.getAll.query(),
    });

    // 变更 (v11 推荐方式，利用 mutationOptions 封装)
    const createTodo = useMutation({
      ...trpc.todos.create.mutationOptions(), // 包含 mutationFn 和 mutationKey
      // 可以覆盖或添加其他 React Query 的配置
      onSuccess: () => {
        console.log("Todo created!");
        // 可能需要手动 invalidate 查询
        // queryClient.invalidateQueries(trpc.todos.getAll.queryKey());
      },
    });

    // 调用变更
    // createTodo.mutate({ title: "New Todo", content: "..." });
    ```
    *注意：v11 更加强调利用 React Query (TanStack Query) 的 `queryOptions` 和 `mutationOptions` 来组织和复用查询/变更逻辑，使得与 React Query 的集成更加原生和灵活。 `useQuery(trpc.todos.getAll)` 这种旧的语法虽然可能仍然可用（取决于具体版本和适配器），但推荐使用新的 `queryOptions` 方式。*

5.  **流式批处理请求 (Streaming Batch Requests)**：
    ```typescript
    // 在 tRPC 客户端配置 link 时使用
    import { httpBatchStreamLink } from "@trpc/client";
    import SuperJSON from "superjson";

    httpBatchStreamLink({
      transformer: SuperJSON,
      url: `${getBaseUrl()}/api/trpc`,
      // ...其他配置
    })
    ```
    这允许在一个 HTTP 请求中批量处理多个 tRPC 调用，并且可以通过流式响应逐步返回结果，提升大型或多个并发请求场景下的性能和用户体验。

6.  **优化的上下文创建 (Optimized Context Creation)**：
    ```typescript
    // src/server/trpc.ts 或类似文件
    import { initTRPC, TRPCError } from '@trpc/server';
    import SuperJSON from 'superjson';
    import { ZodError } from 'zod';
    import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
    import { auth } from '@/server/auth'; // 你的 NextAuth 配置
    import { db } from '@/server/db';    // 你的数据库实例

    // Context 创建函数，可以根据需要注入依赖（如数据库连接、会话信息）
    export const createTRPCContext = async (opts: CreateNextContextOptions) => {
      const session = await auth(); // 获取当前会话
      return {
        db,       // 注入数据库实例
        session,  // 注入会话信息
        headers: opts.req.headers, // 可以传递请求头
      };
    };

    // 初始化 tRPC
    const t = initTRPC.context<typeof createTRPCContext>().create({
      transformer: SuperJSON,
      errorFormatter({ shape, error }) {
        return {
          ...shape,
          data: {
            ...shape.data,
            zodError:
              error.cause instanceof ZodError ? error.cause.flatten() : null,
          },
        };
      },
    });
    
    // 导出可重用的 router 和 procedure 创建器
    export const createTRPCRouter = t.router;
    export const publicProcedure = t.procedure; // 无需认证的 procedure
    
    // 创建需要认证的 procedure 中间件
    const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      return next({
        ctx: {
          // 推断 session 和 user 为非空
          session: { ...ctx.session, user: ctx.session.user },
        },
      });
    });

    // 导出需要认证的 procedure
    export const protectedProcedure = t.procedure.use(enforceUserIsAuthed); 
    ```
    v11 延续并优化了上下文创建模式，允许在创建 tRPC 实例时定义上下文类型，并在每次请求时动态创建上下文，方便地将会话信息、数据库连接等注入到你的 tRPC 过程 (procedures) 中。

## 安装与配置

1.  克隆项目

    ```bash
    git clone <仓库地址>
    cd trpc-todo
    ```

2.  安装依赖

    ```bash
    bun install
    ```

3.  配置环境变量

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
    NEXTAUTH_URL_INTERNAL="http://localhost:3000" # 有时需要内部URL
    ```

    > 注意：需要在 [Discord 开发者平台](https://discord.com/developers/applications) 创建应用并获取 ID 和 Secret，并在 OAuth2 -> Redirects 中添加 `http://localhost:3000/api/auth/callback/discord`。

4.  初始化数据库

    ```bash
    bun run db:push
    ```

## 运行项目

```bash
bun dev
