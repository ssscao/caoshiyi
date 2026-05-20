/**
 * 【文件大致作用】：
 *   本文件是博客系统的“文章主列表页（Index Page）”，对应网站访问的 `/blog` 路由路径。
 *   它主要负责：
 *   1. 配置整张网页的 SEO 元数据（如浏览器标签页标题、描述、以及适配 Twitter/X、微信等平台的社交分享大图卡片）。
 *   2. 搭建博客聚合页的视觉骨架（大标题、个性口号描述）。
 *   3. 引入并渲染真实的博客列表网格组件 `<BlogPosts />`，并限制单页最多展示 20 篇文章。
 *   4. 配置 Next.js 的高级缓存机制（ISR），每隔 60 秒自动在后台刷新一次页面内容。
 * 
 * 【哪些文件可能会用到当前文件】：
 *   - 本文件是 Next.js App Router 架构中的专属约定文件（page.tsx）。它不需要被任何其他代码文件手动 `import`，
 *     Next.js 的框架路由引擎会自动抓取这个文件，并将其编译映射为用户浏览器访问 `/blog` 时看到的独立前端页面。
 * 
 * 【当前文件使用了哪些文件】：
 *   - `./BlogPosts`（即 `app/(main)/blog/BlogPosts.tsx`，负责去数据库或 CMS 抓取文章并用刚才学到的 BlogPostCard 罗列出来）
 *   - `~/components/ui/Container`（通用的页面响应式两侧留白对齐布局容器）
 *   - `~/components/links/SocialLink`（虽然引入了，但当前代码版本中处于待使用状态）
 */

// 引入网页排版平衡器。它极其聪明，能自动计算字数，防止短句在换行时末尾悲惨地孤零零留出一个字（孤字断行）
import Balancer from 'react-wrap-balancer'

import { SocialLink } from '~/components/links/SocialLink'
import { Container } from '~/components/ui/Container'

// 引入同级目录下的文章列表组件（负责真正去读数据并铺设网格布局）
import { BlogPosts } from './BlogPosts'

// 提取出博客的个性简介，用于复用到多个 SEO 标签中
const description = '干爆地球。'

/**
 * 【高级 SEO 配置】：Next.js 专属的元数据导出。
 * 只要在这里 export 一个叫 metadata 的对象，Next.js 会自动把它注入到最终 HTML 的 <head> 标签里。
 * 这样搜索引擎爬虫（Google、百度）和社交软件（微信、Twitter）就能秒懂你的网页内容。
 */
export const metadata = {
  title: '我的博客',
  description,
  // OpenGraph 规范：决定了当你的网站链接被转发到手机微信、Discord、飞书时，弹出的那个精致卡片的标题和简介
  openGraph: {
    title: '我的博客',
    description,
  },
  // Twitter/X 卡片规范：决定了链接被发到推特上时，会不会渲染成一张抓人眼球的漂亮“大图卡片”
  twitter: {
    title: '我的博客',
    description,
    card: 'summary_large_image', // 声明使用大图形式的分享卡片
  },
}

// 主页面组件。注意：这里没有 'use client'，说明它默认是一个高贵且性能极佳的【服务端组件（Server Component）】
// 作者在代码中留了一个 TODO 注释，提醒自己未来在这里追加“分页加载”或“无限滚动（瀑布流）”功能。
export default function BlogPage() {
  return (
    // Container 组件负责在超大屏幕（如 2K 屏、4K 屏）上限制网页最大宽度，并在手机端自动缩进留白
    <Container className="mt-16 sm:mt-24">
      {/* 头部区域：最大宽度限制为 2xl，让文字排版处于最舒适的阅读视线宽度内 */}
      <header className="max-w-2xl">
        {/* 极具个性的博客大标题 */}
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          干爆宇宙
        </h1>
        {/* 博客简介：使用 <Balancer> 包裹，确保 description 文本换行时两行视觉重量绝对均衡 */}
        <p className="my-6 text-base text-zinc-600 dark:text-zinc-400">
          <Balancer>{description}</Balancer>
        </p>
      </header>

      {/* 文章网格展示区：手机端展示 1 列（grid-cols-1），大屏幕（lg）自动横向平铺为 2 列（lg:grid-cols-2） */}
      <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-20 lg:grid-cols-2 lg:gap-8">
        {/* 实例化列表组件，并传参告诉它：这次请帮我拉取并展示最新发表的 20 篇文章 */}
        <BlogPosts limit={20} />
      </div>
    </Container>
  )
}

/**
 * 【Next.js 核心黑魔法：增量静态再生 (ISR)】
 * 导出一行特定的常量 revalidate。数字 60 代表 60 秒。
 * 它的意思是：当用户访问 `/blog` 时，Next.js 不会每次都去翻数据库（那太慢了），而是直接把之前生成好的静态 HTML 秒传给用户。
 * 但每隔 60 秒，Next.js 会在后台悄悄重新读取一次最新文章。
 * 这种模式完美兼顾了“静态网页的极致打开速度”与“动态内容的实时更新”，性能无敌。
 */
export const revalidate = 60
