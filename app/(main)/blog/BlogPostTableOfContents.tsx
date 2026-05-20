/**
 * 【文件大致作用】：
 *   本文件是博客文章的“动态目录（Table of Contents）”组件。
 *   它不仅能在侧边栏渲染出文章的各级大纲标题（支持 h1-h4 缩进进阶），还附带了极其高级的视觉特效：
 *   1. 页面加载时，目录文字会像波浪一样自带“毛玻璃模糊渐显（Blur Fade-in）”和级联动效（Stagger Animation）。
 *   2. 当读者滚动阅读文章时，它能实时监测当前的滚动位置，自动高亮高显当前正在阅读的那一个章节标题。
 * 
 * 【哪些文件可能会用到当前文件】：
 *   - `app/(main)/blog/[slug]/page.tsx` (文章详情页)：通常放置在文章的左侧或右侧固定侧边栏中，作为导航。
 * 
 * 【当前文件使用了哪些文件】：
 *   - 本文件属于原子 UI 组件，主要依赖外部开源工具库（如 `framer-motion` 动画库和 `@zolplay/utils` 的 `clsxm` 样式合并函数），
 *     接收的数据结构兼容 Sanity CMS 的富文本 Block 块级数据。
 */

'use client' // 涉及滚动监听、浏览器窗口高度计算以及动画，必须为客户端组件

import { clsxm } from '@zolplay/utils'
// 引入顶级动画库 framer-motion，motion 用于创建动画组件，useScroll 用于捕获滚动条数据
import { motion, useScroll, type Variants } from 'framer-motion'
import React from 'react'

// TypeScript 类型定义：定义 Sanity CMS 富文本中单个最小文字片段（Span）的骨架
interface HeadingNode {
  _type: 'span'
  text: string
  _key: string
}

// TypeScript 类型定义：定义一整行块级元素的骨架（比如一段话或一个标题）
interface Node {
  _type: 'block'
  style: 'h1' | 'h2' | 'h3' | 'h4' // 只挑出 h1 到 h4 的标题行
  _key: string
  children?: HeadingNode[]
}

/**
 * 【大纲解析器函数】：把后端传来杂乱的文章全量富文本数据，过滤并精简提炼成一个干净的目录数组
 */
const parseOutline = (nodes: Node[]) => {
  return nodes
    // 过滤：只保留类型是 block 且样式是以 "h" 开头（即 h1, h2, h3, h4）的标题元素
    .filter((node) => node._type === 'block' && node.style.startsWith('h'))
    // 映射变换：把复杂的后端结构简化成前端目录秒懂的小对象
    .map((node) => {
      return {
        style: node.style, // 标题级别（h2 还是 h3），用于决定缩进距离
        text:
          node.children?.[0] !== undefined ? node.children[0].text ?? '' : '', // 提取出具体的标题文字
        id: node._key,     // 使用 Sanity 生成的唯一密钥（_key）作为网页锚点连接的 ID
      }
    })
}

/**
 * 【动画配置 1】：外层大列表（ul）的入场动画规则
 */
const listVariants = {
  hidden: { opacity: 0 }, // 初始状态：完全透明隐藏
  visible: {
    opacity: 1, // 展现状态：完全不透明
    transition: {
      when: 'beforeChildren', // 秩序保证：等自己亮起来之后，再开始渲染里面的子文字
      staggerChildren: 0.08,  // 级联时间：子标题之间间隔 0.08 秒像多米诺骨牌一样顺次亮起
      delay: 0.255,           // 延迟 0.255 秒再开场，错开页面主框架加载的时机
      type: 'spring',         // 采用物理弹簧动效，听起来更灵动自然
      stiffness: 150,         // 弹簧劲度系数
      damping: 20,            // 弹簧阻尼比
    },
  },
} satisfies Variants

/**
 * 【动画配置 2】：内层子项（li）标题文字的入场动画规则
 */
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 5,               // 初始位置向下微移 5 像素
    filter: 'blur(8px)', // 【高级视觉】：初始时带有 8 像素的毛玻璃模糊，极具现代科技感
  },
  visible: {
    opacity: 1,
    y: 0,               // 回归标准位置
    filter: 'blur(0px)', // 模糊度完全清零，字迹变清晰
  },
} satisfies Variants

export function BlogPostTableOfContents({ headings }: { headings: Node[] }) {
  // 得到精炼后的干净大纲数组
  const outline = parseOutline(headings)
  // 获取整个页面的滚动轴状态
  const { scrollY } = useScroll()
  // 定义一个状态状态：用来记录网页上当前正处于读者眼皮底下的那一个标题的 ID
  const [highlightedHeadingId, setHighlightedHeadingId] = React.useState<
    string | null
  >(null)

  // 【核心机制】：滚动监听。随时追踪读者读到哪儿了
  React.useEffect(() => {
    const handleScroll = () => {
      // 找到文章的主体标签元素
      const articleElement = document.querySelector<HTMLElement>(
        'article[data-postid]'
      )
      
      // 计算出文章中每一个真实的标题节点，现在距离浏览器可见窗口顶部的相对高度（Y值）
      const outlineYs = outline.map((node) => {
        // 利用锚点选择器定位到正文里具体的 <a> 标签标题
        const el = document.querySelector<HTMLAnchorElement>(
          `article ${node.style}:where([id="${node.id}"]) > a`
        )
        if (!el) return 0
        // getBoundingClientRect().top 代表当前元素距离屏幕最顶端的绝对像素距离
        return el.getBoundingClientRect().top
      })

      if (articleElement) {
        // 边界处理：如果用户已经彻底滑过了整篇文章（滑到了最底部评论区或页脚）
        if (scrollY.get() > articleElement.scrollHeight) {
          setHighlightedHeadingId(null) // 目录里不再高亮任何标题
        } else {
          // 寻找分水岭：在所有标题的相对高度中，寻找第一个高度大于 0（即还在当前视口下方或正好露头）的标题索引
          const idx = outlineYs.findIndex((y) => y > 0)
          
          if (idx === -1) {
            // 如果所有标题的高度都小于 0，说明读者已经读得非常深，所有标题都在屏幕上方了，直接高亮最后一个标题
            setHighlightedHeadingId(outline[outline.length - 1]?.id ?? null)
          } else {
            // 否则，高亮当前露出顶部的这一个标题项
            setHighlightedHeadingId(outline[idx]?.id ?? null)
          }
        }
      }
    }

    // 将滚动监听器绑定到浏览器窗口
    window.addEventListener('scroll', handleScroll)

    // 组件卸载时销毁监听器，防止内存泄漏，这是个非常优秀的代码好习惯
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [outline, scrollY])

  return (
    // motion.ul：带有动画超能力的原生 ul 列表
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={listVariants}
      className="group pointer-events-auto flex flex-col space-y-2 text-zinc-500"
    >
      {outline.map((node) => (
        // motion.li：带有动画超能力的行标签
        <motion.li
          key={node.id}
          variants={itemVariants}
          className={clsxm(
            'text-[12px] font-medium leading-[18px] transition-colors duration-300',
            // 响应式排版：如果是三级标题，左侧缩进 1 单位（ml-1）
            node.style === 'h3' && 'ml-1',
            // 如果是四级标题，左侧缩进 2 单位（ml-2），形成好看的层级树沙漏排版
            node.style === 'h4' && 'ml-2',
            // 动态高亮样式判定：
            node.id === highlightedHeadingId
              ? 'text-zinc-900 dark:text-zinc-200' // 如果是当前阅读位置，文字变黑（暗黑模式下变白）高显
              : 'hover:text-zinc-700 dark:hover:text-zinc-400 group-hover:[&:not(:hover)]:text-zinc-400 dark:group-hover:[&:not(:hover)]:text-zinc-600'
              /**
               * 【上面这行 Tailwind 属于教科书级别的神仙写法】：
               * group-hover:[&:not(:hover)]:text-zinc-400 
               * 它的意思是：当用户的鼠标移入“整个目录大盒子（group）”时，
               * 那些“没有被鼠标直接悬停（not :hover）”的其余普通标题，通通会集体变淡褪色（变浅灰）。
               * 这样可以强行将用户的视觉焦点，聚集在鼠标当前悬浮的那单一行上，交互感拉满！
               */
          )}
          // 无障碍网页设计规范：如果是当前高亮项，打上“当前位置”的盲人语音标签
          aria-label={node.id === highlightedHeadingId ? '当前位置' : undefined}
        >
          {/* 使用原生的网页 HTML 锚点链接 href="#ID"，点击即可瞬间平滑跳转到正文对应的段落 */}
          <a href={`#${node.id}`} className="block w-full">
            {node.text}
          </a>
        </motion.li>
      ))}
    </motion.ul>
  )
}
