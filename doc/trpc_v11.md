# TanStack React Query

与我们的[经典 React Query 集成](/docs/client/react)相比，这个客户端更简单，更加符合 TanStack Query 的原生特性，提供了常见 TanStack React Query 接口的工厂，如 QueryKeys、QueryOptions 和 MutationOptions。我们认为这是未来，建议使用这个客户端，而不是经典客户端，[ 阅读公告帖子](/blog/introducing-tanstack-react-query-client)以获取有关此更改的更多信息。

## 快速示例查询[​](#quick-example-query "Direct link to Quick example query")

```
tsx
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from './trpc';
function Users() {
  const trpc = useTRPC();
  const greetingQuery = useQuery(trpc.greeting.queryOptions({ name: 'Jerry' }));
  // greetingQuery.data === 'Hello Jerry'
}
Copy
```

```
tsx
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from './trpc';
function Users() {
  const trpc = useTRPC();
  const greetingQuery = useQuery(trpc.greeting.queryOptions({ name: 'Jerry' }));
  // greetingQuery.data === 'Hello Jerry'
}
Copy
```

## 用法[​](#usage "Direct link to Usage")

这个客户端的理念是提供轻量且类型安全的工厂，这些工厂可以原生且安全地与 Tanstack React Query 一起使用。这意味着只需按照客户端提供的自动补全，您就可以专注于构建，只需依靠 [TanStack React Query 文档](https://tanstack.com/query/latest/docs/framework/react/overview)提供的知识。

```
tsx
export default function Basics() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  // Create QueryOptions which can be passed to query hooks
  const myQueryOptions = trpc.path.to.query.queryOptions({ /** inputs */ })
  const myQuery = useQuery(myQueryOptions)
  // or:
  // useSuspenseQuery(myQueryOptions)
  // useInfiniteQuery(myQueryOptions)
  // Create MutationOptions which can be passed to useMutation
  const myMutationOptions = trpc.path.to.mutation.mutationOptions()
  const myMutation = useMutation(myMutationOptions)
  // Create a QueryKey which can be used to manipulated many methods
  // on TanStack's QueryClient in a type-safe manner
  const myQueryKey = trpc.path.to.query.queryKey()
  const invalidateMyQueryKey = () => {
    queryClient.invalidateQueries({ queryKey: myQueryKey })
  }
  return (
    // Your app here
  )
}
Copy
```

```
tsx
export default function Basics() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  // Create QueryOptions which can be passed to query hooks
  const myQueryOptions = trpc.path.to.query.queryOptions({ /** inputs */ })
  const myQuery = useQuery(myQueryOptions)
  // or:
  // useSuspenseQuery(myQueryOptions)
  // useInfiniteQuery(myQueryOptions)
  // Create MutationOptions which can be passed to useMutation
  const myMutationOptions = trpc.path.to.mutation.mutationOptions()
  const myMutation = useMutation(myMutationOptions)
  // Create a QueryKey which can be used to manipulated many methods
  // on TanStack's QueryClient in a type-safe manner
  const myQueryKey = trpc.path.to.query.queryKey()
  const invalidateMyQueryKey = () => {
    queryClient.invalidateQueries({ queryKey: myQueryKey })
  }
  return (
    // Your app here
  )
}
Copy
```

`trpc` 对象是完全类型安全的，并将为您在 `AppRouter` 中的所有过程提供自动补全。在代理的末尾，以下方法可用：

### `queryOptions` - 查询数据[​](#queryOptions "Direct link to queryOptions")

可用于所有查询过程。提供一个类型安全的包装器，围绕 [Tanstack 的 `queryOptions` 函数 ](https://tanstack.com/query/latest/docs/framework/react/reference/queryOptions)。第一个参数是过程的输入，第二个参数接受任何原生的 Tanstack React Query 选项。

```
ts
const queryOptions = trpc.path.to.query.queryOptions(
  {
    /** input */
  },
  {
    // Any Tanstack React Query options
    stateTime: 1000,
  },
);
Copy
```

```
ts
const queryOptions = trpc.path.to.query.queryOptions(
  {
    /** input */
  },
  {
    // Any Tanstack React Query options
    stateTime: 1000,
  },
);
Copy
```

您还可以向 `queryOptions` 函数提供一个 `trpc` 对象，以向客户端提供 tRPC 请求选项。

```
ts
const queryOptions = trpc.path.to.query.queryOptions(
  {
    /** input */
  },
  {
    trpc: {
      // Provide tRPC request options to the client
      context: {
        // see https://trpc.io/docs/client/links#managing-context
      },
    },
  },
);
Copy
```

```
ts
const queryOptions = trpc.path.to.query.queryOptions(
  {
    /** input */
  },
  {
    trpc: {
      // Provide tRPC request options to the client
      context: {
        // see https://trpc.io/docs/client/links#managing-context
      },
    },
  },
);
Copy
```

结果可以传递给 `useQuery` 或 `useSuspenseQuery` 钩子，或查询客户端方法，如 `fetchQuery`、`prefetchQuery`、`prefetchInfiniteQuery`、`invalidateQueries` 等。

### `infiniteQueryOptions` - 查询无限数据[​](#infiniteQueryOptions "Direct link to infiniteQueryOptions")

适用于所有接受游标输入的查询过程。提供一个类型安全的包装器，围绕 [Tanstack 的 `infiniteQueryOptions` 函数 ](https://tanstack.com/query/latest/docs/framework/react/reference/infiniteQueryOptions)。第一个参数是过程的输入，第二个参数接受任何原生的 Tanstack React Query 选项。

```
ts
const infiniteQueryOptions = trpc.path.to.query.infiniteQueryOptions(
  {
    /** input */
  },
  {
    // Any Tanstack React Query options
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  },
);
Copy
```

```
ts
const infiniteQueryOptions = trpc.path.to.query.infiniteQueryOptions(
  {
    /** input */
  },
  {
    // Any Tanstack React Query options
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  },
);
Copy
```

### `queryKey` - 获取查询键并对查询客户端执行操作[​](#queryKey "Direct link to queryKey")

适用于所有查询过程。允许您以类型安全的方式访问查询键。

```
ts
const queryKey = trpc.path.to.query.queryKey();
Copy
```

```
ts
const queryKey = trpc.path.to.query.queryKey();
Copy
```

由于 Tanstack React Query 对查询键使用模糊匹配，您还可以为任何子路径创建一个部分查询键，以匹配属于路由器的所有查询：

```
ts
const queryKey = trpc.router.pathKey();
Copy
```

```
ts
const queryKey = trpc.router.pathKey();
Copy
```

或者甚至是匹配所有 tRPC 查询的根路径：

```
ts
const queryKey = trpc.pathKey();
Copy
```

```
ts
const queryKey = trpc.pathKey();
Copy
```

### `queryFilter` - 创建查询过滤器[​](#queryFilter "Direct link to queryFilter")

适用于所有查询过程。允许以类型安全的方式创建[查询过滤器 ](https://tanstack.com/query/latest/docs/framework/react/guides/filters#query-filters)。

```
ts
const queryFilter = trpc.path.to.query.queryFilter(
  {
    /** input */
  },
  {
    // Any Tanstack React Query filter
    predicate: (query) => {
      query.state.data;
    },
  },
);
Copy
```

```
ts
const queryFilter = trpc.path.to.query.queryFilter(
  {
    /** input */
  },
  {
    // Any Tanstack React Query filter
    predicate: (query) => {
      query.state.data;
    },
  },
);
Copy
```

与查询键一样，如果您想在整个路由器上运行过滤器，可以使用 `pathFilter` 来定位任何子路径。

```
ts
const queryFilter = trpc.path.pathFilter({
  // Any Tanstack React Query filter
  predicate: (query) => {
    query.state.data;
  },
});
Copy
```

```
ts
const queryFilter = trpc.path.pathFilter({
  // Any Tanstack React Query filter
  predicate: (query) => {
    query.state.data;
  },
});
Copy
```

有助于创建可以传递给客户端方法的过滤器，例如 `queryClient.invalidateQueries` 等。

### `mutationOptions` - 创建变更选项[​](#mutationOptions "Direct link to mutationOptions")

可用于所有变更过程。提供一个类型安全的识别函数，用于构建可以传递给 `useMutation` 的选项。

```
ts
const mutationOptions = trpc.path.to.mutation.mutationOptions({
  // Any Tanstack React Query options
  onSuccess: (data) => {
    // do something with the data
  },
});
Copy
```

```
ts
const mutationOptions = trpc.path.to.mutation.mutationOptions({
  // Any Tanstack React Query options
  onSuccess: (data) => {
    // do something with the data
  },
});
Copy
```

### `mutationKey` - 获取变更键[​](#mutationKey "Direct link to mutationKey")

可用于所有变更过程。允许您以类型安全的方式获取变更键。

```
ts
const mutationKey = trpc.path.to.mutation.mutationKey();
Copy
```

```
ts
const mutationKey = trpc.path.to.mutation.mutationKey();
Copy
```

### `subscriptionOptions` - 创建订阅选项[​](#subscriptionOptions "Direct link to subscriptionOptions")

TanStack 不提供订阅钩子，因此我们继续在这里公开自己的抽象，它与[标准 tRPC 订阅设置](/docs/server/subscriptions)一起工作。可用于所有订阅过程。提供一个类型安全的识别函数，用于构造可以传递给 `useSubscription` 的选项。请注意，您需要在 tRPC 客户端中配置 [`httpSubscriptionLink`](/docs/client/links/httpSubscriptionLink) 或 [`wsLink`](/docs/client/links/wsLink) 才能使用订阅。

```
tsx
function SubscriptionExample() {
  const trpc = useTRPC();
  const subscription = useSubscription(
    trpc.path.to.subscription.subscriptionOptions(
      {
        /** input */
      },
      {
        enabled: true,
        onStarted: () => {
          // do something when the subscription is started
        },
        onData: (data) => {
          // you can handle the data here
        },
        onError: (error) => {
          // you can handle the error here
        },
        onConnectionStateChange: (state) => {
          // you can handle the connection state here
        },
      },
    ),
  );
  // Or you can handle the state here
  subscription.data; // The lastly received data
  subscription.error; // The lastly received error
  /**
   * The current status of the subscription.
   * Will be one of: `'idle'`, `'connecting'`, `'pending'`, or `'error'`.
   *
   * - `idle`: subscription is disabled or ended
   * - `connecting`: trying to establish a connection
   * - `pending`: connected to the server, receiving data
   * - `error`: an error occurred and the subscription is stopped
   */
  subscription.status;
  // Reset the subscription (if you have an error etc)
  subscription.reset();
  return <>{/* ... */}</>;
}
Copy
```

```
tsx
function SubscriptionExample() {
  const trpc = useTRPC();
  const subscription = useSubscription(
    trpc.path.to.subscription.subscriptionOptions(
      {
        /** input */
      },
      {
        enabled: true,
        onStarted: () => {
          // do something when the subscription is started
        },
        onData: (data) => {
          // you can handle the data here
        },
        onError: (error) => {
          // you can handle the error here
        },
        onConnectionStateChange: (state) => {
          // you can handle the connection state here
        },
      },
    ),
  );
  // Or you can handle the state here
  subscription.data; // The lastly received data
  subscription.error; // The lastly received error
  /**
   * The current status of the subscription.
   * Will be one of: `'idle'`, `'connecting'`, `'pending'`, or `'error'`.
   *
   * - `idle`: subscription is disabled or ended
   * - `connecting`: trying to establish a connection
   * - `pending`: connected to the server, receiving data
   * - `error`: an error occurred and the subscription is stopped
   */
  subscription.status;
  // Reset the subscription (if you have an error etc)
  subscription.reset();
  return <>{/* ... */}</>;
}
Copy
```

### 推断输入和输出类型[​](#inferring-input-and-output-types "Direct link to Inferring Input and Output types")

当您需要推断一个过程或路由的输入和输出类型时，根据情况有两种可用的选项。

推断完整路由器的输入和输出类型

```
ts
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { AppRouter } from './path/to/server';
export type Inputs = inferRouterInputs<AppRouter>;
export type Outputs = inferRouterOutputs<AppRouter>;
Copy
```

```
ts
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { AppRouter } from './path/to/server';
export type Inputs = inferRouterInputs<AppRouter>;
export type Outputs = inferRouterOutputs<AppRouter>;
Copy
```

为单个过程推断类型

```
ts
import type { inferInput, inferOutput } from '@trpc/tanstack-react-query';
function Component() {
  const trpc = useTRPC();
  type Input = inferInput<typeof trpc.path.to.procedure>;
  type Output = inferOutput<typeof trpc.path.to.procedure>;
}
Copy
```

```
ts
import type { inferInput, inferOutput } from '@trpc/tanstack-react-query';
function Component() {
  const trpc = useTRPC();
  type Input = inferInput<typeof trpc.path.to.procedure>;
  type Output = inferOutput<typeof trpc.path.to.procedure>;
}
Copy
```

### 访问 tRPC 客户端[​](#useTRPCClient "Direct link to Accessing the tRPC client")

如果您使用了 [与 React Context 的设置 ](/docs/client/tanstack-react-query/setup#3a-setup-the-trpc-context-provider)，您可以使用 `useTRPCClient` 钩子访问 tRPC 客户端。

```
tsx
import { useTRPCClient } from './trpc';
function Component() {
  const trpcClient = useTRPCClient();
  const result = await trpcClient.path.to.procedure.query({
    /** input */
  });
}
Copy
```

```
tsx
import { useTRPCClient } from './trpc';
function Component() {
  const trpcClient = useTRPCClient();
  const result = await trpcClient.path.to.procedure.query({
    /** input */
  });
}
Copy
```

如果你 [不使用 React Context 进行设置 ](/docs/client/tanstack-react-query/setup#3b-setup-without-react-context)，你可以直接导入全局客户端实例。

```
ts
import { client } from './trpc';
const result = await client.path.to.procedure.query({
  /** input */
});
Copy
```

```
ts
import { client } from './trpc';
const result = await client.path.to.procedure.query({
  /** input */
});
Copy
```

[](https://github.com/trpc/trpc/tree/main/www/docs/client/tanstack-react-query/usage.mdx)

# Migrating from the classic React Client

有几种迁移的方法，这个库与经典客户端有很大不同，因此我们不指望任何人一次性完成。但你可能想尝试结合几种方法...

## Codemod 迁移[​](#codemod-migration "Direct link to Codemod migration")

信息

Codemod 仍在进行中，我们希望能得到帮助以使其更好。如果你有兴趣为 codemod 贡献，请查看 [Julius 在这里的评论 ](https://github.com/trpc/trpc/pull/6262#issuecomment-2651959435)。

我们正在开发一个 codemod，帮助你将现有代码库迁移到新客户端。这个工具已经可以尝试，但我们需要你的反馈和贡献来改进它。Codemod 很难做到完美，因此我们希望能得到你的帮助，使其尽可能有效。

运行我们的升级 CLI：

```
sh
npx @trpc/upgrade
Copy
```

```
sh
npx @trpc/upgrade
Copy
```

当被提示时，选择转换 `Migrate Hooks to xxxOptions API` 和 `Migrate context provider setup` 。

## 渐进式迁移[​](#gradual-migration "Direct link to Gradual migration")

新客户端和经典客户端彼此兼容，并且 [可以在同一个应用程序中共存 ](https://github.com/juliusmarminge/trpc-interop/blob/main/src/client.tsx)。这意味着您可以通过在应用程序的新部分中使用新客户端来开始迁移，并根据需要逐步迁移现有用法。最重要的是，查询键是相同的，这意味着您可以同时使用新客户端和经典客户端，并仍然依赖 TanStack Query 的缓存。

### 迁移查询[​](#migrating-queries "Direct link to Migrating Queries")

经典查询看起来像这样

```
tsx
import { trpc } from './trpc';
function Users() {
  const greetingQuery = trpc.greeting.useQuery({ name: 'Jerry' });
  // greetingQuery.data === 'Hello Jerry'
}
Copy
```

```
tsx
import { trpc } from './trpc';
function Users() {
  const greetingQuery = trpc.greeting.useQuery({ name: 'Jerry' });
  // greetingQuery.data === 'Hello Jerry'
}
Copy
```

并且更改为

```
tsx
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from './trpc';
function Users() {
  const trpc = useTRPC();
  const greetingQuery = useQuery(trpc.greeting.queryOptions({ name: 'Jerry' }));
  // greetingQuery.data === 'Hello Jerry'
}
Copy
```

```
tsx
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from './trpc';
function Users() {
  const trpc = useTRPC();
  const greetingQuery = useQuery(trpc.greeting.queryOptions({ name: 'Jerry' }));
  // greetingQuery.data === 'Hello Jerry'
}
Copy
```

### 迁移无效化和其他 QueryClient 用法[​](#migrating-invalidations-and-other-queryclient-usages "Direct link to Migrating Invalidations and other QueryClient usages")

经典查询看起来像这样

```
tsx
import { trpc } from './trpc';
function Users() {
  const utils = trpc.useUtils();
  async function invalidateGreeting() {
    await utils.greeting.invalidate({ name: 'Jerry' });
  }
}
Copy
```

```
tsx
import { trpc } from './trpc';
function Users() {
  const utils = trpc.useUtils();
  async function invalidateGreeting() {
    await utils.greeting.invalidate({ name: 'Jerry' });
  }
}
Copy
```

并且更改为

```
tsx
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from './trpc';
function Users() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  async function invalidateGreeting() {
    await queryClient.invalidateQueries(
      trpc.greeting.queryFilter({ name: 'Jerry' }),
    );
  }
}
Copy
```

```
tsx
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from './trpc';
function Users() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  async function invalidateGreeting() {
    await queryClient.invalidateQueries(
      trpc.greeting.queryFilter({ name: 'Jerry' }),
    );
  }
}
Copy
```

对于任何 QueryClient 的使用都是一样的，您可以直接遵循 TanStack 文档，而不是使用 tRPC 的 `useUtils`

### 迁移变更[​](#migrating-mutations "Direct link to Migrating Mutations")

经典的变更可能看起来像这样

```
tsx
import { trpc } from './trpc';
function Users() {
  const createUserMutation = trpc.createUser.useMutation();
  createUserMutation.mutate({ name: 'Jerry' });
}
Copy
```

```
tsx
import { trpc } from './trpc';
function Users() {
  const createUserMutation = trpc.createUser.useMutation();
  createUserMutation.mutate({ name: 'Jerry' });
}
Copy
```

并且更改为

```
tsx
import { useMutation } from '@tanstack/react-query';
import { useTRPC } from './trpc';
function Users() {
  const trpc = useTRPC();
  const createUserMutation = useMutation(trpc.createUser.mutationOptions());
  createUserMutation.mutate({ name: 'Jerry' });
}
Copy
```

```
tsx
import { useMutation } from '@tanstack/react-query';
import { useTRPC } from './trpc';
function Users() {
  const trpc = useTRPC();
  const createUserMutation = useMutation(trpc.createUser.mutationOptions());
  createUserMutation.mutate({ name: 'Jerry' });
}
Copy
```

[](https://github.com/trpc/trpc/tree/main/www/docs/client/tanstack-react-query/migrating.mdx)

# Set up with React Server Components

本指南概述了如何将 tRPC 与 React 服务器组件（RSC）框架（如 Next.js 应用路由器）结合使用。请注意，RSC 本身解决了许多 tRPC 旨在解决的问题，因此您可能根本不需要 tRPC。

将 tRPC 与 RSC 集成并没有一种通用的方法，因此请将本指南视为起点，并根据您的需求和偏好进行调整。

信息

如果您想了解如何将 tRPC 与服务器操作一起使用，请查看 [Julius 的这篇博客文章 ](/blog/trpc-actions)。

注意

在继续之前，请阅读 React Query 的[高级服务器渲染](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)文档，以了解不同类型的服务器渲染以及需要避免的陷阱。

## 将 tRPC 添加到现有项目[​](#add-trpc-to-existing-projects "Direct link to Add tRPC to existing projects")

### 1. 安装依赖[​](#1-install-deps "Direct link to 1. Install deps")

* npm
* yarn
* pnpm
* 包子
* deno

```
npm install @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query@latest zod client-only server-onlyCopy
```

```
yarn add @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query@latest zod client-only server-onlyCopy
```

```
pnpm add @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query@latest zod client-only server-onlyCopy
```

```
bun add @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query@latest zod client-only server-onlyCopy
```

```
deno add npm:@trpc/server npm:@trpc/client npm:@trpc/tanstack-react-query npm:@tanstack/react-query@latest npm:zod npm:client-only npm:server-onlyCopy
```

### 2. 创建一个 tRPC 路由器[​](#2-create-a-trpc-router "Direct link to 2. Create a tRPC router")

在 `trpc/init.ts` 中使用 `initTRPC` 函数初始化您的 tRPC 后端，并创建您的第一个路由器。我们将在这里创建一个简单的“你好，世界”路由器和过程 - 但有关创建 tRPC API 的更深入信息，您应该参考 [快速入门指南 ](/docs/quickstart)和 [后端使用文档 ](/docs/server/introduction)以获取 tRPC 信息。

信息

此处使用的文件名并不是 tRPC 强制要求的。您可以使用任何您希望的文件结构。

查看示例后端

```
trpc/init.ts
ts
import { initTRPC } from '@trpc/server';
import { cache } from 'react';
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
Copy
```

```
trpc/init.ts
ts
import { initTRPC } from '@trpc/server';
import { cache } from 'react';
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
Copy
```

\


```
trpc/routers/_app.ts
ts
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
Copy
```

```
trpc/routers/_app.ts
ts
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
Copy
```

\


note

The backend adapter depends on your framework and how it sets up API routes. The following example sets up GET and POST routes at `/api/trpc/*` using the [fetch adapter](https://trpc.io/docs/server/adapters/fetch) in Next.js.

```
app/api/trpc/[trpc]/route.ts
ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '~/trpc/init';
import { appRouter } from '~/trpc/routers/_app';
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
export { handler as GET, handler as POST };
Copy
```

```
app/api/trpc/[trpc]/route.ts
ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '~/trpc/init';
import { appRouter } from '~/trpc/routers/_app';
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
export { handler as GET, handler as POST };
Copy
```

### 3. 创建一个查询客户端工厂[​](#3-create-a-query-client-factory "Direct link to 3. Create a Query Client factory")

创建一个共享文件 `trpc/query-client.ts`，导出一个创建 `QueryClient` 实例的函数。

```
trpc/query-client.ts
ts
import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
import superjson from 'superjson';
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        // deserializeData: superjson.deserialize,
      },
    },
  });
}
Copy
```

```
trpc/query-client.ts
ts
import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
import superjson from 'superjson';
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        // deserializeData: superjson.deserialize,
      },
    },
  });
}
Copy
```

我们在这里设置了一些默认选项：

* `staleTime`: 在服务器端渲染（SSR）中，我们通常希望将一些默认的 staleTime 设置为大于 0，以避免在客户端立即重新获取数据。
* `shouldDehydrateQuery`：这是一个函数，用于确定查询是否应该被脱水。由于 RSC 传输协议支持通过网络对承诺进行水合，我们扩展了 `defaultShouldDehydrateQuery` 函数，以包括仍在待处理的查询。这将允许我们在树的高处开始预取，然后在更低的客户端组件中消费该承诺。
* `serializeData` 和 `deserializeData`（可选）：如果您在上一步中设置了 [数据转换器 ](https://trpc.io/docs/server/data-transformers)，请设置此选项以确保在服务器与客户端边界之间水合查询客户端时数据被正确序列化。

### 4. 为客户端组件创建 tRPC 客户端[​](#4-create-a-trpc-client-for-client-components "Direct link to 4. Create a tRPC client for Client Components")

`trpc/client.tsx` 是从客户端组件消费您的 tRPC API 的入口。在这里，导入您的 tRPC 路由的 **类型定义 **，并使用 `createTRPCContext` 创建类型安全的钩子。我们还将从此文件中导出我们的上下文提供者。

```
trpc/client.tsx
tsx
'use client';
// ^-- to make sure we can mount the Provider from a server component
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
let browserQueryClient: QueryClient;
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://localhost:3000';
  })();
  return `${base}/api/trpc`;
}
export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          // transformer: superjson, <-- if you use a data transformer
          url: getUrl(),
        }),
      ],
    }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
Copy
```

```
trpc/client.tsx
tsx
'use client';
// ^-- to make sure we can mount the Provider from a server component
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
let browserQueryClient: QueryClient;
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://localhost:3000';
  })();
  return `${base}/api/trpc`;
}
export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          // transformer: superjson, <-- if you use a data transformer
          url: getUrl(),
        }),
      ],
    }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
Copy
```

在您的应用程序根部挂载提供者（例如，在使用 Next.js 时的 `app/layout.tsx`）。

### 5. 为服务器组件创建一个 tRPC 调用器[​](#5-create-a-trpc-caller-for-server-components "Direct link to 5. Create a tRPC caller for Server Components")

为了从服务器组件预取查询，我们从路由器创建一个代理。如果您的路由器在单独的服务器上，您也可以传入一个客户端。

```
trpc/server.tsx
tsx
import 'server-only'; // <-- ensure this file cannot be imported from the client
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';
// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});
// If your router is on a separate server, pass a client:
createTRPCOptionsProxy({
  client: createTRPCClient({
    links: [httpLink({ url: '...' })],
  }),
  queryClient: getQueryClient,
});
Copy
```

```
trpc/server.tsx
tsx
import 'server-only'; // <-- ensure this file cannot be imported from the client
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';
// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});
// If your router is on a separate server, pass a client:
createTRPCOptionsProxy({
  client: createTRPCClient({
    links: [httpLink({ url: '...' })],
  }),
  queryClient: getQueryClient,
});
Copy
```

## 使用您的 API[​](#using-your-api "Direct link to Using your API")

现在您可以在应用中使用您的 tRPC API。虽然您可以像在其他 React 应用中一样在客户端组件中使用 React Query 钩子，但我们可以通过在树的高层服务器组件中预取查询来利用 RSC 的能力。您可能对这个概念很熟悉，称为“边渲染边获取”，通常实现为加载器。这意味着请求会尽快发出，但在使用 `useQuery` 或 `useSuspenseQuery` 钩子时不会暂停，直到数据被需要。

```
app/page.tsx
tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient, trpc } from '~/trpc/server';
import { ClientGreeting } from './client-greeting';
export default async function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.hello.queryOptions({
      /** input */
    }),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>...</div>
      {/** ... */}
      <ClientGreeting />
    </HydrationBoundary>
  );
}
Copy
```

```
app/page.tsx
tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient, trpc } from '~/trpc/server';
import { ClientGreeting } from './client-greeting';
export default async function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.hello.queryOptions({
      /** input */
    }),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>...</div>
      {/** ... */}
      <ClientGreeting />
    </HydrationBoundary>
  );
}
Copy
```

```
app/client-greeting.tsx
tsx
'use client';
// <-- hooks can only be used in client components
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '~/trpc/client';
export function ClientGreeting() {
  const trpc = useTRPC();
  const greeting = useQuery(trpc.hello.queryOptions({ text: 'world' }));
  if (!greeting.data) return <div>Loading...</div>;
  return <div>{greeting.data.greeting}</div>;
}
Copy
```

```
app/client-greeting.tsx
tsx
'use client';
// <-- hooks can only be used in client components
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '~/trpc/client';
export function ClientGreeting() {
  const trpc = useTRPC();
  const greeting = useQuery(trpc.hello.queryOptions({ text: 'world' }));
  if (!greeting.data) return <div>Loading...</div>;
  return <div>{greeting.data.greeting}</div>;
}
Copy
```

提示

您还可以创建一个 `prefetch` 和 `HydrateClient` 辅助函数，使其更加简洁和可重用：

```
trpc/server.tsx
tsx
export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
Copy
```

```
trpc/server.tsx
tsx
export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
Copy
```

然后你可以像这样使用它：

```
tsx
import { HydrateClient, prefetch, trpc } from '~/trpc/server';
function Home() {
  prefetch(
    trpc.hello.queryOptions({
      /** input */
    }),
  );
  return (
    <HydrateClient>
      <div>...</div>
      {/** ... */}
      <ClientGreeting />
    </HydrateClient>
  );
}
Copy
```

```
tsx
import { HydrateClient, prefetch, trpc } from '~/trpc/server';
function Home() {
  prefetch(
    trpc.hello.queryOptions({
      /** input */
    }),
  );
  return (
    <HydrateClient>
      <div>...</div>
      {/** ... */}
      <ClientGreeting />
    </HydrateClient>
  );
}
Copy
```

### 利用 Suspense[​](#leveraging-suspense "Direct link to Leveraging Suspense")

您可能更喜欢使用 Suspense 和 Error Boundaries 来处理加载和错误状态。您可以通过使用 `useSuspenseQuery` 钩子来实现这一点。

```
app/page.tsx
tsx
import { HydrateClient, prefetch, trpc } from '~/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ClientGreeting } from './client-greeting';
export default async function Home() {
  prefetch(trpc.hello.queryOptions());
  return (
    <HydrateClient>
      <div>...</div>
      {/** ... */}
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientGreeting />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
Copy
```

```
app/page.tsx
tsx
import { HydrateClient, prefetch, trpc } from '~/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ClientGreeting } from './client-greeting';
export default async function Home() {
  prefetch(trpc.hello.queryOptions());
  return (
    <HydrateClient>
      <div>...</div>
      {/** ... */}
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientGreeting />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
Copy
```

```
app/client-greeting.tsx
tsx
'use client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { trpc } from '~/trpc/client';
export function ClientGreeting() {
  const trpc = useTRPC();
  const [data] = useSuspenseQuery(trpc.hello.queryOptions());
  return <div>{data.greeting}</div>;
}
Copy
```

```
app/client-greeting.tsx
tsx
'use client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { trpc } from '~/trpc/client';
export function ClientGreeting() {
  const trpc = useTRPC();
  const [data] = useSuspenseQuery(trpc.hello.queryOptions());
  return <div>{data.greeting}</div>;
}
Copy
```

### 在服务器组件中获取数据[​](#getting-data-in-a-server-component "Direct link to Getting data in a server component")

如果您需要在服务器组件中访问数据，我们建议创建一个服务器调用器并直接使用它。请注意，这种方法与您的查询客户端是分离的，并且不会将数据存储在缓存中。这意味着您不能在服务器组件中使用数据并期望它在客户端可用。这是故意的，详细说明请参见[高级服务器渲染 ](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#data-ownership-and-revalidation)。 指南。

```
trpc/server.tsx
tsx
// ...
export const caller = appRouter.createCaller(createTRPCContext);
Copy
```

```
trpc/server.tsx
tsx
// ...
export const caller = appRouter.createCaller(createTRPCContext);
Copy
```

```
app/page.tsx
tsx
import { caller } from '~/trpc/server';
export default async function Home() {
  const greeting = await caller.hello();
  //    ^? { greeting: string }
  return <div>{greeting.greeting}</div>;
}
Copy
```

```
app/page.tsx
tsx
import { caller } from '~/trpc/server';
export default async function Home() {
  const greeting = await caller.hello();
  //    ^? { greeting: string }
  return <div>{greeting.greeting}</div>;
}
Copy
```

如果你**真的**需要在服务器和客户端组件中使用数据，并理解在指南中解释的权衡， [高级服务器渲染](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#data-ownership-and-revalidation) 你可以使用 `fetchQuery` 而不是 `prefetch`，以便在服务器上获取数据并将其传递到客户端：

```
app/page.tsx
tsx
import { getQueryClient, HydrateClient, trpc } from '~/trpc/server';
export default async function Home() {
  const queryClient = getQueryClient();
  const greeting = await queryClient.fetchQuery(trpc.hello.queryOptions());
  // Do something with greeting on the server
  return (
    <HydrateClient>
      <div>...</div>
      {/** ... */}
      <ClientGreeting />
    </HydrateClient>
  );
}
Copy
```

```
app/page.tsx
tsx
import { getQueryClient, HydrateClient, trpc } from '~/trpc/server';
export default async function Home() {
  const queryClient = getQueryClient();
  const greeting = await queryClient.fetchQuery(trpc.hello.queryOptions());
  // Do something with greeting on the server
  return (
    <HydrateClient>
      <div>...</div>
      {/** ... */}
      <ClientGreeting />
    </HydrateClient>
  );
}
Copy
```

[](https://github.com/trpc/trpc/tree/main/www/docs/client/tanstack-react-query/server-components.mdx)