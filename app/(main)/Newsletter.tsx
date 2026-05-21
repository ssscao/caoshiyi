/**
 * 【文件大致作用】：
 *   本文件是一个极具交互温度的“电子报订阅卡片组件（Newsletter Subscription Card）”。
 *   它允许访问博客的读者输入邮箱，订阅博主的每月动态更新。
 *   该组件集成了现代前端表单处理的“全家桶”黄金组合：
 *   1. 【安全稳健的表单联动】：利用 `react-hook-form` 配合 `zod` 实现了即时的邮箱格式合法性校验，拒绝无效垃圾数据。
 *   2. 【极佳的情绪反馈（Micro-interactions）】：订阅成功后，利用 `react-rewards` 会在按钮附近喷射出一大票可爱的表情包雨（Emoji Blast），并利用 `framer-motion` 把表单无缝淡出、切换成感谢语。
 *   3. 【商业数据埋点】：内置了 `@vercel/analytics`，每当有人订阅成功就会自动上报，方便博主在 Vercel 后台查看转化率。
 * 
 * 【哪些文件可能会用到当前文件】：
 *   - `app/(main)/page.tsx`（主页右侧侧边栏，用来作为常驻挂件吸引读者订阅）
 *   - `app/(main)/posts/[slug]/page.tsx`（博客文章详情页的底部，看完文章后顺理成章引导订阅）
 * 
 * 【当前文件使用了哪些文件】：
 *   - `~/assets`（引入斜角发送图标 TiltedSendIcon）
 *   - `~/components/ui/Button`（公用的定制按钮组件）
 *   - `/api/newsletter`（【后端路由】点击提交时，会向这个全栈 API 接口发起 POST 请求，真正把邮箱存入数据库或第三方 Newsletter 服务商）
 */

'use client' // 声明客户端组件：包含表单状态交互、DOM 动画渲染、定时器

import { zodResolver } from '@hookform/resolvers/zod'
import va from '@vercel/analytics'
import { clsxm } from '@zolplay/utils'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useReward } from 'react-rewards'
import { z } from 'zod'

import { TiltedSendIcon } from '~/assets'
import { Button } from '~/components/ui/Button'

// 订阅表单在第三方服务商（如 ConvertKit/Loop 等）处的特定标示 ID
const formId = '5108903'

// 【核心高能】：使用 Zod 声明式定义表单校验规则
export const newsletterFormSchema = z.object({
  // 必须是合法的邮箱格式，否则抛出中文提示语；且不能为空值
  email: z.string().email({ message: '邮箱地址不正确' }).nonempty(),
  formId: z.string().nonempty(),
})

// 利用 TypeScript 从 Zod 骨架中反向推导导出严谨的表单类型
export type NewsletterForm = z.infer<typeof newsletterFormSchema>

export function Newsletter({ subCount }: { subCount?: string }) {
  // 初始化 react-hook-form 状态管理器
  const {
    register,     // 用来给 input 标签注册绑定事件与校验规则
    handleSubmit, // 高阶提交处理函数，会自动拦截原生事件并运行 Zod 校验
    formState: { errors, isSubmitting }, // 实时抓取“错误信息”和“是否正在提交中”的挂起状态
    reset,        // 成功后清空表单输入的重置函数
  } = useForm<NewsletterForm>({
    defaultValues: { formId }, // 预填默认的隐藏表单 ID
    resolver: zodResolver(newsletterFormSchema), // 将 Zod 的校验能力完美接入 hook-form
  })

  // 状态：当前读者是否已经订阅成功
  const [isSubscribed, setIsSubscribed] = React.useState(false)

  // 炫酷动效基建：注册一个 ID 为 'newsletter-rewards' 的喷射源，类型为 emoji 粒子
  const { reward } = useReward('newsletter-rewards', 'emoji', {
    position: 'absolute',
    emoji: ['🤓', '😊', '🥳', '🤩', '🤪', '🤯', '🥰', '😎', '🤑', '🤗', '😇'], // 随机喷出的可爱表情包
    elementCount: 32, // 一次性喷出 32 个小粒子
  })

  // 【业务逻辑核心】：提交表单的处理函数
  const onSubmit = React.useCallback(
    async (data: NewsletterForm) => {
      try {
        if (isSubmitting) return // 防抖：如果正在发送中，拒绝重复触发

        // 🚀 数据数据埋点：向 Vercel Analytics 发送自定义订阅计数事件
        va.track('Newsletter:Subscribe')

        // 异步向 Next.js 的全栈 Route Handler 接口发送请求
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data }),
        })

        if (response.ok) {
          reset() // 1. 擦除输入框里的邮箱文本
          reward() // 2. 轰！在屏幕上炸出一场表情包礼花雨
          setIsSubscribed(true) // 3. 标记订阅成功，切入成功态文案
        }
      } catch (error) {
        console.error(error) // 容错：打印可能发生的网络异常
      }
    },
    [isSubmitting, reset, reward]
  )

  // 贴心的状态回收：如果用户订阅成功了，1分钟后把状态悄悄切回输入框状态，方便别人用新邮箱继续订阅
  React.useEffect(() => {
    if (isSubscribed) {
      const timer = setTimeout(() => setIsSubscribed(false), 60000)
      return () => clearTimeout(timer)
    }
  }, [isSubscribed])

  return (
    // clsxm 工具函数：当表单处于正在向服务器发送（isSubmitting）的空窗期时，自动让整个卡片半透明并禁用鼠标一切点击事件
    <form
      className={clsxm(
        'relative rounded-2xl border border-zinc-100 p-6 transition-opacity dark:border-zinc-700/40',
        isSubmitting && 'pointer-events-none opacity-70'
      )}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* 隐藏域输入框：悄悄把表单配置 ID 带过去，对普通读者不可见 */}
      <input type="hidden" className="hidden" {...register('formId')} />
      
      <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <TiltedSendIcon className="h-5 w-5 flex-none" />
        <span className="ml-2">动态更新</span>
      </h2>

      <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 md:text-sm">
        <span>喜欢我的内容的话不妨订阅支持一下 🫶</span>
        <br />
        {/* 社会认同感（Social Proof）：如果外面传进了订阅总人数（比如 500），就展示出来增强吸引力 */}
        {subCount && (
          <span>
            加入其他 <span className="font-medium">{subCount}</span> 位订阅者，
          </span>
        )}
        <span>每月一封，随时可以取消订阅。</span>
      </p>

      {/* AnimatePresence 控制输入框与成功提示之间的“闪转换场动画” */}
      <AnimatePresence mode="wait">
        {!isSubscribed ? (
          // 状态 A：读者还没填，展示输入框和订阅按钮
          <motion.div
            className="mt-6 flex h-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }} // 当消失时轻微向下淡出
          >
            <input
              type="email"
              placeholder="你的邮箱"
              aria-label="电子邮箱"
              required
              // focus:ring-4...：现代 Tailwind 的双层高亮焦点圈，聚焦时输入框四周会晕染开一层极具呼吸感的淡绿色光环
              className="min-w-0 flex-auto appearance-none rounded-lg border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] placeholder:text-zinc-400 focus:border-lime-500 focus:outline-none focus:ring-4 focus:ring-lime-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-lime-400/50 dark:focus:ring-lime-400/5 sm:text-sm"
              {...register('email')}
            />
            <Button
              type="submit"
              className="ml-2 flex-none"
              disabled={isSubmitting}
            >
              订阅
            </Button>
          </motion.div>
        ) : (
          // 状态 B：订阅成功，瞬间变成一行治愈的提示词
          <motion.p
            className="mt-6 h-10 text-center text-lg text-zinc-700 dark:text-zinc-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            请查收订阅确认邮件 🥳
          </motion.p>
        )}
      </AnimatePresence>

      {/* 【关键锚点】：这个隐藏的 span 标签就是 react-rewards 礼花在屏幕上炸开时的那个“发射筒坐标中心” */}
      <span id="newsletter-rewards" className="absolute bottom-12 right-12 h-0 w-0" />

      {/* 表单校验错误提示区：如果你胡乱打字不是邮箱格式，这里会浮现出红色的“邮箱地址不正确” */}
      {errors.email && (
        <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
          {errors.email.message}
        </p>
      )}
    </form>
  )
}
