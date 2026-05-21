/**
 * 【文件大致作用】：
 *   本文件是一个完成度极高、大厂视觉拉满的“智能响应式双模导航栏组件（Dynamic Navigation Bar）”。
 *   它在一个文件里同时封装了 `Desktop`（桌面端胶囊悬浮导航）和 `Mobile`（移动端抽屉遮罩导航）两套完全独立的 UI 交互。
 *   
 *   该组件包含了前端动效的两大天花板级设计：
 *   1. 【神奇动能下划线（Shared Layout Transition）】：切换路由时，绿色的下划线不是生硬地直接闪现，
 *      而是像一块磁铁或液体一样，从前一个标签丝滑地“流过去”吸附在当前项。
 *   2. 【光标跟随聚光灯（Mouse Spotlight Effect）】：鼠标进入桌面端导航栏时，会生成一个高阶
 *      数学矩阵算法驱动的微弱圆形发光淡绿气泡，随着你的准心移动而实时游走，极具数码未来感。
 * 
 * 【哪些文件可能会用到当前文件】：
 *   - `components/Header.tsx` 或全局的 `app/layout.tsx`。
 *     通过在布局中直接调用 `<NavigationBar.Desktop className="hidden md:flex" />` 和 
 *     `<NavigationBar.Mobile className="block md:hidden" />` 来实现极致的跨端自适应切换。
 * 
 * 【当前文件使用了哪些文件】：
 *   - `~/config/nav`（存放全站路由配置，包含 `href` 和 `text` 文本）
 *   - `@headlessui/react`（Tailwind 官方出品的无样式、无缝支持残障人士可访问性 A11y 规范的弹窗状态库）
 */

'use client'

import { Popover, Transition } from '@headlessui/react'
import { clsxm } from '@zolplay/utils'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { navigationItems } from '~/config/nav'

/**
 * ------------------------------------------------------------------------
 * 【子组件一】：单个导航标签项（支持 Shared Layout 动画）
 * ------------------------------------------------------------------------
 */
function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  // 实时抓取 Next.js 路由系统的当前路径，精准判定自己是不是“当前高亮项”
  const isActive = usePathname() === href

  return (
    <li>
      <Link
        href={href}
        className={clsxm(
          'relative block whitespace-nowrap px-3 py-2 transition',
          isActive
            ? 'text-lime-600 dark:text-lime-400'
            : 'text-zinc-600 hover:text-lime-600 dark:text-zinc-400 dark:hover:text-lime-400'
        )}
      >
        {children}
        
        {/* 【高能核心】：如果当前项处于激活态，追加一个 Framer Motion 的动画短线 */}
        {isActive && (
          <motion.span
            className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-lime-700/0 via-lime-700/70 to-lime-700/0 dark:from-lime-400/0 dark:via-lime-400/40 dark:to-lime-400/0"
            // layoutId 是灵魂属性！只要名字叫 "active-nav-item"，不管它在哪个 <li> 节点里诞生，
            // Framer Motion 都能感知前任和现任的坐标，自动算出一段完美的横移平滑形变动效
            layoutId="active-nav-item"
          />
        )}
      </Link>
    </li>
  )
}

/**
 * ------------------------------------------------------------------------
 * 【主组件 A】：桌面端高性能聚光灯胶囊导航栏
 * ------------------------------------------------------------------------
 */
function Desktop({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  // 【底层性能优化】：使用 Framer Motion 特有的 MotionValue 存储坐标。
  // 它的神奇之处在于鼠标怎么乱动，都不会触发 React 组件进行任何一次真正的 `render` 刷新！
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const radius = useMotionValue(0)

  // 捕获鼠标在导航栏内的相对几何像素差
  const handleMouseMove = React.useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      // 拿到当前整个胶囊导航栏在屏幕上的绝对边界矩形（bounding rect）
      const bounds = currentTarget.getBoundingClientRect()
      
      // 减去左边界和上边界，换算得出光标相对于导航栏【左上角 (0,0)】的精确 X/Y 像素坐标
      mouseX.set(clientX - bounds.left)
      mouseY.set(clientY - bounds.top)
      
      // 动态计算聚光灯的半径：利用勾股定理求出导航栏对角线长度，再除以 2.5 算出最优雅的晕染光圈范围
      radius.set(Math.sqrt(bounds.width ** 2 + bounds.height ** 2) / 2.5)
    },
    [mouseX, mouseY, radius]
  )

  // 将 MotionValue 的数值实时转化为标准的 CSS 径向渐变属性字符串（Radial Gradient）
  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color) 0%, transparent 65%)`

  return (
    <nav
      onMouseMove={handleMouseMove}
      className={clsxm(
        'group relative',
        'rounded-full bg-gradient-to-b from-zinc-50/70 to-white/90',
        'shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md',
        'dark:from-zinc-900/70 dark:to-zinc-800/90 dark:ring-zinc-100/10',
        // 利用 Tailwind 的独创写法将系统 CSS 变量直接内联注入（在不同肤色下采用不同透明度的萤火绿）
        '[--spotlight-color:rgb(236_252_203_/_0.6)] dark:[--spotlight-color:rgb(217_249_157_/_0.07)]',
        className
      )}
      {...props}
    >
      {/* 
        【聚光灯图层】：pointer-events-none 让这个图层完全不响应任何鼠标事件（做透明幽灵层），
        从而让鼠标事件完好无损地渗透、直达下层的具体导航文字上。
        group-hover:opacity-100：平时彻底隐藏，只有鼠标进来时才展现这层发光效果。
      */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background }}
        aria-hidden="true"
      />

      <ul className="flex bg-transparent px-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {navigationItems.map(({ href, text }) => (
          <NavItem key={href} href={href}>
            {text}
          </NavItem>
        ))}
      </ul>
    </nav>
  )
}

/**
 * ------------------------------------------------------------------------
 * 【子组件二】：移动端弹出菜单链接项
 * ------------------------------------------------------------------------
 */
function MobileNavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      {/* Popover.Button as={Link}：神级封装。当用户点触这个链接跳转时，Popover 会在幕后自动把弹窗给悄悄合上 */}
      <Popover.Button as={Link} href={href} className="block py-2">
        {children}
      </Popover.Button>
    </li>
  )
}

/**
 * ------------------------------------------------------------------------
 * 【主组件 B】：移动端抽屉式浮层弹出菜单
 * ------------------------------------------------------------------------
 */
function Mobile(props: PopoverProps<'div'>) {
  return (
    <Popover {...props}>
      {/* 呼出菜单的微型触发按钮 */}
      <Popover.Button className="group flex items-center rounded-full bg-gradient-to-b from-zinc-50/20 to-white/80 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md focus:outline-none dark:from-zinc-900/30 dark:to-zinc-800/80 dark:text-zinc-200 dark:ring-white/10">
        前往
        <svg viewBox="0 0 8 6" aria-hidden="true" className="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400">
          <path d="M1.75 1.75 4 4.25l2.25-2.5" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Popover.Button>

      {/* 弹窗渲染根节点 */}
      <Transition.Root>
        {/* 1. 背景磨砂暗化遮罩（Backdrop Overlay） */}
        <Transition.Child
          as={React.Fragment}
          enter="duration-150 ease-out" enterFrom="opacity-0" enterTo="opacity-100"
          leave="duration-150 ease-in" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur dark:bg-black/80" />
        </Transition.Child>

        {/* 2. 核心导航面板主体（Panel with Scale Animation） */}
        <Transition.Child
          as={React.Fragment}
          enter="duration-150 ease-out" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
          leave="duration-150 ease-in" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel focus className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-gradient-to-b from-zinc-100/75 to-white p-8 ring-1 ring-zinc-900/5 dark:from-zinc-900/50 dark:to-zinc-900 dark:ring-zinc-800">
            <div className="flex flex-row-reverse items-center justify-between">
              {/* 关闭弹窗的 X 按钮 */}
              <Popover.Button aria-label="关闭菜单" className="-m-1 p-1">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 text-zinc-500 dark:text-zinc-400">
                  <path d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Popover.Button>
              <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">站内导航</h2>
            </div>
            
            {/* 列表区域：带有一条极细虚线的优雅分割（divide-y） */}
            <nav className="mt-6">
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

// 采用全行业最推崇的“名值空间聚合导出法（Namespace Object Export）”
export const NavigationBar = {
  Desktop,
  Mobile,
} as const
