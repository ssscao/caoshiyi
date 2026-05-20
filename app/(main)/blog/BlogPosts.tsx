// 引入 Redis 数据库存储浏览量时用到的“键名（Key）”生成规则
import { kvKeys } from '~/config/kv'
// 引入环境变量配置，用来判断当前是在“本地开发”还是“线上生产环境”
import { env } from '~/env.mjs'
// 引入 Redis 客户端，用来连接 Redis 数据库并读取实时的浏览量数据
import { redis } from '~/lib/redis'
// 引入数据库查询函数，负责去 Sanity CMS 里把最新的博客文章列表抓取出来
import { getLatestBlogPosts } from '~/sanity/queries'

// 引入单篇文章卡片的 UI 组件，负责把每一篇文章的标题、摘要、浏览量漂亮地渲染出来
import { BlogPostCard } from './BlogPostCard'


// 定义并导出 BlogPosts 组件。{ limit = 5 } 意思是默认只展示最新的 5 篇文章
export async function BlogPosts({ limit = 5 }) {
  // 去 Sanity CMS 抓取最新文章，如果没有拿到任何数据，则默认给一个空数组 [] 防止后续代码崩溃
  const posts = await getLatestBlogPosts({ limit, forDisplay: true }) || []
  // 使用 map 循环，把拿到的每篇文章的唯一 ID（_id），批量转换成在 Redis 数据库里查询浏览量所需的 Key 数组
  const postIdKeys = posts.map(({ _id }) => kvKeys.postViews(_id))

  // 创建一个用来存放所有文章浏览量的数字数组
  let views: number[] = []
  // 【贴心调试逻辑】如果判断当前处于本地电脑开发环境（development）
  if (env.VERCEL_ENV === 'development') {
    // 本地不连接真实的 Redis，而是给每篇文章随机生成一个 0 到 1000 之间的浏览量，方便看排版效果
    views = posts.map(() => Math.floor(Math.random() * 1000))
  } else {
    // 如果是在线上真实环境，且确实查到了文章（Key 数组不为空）
    if (postIdKeys.length > 0) {
      // 使用 redis.mget（批量获取命令）一次性把这几篇文章在线上的真实浏览量全部拿下来，效率极高
      views = await redis.mget<number[]>(...postIdKeys)
    }
  }

  return (
    // React 的空标签，用来包裹循环出来的多篇文章卡片
    <>
      {/* 循环遍历文章数组。post 代表当前文章，idx 代表它是第几篇。
          调用单篇文章卡片组件，views={views[idx] ?? 0} 的意思是：把上面从 Redis 查到的对应位置的浏览量传过去，如果没查到就显示 0 */}
      {posts.map((post, idx) => (
        <BlogPostCard post={post} views={views[idx] ?? 0} key={post._id} />
      ))}
    </>
  )
}
