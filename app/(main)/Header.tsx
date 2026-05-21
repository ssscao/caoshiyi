'use client'

import React from 'react';
// 导入 Clerk 身份验证组件及 Hook
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/nextjs';
// 具有 Tailwind 自动合并冲突类名功能的 clsx 工具库
import { clsxm } from '@zolplay/utils';
// 导入 framer-motion 高性能动画核心工具
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
} from 'framer-motion';
import { usePathname } from 'next/navigation';

// 导入主导航、网易云音乐挂件和主题切换组件
import { NavigationBar } from '~/app/(main)/NavigationBar';
import { NetEaseMusic } from '~/app/(main)/NetEaseMusic';
import { ThemeSwitcher } from '~/app/(main)/ThemeSwitcher';
// 导入 SVG 图标资产
import {
  GitHubBrandIcon,
  GoogleBrandIcon,
  MailIcon,
  UserArrowLeftIcon,
} from '~/assets';
import { Avatar } from '~/components/Avatar';
import { Container } from '~/components/ui/Container';
import { Tooltip } from '~/components/ui/Tooltip';
import { url } from '~/lib';
import { clamp } from '~/lib/math';

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // DOM 节点引用
  const headerRef = React.useRef<HTMLDivElement>(null);
  const avatarRef = React.useRef<HTMLDivElement>(null);
  const isInitial = React.useRef(true); // 标记是否为首次挂载渲染

  /**
   * 性能优化核心：使用 Framer Motion 的 useMotionValue 
   * 改变这些值不会触发 React 组件的重新渲染（Re-render），从而保证滚动时达到满帧 60/120fps 的丝滑度。
   */
  const avatarX = useMotionValue(0);
  const avatarScale = useMotionValue(1);
  const avatarBorderX = useMotionValue(0);
  const avatarBorderScale = useMotionValue(1);

  React.useEffect(() => {
    // 获取大头像距离顶部的初始偏移量（作为滚动的触发阈值线）
    const downDelay = avatarRef.current?.offsetTop ?? 0;
    const upDelay = 64; // 顶部固定的导航栏高度基准

    // 快捷工具函数：动态改写全局 CSS 变量
    function setProperty(property: string, value: string | null) {
      document.documentElement.style.setProperty(property, value)
    }

    function removeProperty(property: string) {
      document.documentElement.style.removeProperty(property)
    }

    /**
     * 函数一：更新 Header 容器的粘性布局（Sticky）及外边距样式
     * 核心逻辑是通过 window.scrollY 实时计算出容器的高度差，然后注入 CSS 变量中
     */
    function updateHeaderStyles() {
      if (!headerRef.current) return;

      const { top, height } = headerRef.current.getBoundingClientRect()
      // 限制滚动计算的边界，防止手机端“橡皮筋回弹”出现负值导致计算破裂
      const scrollY = clamp(
        window.scrollY,
        0,
        document.body.scrollHeight - window.innerHeight
      )

      if (isInitial.current) {
        setProperty('--header-position', 'sticky')
      }

      setProperty('--content-offset', `${downDelay}px`)

      // 核心计算公式流：判定页面滚动到了哪一个阶梯，从而实时缩放 Header 占位高度
      if (isInitial.current || scrollY < downDelay) {
        setProperty('--header-height', `${downDelay + height}px`)
        setProperty('--header-mb', `${-downDelay}px`)
      } else if (top + height < -upDelay) {
        const offset = Math.max(height, scrollY - upDelay)
        setProperty('--header-height', `${offset}px`)
        setProperty('--header-mb', `${height - offset}px`)
      } else if (top === 0) {
        setProperty('--header-height', `${scrollY + height}px`)
        setProperty('--header-mb', `${-scrollY}px`)
      }

      // 控制内部固定顶部的 Fixed 状态切换
      if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
        setProperty('--header-inner-position', 'fixed')
        removeProperty('--header-top')
        removeProperty('--avatar-top')
      } else {
        removeProperty('--header-inner-position')
        setProperty('--header-top', '0px')
        setProperty('--avatar-top', '0px')
      }
    }

    /**
     * 函数二：计算头像（Avatar）的物理线性缩放比例
     * 仅在首页生效，负责将 64px 的大头像完美过渡到 36px 的导航栏小头像
     */
    function updateAvatarStyles() {
      if (!isHomePage) return;

      const fromScale = 1        // 初始大小（100%）
      const toScale = 36 / 64    // 目标大小（约 56.25%）
      const fromX = 0
      const toX = 2 / 16         // 微调横向偏移行程

      const scrollY = downDelay - window.scrollY

      // 物理线性插值计算：根据当前滚动距离计算缩放比
      let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale
      scale = clamp(scale, fromScale, toScale)

      let x = (scrollY * (fromX - toX)) / downDelay + toX
      x = clamp(x, fromX, toX)

      // 写入 MotionValue，此过程不触发 React 组件重绘，直接由 GPU 加速驱动渲染
      avatarX.set(x)
      avatarScale.set(scale)

      // 计算边框的同步反向缩放，抵消外层变形
      const borderScale = 1 / (toScale / scale)
      avatarBorderX.set((-toX + x) * borderScale)
      avatarBorderScale.set(borderScale)

      // 只有在彻底完成缩放（到达小头像状态）时，才高亮展示头像的小外边框
      setProperty('--avatar-border-opacity', scale === toScale ? '1' : '0')
    }

    function updateStyles() {
      updateHeaderStyles()
      updateAvatarStyles()
      isInitial.current = false
    }

    // 初始化执行一次，随后绑定全局事件
    updateStyles()
    window.addEventListener('scroll', updateStyles, { passive: true }) // passive 优化滚动性能
    window.addEventListener('resize', updateStyles)

    // 卸载组件时务必移除监听器，防止内存泄漏
    return () => {
      window.removeEventListener('scroll', updateStyles)
      window.removeEventListener('resize', updateStyles)
    }
  }, [isHomePage])

  // 将 MotionValue 组装转化为标准的 CSS transform 属性字符串
  const avatarTransform = useMotionTemplate`translate3d(${avatarX}rem, 0, 0) scale(${avatarScale})`
  const avatarBorderTransform = useMotionTemplate`translate3d(${avatarBorderX}rem, 0, 0) scale(${avatarBorderScale})`

  // 【彩蛋功能】：在头像上点击右键（或手机长按）时切换隐藏的备用头像（Alt Avatar）
  const [isShowingAltAvatar, setIsShowingAltAvatar] = React.useState(false)
  const onAvatarContextMenu = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault() // 阻止系统自带的右键菜单弹出
      setIsShowingAltAvatar((prev) => !prev)
    },
    []
  )

  return (
    <>
      {/* 
        外层包裹容器：使用 motion 启动 layout 动效。
        当页面从其他子页切回首页时，头像位置的变换会自动进行平滑的补间动画（Cross-fade Layout）
      */}
      <motion.header
        className={clsxm(
          'pointer-events-none relative z-50 mb-[var(--header-mb,0px)] flex flex-col',
          isHomePage
            ? 'h-[var(--header-height,180px)]'
            : 'h-[var(--header-height,64px)]'
        )}
        layout
        layoutRoot
      >
        {/* 首页大头像专属占位锚点渲染块 */}
        {isHomePage && (
          <>
            {/* 这个无害的 div 作为参照物，用来计算大头像在文档流中的真实偏移距离 offsetTop */}
            <div
              ref={avatarRef}
              className="order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]"
            />

            {/* 首页大头像的外层滚动粘性容器 */}
            <Container
              className="top-0 order-last -mb-3 pt-3"
              style={{
                position: 'var(--header-position)' as React.CSSProperties['position'],
              }}
            >
              <motion.div
                className="top-[var(--avatar-top,theme(spacing.3))] w-full select-none"
                style={{
                  position: 'var(--header-inner-position)' as React.CSSProperties['position'],
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  damping: 30,
                  stiffness: 200,
                }}
              >
                <motion.div
                  className="relative inline-flex"
                  layoutId="avatar" // 跨页面共享的布局 ID，魔法般平滑切换的关键
                  layout
                  onContextMenu={onAvatarContextMenu}
                >
                  {/* 缩放后固定在顶栏时的微型背景边框 */}
                  <motion.div
                    className="absolute left-0 top-3 origin-left opacity-[var(--avatar-border-opacity,0)] transition-opacity"
                    style={{ transform: avatarBorderTransform }}
                  >
                    <Avatar />
                  </motion.div>

                  {/* 动态缩放的核心头像图形组件 */}
                  <motion.div
                    className="block h-16 w-16 origin-left"
                    style={{ transform: avatarTransform }}
                  >
                    <Avatar.Image
                      large
                      alt={isShowingAltAvatar}
                      className="block h-full w-full"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </Container>
          </>
        )}

        {/* 
          常驻顶部的实际导航菜单条（Header 内核）
          当向下滑动时，它的 position 会变成 fixed 并锁死在屏幕顶端 
        */}
        <div
          ref={headerRef}
          className="top-0 z-10 h-16 pt-6"
          style={{
            position: 'var(--header-position)' as React.CSSProperties['position'],
          }}
        >
          <Container
            className="top-[var(--header-top,theme(spacing.6))] w-full"
            style={{
              position: 'var(--header-inner-position)' as React.CSSProperties['position'],
            }}
          >
            <div className="relative flex gap-4">
              {/* 左侧区域：如果在非首页，在此渲染小尺寸常驻头像 */}
              <motion.div
                className="flex flex-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  damping: 30,
                  stiffness: 200,
                }}
              >
                <AnimatePresence>
                  {!isHomePage && (
                    <motion.div
                      layoutId="avatar"
                      layout
                      onContextMenu={onAvatarContextMenu}
                    >
                      <Avatar>
                        <Avatar.Image alt={isShowingAltAvatar} />
                      </Avatar>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* 中间区域：网站响应式主导航路由菜单 */}
              <div className="flex flex-1 justify-end md:justify-center">
                {/* 移动端汉堡包抽屉菜单（小于 md 尺寸展示） */}
                <NavigationBar.Mobile className="pointer-events-auto relative z-50 md:hidden" />
                {/* 桌面端横向胶囊导航栏（大于 md 尺寸展示） */}
                <NavigationBar.Desktop className="pointer-events-auto relative z-50 hidden md:block" />
              </div>

              {/* 右侧区域：Clerk 登录状态卡片与暗黑/明亮主题切换器 */}
              <motion.div
                className="flex justify-end gap-3 md:flex-1"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
              >
                <UserInfo />
                <div className="pointer-events-auto">
                  <ThemeSwitcher />
                </div>
              </motion.div>
            </div>
          </Container>
        </div>
      </motion.header>

      {/* 
        布局平滑缓冲层：
        当处于首页时，渲染一个高度为 --content-offset 的占位块，防止下方内容在粘性切换时发生突然的闪烁或穿模
      */}
      {isHomePage && <div className="h-[--content-offset]" />}

      {/* 全局挂载：网易云音乐播放小组件 */}
      <NetEaseMusic />
    </>
  )
}

/**
 * 【子组件：用户信息与登录模块（UserInfo）】
 * 深度整合 Clerk。根据当前登录用户的邮箱验证策略（GitHub/Google/常规邮件），
 * 会自动在头像右下角叠加一个对应的平台小徽章图标（Badged Avatar）。
 */
function UserInfo() {
  const [tooltipOpen, setTooltipOpen] = React.useState(false)
  const pathname = usePathname()
  const { user } = useUser()

  // 记忆化检索当前用户的认证源，计算要显示的图标类型
  const StrategyIcon = React.useMemo(() => {
    const strategy = user?.primaryEmailAddress?.verification.strategy
    if (!strategy) return null

    switch (strategy) {
      case 'from_oauth_github':
        return GitHubBrandIcon as (props: React.ComponentProps<'svg'>) => JSX.Element
      case 'from_oauth_google':
        return GoogleBrandIcon
      default:
        return MailIcon
    }
  }, [user?.primaryEmailAddress?.verification.strategy])

  return (
    <AnimatePresence>
      {/* 状态一：如果用户已经登录，渲染 Clerk 原生用户面板头像 */}
      <SignedIn key="user-info">
        <motion.div
          className="pointer-events-auto relative flex h-10 items-center"
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 25 }}
        >
          <UserButton
            afterSignOutUrl={url(pathname).href} // 登出后自动重定向回当前页面
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9 ring-2 ring-white/20', // 微调登录头像边框
              },
            }}
          />
          {/* 第三方 OAuth 登录认证源小徽章 */}
          {StrategyIcon && (
            <span className="pointer-events-none absolute -bottom-1 -right-1 flex h-4 w-4 select-none items-center justify-center rounded-full bg-white dark:bg-zinc-900 shadow-sm">
              <StrategyIcon className="h-3 w-3" />
            </span>
          )}
        </motion.div>
      </SignedIn>

      {/* 状态二：如果未登录，展示带高级 Tooltip 浮窗提示的登录入口按钮 */}
      <SignedOut key="sign-in">
        <motion.div
          className="pointer-events-auto"
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 25 }}
        >
          <Tooltip.Provider disableHoverableContent>
            <Tooltip.Root open={tooltipOpen} onOpenChange={setTooltipOpen}>
              {/* 唤起 Clerk 官方模态弹窗 */}
              <SignInButton mode="modal" redirectUrl={url(pathname).href}>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    aria-label="登录账户"
                    className="group h-10 rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 px-3 text-sm shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
                  >
                    {/* 自定义的小人向左进入图标 */}
                    <UserArrowLeftIcon className="h-5 w-5 text-zinc-700 transition group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-100" />
                  </button>
                </Tooltip.Trigger>
              </SignInButton>

              {/* 气泡悬停文字提示 */}
              <AnimatePresence>
                {tooltipOpen && (
                  <Tooltip.Portal forceMount>
                    <Tooltip.Content asChild>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 shadow-md"
                      >
                        登录
                      </motion.div>
                    </Tooltip.Content>
                  </Tooltip.Portal>
                )}
              </AnimatePresence>
            </Tooltip.Root>
          </Tooltip.Provider>
        </motion.div>
      </SignedOut>
    </AnimatePresence>
  )
}
