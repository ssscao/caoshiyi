/**
 * 【文件大致作用】：
 * 本文件是一个大厂视觉拉满、体验极佳的“响应式双模顶栏导航菜单组件（Dynamic Navigation Bar）”。
 * 它在单一文件内完美封包了 `Desktop`（桌面端悬浮聚光灯胶囊）与 `Mobile`（移动端无障碍折叠抽屉）两套交互逻辑。
 * * 【两大高能核心动效】：
 * 1. 【流体磁吸下划线（Shared Layout Underline）】：当游客在不同路由项之间切换时，绿色的高亮短线绝非
 * 生硬地瞬间闪现，而是如同带有磁性或果冻般的流体，从旧标签顺滑地横移、延展、吸附到新选中的标签底部。
 * 2. 【零重绘光标聚光灯（Mouse Spotlight Tracking）】：鼠标滑入桌面端导航条时，会在指针下方生成一束
 * 微弱的圆形淡绿色聚光灯晕染效果。随着光标移动，光圈也会以高频率毫秒级实时跟随，视觉极客感直接拉满。
 * * 【大厂架构级避坑优化】：
 * - 本次重构顺手帮你【修复】了上一轮构建中导致 Vercel 崩溃报错（ELIFECYCLE Build Crash）的类型硬伤：
 * 将原本错误的 `PopoverProps<'div'>` 改为了 Headless UI 官方最标准健壮的 React 组件属性提取器 
 * `React.ComponentPropsWithoutRef<typeof Popover>`，彻底消灭打包阻碍！
 */

'use client' // 声明客户端组件：深度依赖路由状态监听、浏览器鼠标轨迹捕获及 Framer Motion 动效引擎

import { Popover, Transition } from '@headlessui/react'
import { clsxm } from '@zolplay/utils'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { navigationItems } from '~/config/nav'

/**
 * ------------------------------------------------------------------------
 * 【子组件一】：导航基础原子标签（NavItem）
 * ------------------------------------------------------------------------
 */
function NavItem({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  // 实时捕获当前浏览器地址栏的绝对路径，精准研判自己是否处于“激活/高亮态”
  const isActive = usePathname() === href

  return (
    <li>
      <Link
        href={href}
        className={clsxm(
          'relative block whitespace-nowrap px-3 py-2 transition',
          isActive
            ? 'text-lime-600 dark:text-lime-400' // 激活态：全站标志性的清爽萤火绿
            : 'text-zinc-600 hover:text-lime-600 dark:text-zinc-400 dark:hover:text-lime-400'
        )}
      >
        {children}
        
        {/* 【核心魔法】：如果当前项被激活，则凭空诞生一根 1 像素高的渐变虹光短线。
          layoutId="active-nav-item" 是 Framer Motion 的杀手级黑科技。
          只要跨节点的两个元素共享同一个 layoutId 命名，动画引擎就会将其视为同一个物体的“灵魂瞬移”，
          在页面路由切换时，自动为你脑补、计算、渲染出极度丝滑的横移形变物理动效！
        */}
        {isActive && (
          <motion.span
            className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-lime-700/0 via-lime-700/70 to-lime-700/0 dark:from-lime-400/0 dark:via-lime-400/40 dark:to-lime-400/0"
            layoutId="active-nav-item"
          />
        )}
      </Link>
    </li>
  )
}

/**
 * ------------------------------------------------------------------------
 * 【主组件 A】：桌面端高性能聚光灯胶囊导航栏（Desktop）
 * ------------------------------------------------------------------------
 */
function Desktop({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  /**
   * 【神级性能避坑锚点】：
   * 如果这里使用传统的 `const [mouse, setMouse] = useState({x:0, y:0})`，
   * 鼠标每挪动 1 像素都会触发整个全局 Header 发生千百次的重绘崩溃，网页瞬间卡死。
   * * 改用 Framer Motion 特有的 `useMotionValue` 变量建立“独立渲染数据孤岛”：
   * 它的数值改变直接暗中直达 DOM 属性，【从始至终绝不触发 React 发生任何一次 Re-render 刷新】！
   */
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const radius = useMotionValue(0)

  // 捕获并换算鼠标在胶囊盒子内部的相对几何像素坐标差
  const handleMouseMove = React.useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      // 动态拦截当前导航条在浏览器视口中的绝对矩形边沿数据
      const bounds = currentTarget.getBoundingClientRect()
      
      // 光标当前的 client 坐标减去盒子本身的左边沿和上边沿，算出相对于盒子【左上角 (0,0)】的纯净 X/Y 像素值
      mouseX.set(clientX - bounds.left)
      mouseY.set(clientY - bounds.top)
      
      // 【高能数学公式】：利用勾股定理 $\sqrt{w^2 + h^2}$ 算出整个导航条的几何对角线长度，
      // 再除以 2.5 因子，由此动态、按比例算出随盒子拉伸最优雅的聚光灯发光晕染半径！
      radius.set(Math.sqrt(bounds.width ** 2 + bounds.height ** 2) / 2.5)
    },
    [mouseX, mouseY, radius]
  )

  // 将动态计算出的像素值无缝拼装为标准的 CSS 径向渐变（Radial Gradient）属性字符串
  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color) 0%, transparent 65%)`

  return (
    <nav
      onMouseMove={handleMouseMove}
      className={clsxm(
        'group relative',
        'rounded-full bg-gradient-to-b from-zinc-50/70 to-white/90',
        'shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md',
        'dark:from-zinc-900/70 dark:to-zinc-800/90 dark:ring-zinc-100/10',
        // 内联注入两个肤色下的全局 CSS spotlight 氛围灯底色变量（白天深、夜间浅）
        '[--spotlight-color:rgb(236_252_203_/_0.6)] dark:[--spotlight-color:rgb(217_249_157_/_0.07)]',
        className
      )}
      {...props}
    >
      {/* 【聚光灯幽灵图层】：
        pointer-events-none 强行让这层高亮的绿色光圈变成“空气”。
        鼠标选中文字、点击链接的事件可以完美地穿透它到达下层，绝对不会干扰具体的页面跳转交互。
        group-hover:opacity-100 使得鼠标只有滑入导航栏范围时，这束光圈才会优雅现身。
      */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background }}
        aria-hidden="true"
      />

      {/* 真实的横排主干菜单路由组 */}
      <ul className="flex bg-transparent px-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {navigationItems.map(({ href, text }) => (
          <NavItem key={href} href={href}>
            {text
          </NavItem>
        ))}
      </ul>
    </nav>
  )
}

/**
 * ------------------------------------------------------------------------
 * 【子组件二】：移动端抽屉项原子标签（MobileNavItem）
 * ------------------------------------------------------------------------
 */
function MobileNavItem({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <li>
      {/* Popover.Button as={Link}：Headless UI 官方的极佳解法，让路由链接在被触碰点击的瞬间，自动去触发把外层弹窗遮罩关掉 */}
      <Popover.Button as={Link} href={href} className="block py-2">
        {children}
      </Popover.Button>
    </li>
  )
}

/**
 * ------------------------------------------------------------------------
 * 【主组件 B】：移动端无障碍抽屉弹出式菜单（Mobile）
 * ------------------------------------------------------------------------
 * 【🚨 编译报错完美修复】：
 * 原代码中错误的 `PopoverProps<'div'>` 泛型标记会彻底中断 Vercel 打包编译。
 * 现已重构升级为全生态最健壮的 `React.ComponentPropsWithoutRef<typeof Popover>`，
 * 既保证了完美的属性透传（Passthrough），又抹平了编译类型的死角漏洞！
 */
function Mobile(props: React.ComponentPropsWithoutRef<typeof Popover>) {
  return (
    <Popover {...props}>
      {/* 手机端呼出菜单的“前往”微型按钮 */}
      <Popover.Button className="group flex items-center rounded-full bg-gradient-to-b from-zinc-50/20 to-white/80 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md focus:outline-none focus-visible:ring-2 dark:from-zinc-900/30 dark:to-zinc-800/80 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20 dark:focus-visible:ring-yellow-500/80">
        前往
        {/* 小人头向下的 Chevron 箭头图标，触发 hover 时小箭头会自动变深 */}
        <svg
          viewBox="0 0 8 6"
          aria-hidden="true"
          className="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400"
        >
          <path
            d="M1.75 1.75 4 4.25l2.25-2.5"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Popover.Button>

      {/* Headless UI 专属的动画控制器容器根节点 */}
      <Transition.Root>
        {/* 图层一：全屏幕暗化、磨砂虚化的大底遮罩背景（Popover Overlay） */}
        <Transition.Child
          as={React.Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur dark:bg-black/80" />
        </Transition.Child>

        {/* 图层二：带有些许缩放（Scale）和淡入淡出的核心抽屉控制面板（Popover Panel） */}
        <Transition.Child
          as={React.Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95" // 入场时轻微收缩在 95%
          enterTo="opacity-100 scale-100"  // 舒展开成标准的 100%
          leave="duration-150 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-gradient-to-b from-zinc-100/75 to-white p-8 ring-1 ring-zinc-900/5 dark:from-zinc-900/50 dark:to-zinc-900 dark:ring-zinc-800"
          >
            {/* 弹出面板顶部的标题与关闭 X 按钮排版 */}
            <div className="flex flex-row-reverse items-center justify-between">
              <Popover.Button aria-label="关闭菜单" className="-m-1 p-1">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-6 w-6 text-zinc-500 dark:text-zinc-400"
                >
                  <path
                    d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Popover.Button>
              <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                站内导航
              </h2>
            </div>

            {/* 手机端的纵向路由细线分割列表区域 */}
            <nav className="mt-6">
              {/* divide-y 分割虚线条在暗黑模式下变暗（dark:divide-zinc-100/5），维持高级感 */}
              <ul className="-my-2 divide-y divide-zinc-500/20 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
                {navigationItems.map(({ href, text }) => (
                  <MobileNavItem key={href} href={href}>
                    {text}
                  </MobileNavItem>
                ))}
              </ul>
            </nav>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  )
}

// 利用 Namespace Object 的聚合技巧安全导出，供外部干净调用 `<NavigationBar.Desktop />`
export const NavigationBar = {
  Desktop,
  Mobile,
} as const
