'use client'

// 加上这一行，把这个数字美化工具函数拉进来
import { prettifyNumber } from '~/lib/math'


// 引入第三方日期解析工具，用来将各种奇怪的后台时间格式规范化
import { parseDateTime } from '@zolplay/utils'
// 引入强大的动画库，专门负责给页面上的封面图、标题制作丝滑的入场动画效果
import { motion } from 'framer-motion'
// 引入 Next.js 官方的高性能图片组件，能自动压缩图片并做延迟加载以提高网速
import Image from 'next/image'
import React from 'react'
// 引入排版神器，专门防止文章标题在换行时出现“孤字成行”或错位的情况，让美观度大增
import Balancer from 'react-wrap-balancer'

// 引入状态加载器，可能用于在后台悄悄增加这篇文章的阅读计数（PV统计）
import { BlogPostStateLoader } from '~/app/(main)/blog/BlogPostStateLoader'
// 引入博客互动点赞、小情绪（Mood）选择的右侧挂件组件
import { BlogReactions } from '~/app/(main)/blog/BlogReactions'
// 批量引入页面各处要用到的小图标（日历、点击、沙漏、铅笔、回退等）
import {
  CalendarIcon,
  CursorClickIcon,
  HourglassIcon,
  PencilSwooshIcon,
  ScriptIcon,
  UTurnLeftIcon,
} from '~/assets'
// 引入防止服务器/客户端渲染不一致的隔离组件，确保某些特殊代码只在浏览器中执行
import { ClientOnly } from '~/components/ClientOnly'
// 引入 Sanity CMS 专用的富文本渲染器，把后台编辑的博客主内容转换为漂亮的 HTML 标签
import { PostPortableText } from '~/components/PostPortableText'
// 引入排版组件，自动为文章内的文本、段落、加粗等加上优雅的间距与字体样式
import { Prose } from '~/components/Prose'
// 引入统一封装的按钮组件
import { Button } from '~/components/ui/Button'
// 引入居中容器组件，限制文章的最大宽度，防止屏幕太大时文字横向拉得太长导致阅读疲劳
import { Container } from '~/components/ui/Container'
// 引入数学工具函数，负责把巨大的数字（如 12345）美化成可读性更高的格式（如 12.3k）
import { type PostDetail } from '~/sanity/schemas/post'

// 引入单篇文章卡片，用于页面底部渲染“相关文章”推荐
import { BlogPostCard } from './BlogPostCard'
// 引入左侧静态悬浮的文章目录导航组件
import { BlogPostTableOfContents } from './BlogPostTableOfContents'


// 定义并导出博客详情页主组件。大括号里的是入参（Props），接收文章数据、点击量、点赞量等
export function BlogPostPage({
  post,
  views,
  reactions,
  relatedViews,
}: {
  // 定义传入数据的 TypeScript 类型规则，规定了数据里必须有哪些字段
  post: PostDetail
  views?: number
  reactions?: number[]
  relatedViews: number[]
}) {
  return (
    // 最外层大容器，mt-16 lg:mt-32 实现了响应式间距：手机端距离顶部少一点，电脑端多一点
    <Container className="mt-16 lg:mt-32">
      {/* 整个页面的三栏网格基础。md:flex 代表在中大屏幕上开启弹性盒模型，xl:relative 为绝对定位按钮做参考 */}
      <div className="w-full md:flex md:justify-between xl:relative">
        
        {/* 【左侧栏】：hidden lg:block 意味着默认在手机、平板上完全隐藏，只有到电脑大屏幕（lg）上才以 160px 宽度显示 */}
        <aside className="hidden w-[160px] shrink-0 lg:block">
          {/* sticky top-2 pt-20 实现了极其高级的“吸顶”效果：向下滚动页面时，目录会静止悬浮在顶部不随页面滚走 */}
          <div className="sticky top-2 pt-20">
            {/* 渲染文章目录组件，并把文章里的所有标题层级（headings）传进去 */}
            <BlogPostTableOfContents headings={post.headings} />
          </div>
        </aside>

        {/* 【中间主内容栏】：限制最大宽度为 2xl（约 672px），这是最适合人类眼睛阅读的舒适宽度 */}
        <div className="max-w-2xl md:flex-1 md:shrink-0">
          {/* 返回按钮：点击跳回 /blog。className 里那一长串是 Tailwind CSS，定义了暗黑模式、悬浮环绕阴影等精致特效 */}
          <Button
            href="/blog"
            variant="secondary"
            aria-label="返回博客页面"
            className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20 lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0"
          >
            {/* 按钮内的回退图标。group-hover 代表鼠标停在整个按钮上时，图标的线条颜色会同时发生变深过渡 */}
            <UTurnLeftIcon className="h-8 w-8 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
          </Button>

          {/* HTML5 标准的文章标签，带上 data-postid 方便统计脚本获取文章 ID */}
          <article data-postid={post._id}>
            {/* 文章头部区域：after:开头的样式利用了 CSS 伪元素，在标题下方画了一条由深到透明、极具质感的渐变分界线 */}
            <header className="relative flex flex-col items-center pb-5 after:absolute after:-bottom-1 after:block after:h-px after:w-full after:rounded after:bg-gradient-to-r after:from-zinc-400/20 after:via-zinc-200/10 after:to-transparent dark:after:from-zinc-600/20 dark:after:via-zinc-700/10">
              
              {/* 动效包裹盒子：控制封面图的宽高比为 16:9（240/135），并且在电脑端故意将图片拓宽到主栏外（w-[120%]） */}
              <motion.div
                className="relative mb-7 aspect-[240/135] w-full md:mb-12 md:w-[120%]"
                // 动画初始状态：透明度为 0（隐形），缩放为 0.96 倍，向下偏移 10 像素
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                // 动画最终状态：完全不透明，恢复正常大小，回到原位
                animate={{ opacity: 1, scale: 1, y: 0 }}
                // 动画物理特性配置：采用 spring（弹簧阻尼）模式，这会让图片入场时带有类似原生 iOS 的高级弹性触感
                transition={{
                  duration: 0.35,
                  type: 'spring',
                  stiffness: 120, // 弹簧刚度，数值越大弹得越快
                  damping: 20,    // 阻尼，控制最后回弹晃动的幅度大小
                }}
              >
                {/* 封面图的【底层高斯模糊背影】：利用绝对定位藏在主图下方，blur-xl 彻底模糊，saturate-150 提高色彩饱和度，营造出炫酷的发光氛围感 */}
                <div className="absolute z-0 hidden aspect-[240/135] w-full blur-xl saturate-150 after:absolute after:inset-0 after:hidden after:bg-white/50 dark:after:bg-black/50 md:block md:after:block">
                  <Image
                    src={post.mainImage.asset.url}
                    alt=""
                    className="select-none"
                    unoptimized
                    fill
                    aria-hidden={true} // 告诉盲人读屏软件：这层只是个装饰背影，请直接忽略
                  />
                </div>

                {/* 封面图的【上层真实清晰主图】 */}
                <Image
                  src={post.mainImage.asset.url} // 图片地址
                  alt={post.title}               // 图片无法显示时的替代文字
                  className="select-none rounded-2xl ring-1 ring-zinc-900/5 transition dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20 md:rounded-3xl"
                  placeholder="blur"             // 开启图片未下载完时的模糊渐变占位效果
                  blurDataURL={post.mainImage.asset.lqip} // 极小、极模糊的底图 base64 字符串，用于瞬间加载防白屏
                  unoptimized
                  fill                           // 让图片自动撑满父容器组件的空间
                />
              </motion.div>

              {/* 动效包裹盒子：负责渲染文章元信息（日期、分类标签），比主图延迟 0.1 秒入场 */}
              <motion.div
                className="flex w-full items-center space-x-4 text-sm font-medium text-zinc-600/80 dark:text-zinc-400/80"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.15,
                  type: 'spring',
                  stiffness: 150,
                  damping: 20,
                  delay: 0.1, // 延迟入场
                }}
              >
                {/* 语义化时间标签 */}
                <time
                  dateTime={post.publishedAt}
                  className="flex items-center space-x-1.5"
                >
                  <CalendarIcon />
                  <span>
                    {/* 解析日期对象，并强行将其格式化为标准的 “年/月/日” 格式展示 */}
                    {parseDateTime({
                      date: new Date(post.publishedAt),
                    })?.format('YYYY/MM/DD')}
                  </span>
                </time>

                {/* 文章分类展示区域 */}
                <span className="inline-flex items-center space-x-1.5">
                  <ScriptIcon />
                  {/* 后台拿到的分类通常是数组（如 ['Nextjs', '前端']），用 join(', ') 将它们串成带逗号的单行文本 */}
                  <span>{post.categories?.join(', ')}</span>
                </span>
              </motion.div>

              {/* 动效大标题（H1）：文字超大（text-4xl sm:text-5xl），加粗，延迟 0.2 秒入场 */}
              <motion.h1
                className="mt-6 w-full text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  type: 'spring',
                  stiffness: 150,
                  damping: 30,
                  delay: 0.2,
                }}
              >
                {/* 使用 Balancer 排版神器包裹标题文字 */}
                <Balancer>{post.title}</Balancer>
              </motion.h1>

              {/* 动效副标题/摘要（P标签）：字体略显灰色（text-zinc-500），延迟 0.23 秒入场 */}
              <motion.p
                className="my-5 w-full text-sm font-medium text-zinc-500"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  type: 'spring',
                  stiffness: 150,
                  damping: 20,
                  delay: 0.23,
                }}
              >
                {post.description}
              </motion.p>

              {/* 动效数据统计栏（点击量和阅读时长），延迟 0.255 秒入场 */}
              <motion.div
                className="flex w-full items-center space-x-4 text-sm font-medium text-zinc-700/50 dark:text-zinc-300/50"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.15,
                  type: 'spring',
                  stiffness: 150,
                  damping: 20,
                  delay: 0.255,
                }}
              >
                {/* 点击量统计。title 属性可以让鼠标悬浮在上面时，弹出未经过缩写的完整数字字符串 */}
                <span
                  className="inline-flex items-center space-x-1.5"
                  title={views?.toString()}
                >
                  <CursorClickIcon />
                  {/* 使用 prettifyNumber 函数把浏览量（如 24500）转化为好看的（如 2.4w 次点击） */}
                  <span>{prettifyNumber(views ?? 0, true)}次点击</span>
                </span>

                {/* 阅读时间展示 */}
                <span className="inline-flex items-center space-x-1.5">
                  <HourglassIcon />
                  {/* toFixed(0) 意思是四舍五入保留 0 位小数（取整数分钟数） */}
                  <span>{post.readingTime.toFixed(0)}分钟阅读</span>
                </span>
              </motion.div>
            </header>

            {/* 【正文核心渲染区】：Prose 组件提供排版大底，PostPortableText 负责把 Sanity 的一堆复杂 JSON 内容转成图文网页 */}
            <Prose className="mt-8">
              <PostPortableText value={post.body} />
            </Prose>
          </article>
        </div>

        {/* 【右侧栏】：宽度 90px，隐藏于手机端，电脑端（lg）悬浮吸顶展现 */}
        <aside className="hidden w-[90px] shrink-0 lg:block">
          <div className="sticky top-2 flex justify-end pt-20">
            {/* 调出点赞/心情互动组件，传入文章ID、心情基调和当前文章的点赞互动数组 */}
            <BlogReactions
              _id={post._id}
              mood={post.mood}
              reactions={reactions}
            />
          </div>
        </aside>
      </div>

      {/* 【底部相关文章推荐区域】：使用三元表达式判断。如果后台配置了相关推荐（post.related 存在且有数据）则渲染展示 */}
      {post.related && post.related.length > 0 ? (
        <section className="mb-12 mt-32">
          {/* 相关推荐小标题 */}
          <h2 className="mb-6 flex items-center justify-center text-lg font-bold text-zinc-900 dark:text-zinc-100">
            <PencilSwooshIcon className="h-5 w-5 flex-none" />
            <span className="ml-2">相关文章</span>
          </h2>

          {/* 相关文章卡片的网格自适应排版盒子：利用 CSS 的 auto-fit 实现了在大屏幕上横向铺开排列的精美画廊效果 */}
          <div className="mt-6 grid grid-cols-1 justify-center gap-6 md:grid-cols-[repeat(auto-fit,75%)] lg:grid-cols-[repeat(auto-fit,45%)] lg:gap-8">
            {/* 循环遍历推荐文章数组，生成一个个微型的文章卡片 */}
            {post.related.map((post, idx) => (
              <BlogPostCard
                post={post}
                views={relatedViews[idx] ?? 0} // 传入对应的相关文章点击量
                key={post._id}
              />
            ))}
          </div>
        </section>
      ) : null /* 如果后台没有配置相关文章，则这里隐形（返回 null），什么都不在页面上渲染 */}

      {/* 只在客户端浏览器加载的底层状态加载器 */}
      <ClientOnly>
        <BlogPostStateLoader post={post} />
      </ClientOnly>
    </Container>
  )
}
