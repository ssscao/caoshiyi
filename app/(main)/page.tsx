import React from 'react'

// 引入“博客文章列表”组件，用来在首页显示最近写的文章
import { BlogPosts } from '~/app/(main)/blog/BlogPosts'
// 引入“大标题/个人介绍”组件，通常包含作者的名字和一句酷酷的自我介绍
import { Headline } from '~/app/(main)/Headline'
// 引入“邮件订阅”组件，就是一个让读者输入邮箱、订阅周刊的输入框和按钮
import { Newsletter } from '~/app/(main)/Newsletter'
// 引入“照片墙/横向相册”组件，用来在首页展示一排精美的照片
import { Photos } from '~/app/(main)/Photos'
// 引入“简历/工作经历”组件，用来展示作者在哪些公司呆过
import { Resume } from '~/app/(main)/Resume'
// 引入一个“铅笔”图标，后面会放在“近期文章”四个字的左边做装饰
import { PencilSwooshIcon } from '~/assets'
// 引入“容器”组件。它的作用是控制网页内容的宽度，让内容在屏幕居中，两边留出好看的空白
import { Container } from '~/components/ui/Container'
// 引入一个数据库查询函数。负责去 Sanity CMS（后台管理系统）里把网站的配置数据取出来
import { getSettings } from '~/sanity/queries'


// 定义并导出主页面函数。async（异步）意味着页面需要等待数据库的数据下载完，再往后渲染
export default async function BlogHomePage() {
  // 执行 getSettings() 函数去后台拿到网站的配置数据（如照片、简历），await 表示“等数据下载完再执行下一步”
  const settings = await getSettings()

  return (
    // React 的空标签（Fragment），用来包裹多个子组件，同时避免在网页中生成无意义的 HTML 标签
    <>
      {/* 呼出容器组件，className="mt-10" 是样式，意思是让个人介绍板块距离网页顶部留出一点间距 */}
      <Container className="mt-10">
        {/* 渲染个人大标题与自我介绍板块 */}
        <Headline />
      </Container>


      {/* 条件渲染：如果后台配置里有照片（settings.heroPhotos 存在），就显示照片墙组件，没有就不渲染，防止报错 */}
      {settings?.heroPhotos && <Photos photos={settings.heroPhotos} />}


      {/* 另一个大容器，mt-24 md:mt-28 实现了自适应：手机端距离上方照片墙近一点，电脑端远一点 */}
      <Container className="mt-24 md:mt-28">
        {/* 网格布局布局盒子：手机端（grid-cols-1）内容上下单列堆叠；电脑端（lg:grid-cols-2）自动变成左右两列 */}
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          {/* 左边这一列的垂直排版盒子 */}
          <div className="flex flex-col gap-6 pt-6">
            {/* 左边列的小标题，dark:text-zinc-100 让它支持暗黑模式，白天深色字，晚上亮色字 */}
            <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {/* 渲染前面导入的铅笔小图标 */}
              <PencilSwooshIcon className="h-5 w-5 flex-none" />
              {/* “近期文章”文本，ml-2 让文字离左边的铅笔图标稍微空开一点点 */}
              <span className="ml-2">近期文章</span>
            </h2>
            {/* 在小标题下方，把最近写的博客文章一篇篇排列出来 */}
            <BlogPosts />
          </div>


          {/* 右边这一列（侧边栏 aside）。lg:sticky lg:top-8 实现了高级效果：电脑端滚动鼠标时，侧边栏会钉在屏幕上不动 */}
          <aside className="space-y-10 lg:sticky lg:top-8 lg:h-fit lg:pl-16 xl:pl-20">
            {/* 在侧边栏最上方放置“邮件订阅”组件 */}
            <Newsletter />
            {/* 条件渲染：如果后台配置了简历（settings.resume 存在），就把简历与工作经历组件显示出来 */}
            {settings?.resume && <Resume resume={settings.resume} />}
          </aside>
        </div>
      </Container>
    </>
  )
}


// Next.js 的高级性能优化（增量静态再生）：首页在访问后会被缓存 60 秒。
// 60秒内不管多少人访问都直接读缓存（速度极快），60秒后有新访问才会悄悄在后台更新网页，防止数据库崩溃。
export const revalidate = 60
