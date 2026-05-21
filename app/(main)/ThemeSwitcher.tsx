/**
 * 【文件大致作用】：
 *   本文件是网站顶部导航栏核心的“主题切换按钮组件（Theme Switcher）”。
 *   它允许用户在“浅色（白天）模式”和“深色（夜间）模式”之间自由切换。
 *   这个组件虽小，但完成度极高：
 *   1. 结合 `next-themes` 实现了无缝的本地缓存记住主题、以及自动跟随系统设置。
 *   2. 结合 `framer-motion` 实现了极其细腻的悬浮气泡提示（Tooltip）淡入淡出与缩放动效。
 *   3. 采用了经典的【SSR 客户端挂载防御机制】，彻底杜绝了服务端渲染与客户端状态不一致导致的网页闪烁（Hydration Mismatch）报错。
 * 
 * 【哪些文件可能会用到当前文件】：
 *   - `~/app/(main)/Header.tsx`（顶部导航栏组件，通常把切换按钮放在右侧）
 * 
 * 【当前文件使用了哪些文件】：
 *   - `~/assets`（引入了 SunIcon、MoonIcon 和闪电图标 LightningIcon）
 *   - `~/components/ui/Tooltip`（引入了基于 Radix UI 规范封装的可访问性气泡提示组件）
 */

'use client' // 声明这是一个客户端组件，因为需要用到浏览器的 LocalStorage、useEffect 监听以及动效库

import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import React from 'react'

import { LightningIcon, MoonIcon, SunIcon } from '~/assets'
import { Tooltip } from '~/components/ui/Tooltip'

// 静态配置表：建立主题值与具体文字、图标组件的映射关系
const themes = [
  {
    label: '浅色模式',
    value: 'light',
    icon: SunIcon,
  },
  {
    label: '深色模式',
    value: 'dark',
    icon: MoonIcon,
  },
]

export function ThemeSwitcher() {
  // 状态一：记录当前组件是否已经安全地在浏览器中“挂载完成”
  const [mounted, setMounted] = React.useState(false)
  // 状态二：控制悬浮气泡提示（Tooltip）的打开与关闭状态
  const [open, setOpen] = React.useState(false)
  
  // 从 next-themes 中解构出核心工具：
  // setTheme：修改主题的函数
  // theme：当前设置的主题名（可能是 'light', 'dark', 或 'system'）
  // resolvedTheme：【关键属性】如果 theme 是 'system'，它会精准告诉你当前系统到底被解析成了 'light' 还是 'dark'
  const { setTheme, theme, resolvedTheme } = useTheme()

  // 【高阶工程优化】：根据当前主题动态计算出应该显示什么图标
  // 使用 useMemo 缓存计算结果，只有当 theme 发生改变时才重新匹配，防止组件无关刷新时频繁重建图标
  const ThemeIcon = React.useMemo(
    () => themes.find((t) => t.value === theme)?.icon ?? LightningIcon,
    [theme]
  )

  // 当组件在浏览器首次渲染成功后，将 mounted 标记为 true
  React.useEffect(() => setMounted(true), [])

  // 核心切换按钮的点击事件逻辑
  function toggleTheme() {
    // 逻辑非常优雅：如果当前系统被解析成了深色模式，点击就切换到浅色；反之亦然。
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  /**
   * 【神级避坑锚点：服务器水合防御】
   * 如果当前还没有挂载成功（即处于 Next.js 服务端进行 HTML 预编译的阶段），
   * 直接无条件返回 null（即先展示一片空白占位）。
   * 为什么要这么做？请参见下方小白速通第 1 条。
   */
  if (!mounted) {
    return null
  }

  return (
    // Tooltip.Provider：气泡提示的全局上下文，disableHoverableContent 阻止鼠标滑入气泡时保持显示，提升纯文本体验
    <Tooltip.Provider disableHoverableContent>
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        
        {/* Trigger 代表触发器，asChild 意味着不要生成多余的包装标签，直接把事件和属性绑定给下面的 <button> */}
        <Tooltip.Trigger asChild>
          <button
            type="button"
            aria-label="切换颜色主题"
            // bg-gradient-to-b...：白天模式下按钮自带一层极其微弱的白色半透明渐变和微量磨砂玻璃感（backdrop-blur）
            // dark:...：夜间模式下自动变为深色半透明微光，配合 ring-1 实现精致的 1 像素科技感外边框
            className="group rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
            onClick={toggleTheme}
          >
            {/* 动态图标渲染，group-hover 使得鼠标只要碰到外层圆圈，里面的小太阳/小月亮就会顺滑地加深颜色 */}
            <ThemeIcon className="h-6 w-6 stroke-zinc-500 p-0.5 transition group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-200" />
          </button>
        </Tooltip.Trigger>

        {/* AnimatePresence 是 Framer Motion 的灵魂组件：用来管理那些由于条件渲染（open && ...）即将从 DOM 树中销毁的组件的“离场动画” */}
        <AnimatePresence>
          {open && (
            // forceMount 强制挂载，把生死大权交由外层的 AnimatePresence 动效引擎全权接管
            <Tooltip.Portal forceMount>
              <Tooltip.Content asChild>
                {/* motion.div：带有动画高能加持的普通 div */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }} // 诞生那一刻：透明且微微缩小
                  animate={{ opacity: 1, scale: 1 }}    // 正常显示时：完全不透明且恢复标准大小
                  exit={{ opacity: 0, scale: 0.95 }}   // 鼠标移开消失时：顺滑地一边淡出一边缩小
                >
                  {/* 动态显示文本，如果配置表里查不到，说明当前是跟随系统的状态，兜底显示“系统模式” */}
                  {themes.find((t) => t.value === theme)?.label || "系统模式"}
                </motion.div>
              </Tooltip.Content>
            </Tooltip.Portal>
          )}
        </AnimatePresence>

      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
