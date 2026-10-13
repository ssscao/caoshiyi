import { Container } from '~/components/ui/Container'
import { BorderBeam } from 'border-beam'

export default function AskMeAnythingPage() {
  return (
    <Container className="mt-16 sm:mt-24">
      {/* 确保父容器具备 relative 定位和 overflow-hidden（如果需要裁剪溢出的光效），以及适当的圆角和背景 */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 p-8 dark:border-zinc-800">
        毕业一年，大脑皮层已如气球般光滑，没有一丝感悟。
        
        {/* 加入 BorderBeam 组件 */}
        <BorderBeam size={250} duration={12} delay={9} />
      </div>
    </Container>
  )
}
