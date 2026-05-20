/**
 * 【文件大致作用】：
 *   本文件是整个系统的“用户注册（Sign Up）入口页”。
 *   作为前一个登录页（Sign In）的“亲兄弟”，它同样利用了 Clerk 的全栈身份认证托管方案。
 *   这行 `<SignUp />` 组件在幕后承载了极为繁琐的注册合规逻辑：
 *   包括：密码强度动态检测、邮箱/手机号验证码（OTP）实时发送与校验、OAuth 第三方社交账号一键开户等。
 * 
 * 【哪些文件可能会用到当前文件】：
 *   - 本文件是 Next.js App Router 架构中的专属路由页面文件（page.tsx）。
 *     上级文件夹命名为 `[[...sign-up]]`（可选全捕获路由）。
 *     在用户注册时，诸如去邮箱收验证码并填写的 `/sign-up/verify-email-address` 等中间步骤，
 *     都会在这个页面内通过原地变换表单视图来优雅完成。
 * 
 * 【当前文件使用了哪些文件】：
 *   - `@clerk/nextjs`（引入 Clerk 官方的预制全功能注册面板组件）
 *   - `~/components/ui/Container`（全站统一的自适应留白包裹容器）
 */

import { SignUp } from '@clerk/nextjs'

import { Container } from '~/components/ui/Container'

export default function Page() {
  return (
    // mt-24：让注册面板与顶部导航栏保持 96 像素的呼吸感间距
    // flex items-center justify-center：让复杂的注册卡片在视口中保持水平且垂直居中，视觉体验极为舒适
    <Container className="mt-24 flex items-center justify-center">
      
      {/* 
        Clerk 官方的核心注册原子组件。
        它会自动读取你在 Clerk 后台配置的“新用户必填字段”（如是否需要强制验证姓名、是否需要勾选服务条款等），
        并在用户注册成功后，自动根据环境变量将用户重定向至欢迎页或后台。
      */}
      <SignUp />
      
    </Container>
  )
}
