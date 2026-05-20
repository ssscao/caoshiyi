/**
 * 【文件大致作用】：
 *   本文件是一个“数据同步加载器”（Headless Component）。它没有自己的 UI 画面（返回 null），
 *   专门负责在浏览器后台通过 API 请求获取当前文章的最新评论，并把数据实时同步到 Valtio 全局状态中。
 * 
 * 【哪些文件可能会用到当前文件】：
 *   - `app/(main)/blog/[slug]/page.tsx` (或名为 `BlogPostPage.tsx` 的文章详情页)：
 *     它会把这个加载器塞在页面底部，让它在后台默默工作，为整篇博客赋予数据活力。
 * 
 * 【当前文件使用了哪些文件】：
 *   - `app/(main)/blog/blog-post.state.ts`（用于往这个全局状态大广播台写入 postId 和塞入新评论）
 *   - `~/db/dto/comment.dto`（使用其中的 PostIDLessCommentDto 评论数据结构规范）
 *   - `~/sanity/schemas/post`（使用其中的 Post 文章数据结构规范）
 */

'use client' // 声明这是一个客户端组件，允许在内部使用浏览器专属的 useEffect 和网络请求

import React from 'react'
// 引入强大的前端数据请求利器：React Query（用于自动化管理网络请求、缓存和自动重试）
import { useQuery } from 'react-query'

// 导入上一节我们刚写过注释的全局状态库及添加评论的方法
import { addComment, blogPostState } from '~/app/(main)/blog/blog-post.state'
import { type PostIDLessCommentDto } from '~/db/dto/comment.dto'
import { type Post } from '~/sanity/schemas/post'

// 导出状态加载器组件，接收当前文章的完整 post 数据作为参数
export function BlogPostStateLoader({ post }: { post: Post }) {
  
  // 【核心功能 1】：使用 React Query 悄悄在后台发请求，拉取这篇文章的评论列表
  // 解构赋值：把请求拿到的 data 重命名为 comments
  const { data: comments } = useQuery(
    // 缓存钥匙（Query Key）：只要钥匙里的文章 ID（post._id）变了，它就会自动重新发请求获取新文章的评论
    ['comments', post._id],
    // 真正负责干活的异步请求函数
    async () => {
      const res = await fetch(`/api/comments/${post._id}`) // 请求后端的评论接口
      const data = await res.json()                       // 将结果转为 JSON 格式
      return data as PostIDLessCommentDto[]               // 强制断言声明这就是我们需要的标准评论数组
    },
    // 初始配置：在网络请求还没成功返回之前，默认给一个空数组 []，防止页面因为没数据而报错挂掉
    { initialData: [] }
  )

  // 【核心功能 2】：每当文章的 ID 发生变化时，立刻同步给 Valtio 全局状态
  React.useEffect(() => {
    blogPostState.postId = post._id
  }, [post._id]) // 依赖项：只有当传入的文章 ID 变了，才会触发这里的赋值


  // 【核心功能 3】：每当 React Query 拿到了新的评论列表（comments 更新时），执行同步
  React.useEffect(() => {
    // 唯独追加新评论（only append new comments）
    comments?.forEach((comment) => {
      // 严谨去重检测：遍历新拿到的每条评论，如果发现全局 Valtio 状态的 comments 数组里已经有这个评论的 id 了，就直接跳过（return）
      if (blogPostState.comments.find((c) => c.id === comment.id)) return
      
      // 如果大广播台里还没有这条评论，就调用上一节写好的 addComment 方法，把它追加进去
      addComment(comment)
    })
  }, [comments]) // 依赖项：只有当请求回来的新评论数组发生变化时，才触发这段去重并塞入的逻辑

  // 作为一个专门管逻辑、管运输的“幕后黑手”组件，它不需要渲染任何好看的皮肤，所以直接返回空（null）
  return null
}
