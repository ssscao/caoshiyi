/**
 * 【文件大致作用】：
 *   本文件是博客文章详情页的“全局加载过渡状态（Loading Fallback）”。
 *   由于文章详情页（[slug]/page.tsx）需要从远程数据库或 Sanity CMS 异步抓取数据，
 *   在数据没有完全下载完毕、网页处于“白屏加载中”的间隙，Next.js 会自动捕获并渲染这个文件。
 *   它实现了一个极其极简且科幻的加载动画：屏幕中央闪烁着一个半透明的 UFO 图标（脉冲呼吸灯特效）。
 * 
 * 【哪些文件可能会用到当前文件】：
 *   - 本文件是 Next.js App Router 架构中的专属约定文件（loading.tsx）。
 *     它不需要被任何文件手动引入，只要和文章详情页 `page.tsx` 躺在同一个文件夹下，
 *     框架路由引擎就会在幕后自动将其包装成一个 React Suspense 边框。
 * 
 * 【当前文件使用了哪些文件】：
 *   - `~/assets`（引入了项目专属的定制图标组件 UFOIcon）
 *   - `~/components/ui/Container`（复用页面的两边留白响应式对齐容器，保证加载区域和真实文章区域宽度严丝合缝）
 */

import { UFOIcon } from '~/assets'
import { Container } from '~/components/ui/Container'

// 组件命名为 BlogPostPageSkeleton（文章页骨架屏）
export default function BlogPostPageSkeleton() {
  return (
    // 容器设为 relative（相对定位），方便内部的加载动画进行绝对定位居中
    // min-h-screen：确保加载状态撑满至少一整屏高度，防止页面在加载时底部突兀地上移顶死
    <Container className="relative mt-16 min-h-screen lg:mt-32">
      
      {/* 居中大盒子：absolute inset-0 代表铺满整个父级容器，flex 布局将其中的 UFO 图标完美居中 */}
      <div className="absolute inset-0 flex items-center justify-center">
        
        {/* 
          【核心动效】：
          animate-pulse：Tailwind 预设的“脉冲呼吸灯”动画。它会让这个小盒子在 2 秒内不断地、顺滑地从不透明变为半透明，再变回不透明。
          text-5xl：把 UFO 矢量图标的尺寸放大到 5xl（约 48 像素）。
          text-zinc-500/50：使用中灰色的锌色，同时后面加 `/50` 代表自带 50% 的初始透明度，让图标看起来非常低调、深邃。
        */}
        <div className="animate-pulse text-5xl text-zinc-500/50">
          <UFOIcon />
        </div>
      </div>

    </Container>
  )
}
