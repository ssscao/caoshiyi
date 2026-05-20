// 引入日期规范化工具，把时间戳变成好看的 YYYY/MM/DD 格式
import { parseDateTime } from '@zolplay/utils'
// 引入官方的高性能图片组件，负责卡片上封面图的智能加载
import Image from 'next/image'
// 引入 Next.js 官方的客户端路由跳转组件。用它跳转不会刷新整个网页，体验就像单页应用一样快
import Link from 'next/link'

// 统一引入卡片上要用的各种小图标（日历、点击量、沙漏、手稿）
import {
  CalendarIcon,
  CursorClickIcon,
  HourglassIcon,
  ScriptIcon,
} from '~/assets'
// 引入数字美化工具，把过万的数字变成带 w 的简写（例如 1.2w）
import { prettifyNumber } from '~/lib/math'
// 引入文章对象的 TypeScript 类型定义，用于做数据的严格检验
import { type Post } from '~/sanity/schemas/post'


// 定义并导出单篇文章卡片组件。接收 post（单篇文章的各种数据）和 views（该文章的浏览量）
export function BlogPostCard({ post, views }: { post: Post; views: number }) {
  // 从传入的 post 对象中解构出需要的属性：标题、链接标识、主图、发布时间、分类、阅读时长
  const { title, slug, mainImage, publishedAt, categories, readingTime } = post

  return (
    // 使用 Link 包裹整个卡片，使其变成一个可点击的超链接
    <Link
      // 点击后动态跳转到对应的文章详情页路径
      href={`/blog/${slug}`}
      // prefetch={false} 意味着关闭 Next.js 默认的“静默预加载”功能，只有当鼠标移上去或滑到这里时才去加载该页代码，省流量
      prefetch={false}
      // transform-gpu 开启显卡加速；transition-transform 绑定过渡；hover:-translate-y-0.5 让鼠标悬停时卡片微微上浮
      className="group relative flex w-full transform-gpu flex-col rounded-3xl bg-transparent ring-2 ring-[--post-image-bg] transition-transform hover:-translate-y-0.5"
      // 【高级设计】：动态把 Sanity 提取出的封面图片色调（前景色 foreground、背景色 background、图片URL）注入成 CSS 全局变量
      style={
        {
          '--post-image-fg': mainImage.asset.dominant?.foreground,
          '--post-image-bg': mainImage.asset.dominant?.background,
          '--post-image': `url(${mainImage.asset.url}`,
        } as React.CSSProperties // 欺骗 TypeScript 解释器，允许写入自定义 CSS 变量而不会报错
      }
    >
      {/* 封面图的盛放盒子，固定高宽比为 16:9（aspect-[240/135]） */}
      <div className="relative aspect-[240/135] w-full">
        <Image
          src={mainImage.asset.url}
          alt=""
          className="rounded-t-3xl object-cover" // 只有上面两个角是圆角（rounded-t-3xl），图片裁剪铺满（object-cover）
          placeholder="blur"                    // 开启高斯模糊占位防白屏
          blurDataURL={mainImage.asset.lqip}    // 填入从后台直接带过来的低像素模糊预览小图
          fill                                  // 撑满父容器盒子
          // 响应式图片加载策略：手机端加载 100% 宽度的图，平板及以上大屏加载 50% 宽度的图，极致节约用户的手机流量
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
        />
      </div>

      {/* 【复杂的卡片下半部分文字区】：这里运用了极为复杂的 CSS 混合模式（bg-blend-overlay）和毛玻璃滤镜（backdrop-blur）
          before: 和 after: 两个伪元素在底层层层铺设了半透明和渐变的色彩层，组成了富有科技感的背景 */}
      <span className="relative z-10 flex w-full flex-1 shrink-0 flex-col justify-between gap-0.5 rounded-b-[calc(1.5rem+1px)] bg-cover bg-bottom bg-no-repeat p-4 bg-blend-overlay [background-image:var(--post-image)] before:pointer-events-none before:absolute before:inset-0 before:z-10 before:select-none before:rounded-b-[calc(1.5rem-1px)] before:bg-[--post-image-bg] before:opacity-70 before:transition-opacity after:pointer-events-none after:absolute after:inset-0 after:z-10 after:select-none after:rounded-b-[calc(1.5rem-1px)] after:bg-gradient-to-b after:from-transparent after:to-[--post-image-bg] after:backdrop-blur after:transition-opacity group-hover:before:opacity-30 md:p-5">
        
        {/* 文章标题：这里的颜色 text-[--post-image-fg] 直接使用了上面style里传入的图片前景色。
            group-hover:opacity-100 意味着默认时字有点半透明（opacity-70），鼠标移入整个卡片（group）时字会立刻完全变亮 */}
        <h2 className="z-20 text-base font-bold tracking-tight text-[--post-image-fg] opacity-70 transition-opacity group-hover:opacity-100 md:text-xl">
          {title}
        </h2>


        {/* 底部的元数据栏（包括左边的日期分类，以及右边的浏览量时长） */}
        <span className="relative z-20 flex items-center justify-between opacity-50 transition-opacity group-hover:opacity-80">
          
          {/* 左侧信息组合：发布日期 + 分类标签 */}
          <span className="inline-flex items-center space-x-3">
            {/* 渲染发布时间 */}
            <span className="inline-flex items-center space-x-1 text-[12px] font-medium text-[--post-image-fg] md:text-sm">
              <CalendarIcon />
              <span>
                {parseDateTime({ date: new Date(publishedAt) })?.format(
                  'YYYY/MM/DD'
                )}
              </span>
            </span>

            {/* 安全验证：如果后台传过来的分类确实是一个正常的数组（Array.isArray），就把它们串在一起渲染出来 */}
            {Array.isArray(categories) && (
              <span className="inline-flex items-center space-x-1 text-[12px] font-medium text-[--post-image-fg] md:text-sm">
                <ScriptIcon />
                {/* 用逗号拼接数组里的分类名称 */}
                <span>{categories.join(', ')}</span>
              </span>
            )}
          </span>


          {/* 右侧信息组合：点击数 + 阅读时长 */}
          <span className="inline-flex items-center space-x-3 text-[12px] font-medium text-[--post-image-fg] md:text-xs">
            {/* 渲染缩写美化后的点击量 */}
            <span className="inline-flex items-center space-x-1">
              <CursorClickIcon />
              <span>{prettifyNumber(views, true)}</span>
            </span>

            {/* 渲染四舍五入后的预计阅读分钟数 */}
            <span className="inline-flex items-center space-x-1">
              <HourglassIcon />
              <span>{readingTime.toFixed(0)}分钟阅读</span>
            </span>
          </span>

        </span>
      </span>
    </Link>
  )
}
