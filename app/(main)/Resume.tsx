/**
 * 【文件大致作用】：
 *   本文件是一个精致的“工作经历/简历小部件组件（Resume Widget）”。
 *   它通常作为挂件安插在个人主页的侧边栏（Sidebar）。
 *   该组件在代码设计上非常硬核，完美遵循了现代前端的两个核心指标：
 *   1. 【极致的语义化与可访问性（A11y）】：没有通篇瞎写 `<div>`，而是教科书般地使用了 `<ol>`（有序列表）、
 *      `<dl>`（描述列表）、`<dt>`（描述术语）和 `<dd>`（描述详情），并配合 `sr-only` 照顾盲人读屏软件。
 *   2. 【健壮的防御性编程】：利用 TypeScript 严格约束了时间字段，并使用双问号操作符（??）完美承接“在职/至今”的边界状态。
 * 
 * 【哪些文件可能会用到当前文件】：
 *   - `app/(main)/page.tsx`（博客系统的主页。通常在主页右侧侧边栏，把一串工作履历数组传给它渲染）
 * 
 * 【当前文件使用了哪些文件】：
 *   - `next/image`（Next.js 官方的高性能图片组件）
 *   - `~/assets`（引入公用的公文包图标 BriefcaseIcon）
 */

import Image from 'next/image'
import React from 'react'

import { BriefcaseIcon } from '~/assets'

// 定义单条履历的严格数据结构
type Resume = {
  company: string   // 公司名称
  title: string     // 担任职位
  start: string     // 入职年份/月份
  end?: string | null // 离职年份（如果是可选的 `?` 或 `null`，代表当前依然在职）
  logo: string      // 公司 Logo 的图片 URL 地址
}

export function Resume({ resume }: { resume: Resume[] }) {
  return (
    // 外层大卡片：自带圆角（rounded-2xl）和细微的边框。
    // 在暗黑模式下（dark:border-zinc-700/40）边框透明度变浅，使其看起来非常内敛、不夺主视觉
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      
      {/* 小部件的头部标题 */}
      <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {/* flex-none：强行锁死图标大小，防止右侧文字过长时把左边的图标挤压变形 */}
        <BriefcaseIcon className="h-5 w-5 flex-none" />
        <span className="ml-2">工作经历</span>
      </h2>

      {/* space-y-4：现代 Tailwind 杀手级属性，自动让列表内部的每个 `<li>` 之间垂直保持 16 像素的等距间隔 */}
      <ol className="mt-6 space-y-4">
        {resume.map((role, roleIndex) => (
          // 以循环的索引值 roleIndex 作为 React 的唯一 key
          <li key={roleIndex} className="flex gap-4">
            
            {/* ------------------------------------------------------------------------
             * 【左侧：公司 Logo 容器】
             * ------------------------------------------------------------------------ */}
            <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
              <Image
                src={role.logo}
                alt={role.company}
                className="h-8 w-8 rounded-full"
                width={100}
                height={100}
                // unoptimized：禁用 Next.js 默认的云端图片裁剪格式优化。
                // 为什么要加这个？请参见下方小白速通第 2 条。
                unoptimized
              />
            </div>

            {/* ------------------------------------------------------------------------
             * 【右侧：结构化图文详情（使用标准 HTML 描述列表 dl）】
             * ------------------------------------------------------------------------ */}
            {/* flex-auto flex-wrap：开启弹性布局并允许内容自动换行 */}
            <dl className="flex flex-auto flex-wrap gap-x-2">
              
              {/* sr-only 的神级应用：对正常肉眼完全隐藏，但盲人读屏软件能清晰读出当前项是“公司” */}
              <dt className="sr-only">公司</dt>
              {/* w-full flex-none：强行让公司名字霸占整整第一行，把职位和日期挤到第二行去 */}
              <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {role.company}
              </dd>

              <dt className="sr-only">职位</dt>
              <dd className="text-xs text-zinc-500 dark:text-zinc-400">
                {role.title}
              </dd>

              <dt className="sr-only">日期</dt>
              {/* ml-auto：神奇的对齐魔法，把日期时间线死死地推到最右侧对齐 */}
              <dd className="ml-auto text-xs text-zinc-500/80 dark:text-zinc-400/80">
                {role.start}
                {/* aria-hidden="true"：告诉读屏软件，中间这根连字符“—”就不要笨拙地读出声音来了，直接跳过读日期即可 */}
                <span aria-hidden="true">—</span> {role.end ?? '至今'}
              </dd>

            </dl>
          </li>
        ))}
      </ol>
    </div>
  )
}
