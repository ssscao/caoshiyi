/**
 * 【文件大致作用】：
 *   本文件是一个非常惊艳的“精美交互式相册/剪贴画墙组件（Interactive Photo Gallery）”。
 *   它通常平铺在主页的黄金视觉位，用来展示博主的生活照、旅行记录或工位环境。
 *   这个组件的技术含金量极高，完美融合了两种截然不同的用户体验（UX）策略：
 *   1. 【桌面端：风琴式动态手风琴（Hover Accordion Effect）】：
 *      在宽屏设备上，照片会微微错落倾斜（2° 或 -1°），自带复古胶片感。当鼠标悬浮在某张照片上时，
 *      该照片会瞬间“吸饱色彩”并丝滑拉伸变宽，同时利用 Framer Motion 的 layout 机制把周围的照片温柔地推开。
 *   2. 【移动端：原生流式画廊（CSS Scroll Snap Carousel）】：
 *      在手机等小屏幕上，自动关闭复杂的悬浮拉伸逻辑（因为手机没有鼠标悬浮），
 *      无缝降级为支持手指横向清扫、且带有原生磁性吸附边界（Scroll Snap）的移动端画廊。
 * 
 * 【哪些文件可能会用到当前文件】：
 *   - `app/(main)/page.tsx`（主页核心组件，直接从数据源读取一组图片 URL 字符串数组并扔给本组件）
 * 
 * 【当前文件使用了哪些文件】：
 *   - `framer-motion`（提供高能物理弹簧动效及布局流自动校准）
 *   - `next/image`（Next.js 官方的高性能、自适应图片加载引擎）
 */

'use client' // 深度依赖浏览器窗口尺寸监听、React 状态以及客户端动画库

import { motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'

export function Photos({ photos }: { photos: string[] }) {
  // 状态一：每张照片动态计算出来的标准基准宽度（单位：像素）
  const [width, setWidth] = React.useState(0)
  // 状态二：标记当前屏幕是不是极小的移动端（小于 640px）
  const [isCompact, setIsCompact] = React.useState(false)

  // 【数学黄金比例】：当鼠标悬浮某张照片时，它的目标膨胀宽度是标准宽度的 1.38 倍
  const expandedWidth = React.useMemo(() => width * 1.38, [width])

  // 核心动效基建：实时监听浏览器视口缩放（Responsive Dynamic Layout Calculation）
  React.useEffect(() => {
    const handleResize = () => {
      // 如果屏幕宽度小于 640px（对应 Tailwind 的 sm 断点以下）
      if (window.innerWidth < 640) {
        setIsCompact(true)
        // 手机端：让两张照片平分屏幕宽度（减去左右间距边沿）
        return setWidth(window.innerWidth / 2 - 64)
      }

      // 宽屏桌面端：用当前总宽度除以照片张数，再扣除照片之间的间距（Gap），算出绝对均分的完美宽度
      setIsCompact(false)
      setWidth(window.innerWidth / photos.length - 4 * photos.length)
    }

    // 初始化注册监听器
    window.addEventListener('resize', handleResize)
    handleResize() // 首次挂载时主动触发一次计算，防止首屏闪烁

    // 内存泄漏防护：组件销毁时及时移除事件监听器
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [photos.length])

  return (
    <motion.div
      className="mt-16 sm:mt-20"
      initial={{ opacity: 0, scale: 0.925, y: 16 }} // 进场动画：从下方 16 像素处半透明轻微放大浮现
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: 0.5, // 延迟半秒等待网页大框架先安顿好，再优雅进场
        type: 'spring', // 使用拟真的物理弹簧阻尼效果，拒绝死板的线性动画
      }}
    >
      {/* 
        ==========================================================================
        【大厂架构细节：移动端与桌面端的双模容器】
        ==========================================================================
        overflow-x-auto：移动端开启横向无阻碍滚动条。
        snap-x snap-proximity：移动端开启原生的“磁性滚动吸附”，手指松开时照片会自动对齐。
        md:overflow-x-hidden：到了大屏幕，强制把滚动条隐藏，变成一个完全静态的、靠鼠标 Hover 交互的艺术墙。
      */}
      <div className="-my-4 flex w-full snap-x snap-proximity scroll-pl-4 justify-start gap-4 overflow-x-auto px-4 py-4 sm:gap-6 md:justify-center md:overflow-x-hidden md:px-0">
        {photos.map((image, idx) => (
          <motion.div
            key={idx}
            className="relative h-40 flex-none shrink-0 snap-start overflow-hidden rounded-xl bg-zinc-100 ring-2 ring-lime-800/20 dark:bg-zinc-800 dark:ring-lime-300/10 md:h-72 md:rounded-3xl"
            // 实时同步响应式动画数据
            animate={{
              width,
              // 桌面端默认处于半静止状态：85% 透明度、自带 50% 灰色滤镜（grayscale），呈现一种高级的清冷感
              opacity: isCompact ? 1 : 0.85,
              filter: isCompact ? 'grayscale(0)' : 'grayscale(0.5)',
              // 艺术字画般的错落设计：双数索引图片向右微旋 2 度，单数向左微旋 1 度，打破呆板的矩形排版
              rotate: idx % 2 === 0 ? 2 : -1,
            }}
            // 鼠标悬浮交互（如果不是移动端，就触发高能膨胀变宽、恢复 100% 全彩、恢复 100% 亮度的绚丽效果）
            whileHover={
              isCompact
                ? {}
                : {
                    width: expandedWidth,
                    opacity: 1,
                    filter: 'grayscale(0)',
                    rotate: 0, // 悬浮时立正摆正，方便读者仔细端详
                  }
            }
            // 【神级属性】：告诉 Framer Motion，当这个卡片宽度暴涨时，请让它的邻居兄弟们也用动画顺滑地挪开位置，而不是生硬地瞬间瞬移
            layout
          >
            <Image
              src={image}
              alt="生活瞬间"
              width={500}
              height={500}
              // 性能优化：根据不同的媒体查询，精准预判图片在浏览器里的渲染规格，让浏览器提前准备好对应的内存缓存
              sizes="(min-width: 640px) 18rem, 11rem"
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
              // priority：提升加载优先级。让这几张处于网页第一屏核心视觉区的相册图片直接加入最高优先级的下载队列，杜绝白屏等待
              priority
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
