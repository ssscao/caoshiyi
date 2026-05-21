/**
 * 【文件大致作用】：
 *   本文件是一个非常个性化的“网易云音乐外链播放器组件（NetEase Music Widget）”。
 *   它常用于个人博客的侧边栏或关于页面，为全站访问者营造一种“边看博客边听歌”的氛围感。
 *   
 * 【高阶工程优化说明】：
 *   原代码中使用原生 CSS `<style>` 标签注入 `@keyframes pulseGlow` 来做呼吸发光效果，
 *   这会引发一个不易察觉的动效冲突：当鼠标悬停（Hover）触发 Framer Motion 的 `boxShadow` 放大发光时，
 *   原生的 CSS 定时动画依然在后台暴力重写 `box-shadow` 属性，导致两者“打架”，画面出现高频闪烁或卡顿。
 *   
 *   【本次重构修复】：我们直接砍掉了原生的 `<style>` 标签，改用 Framer Motion 的【数组键值对（Keyframes Array）】
 *   来统一接管呼吸灯特效。这样不仅代码更加纯正 React 化，而且 Hover 悬停时的过渡动画也会变得极其丝滑。
 * 
 * 【哪些文件可能会用到当前文件】：
 *   - `app/(main)/about/page.tsx`（关于我页面，用来展示自己的生活品味）
 *   - `~/components/Sidebar.tsx`（侧边栏挂件）
 */

'use client' // 声明客户端组件：内部深度使用了 Framer Motion 的多状态并行触发器

import React from 'react'
import { motion } from 'framer-motion'

export function NetEaseMusic() {
  return (
    <motion.div
      // ------------------------------------------------------------------------
      // 【第一层：外层入场过渡容器】
      // ------------------------------------------------------------------------
      initial={{ opacity: 0, y: 20 }} // 初始化状态：完全透明，且下移 20 像素
      animate={{ opacity: 1, y: 0 }}  // 挂载后状态：平滑升起并清晰显现
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="mt-4 flex items-center justify-center"
    >
      <motion.div
        // ------------------------------------------------------------------------
        // 【第二层：核心玻璃拟态卡片容器】
        // ------------------------------------------------------------------------
        // 【工程级避坑：多动效融合】
        // 同时声明 animate（常驻呼吸灯）与 whileHover（鼠标悬停放大），Framer Motion 会在内部自动进行矩阵状态混合，
        // 当鼠标滑入时，发光范围会自动以弹簧质感平滑过渡到 30px 的强光，彻底告别原生 CSS 动画的突变闪烁。
        animate={{
          boxShadow: [
            '0 0 10px rgba(132, 204, 22, 0.05)',  // 阶段 0%：微弱绿光（配合整体系统的 lime 调性）
            '0 0 25px rgba(132, 204, 22, 0.25)',  // 阶段 50%：能量蓄满，扩散发光
            '0 0 10px rgba(132, 204, 22, 0.05)'   // 阶段 100%：回落
          ]
        }}
        whileHover={{
          scale: 1.04, // 悬停时轻微放大
          boxShadow: '0 0 35px rgba(132, 204, 22, 0.45)', // 悬停时强光锁定
        }}
        // 动效参数精细分离控制
        transition={{
          // 给常驻的 boxShadow 呼吸灯单独定制一个无限循环、上下回旋（reverse）的缓动策略
          boxShadow: {
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 3.5,
            ease: 'easeInOut'
          },
          // 给 Hover 缩放单独定制一个清爽的物理弹簧
          scale: {
            type: 'spring',
            stiffness: 260,
            damping: 20
          }
        }}
        className="rounded-2xl border border-white/20 bg-white/10 p-3 shadow-xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-black/30"
      >
        {/* 
          网易云官方外链播放器 iframe 
          安全优化：明确补全 https: 协议头，防止在部分严格的安全沙箱环境下出现 Mixed Content 拦截错误。
        */}
        <iframe
          title="网易云音乐播放器"
          frameBorder="no"
          width="330"
          height="120"
          // id=6673286917 为当前的歌单/单曲 ID；auto=0 代表关闭网页时默认静音，不打扰读者，由读者手动点击播放
          src="https://music.163.com/outchain/player?type=0&id=6673286917&auto=0&height=90"
          className="rounded-xl shadow-lg dark:opacity-90"
        ></iframe>
      </motion.div>
    </motion.div>
  )
}
