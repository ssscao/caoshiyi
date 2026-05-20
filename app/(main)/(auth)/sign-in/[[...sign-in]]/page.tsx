/**
 * 【文件大致作用】：
 *   本文件是整个博客/网站系统的“用户登录（Sign In）入口页”。
 *   虽然它只有寥寥数行代码，但由于它利用了当今最火爆的第三方全栈认证身份管理方案 —— **Clerk**，
 *   这行 `<SignIn />` 组件在幕后其实已经帮你把“密码登录、手机验证码、Google/GitHub 第三方社交登录、
 *   两步验证（MFA）、找回密码”等所有极为繁琐的视觉界面与安全逻辑全套打包搞定了。
 * 
 * 【哪些文件可能会用到当前文件】：
 *   - 本文件是 Next.js App Router 架构中的专属路由页面文件（page.tsx）。
 *     它的上级文件夹命名为 `[[...sign-in]]`，这是一个高级路由黑话（可选捕获所有路由）。
 *     这意味着，无论是访问 `/sign-in`，还是登录过程中跳转到 `/sign-in/factor-one`（输入二次验证码），
 *     框架都会统统交由这个页面来渲染，保证登录心跳不断流。
 * 
 * 【当前文件使用了哪些文件】：
 *   - `@clerk/nextjs`（引入 Clerk 官方为 Next.js 深度定制的预制全功能登录面板）
 *   - `~/components/ui/Container`（复用全站统一的包裹容器，控制页面的最大宽度与两边留白）
 */

import { SignIn } from '@clerk/nextjs'

import { Container } from '~/components/ui/Container'

export default function Page() {
  return (
    // mt-24：距离顶部导航栏空出 96 像素的优雅安全距离，防止登录框顶到最上方
    // flex items-center justify-center：利用经典的 Flexbox 布局，将 Clerk 登录卡片在视口中“水平且垂直完美居中”
    <Container className="mt-24 flex items-center justify-center">
      
      {/* 
        Clerk 官方的核心登录原子组件。
        它会自动读取你在 Clerk Dashboard 以及本地环境变量（.env.local）中配置的：
        NEXT_PUBLIC_CLERK_SIGN_IN_URL、NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL 等规则，
        全自动完成登录成功后的重定向跳转。
      */}
      <SignIn />
      
    </Container>
  )
}
