/**
 * 【文件大致作用】：
 *   本文件是整个网站的“全局暗黑模式皮肤控制器（Theme Provider Wrapper）”。
 *   虽然代码极其精简，只有短短几行，但它是让整个项目完美支持“白天/夜间/系统自适应切换”的底层基建。
 *   它 local 封装了第三方库 `next-themes` 的核心 Provider，并强制打上了 `'use client'` 标签，
 *   专门用来解决 Next.js 全新 App Router 架构与传统 React Context（上下文状态共享）之间的冲突。
 * 
 * 【哪些文件可能会用到当前文件】：
 *   - 项目最外层的全局布局文件，比如 `app/layout.tsx`。
 *     它会像一件厚衣服一样，把全站的所有页面组件（children）拦腰包裹在里面，赋予它们共享主题状态的能力。
 * 
 * 【当前文件使用了哪些文件】：
 *   - `next-themes`（前端界极其著名的暗黑模式全自动化解决方案库）
 */

'use client' // 声明这是一个客户端组件。因为主题切换的核心是依赖 React 的 Context API，必须在浏览器端才能运转

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes/dist/types'

/**
 * 带有大厂特殊避坑补丁的自定义主题提供者组件。
 * 这里的注释链接（https://github.com/pacocoursey/next-themes/issues/152...）
 * 记录了开源社区里一个关于 Next.js 13/14+ 编译崩溃的经典 Issue 解决方案。
 */
export function ThemeProvider(props: ThemeProviderProps) {
  // {...props} 是优雅的属性透传（Props Passthrough）。
  // 外部在使用我们这个定制组件时传进来的任何配置（比如 defaultTheme="system" 或 attribute="class"），
  // 都会毫无保留地平移灌入到底层的 NextThemesProvider 中。
  return <NextThemesProvider {...props} />
}
