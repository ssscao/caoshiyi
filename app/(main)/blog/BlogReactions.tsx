/**
 * 【文件大致作用】：
 *   本文件是博客文章的“文章情感互动/点赞浮动面板”组件。
 *   读者可以在这里给文章投递各种表情回应（如鼓掌、放烟花、点火等）。它包含两大高级亮点：
 *   1. 视觉特效：利用贝塞尔曲线和物理弹簧运动，完美复刻了 macOS Dock 栏鼠标靠近时图标动态放大的阻尼动效。
 *   2. 交互逻辑：采用前端高级的“乐观更新”技术，点击时瞬间增加计数，无需等待服务器漫长的网络延迟。
 * 
 * 【哪些文件可能会用到当前文件】：
 *   - `app/(main)/blog/[slug]/page.tsx`（文章详情页）：通常以固定侧边栏（Sticky）的形式悬浮在文章左侧或右侧，方便读者随时点赞。
 * 
 * 【当前文件使用了哪些文件】：
 *   - `~/lib/math`（使用其中的 prettifyNumber 函数，用于美化超大点赞数字的格式化）
 *   - `~/sanity/schemas/post`（使用其中的 Post 类型，用于读取文章的 ID 和情绪分类）
 */

'use client' // 包含复杂的鼠标坐标追踪、动画帧监听和 PATCH 异步请求，必须声明为客户端组件

import {
  motion,
  type MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import Image from 'next/image'
import React from 'react'

import { prettifyNumber } from '~/lib/math'
import { type Post } from '~/sanity/schemas/post'

/**
 * 【情绪策略映射函数】：根据作者在后台为这篇文章注入的“情绪基调（mood）”，动态决定展示哪四种表情符号。
 * 让悲伤的文章展示祈祷、拥抱；快乐的文章展示欢呼、烟花，极具人文关怀。
 */
function moodToReactions(mood: Post['mood']) {
  switch (mood) {
    case 'happy': // 快乐的氛围
      return ['claps', 'tada', 'confetti', 'fire'] // 鼓掌、庆祝、五彩纸屑、火
    case 'sad':   // 悲伤/严肃的氛围
      return ['pray', 'cry', 'heart', 'hugs']     // 祈祷、哭泣、爱心、拥抱
    default:      // 默认常规氛围
      return ['claps', 'heart', 'thumbs-up', 'fire'] // 鼓掌、爱心、点赞、火
  }
}

export function BlogReactions({
  _id,
  mood,
  reactions,
}: Pick<Post, '_id' | 'mood'> & { reactions?: number[] }) {
  // 创建一个高性能的运动变量 mouseY，用于实时记录鼠标当前在浏览器窗口里的垂直 Y 坐标
  // 初始值设为 Infinity（无穷大），代表鼠标还没移入，距离无限远
  const mouseY = useMotionValue(Infinity)

  // 鼠标移动时的回调函数：高频同步更新当前的鼠标 Y 轴坐标
  const onMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      mouseY.set(e.clientY)
    },
    [mouseY]
  )

  // 将传入的初始点赞数组（例如 [12, 5, 0, 8]）同步到本地的缓存状态中
  const [cachedReactions, setCachedReactions] = React.useState(
    reactions ?? [0, 0, 0, 0]
  )

  /**
   * 【核心交互：乐观更新】：
   * 当用户点击某个表情时，如果等服务器回应再加数字，页面会有零点几秒的卡顿。
   * “乐观更新”的做法是：管它三七二十一，先假设服务器一定会成功，在本地盲目把数字 +1，让用户感觉“秒赞”；
   * 同时悄悄向后端发请求，等后端把真实的数据返回后，再做一次最终的校准。
   */
  const onClick = React.useCallback(
    async (index: number) => {
      // 1. 第一步（乐观估计）：不等网络结果，直接在前端肉眼可见地把对应表情的数字自增 1
      setCachedReactions((prev) => {
        const next = [...prev]
        next[index]++
        return next
      })

      // 2. 第二步：在幕后悄悄向服务器发送 PATCH 计数修改请求
      const res = await fetch(`/api/reactions?id=${_id}&index=${index}`, {
        method: 'PATCH',
      })
      // 3. 第三步：拿到后端持久化成功后的最新准确数组，更新缓存，纠正可能存在的误差
      const { data } = (await res.json()) as { data: number[] }
      setCachedReactions(data)
    },
    [_id]
  )

  return (
    // 外层包裹的大盒子：负责卡片的整体入场动画（从旋转 90 度到完全展开）
    <motion.div
      className="pointer-events-auto flex w-12 flex-col items-center justify-center gap-8 rounded-3xl bg-gradient-to-b from-zinc-100/80 to-white/90 px-1 pb-8 pt-4 ring-1 ring-zinc-400/10 backdrop-blur-lg dark:from-zinc-800/80 dark:to-zinc-950/80 dark:ring-zinc-500/10"
      onMouseMove={onMouseMove} // 绑定鼠标移动监听
      onMouseLeave={() => mouseY.set(Infinity)} // 鼠标移出后，把鼠标坐标重置为无穷远，让图标收缩复原
      initial={{
        opacity: 0,
        y: 8,
        rotateY: 90, // 三维沿 Y 轴旋转 90 度（立起来隐藏）
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotateY: 0,  // 平滑转正，面向读者
      }}
      transition={{
        delay: 0.5,
        duration: 0.55,
        type: 'spring', // 标志性的弹簧质感入场
        damping: 15,
        stiffness: 180,
      }}
    >
      {/* 根据文章基调渲染 4 个动态图标 */}
      {moodToReactions(mood).map((reaction, idx) => (
        <ReactIcon
          key={idx}
          y={mouseY} // 将鼠标的实时坐标向下传递给每一个小图标组件
          image={`/reactions/${reaction}.png`}
          count={cachedReactions[idx]}
          onClick={() => onClick(idx)}
        />
      ))}
    </motion.div>
  )
}

/**
 * 【子组件】：单个表情图标按钮。负责计算自己与鼠标的距离，并决定自己该放大多大。
 */
function ReactIcon({
  y,
  image,
  count = 0,
  onClick,
}: {
  y: MotionValue
  image: string
  count?: number
  onClick?: () => void
}) {
  // 绑定一个 DOM 引用，用来测量当前这个图标在屏幕上的绝对垂直高度
  const ref = React.useRef<HTMLButtonElement>(null)

  /**
   * 【数学变换 1】：计算当前鼠标与本图标“核心原点”之间的直线距离
   */
  const distance = useTransform(y, (val) => {
    // 拿到当前按钮在屏幕上的边界坐标（bounds）
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 }
    // 鼠标 Y 坐标 - 按钮的顶端 Y 坐标 - 按钮高度的一半 = 鼠标距离按钮中心的绝对像素差值
    return val - bounds.y - bounds.height / 2
  })

  /**
   * 【数学变换 2】：距离映射（放大曲线映射）
   * 这里的数字含义非常经典：
   * 如果像素差值在 [-120px, 0px, 120px] 范围内波动（即鼠标进入了图标上下 120 像素的引力圈）：
   * 图标的高度将从标准的 [24px] 顺滑膨胀到最顶峰的 [56px]，再收缩回 [24px]。
   */
  const heightSync = useTransform(distance, [-120, 0, 120], [24, 56, 24])

  /**
   * 【物理弹性平滑】：如果只用上面的映射，图标变大变小会很僵硬。
   * 这里用 useSpring 注入一层物理世界特有的“质量（mass）”和“阻尼（damping）”，
   * 让图标在放大缩小的时候产生果冻般极其Q弹、解压的手感！
   */
  const height = useSpring(heightSync, {
    mass: 0.1,     // 质量极轻，反应极快
    stiffness: 180, // 刚度
    damping: 15,   // 阻尼
  })

  return (
    <motion.button
      ref={ref}
      type="button"
      style={{ height }} // 【核心】：把计算出的带有果冻物理反馈的高度，强行绑定到按钮的 CSS 高度上
      className="relative aspect-square h-8"
      whileTap={{
        scale: 1.3, // 点击的一瞬间，图标会产生 1.3 倍的Q弹放大反馈
      }}
      onClick={onClick}
    >
      <Image
        src={image}
        alt=""
        className="inline-block"
        priority          // 提高加载优先级
        fetchPriority="high" // 强行插队优先下载这些表情小图标，保证交互绝不卡顿
        fill
        unoptimized       // 禁用 Next.js 的图片裁剪服务，因为小表情直接读取原图速度最快
      />
      {/* 表情下方的数字计数君 */}
      <span className="absolute -bottom-6 left-0 flex w-full items-center justify-center whitespace-nowrap text-[12px] font-semibold text-zinc-700/30 dark:text-zinc-200/25">
        {prettifyNumber(count, true)}
      </span>
    </motion.button>
  )
}
