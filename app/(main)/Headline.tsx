'use client'

import { motion } from 'framer-motion'
import Balancer from 'react-wrap-balancer'

import { SparkleIcon, UserSecurityIcon } from '~/assets'
import { PeekabooLink } from '~/components/links/PeekabooLink'
import { SocialLink } from '~/components/links/SocialLink'

/**
 * 【标签一：开发者（Developer）】
 * 模拟代码标签闭合语法 & 光标闪烁键入动效
 */
function Developer() {
  return (
    <span className="group">
      {/* 模拟代码左尖括号 < */}
      <span className="font-mono">&lt;</span>
      灵界和源堡的眷者
      {/* 模拟代码右闭合标签 /> */}
      <span className="font-mono">/&gt;</span>
      {/* 
        灵魂动效：鼠标悬停（Hover）时，利用 before 伪元素渲染出一个符号 | 
        并通过自定义的 animate-typing 动画模拟打字机光标的闪烁效果 
      */}
      <span className="invisible inline-flex text-zinc-300 before:content-['|'] group-hover:visible group-hover:animate-typing dark:text-zinc-500" />
    </span>
  )
}

/**
 * 【标签二：设计师（Designer）】
 * 纯 CSS 像素级模拟图形设计软件（如 Figma/Photoshop）中图形选中的“控制锚点”和“边框”
 */
function Designer() {
  return (
    <span className="group relative bg-black/5 p-1 dark:bg-white/5">
      {/* 外层包裹一个绝对定位、全覆盖的矩形外框 */}
      <span className="pointer-events-none absolute inset-0 border border-lime-700/90 opacity-70 group-hover:border-dashed group-hover:opacity-100 dark:border-lime-400/90">
        {/* 以下 4 个 span 利用负值外边距（-3.5px），精准定位在矩形的 4 个顶点上，模拟拉伸手柄 */}
        {/* 左上角控制点 */}
        <span className="absolute -left-[3.5px] -top-[3.5px] size-1.5 border border-lime-700 bg-zinc-50 dark:border-lime-400" />
        {/* 右下角控制点 */}
        <span className="absolute -bottom-[3.5px] -right-[3.5px] size-1.5 border border-lime-700 bg-zinc-50 dark:border-lime-400" />
        {/* 左下角控制点 */}
        <span className="absolute -bottom-[3.5px] -left-[3.5px] size-1.5 border border-lime-700 bg-zinc-50 dark:border-lime-400" />
        {/* 右上角控制点 */}
        <span className="absolute -right-[3.5px] -top-[3.5px] size-1.5 border border-lime-700 bg-zinc-50 dark:border-lime-400" />
      </span>
      源源不断流淌的诡秘
    </span>
  )
}

/**
 * 【标签三：完美主义者（OCD/Details）】
 * 图标交互：鼠标移入时星星图标自转 180 度
 */
function OCD() {
  return (
    <span className="group inline-flex items-center">
      {/* 开启 transform-gpu 硬件加速，确保大角度旋转动效在低端设备或手机上依然不掉帧 */}
      <SparkleIcon className="mr-1 inline-flex transform-gpu transition-transform duration-500 group-hover:rotate-180" />
      <span>贫困孩子的保护者</span>
    </span>
  )
}

/**
 * 【标签四：创始人/守望者（Founder）】
 * 图标交互：悬停时图标微调，高亮背光颜色
 */
function Founder() {
  return (
    <span className="group inline-flex items-center">
      <UserSecurityIcon className="mr-1 inline-flex group-hover:fill-zinc-600/20 dark:group-hover:fill-zinc-200/20" />
      <span>漫长历史的见证</span>
    </span>
  )
}

/**
 * 【主组件（Main Export）】
 * 采用弹性物理弹簧（Spring）动效分层错开滑出的巨型页头欢迎文本块
 */
export function Headline() {
  return (
    <div className="max-w-2xl">
      {/* 第一层：4 行尊名/个性化标签，从下方 30px 的地方带弹簧阻尼感滑入 */}
      <motion.h1
        className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          damping: 25,   // 阻尼值（越大弹得越柔和）
          stiffness: 100, // 刚度（越大回弹速度越快）
          duration: 0.3,
        }}
      >
        <Developer />
        <span className="block h-2" />
        <Designer />
        <span className="block h-2" />
        <OCD />
        <span className="block h-2" />
        <Founder />
      </motion.h1>

      {/* 第二层：个性自我介绍段落，延迟 0.1 秒滑入 */}
      <motion.p
        className="mt-6 text-base text-zinc-600 dark:text-zinc-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 85,
          duration: 0.3,
          delay: 0.1, // 错峰渲染，让整体视觉产生阶梯感
        }}
      >
        {/* 使用 react-wrap-balancer 防止长文本由于屏幕宽度变化在末尾产生尴尬的“单个汉字掉落折行” */}
        <Balancer>
          此处预留个人介绍。你可以描述自己的教育背景、目前专注的技术栈（例如嵌入式、硬件开发、物联网、ESP32
          等领域），以及你正在探索的有趣副业或外包方向。
        </Balancer>
      </motion.p>

      {/* 第三层：全社交平台外链矩阵（Social Links Bar），延迟 0.25 秒最后滑入 */}
      <motion.div
        className="mt-6 flex flex-wrap gap-6" // 加了 flex-wrap，防止小屏幕手机上图标排不下导致溢出边界
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          damping: 50,
          stiffness: 90,
          duration: 0.35,
          delay: 0.25,
        }}
      >
        {/* 社交链卡片：href 填入后会自动关联，未填则可作为占位悬停图标 */}
        <SocialLink href="" aria-label="我的推特" platform="twitter" />
        <SocialLink href="" aria-label="我的 YouTube" platform="youtube" />
        <SocialLink href="" aria-label="我的 Bilibili" platform="bilibili" />
        <SocialLink href="" aria-label="我的 GitHub" platform="github" />
        <SocialLink href="" aria-label="我的 Telegram" platform="telegram" />
        <SocialLink href="/feed.xml" platform="rss" aria-label="RSS 订阅" />
        <SocialLink href="mailto:your-email@domain.com" aria-label="我的邮箱" platform="mail" />
      </motion.div>
    </div>
  )
}
