/**
 * 【文件大致作用】：
 *   本文件是整个博客/网站系统的“关于我（About Me）”独立静态页面，对应访问路径为 `/about`。
 *   目前它是一个标准的**“开发占位符（Placeholder / WIP Page）”**。
 *   虽然代码只有几行，展示的也是一句俏皮的“给我点时间开发一下...”，但它的存在确保了整个网站
 *   在导航栏点击“关于”时不会发生 404 崩塌，而是维持了优雅、完整的站点闭环架构。
 * 
 * 【哪些文件可能会用到当前文件】：
 *   - 本文件作为 Next.js 约定的页面入口（page.tsx），由框架的路由引擎自动调度。
 *     当游客在顶部导航栏（Navbar）或底部页脚（Footer）点击 “About” 或 “关于” 链接时，就会渲染此页面。
 * 
 * 【当前文件使用了哪些文件】：
 *   - `~/components/ui/Container`（复用全站统一的全局自适应宽度容器，确保文字的左侧对齐线和主页、博客页完全一致）
 */

import { Container } from '~/components/ui/Container'

export default function AboutPage() {
  return (
    // <Container> 保证了无论在 2K 显示器还是在 iPhone 手机上，内容都会乖乖呆在中间，两边自动留白
    <Container>
      
      {/* 
        mt-10：margin-top: 2.5rem (40 像素)。给上方空出一点舒适的呼吸感。
        h1：标准的网页一级标题标签，语义化极好。
      */}
      <h1 className="mt-10 text-xl font-medium text-zinc-800 dark:text-zinc-200">
        给我点时间开发一下...
      </h1>
      
    </Container>
  )
}
