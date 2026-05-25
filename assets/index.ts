// 💡 这个文件叫做“大仓库”或“集中批发部”。
// 它的主要工作就是把分散在 `./icons/` 文件夹里的几十个小图标统一收拢，再一起派发出去。
// 以后别的文件要用图标，直接找这个 index.ts 登记就行，省去了写一堆复杂文件路径的麻烦。
import type React from 'react'



// 🛠️ 这一步是在给所有图标定下“规矩”（定义 TypeScript 类型）：
// 名字叫 IconProps，意思是“所有图标的通用皮肤说明书”。
// 它扩展了 React 的标准 SVG 属性，这意味着将来你在用这些图标时，可以随便给它们传宽度、高度（width/height）、颜色（fill）或者样式类名（className），它们都能完美听懂并改变外观。
export type IconProps = React.SVGAttributes<SVGElement>



// 📦 【第一组：社交媒体与大型品牌图标】
// 这部分把各大主流平台的图标聚合起来，我们在上一节看到的“愚者尊名”下方的社交一栏，就是在这里进货的。
export { BilibiliIcon } from './icons/BilibiliIcon' // 哔哩哔哩（B站）
export { GitHubBrandIcon } from './icons/GitHubBrandIcon' // GitHub 品牌特定款
export { GitHubIcon } from './icons/GitHubIcon' // GitHub 标准款
export { GoogleBrandIcon } from './icons/GoogleBrandIcon' // 谷歌
export { TelegramIcon } from './icons/TelegramIcon' // 电报
export { TwitterIcon } from './icons/TwitterIcon' // 推特（小鸟或 X）
export { YouTubeIcon } from './icons/YouTubeIcon' // 优酷/油管视频平台



// 📦 【第二组：网站核心版块导航图标】
// 对应网站的主页、个人简历、后台、日历、项目经历等骨架部分的图标。
export { AtomIcon } from './icons/AtomIcon' // 原子图标（通常代表科技、底层技术或者 React 框架）
export { BriefcaseIcon } from './icons/BriefcaseIcon' // 公文包图标（一般用在“工作经历”或者“我的项目”页面）
export { CalendarIcon } from './icons/CalendarIcon' // 日历图标（用来展示文章发布时间或活动日程）
export { CloudIcon } from './icons/CloudIcon' // 云朵图标（多用于云端服务或天气、部署状态）
export { DashboardIcon } from './icons/DashboardIcon' // 仪表盘后台图标（管理员专享）
export { HomeIcon } from './icons/HomeIcon' // 经典的小房子图标（点击回首页）



// 📦 【第三组：表单交互与日常工具图标】
// 用于文章里的各种小动作，比如复制、打勾、过滤筛选、或者切换密码的可见性。
export { CheckDoubleTickIcon } from './icons/CheckDoubleTickIcon' // 双打勾（通常表示“已读”或“任务彻底完成”）
export { ClipboardCheckIcon } from './icons/ClipboardCheckIcon' // 带勾的剪贴板（多用于代码块右上角的“复制成功”提示）
export { ClipboardDataIcon } from './icons/ClipboardDataIcon' // 带数据的剪贴板
export { CursorClickIcon } from './icons/CursorClickIcon' // 鼠标点击状态
export { CursorIcon } from './icons/CursorIcon' // 鼠标指针样式
export { ExternalLinkIcon } from './icons/ExternalLinkIcon' // 带有右上角小箭头的跳出图标（提示用户这是一个“外部链接”）
export { EyeCloseIcon } from './icons/EyeCloseIcon' // 闭眼图标（用于隐藏密码或私密内容）
export { EyeOpenIcon } from './icons/EyeOpenIcon' // 睁眼图标（用于显示密码）
export { FilterHorizontalIcon } from './icons/FilterHorizontalIcon' // 横向过滤器/漏斗（用于博客文章按标签筛选）



// 📦 【第四组：视觉动效与主题状态图标】
// 这里包含了大名鼎鼎的昼夜交替（主题切换）图标，还有上一节为克莱恩尊名立功的星星和防护图标！
export { HourglassIcon } from './icons/HourglassIcon' // 沙漏（代表时间、漫长历史或正在加载）
export { Layers3Icon } from './icons/Layers3Icon' // 三层图层（代表技术架构或者堆叠状态）
export { LightningIcon } from './icons/LightningIcon' // 闪电（代表高能、快速、或者网站性能优化）
export { MailIcon } from './icons/MailIcon' // 传统信封（用于底部的“联系我”邮箱链接）
export { MinusCircleIcon } from './icons/MinusCircleIcon' // 圆圈减号（常用于删除或减少数量）
export { MoonIcon } from './icons/MoonIcon' // 月亮（点击切换到“暗黑深色模式”）
export { NewCommentIcon } from './icons/NewCommentIcon' // 新评论小气泡
export { PencilSwooshIcon } from './icons/PencilSwooshIcon' // 炫酷的流体画笔（通常用在“写博客”或管理后台）
export { SparkleIcon } from './icons/SparkleIcon' // 闪烁的小星星（就是上一节鼠标移上去会旋转 180 度的魔法星星！）
export { SubscriberIcon } from './icons/SubscriberIcon' // 订阅者小人（Newsletter 专属）
export { SunIcon } from './icons/SunIcon' // 太阳（点击切换到“明亮浅色模式”）
export { TagIcon } from './icons/TagIcon' // 标签分类（文章归类使用）



// 📦 【第五组：高级动作指令与返回彩蛋图标】
// 负责处理最后的发送、登出、关闭，甚至还有极客专属的神秘 UFO 飞碟。
export { TiltedSendIcon } from './icons/TiltedSendIcon' // 倾斜的纸飞机（点击发送评论或发送订阅邮件）
export { UFOIcon } from './icons/UFOIcon' // UFO 飞碟（极其闷骚的极客彩蛋，可能用在“未解之谜 AMA”或 404 迷路页面）
export { UserArrowLeftIcon } from './icons/UserArrowLeftIcon' // 带着左箭头的用户（通常代表登出或退出登录）
export { UserSecurityIcon } from './icons/UserSecurityIcon' // 盾牌小人（就是上一节“漫长历史的见证”旁边那个安全盾牌！）
export { UsersIcon } from './icons/UsersIcon' // 多人图标（代表粉丝量、群组或访客总数）
export { UTurnLeftIcon } from './icons/UTurnLeftIcon' // U型急转弯左转（紧急返回上一页）
export { XIcon } from './icons/XIcon' // 标准的弹窗关闭大叉叉
export { XSquareIcon } from './icons/XSquareIcon' // 带方框的关闭叉叉
