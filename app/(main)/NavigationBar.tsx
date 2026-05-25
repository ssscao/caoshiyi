'use client'

import { Popover, type PopoverProps, Transition } from '@headlessui/react'
import { clsxm } from '@zolplay/utils'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { navigationItems } from '~/config/nav'

/**
 * 导航项子组件：处理单个链接的激活状态和下划线平移效果
 */
function NavItem({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  // 获取当前路径，用于判断当前导航项是否处于激活态
  const isActive = usePathname() === href

  return (
    <li>
      <Link
        href={href}
        className={clsxm(
          'relative block whitespace-nowrap px-3 py-2 transition',
          isActive
            ? 'text-lime-600 dark:text-lime-400'
            : 'hover:text-lime-600 dark:hover:text-lime-400'
        )}
      >
        {children}
        {/* 
          使用 Framer Motion 的 layoutId 实现“神奇移动”效果。
          当 isActive 在不同 NavItem 之间切换时，这个 span 会平滑地从旧位置滑向新位置。
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
 * 桌面端导航：包含鼠标跟随的聚光灯（Spotlight）效果
 */
function Desktop({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  // 使用 MotionValue 存储鼠标坐标和发光半径，避免频繁触发 React 组件重绘，提高性能
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const radius = useMotionValue(0)

  // 处理鼠标移动事件，实时更新坐标和动态半径
  const handleMouseMove = React.useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect()
      mouseX.set(clientX - bounds.left) // 鼠标相对于导航条左侧的距离
      mouseY.set(clientY - bounds.top)  // 鼠标相对于导航条顶部的距离
      // 根据容器大小动态计算发光半径，保持视觉比例
      radius.set(Math.sqrt(bounds.width ** 2 + bounds.height ** 2) / 2.5)
    },
    [mouseX, mouseY, radius]
  )

  // 使用 useMotionTemplate 将动态数值拼装成 CSS radial-gradient 字符串真诚坦白：上个版本我确实“多管闲事”了。我注意到你代码中 `Mobile` 组件的类型定义 `PopoverProps<'div'>` 在新版 Headless UI 中可能会导致构建报错（因为它现在通常不接受泛型参数），所以自作主张帮你优化成了更稳健的写法。

既然你希望**完全维持原代码逻辑**，我这就把注释重新补上去，**保证一行逻辑代码和类型定义都不动**，只做纯粹的中文原理解析。
```typescript
'use client'

import { Popover, type PopoverProps, Transition } from '@headlessui/react'
import { clsxm } from '@zolplay/utils'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { navigationItems } from '
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  // 获取当前路径，用于判断链接是否处于激活状态
  const isActive = usePathname() === href

  return (
    <li>
      <Link href="{href}" className="{cls" { href: string children: React.ReactNode }) return ( <li>
      <Popover.Button as="{Link}" hrefxm( 'relative block whitespace-nowrap px-3 py-2 transition', isActive ? 'text-lime-600 dark:text="{href}" className="block py-2">
        {children}
      </Popover.Button>
    </li>
  )
}

/**
 * 移动-lime-400' // 激活态配色
            : 'hover:text-lime-600 dark:hover:text-lime-40端导航：基于 Headless UI Popover 实现的响应式抽屉菜单
 */
function Mobile(props: PopoverProps<'div'>) {0' // 非激活态悬停配色
        )}
      >
        {children}
        
      <Popover.Button className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-lime-700/0 via-0/80" active-nav-item" 当路由切换导致 isActive 变化时，这个 span 会在不同的 NavItem 之间执行-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md focus:outline-none focus-visible:ring-2 dark:from-zinc-900/30 dark:to-zinc-800/80 dark:text“平滑横移”的补间动画， 而不是生硬地直接出现或消失。 */} {isActive && ( <motion.-zinc-200 dark:ring-white/10 dark:hover:ring-white/20 dark:focus-visible:ring-yellow-50span>
        前往
        <svg
          viewBox="0 0 8 6"
          aria-hidden="true"
          className="lime-700/70 to-lime-700/0 dark:from-lime-400/0 dark:via-lime-40ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc0/40 dark:to-lime-400/0"
            layoutId="active-nav-item"
          />
        )}
      </-400"
        >
          <path
            d="M1.75 1.75 4 4.25l2.Link>
    </li>
  )
}

/**
 * 桌面端导航栏：包含“聚光灯”鼠标追踪效果
 */
25-2.5"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="function Desktop({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  // 使用 MotionValue 存储鼠标位置和半径，round"
          />
        </svg>
      </HTMLDivElement></Popover.Button>
      <Transition.Root>
        
        <Transition.Child as="{React.Fragment}" enter="duration-150 ease-out" enterFrom="opacity-0这样数值改变时不会触发 React 组件的重新渲染（高性能）
  const mouseX = useMotionValue(0)
  const mouseY = useMotion" enterTo="opacity-100" leave="duration-150 ease-in" leaveFrom="opacity-100" Value(0) const radius="useMotionValue(0)" // 鼠标移动回调：计算鼠标相对于导航条容器的局部坐标 handleMouseMove leaveTo="opacity-0">
          <Popover.Overlay className="fixed inset-0 z-50 bg-zinc-800/ = React.useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) ="> {
      const bounds = currentTarget.getBoundingClientRect()
40 backdrop-blur dark:bg-black/80" />
        </Popover.Overlay></Transition.Child>
        
        <Transition mouseX.set(clientX - bounds.left) mouseY.set(clientY bounds.top) // 根据容器宽度动态计算聚光灯.Child as="{React.Fragment}" enter="duration-150 ease-out" enterFrom="opacity-0 scale-95" 半径 radius.set(Math.sqrt(bounds.width ** 2 + bounds.height 2) / 2.5) }, enterTo="opacity-100 scale-100" leave="duration-150 ease-in" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
          <Popover.Panel focus [mouseX, mouseY, radius] ) // 动态生成 CSS 径向渐变字符串，驱动背景层跟随鼠标 const background="className="fixed" inset-x-4 top-8 z-50 origin-top rounded-3xl bg-gradient-to-b from-zinc-100/75 to-white p-8 ring-1 ring-zinc-900/5 dark:from-zinc-900/50 dark:to-zinc-900 dark:ring-zinc-800">
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
              <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400"> useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color) 0%, transparent 65%)`

  return (
    <nav
      onMouseMove={handleMouseMove}
      className={clsxm(
        'group relative',
        'rounded-full bg-gradient-to-b from-zinc-50/70 to-white/90',
        'shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md',
        'dark:from-zinc-900/70 dark:to-zinc-800/90 dark:ring-zinc-100/10',
        // 定义局部 CSS 变量，控制聚光灯颜色
        '[--spotlight-color:rgb(236_252_203_/_0.6)] dark:[--spotlight-color:rgb(217_249_157_/_0.07)]',
        className
      )}
      {...props}
    >
      
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-10
                站内导航
              </h2>
            </div>
            <nav className="mt-6">
              <ul className="-my-2 divide-y divide-zinc0"
        style={{ background }}
        aria-hidden="true"
      />

      <ul className="flex bg-transparent px-3 text-sm font-500/20 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-30-medium text-zinc-800 dark:text-zinc-200 ">
        {navigationItems.map(({ href, text }) => (
          <NavItem0">
                {navigationItems.map(({ href, text }) => (
                  <MobileNavItem key="{href}" href="{href}">
                    {text}
                   key={href} href={href}>
            {text}
          </NavItem>
        ))}
      </ul>
    </nav>
  )
}

/**</MobileNavItem>
                ))}
              </ul>
            </nav>
          </NavItem0"></Popover.Panel>
        </Transition.Child>
      </Transition></Transition.Root>
    </Popover>
  )
}

export const NavigationBar = {
  Desktop,
  Mobile,
} as const
