// 💡 这是一个 Next.js 客户端组件。因为代码里用了炫酷的网页动画库，必须加上这行告诉浏览器：“这个文件需要在用户的浏览器里运行，而不是在服务器后台静止渲染”。
'use client'

// 📦 这里引入了各种开箱即用的“魔法工具箱”：
// 1. motion：大名鼎鼎的动画库，让文字和按钮能丝滑地飞入屏幕。
// 2. Balancer：文字平衡器，防止一句话最后剩下一个字孤零零地换行，让排版更美观。
// 3. Icons / Links：定制的图标和社交链接组件。
import { motion } from 'framer-motion'
import Balancer from 'react-wrap-balancer'
import { SparkleIcon, UserSecurityIcon } from '~/assets'
import { PeekabooLink } from '~/components/links/PeekabooLink'
import { SocialLink } from '~/components/links/SocialLink'



// 🛠️ 标签组件一：【开发者】（对应“灵界和源堡的眷者”）
// 效果：模拟代码的标签（如 < 文本 />），鼠标放上去时，右侧会亮起一个网页代码常见的“闪烁打字光标”。
function Developer() {
  return (
    <span className="group">
      {/* 这里用转义字符 &lt; 和 &gt; 打印出了代码的尖括号 < 和 /> */}
      <span className="font-mono">&lt;</span>灵界和源堡的眷者
      <span className="font-mono">/&gt;</span>
      {/* 下面这行是个“隐形人”（invisible），当鼠标移入这个区域时（group-hover），它会变成可见并触发类似终端打字的闪烁动画（animate-typing） */}
      <span className="invisible inline-flex text-zinc-300 before:content-['|'] group-hover:visible group-hover:animate-typing dark:text-zinc-500" />
    </span>
  )
}



// 🛠️ 标签组件二：【设计师】（对应“源自古代的诡秘”）
// 效果：鼠标放上去时，文字周围会出现一个像专业设计软件（如 Figma/Photoshop）里的那种带四个角落蓝框/绿框的高亮选框，且实线变虚线。
function Designer() {
  return (
    <span className="group relative bg-black/5 p-1 dark:bg-white/5">
      {/* 这个 span 负责画出四周的边框线，鼠标移上去后实线会变成虚线（group-hover:border-dashed） */}
      <span className="pointer-events-none absolute inset-0 border border-lime-700/90 opacity-70 group-hover:border-dashed group-hover:opacity-100 dark:border-lime-400/90">
        {/* 这四个绝对定位（absolute）的小方块，就是设计框四个角上的“缩放锚点/小把手” */}
        <span className="absolute -left-[3.5px] -top-[3.5px] size-1.5 border border-lime-700 bg-zinc-50 dark:border-lime-400" />
        <span className="absolute -bottom-[3.5px] -right-[3.5px] size-1.5 border border-lime-700 bg-zinc-50 dark:border-lime-400" />
        <span className="absolute -bottom-[3.5px] -left-[3.5px] size-1.5 border border-lime-700 bg-zinc-50 dark:border-lime-400" />
        <span className="absolute -right-[3.5px] -top-[3.5px] size-1.5 border border-lime-700 bg-zinc-50 dark:border-lime-400" />
      </span>
      源自古代的诡秘
    </span>
  )
}



// 🛠️ 标签组件三：【完美主义/星星】（对应“贫困孩子的保护者”）
// 效果：文字左边有一个小星星图标。当鼠标放上去时，星星会像魔法一样丝滑地旋转 180 度。
function OCD() {
  return (
    <span className="group inline-flex items-center">
      {/* transform-gpu 代表启用显卡加速让动画不卡顿，duration-500 意思是旋转过程持续 0.5 秒，rotate-180 就是鼠标移入转半圈 */}
      <SparkleIcon className="mr-1 inline-flex transform-gpu transition-transform duration-500 group-hover:rotate-180" />
      <span>贫困孩子的保护者</span>
    </span>
  )
}



// 🛠️ 标签组件四：【安全/创始人】（对应“漫长历史的见证”）
// 效果：左边有一个安全盾牌图标。鼠标放上去时，图标的内部镂空部分会变成淡淡的灰色，产生微弱的互动感。
function Founder() {
  return (
    <span className="group inline-flex items-center">
      {/* group-hover:fill-zinc... 意思是当鼠标靠近这一整行时，给图标里面的空心部分填满淡淡的浅色 */}
      <UserSecurityIcon className="mr-1 inline-flex group-hover:fill-zinc-600/20 dark:group-hover:fill-zinc-200/20" />
      <span>漫长历史的见证</span>
    </span>
  )
}



// 👑 主核心组件：【大标题 Headline】
// 职责：把上面定义好的四个炫酷称号垂直排好，并为它们套上“首次打开网页时，从下往上飞入”的华丽物理弹簧动效。
export function Headline() {
  return (
    <div className="max-w-2xl">
      {/* 🎬 动效一：主尊名大字报。motion.h1 代替了普通的 h1 标签，让它拥有了动画超能力 */}
      <motion.h1
        className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl"
        initial={{ opacity: 0, y: 30 }} // 动画起点：刚进网页时是隐形的（opacity:0），并且往下挪了 30 像素（y:30）
        animate={{ opacity: 1, y: 0 }}   // 动画终点：完全显现（opacity:1），并且回到原本完美居中的位置
        transition={{
          type: 'spring',               // 弹簧物理动画，拒绝死板，像拉扯松紧带一样自然回弹
          damping: 25,                  // 阻力（数值越大，弹得越不厉害，收尾越稳）
          stiffness: 100,               // 刚度/硬度（数值越大，弹得越快、越有劲）
          duration: 0.3,                // 整个动画总共用时 0.3 秒
        }}
      >
        {/* 依次渲染四个称号，中间夹着 h-2（高 8 像素）的隐形方块作为行与行之间的间距 */}
        <Developer />
        <span className="block h-2" />
        <Designer />
        <span className="block h-2" />
        <OCD />
        <span className="block h-2" />
        <Founder />
      </motion.h1>


      {/* 🎬 动效二：副标题介绍文案。比上面的大字稍微晚一点点出场，形成一种极具高级感的视觉先后层次 */}
      <motion.p
        className="mt-6 text-base text-zinc-600 dark:text-zinc-400"
        initial={{ opacity: 0, y: 20 }} // 同样是隐形并下移，但只下移了 20 像素，动作幅度更小、更细腻
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 85,
          duration: 0.3,
          delay: 0.1,                   // 关键：延迟 0.1 秒播放。等上面的大字动得差不多了它再冒出来
        }}
      >
        {/* Balancer 标签会动态计算文字，保证在手机端和电脑端折行时，两行的字数均衡，不会出现排版难看的狗牙错落 */}
        <Balancer>
          预留介绍
        </Balancer>
      </motion.p>


      {/* 🎬 动效三：社交媒体图标栏。最后排队登场，里面整整齐齐地排了一排按钮 */}
      <motion.div
        className="mt-6 flex gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          damping: 50,
          stiffness: 90,
          duration: 0.35,
          delay: 0.25,                  // 关键：延迟 0.25 秒播放，作为整套大招华丽登场的压轴戏
        }}
      >
        {/* SocialLink 是作者封装好的组件，目前 href 都是空的 ""，你以后可以在里面填入你自己的主页链接（如 https://github.com/你的名字） */}
        <SocialLink
          href=""
          aria-label="我的推特"
          platform="twitter"
        />
        <SocialLink
          href=""
          aria-label="我的 YouTube"
          platform="youtube"
        />
        <SocialLink
          href=""
          aria-label="我的 Bilibili"
          platform="bilibili"
        />
        <SocialLink
          href=""
          aria-label="我的 GitHub"
          platform="github"
        />
        <SocialLink
          href=""
          aria-label="我的 Telegram"
          platform="telegram"
        />
        {/* 这一行配置的是网站的 RSS 订阅源，链接指向了你目录里的 /feed.xml 路由 */}
        <SocialLink href="/feed.xml" platform="rss" aria-label="RSS 订阅" />
        <SocialLink
          href=""
          aria-label="我的邮箱"
          platform="mail"
        />
      </motion.div>
    </div>
  )
}
