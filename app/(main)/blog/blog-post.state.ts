// 引入 Valtio 库的核心函数 proxy（代理）。它负责把一个普通的数据对象变成“会魔法的响应式对象”
import { proxy } from 'valtio'

// 引入评论数据的标准格式规范（DTO），用来约束一条评论里必须包含用户名、内容、时间等字段
import { type PostIDLessCommentDto } from '~/db/dto/comment.dto'

// TypeScript 别名定义：把 string（字符串类型）起个更好懂的别名叫 PostID
type PostID = string

// 使用 proxy 导出全局状态大广播台。尖括号 <...> 里面是 TypeScript 的类型紧箍咒，用来规范广播台的数据结构
export const blogPostState = proxy<{
  postId: PostID                         // 当前正在阅读的文章的唯一 ID
  currentBlockId: string | null          // 读者当前鼠标聚焦、悬浮或阅读的文章具体某一段落（Block）的 ID
  comments: PostIDLessCommentDto[]       // 这篇文章下的所有评论数据列表（一个数组）
  replyingTo: PostIDLessCommentDto | null // 当前用户正在“回复”的那条特定评论。如果没有在回复任何人，则为 null
}>({
  // 这里是大广播台的【初始默认值】
  postId: '',
  currentBlockId: null,
  comments: [],
  replyingTo: null,
})


// 【功能函数 1】：向这篇文章添加一条新评论
export function addComment(comment: PostIDLessCommentDto) {
  // 直接用原生的数组 push 方法把新评论塞进列表。由于 Valtio 的魔法代理，页面上的评论区域会自动刷新并显示它
  blogPostState.comments.push(comment)
}


// 【功能函数 2】：当用户点击某条评论旁边的“回复”按钮时触发
export function replyTo(comment: PostIDLessCommentDto) {
  // 把全局状态里的 replyingTo 设置为当前这条评论。此时，页面上的评论框就会自动变成“正在回复 xxx”的状态
  blogPostState.replyingTo = comment
}


// 【功能函数 3】：取消回复
export function clearReply() {
  // 把回复目标重新清空（变为 null），评论框恢复成普通的发表独立评论状态
  blogPostState.replyingTo = null
}


// 【功能函数 4】：聚焦、锁定某一篇文章的段落
export function focusBlock(blockId: string | null) {
  // 记录当前用户正停留在哪个段落 ID 上。这通常用于实现非常高级的功能：比如针对文章中某一句特定的话发表侧边栏评论
  blogPostState.currentBlockId = blockId
}


// 【功能函数 5】：清除段落聚焦
export function clearBlockFocus() {
  // 将当前段落聚焦清空，恢复普通状态
  blogPostState.currentBlockId = null
}
