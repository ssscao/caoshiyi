// 💡 这个文件负责渲染网站顶部或个人主页上那个圆圆的、精致的用户头像（Avatar）。
// 它非常高级，内部藏着两个小组件：一个负责画“外框和阴影”，另一个负责“加载头像图片”。
// 另外，它还包含一个好玩的隐藏功能：支持通过一个开关，在“正常头像”和“备用/第二头像”之间无缝切换（比如克莱恩切换成夏洛克，哈哈）！
import { type ComponentProps } from '@zolplay/react'
import { clsxm } from '@zolplay/utils'
import Image from 'next/image'
import Link, { type LinkProps } from 'next/link'

// 🖼️ 提前把本地准备好的两张头像图片“进货”搬运进来：
// portraitImage 是主头像（正常状态），portraitAltImage 是备用/变身头像（Alternative 状态）。
import portraitImage from '~/assets/Portrait.png'
import portraitAltImage from '~/assets/PortraitAlt.jpg'



// 🛠️ 组件一：【头像的白围墙/外容器 - AvatarContainer】
// 职责：它不负责显示图片，只负责在图片外面画一圈漂亮的圆形外框、加点高档的毛玻璃滤镜（backdrop-blur）和立体感阴影。
function AvatarContainer({ className, ...props }: ComponentProps) {
  return (
    <div
      // clsxm 是一个神奇的 Tailwind 类名打包器。
      // 它的作用是：把下面这一长串默认样式（圆角、白底、阴影、暗黑模式边框）打包。
      // 如果你在外面给这个组件传了新的 className（比如调个边距），它能完美合并，不会引起样式冲突。
      className={clsxm(
        className,
        'h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:ring-white/10'
      )}
      {...props} // ...props 代表把剩下的其他原生属性（比如 id 或 鼠标事件）原封不动地传给这个 div
    />
  )
}



// 📋 属性说明书（TypeScript 类型定义）：【头像图片需要哪些参数 - AvatarImageProps】
// 这里规定了：你可以决定它是不是大号头像（large）、点击后跳到哪（href）、以及是否启用备用变身头像（alt）。
type AvatarImageProps = ComponentProps &
  Omit<LinkProps, 'href'> & {
    large?: boolean // 问号代表可选属性：填 true 就是大头像，不填就是默认小头像
    href?: string   // 点击头像后跳转的网页链接
    alt?: boolean   // 问号代表可选：填 true 就会切成备用头像
  }



// 🛠️ 组件二：【真正的头像图片 - AvatarImage】
// 职责：点击它能跳转回首页，并且能根据你给的指令，智能变大变小、切换图片。
function AvatarImage({
  large = false, // 默认不开启大号头像
  className,
  href,
  alt,
  ...props
}: AvatarImageProps) {
  return (
    // 它在最外面套了一个 Next.js 的 Link 标签，这意味着头像天然就是一个“超链接”，点击就能跳转。
    <Link
      aria-label="主页" // 盲人无障碍辅助标签，告诉读屏软件：“这是一个通往主页的头像”
      className={clsxm(className, 'pointer-events-auto')} // pointer-events-auto 确保头像在任何层级下都能被鼠标正常点击
      href={href ?? '/'} // 如果你没传 href，默认点击就回到网站根目录（首页 '/'）
      {...props}
    >
      {/* Next.js 专属的超级优化图片组件（Image），能自动帮你压缩图片大小、防止网页加载时布局抖动 */}
      <Image
        // 🔥 这里是个好玩的魔法三元表达式！如果 alt 属性传了 true，就显示备用头像，否则就显示正常的主头像。
        src={alt ? portraitAltImage : portraitImage}
        alt="" // 装饰性图片，这里置空即可，无障碍标签已经写在上面的 Link 里了
        // sizes 属性告诉浏览器：“大号时占 4rem（64像素）宽，小号时占 2.25rem（36像素）宽”，方便浏览器提前准备合适分辨率的图
        sizes={large ? '4rem' : '2.25rem'}
        // 通过 large 的真假，动态切换图片的 Tailwind 宽高样式（h-16 w-16 对应 64px，h-9 w-9 对应 36px）
        className={clsxm(
          'rounded-full bg-zinc-100 object-cover dark:bg-zinc-800',
          large ? 'h-16 w-16' : 'h-9 w-9'
        )}
        priority // 极其关键的属性！意思是“最高优先级预加载”。因为头像是网页一打开最上面的核心视觉，加上它，图片会在第一时间亮起，绝不卡顿。
      />
    </Link>
  )
}



// 👑 终极大合体与导出：【复合组件设计模式 (Compound Components)】
// 这行代码把“外框组件”和“图片组件”通过 JavaScript 的 Object.assign 强行缝合在一起，改名叫 Avatar。
// 这样做的主要目的是为了让你在别的文件里用起来超级舒服、超级有组织性。
// 以后你在别的页面只需要这样写：
// <Avatar>
//   <Avatar.Image large={true} alt={false} />
// </Avatar>
export const Avatar = Object.assign(AvatarContainer, { Image: AvatarImage })
