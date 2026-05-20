/**
 * 【文件大致作用】：
 *   本文件是博客系统的“文章详情动态路由页（Dynamic Route Page）”，对应访问路径为 `/blog/[slug]`。
 *   它是典型的 Next.js 【服务端组件（Server Component）】，充当了高能的数据编排大脑：
 *   1. 负责动态提取 URL 里的文章别名（slug），去 Sanity CMS 查出对应的完整文章内容。
 *   2. 负责【动态 SEO 生成】：提取文章标题、简介和封面图，实时动态生成每个页面的 Meta 标签。
 *   3. 负责【全栈数据联动】：合并来自 Sanity 的文章内容、来自 Redis 的高并发实时浏览量（Views），
 *      以及通过内部 API 抓取到的情感互动计数（Reactions）。
 *   4. 环境安全隔离：区分了开发环境与生产环境，避免本地开发时污染线上的真实统计数据。
 * 
 * 【哪些文件可能会用到当前文件】：
 *   - 本文件是 Next.js 约定的路由主入口（page.tsx）。当读者点击任意文章卡片跳到详情页时，
 *     框架引擎会自动调度此文件。
 * 
 * 【当前文件使用了哪些文件】：
 *   - `~/app/(main)/blog/BlogPostPage`（真正的文章详情 UI 呈现组件，即渲染排版、点赞面板等）
 *   - `~/sanity/queries`（其中的 getBlogPost 函数，负责去 CMS 数据库抓取文章）
 *   - `~/lib/redis` & `~/config/kv`（用于读写高速 Redis 缓存中的浏览量）
 *   - `~/env.mjs`（用来识别当前是本地电脑开发环境，还是 Vercel 云端线上生产环境）
 */

import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogPostPage } from '~/app/(main)/blog/BlogPostPage'
import { kvKeys } from '~/config/kv'
import { env } from '~/env.mjs'
import { url } from '~/lib'
import { redis } from '~/lib/redis'
import { getBlogPost } from '~/sanity/queries'

/**
 * 【高级动态 SEO 黑魔法】：generateMetadata
 * 当用户或搜索引擎爬虫请求某篇博客时，Next.js 会优先自动执行这个函数。
 * 它允许我们根据当前文章的真实内容，动态定制 <head> 里的网页标题、描述和抓取大图。
 */
export const generateMetadata = async ({
  params,
}: {
  params: { slug: string }
}) => {
  // 1. 根据当前网址的 [slug] 去拉取文章内容
  const post = await getBlogPost(params.slug)
  // 安全防御：如果数据库里压根没这篇文章，立刻触发 Next.js 的 notFound() 拦截器，直接给用户看 404 页面
  if (!post) {
    notFound()
  }

  const { title, description, mainImage } = post

  // 2. 动态组装并返回符合 Next.js 标准的元数据对象
  return {
    title,
    description,
    // 适配社交网络分享（微信、Slack、Discord 等）的卡片样式
    openGraph: {
      title,
      description,
      images: [
        {
          url: mainImage.asset.url, // 将文章主图设置为分享卡片的缩略图
        },
      ],
      type: 'article', // 声明网页类型为结构化的“文章”
    },
    // 专为 Twitter/X 平台定制的高级分享大图卡片标签
    twitter: {
      images: [
        {
          url: mainImage.asset.url,
        },
      ],
      title,
      description,
      card: 'summary_large_image', // 强制使用抓人眼球的超大图卡片格式
      site: '@thecalicastle',
      creator: '@thecalicastle',
    },
  } satisfies Metadata
}

/**
 * 【文章页主异步函数】：Server Component
 */
export default async function BlogPage({
  params,
}: {
  params: { slug: string }
}) {
  // 同步抓取 Sanity CMS 中的文章主体数据
  const post = await getBlogPost(params.slug)
  if (!post) {
    notFound()
  }

  /* ------------------------------------------------------------------------
   * 【核心功能区一：实时浏览量统计（Views）】
   * ------------------------------------------------------------------------ */
  let views: number
  // 环境防御：只有当网站运行在 Vercel 线上生产环境（production）时，才触发真实的 Redis 计数自增
  if (env.VERCEL_ENV === 'production') {
    // redis.incr 会让对应的 Key 自增 1，并秒级返回自增后的最新数字
    views = await redis.incr(kvKeys.postViews(post._id))
  } else {
    // 如果你在本地电脑开发（localhost），为了防止你每次刷新页面都疯狂给线上刷播放量，
    // 这里硬编码返回一个固定数字，既方便开发调试，又隔离了数据污染。
    views = 30578
  }

  /* ------------------------------------------------------------------------
   * 【核心功能区二：情感回应点赞数拉取（Reactions）】
   * ------------------------------------------------------------------------ */
  let reactions: number[] = []
  try {
    if (env.VERCEL_ENV === 'production') {
      // 线上环境：利用 Next.js 原生的 fetch 请求我们自己的后台点赞接口
      const res = await fetch(url(`/api/reactions?id=${post._id}`), {
        // 【高级缓存控制】：贴上专门的 tags 标签。
        // 未来用户只要在前端点赞，我们只需要在后端 revalidateTag(`reactions:${post._id}`),
        // 就能精准擦除这篇博客的点赞缓存，而不需要刷新整张网页的内容，体验极佳。
        next: {
          tags: [`reactions:${post._id}`],
        },
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        reactions = data
      }
    } else {
      // 本地开发环境：随机生成 4 个几万内的超大数字，供你肉眼测试“数字美化工具函数（prettifyNumber）”是否工作正常
      reactions = Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * 50000)
      )
    }
  } catch (error) {
    console.error('拉取表情点赞数据失败：', error)
  }

  /* ------------------------------------------------------------------------
   * 【核心功能区三：相关推荐文章的浏览量合并（Related Views）】
   * ------------------------------------------------------------------------ */
  let relatedViews: number[] = []
  // 如果这篇文章底部有作者设置的“推荐阅读”关联文章
  if (typeof post.related !== 'undefined' && post.related.length > 0) {
    if (env.VERCEL_ENV === 'development') {
      // 开发模式：直接随机 mock 一堆几百的浏览量
      relatedViews = post.related.map(() => Math.floor(Math.random() * 1000))
    } else {
      // 【架构高光：高并发合并查询（MGET）】
      // 如果底部关联了 5 篇文章，普通的做法是写一个循环去查 5 次 Redis，那会引发 5 次网络来回延迟（RTT 爆炸）。
      // 这里的做法极其专业：先用 map 把 5 篇文章的 ID 提取出来组成一个 Keys 数组，
      // 然后利用 redis.mget 批量查询命令，仅花费【一次网络通信】，就把所有相关文章的阅读量一股脑全打包带回来！
      const postIdKeys = post.related.map(({ _id }) => kvKeys.postViews(_id))
      relatedViews = await redis.mget<number[]>(...postIdKeys)
    }
  }

  /* ------------------------------------------------------------------------
   * 【最终投递渲染】：将拼装好的完备数据流，灌入负责前端排版的渲染组件中
   * ------------------------------------------------------------------------ */
  return (
    <BlogPostPage
      post={post}
      views={views}
      relatedViews={relatedViews}
      reactions={reactions.length > 0 ? reactions : undefined}
    />
  )
}

// 增量静态再生（ISR）：每隔 60 秒在后台静默刷新整篇博客的静态内容
export const revalidate = 60
