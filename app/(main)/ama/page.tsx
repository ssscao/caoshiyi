// 💡 这是一个 Next.js 客户端组件。因为代码里用了炫酷的网页动画库，必须加上这行告诉浏览器：“这个文件需要在用户的浏览器里运行，而不是在服务器后台静止渲染”。
'use client'
import { BorderBeam } from 'border-beam'

import { Container } from '~/components/ui/Container'
export default function AskMeAnythingPage() {
  return (
    <BorderBeam
          size="md"
          colorVariant="colorful"
          theme="light"
          strength={0.7}
          duration={3.1}
    >
    
      <Container className="mt-16 sm:mt-24">
      毕业一年，大脑皮层已如气球般光滑，没有一丝感悟。
      </Container>
    </BorderBeam>
  )
}
