/**
 * 【文件大致作用】：
 *   本文件是 `(main)` 路由组下的“全局共享外壳布局（Root Layout / Shared Layout）”。
 *   如果说各个单独的 `page.tsx` 是舞台上走马灯般轮换的主角，那当前这个 layout 就是“雷打不动的舞台背景与基建”。
 *   它承载了整个网站所有核心页面共同享有的视觉资产与技术底座：
 *   1. 【高阶视觉层】：通过固定定位（fixed）叠加了复古科技感的网格背景（Grid）与顶部柔光渐变晕染（Radial Gradient），
 *      并搭建了全站中央对称的“卡片式大背板”。
 *   2. 【全站大件套】：把顶部导航栏 `<Header />` 和底部页脚 `<Footer />` 焊死在页面首尾，免去每个页面手动复制的痛苦。
 *   3. 【状态全域通】：引入了客户端请求状态管理器 `<QueryProvider>`（通常包裹了 React Query），让其肚子里所有的子组件都能随时进行高能异步数据拉取。
 *   4. 【数据雷达】：默默挂载 Vercel 官方的流量分析插件 `<Analytics />`，监测全网真实访客的足迹。
 * 
 * 【哪些文件可能会用到当前文件】：
 *   - 本文件是 Next.js App Router 架构中的专属布局约定文件（layout.tsx）。
 *     它会自动包裹 `(main)` 文件夹下的所有子路由页面（如 `/`, `/blog`, `/blog/[slug]`, `/about`）。
 * 
 * 【当前文件使用了哪些文件】：
 *   - `./blog/[slug]/blog.css`（直接把评论排版样式包干引入，确保全站多处复用时不失真）
 *   - `~/app/(main)/Header` & `~/app/(main)/Footer`（全站头尾大组件）
 *   - `~/app/QueryProvider`（React Query 的上下文状态提供者）
 */

import './blog/[slug]/blog.css'

import { Analytics } from '@vercel/analytics/react'
import { Suspense } from 'react'

import { Footer } from '~/app/(main)/Footer'
import { Header } from '~/app/(main)/Header'
import { QueryProvider } from '~/app/QueryProvider'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* 
        ==========================================================================
        【视觉特效层一：极客像素网格线（SVG Grid Background）】
        ==========================================================================
        pointer-events-none：【神级定位属性】—— 让这层背景变成“幽灵空气”。无论它叠得有多高，鼠标都能完美穿透它，
                            绝对不会干扰到下层真实文章内容的文字选中、链接点击或按钮触发。
        fixed inset-0：强行把这个小盒子钉死在屏幕的左上角，并横向纵向 100% 铺满整个浏览器视口。
        select-none：禁止用户用鼠标右键或拖拽来选中这张背景图。
        bg-[url('/grid-black.svg')]：Tailwind 任意值魔法。白天模式使用黑色的微弱线条网格，夜间模式（dark:）自动切成白色的线条网格。
      */}
      <div className="pointer-events-none fixed inset-0 select-none bg-[url('/grid-black.svg')] bg-top bg-repeat dark:bg-[url('/grid.svg')]" />
      
      {/* 
        ==========================================================================
        【视觉特效层二：手电筒式的顶部柔光氛围灯（Radial Gradient Glow）】
        ==========================================================================
        h-[800px]：这盏灯在视口顶部纵深向下晕染 800 像素后悄然隐形。
        bg-[radial-gradient(...)]：高阶原生 CSS 径向渐变。
        在屏幕顶部正中央（at 50% 0%）向下发射一束极淡的椭圆形柔光。白天是 4.5% 透明度的幽深微光，
        到了暗黑模式（dark:）则化身为 9% 透明度的皎洁月光，全站高档的极客感就是靠这两层背景撑起来的。
      */}
      <span className="pointer-events-none fixed top-0 block h-[800px] w-full select-none bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(5,5,5,0.045)_0%,rgba(0,0,0,0)_100%)] dark:bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0)_100%)]" />

      {/* 
        ==========================================================================
        【视觉特效层三：经典的中央对称“大卡片白背板”（Boxed Layout Architecture）】
        ==========================================================================
        这里的架构非常高级。为了在左右滚动条拉动时，让整个博客像一张高级精装卡片一样浮立在背景之上：
        它用一个 `fixed inset-0 flex justify-center` 容器在视口底部垫了一张最大宽度为 max-w-7xl（1280像素）的背景墙。
        ring-1 ring-zinc-100：给卡片的左右两侧加上一条极其细微的 1 像素亮灰色勾边。
        bg-zinc-50/90：主板自带 90% 的微弱磨砂半透明度，能隐约透出底下刚刚铺设的像素网格线。
      */}
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20" />
        </div>
      </div>

      {/* 
        ==========================================================================
        【真实内容与状态投递层（Application Root Core）】
        ==========================================================================
      */}
      {/* QueryProvider 全局包裹，保证后台的所有数据加载、状态缓存服务（如 TanStack Query）一路绿灯 */}
      <QueryProvider>
        {/* relative：将真实内容的定位权重提到最高，确保它悬浮在刚才那堆 fixed 背景层的正上方 */}
        <div className="relative text-zinc-800 dark:text-zinc-200">
          
          {/* 全局公共头部导航栏（内含 Logo、菜单项、暗黑/白天模式小太阳切换开关） */}
          <Header />
          
          {/* 【动态插座】：这里是 Next.js 的灵魂。用户访问首页，这里就塞入主页；访问 /blog，这里就塞入列表。 */}
          <main>{children}</main>
          
          {/* 
            【架构细节】：为什么要给 Footer 额外套一层 React 原生的 <Suspense>？
            因为优雅的 Footer 里面通常包含了一些需要实时动态计算的代码（例如通过 `usePathname` 检测当前高亮的路由、
            或者含有需要等待客户端挂载后才能显示真实年份的 `new Date().getFullYear()`）。
            用 <Suspense> 把它单独隔离成一个异步子树，可以确保即使页脚在服务端（SSR）渲染时存在微小的动态不确定性，
            也绝对不会拖累上面 <main> 区域那些核心文章主干内容的静态秒开速度（防止整页降级为完全的动态渲染）。
          */}
          <Suspense>
            <Footer />
          </Suspense>
          
        </div>
      </QueryProvider>

      {/* Vercel 官方提供的零配置数据统计雷达，用于分析网站的浏览量、跳出率等性能指标 */}
      <Analytics />
    </>
  )
}
