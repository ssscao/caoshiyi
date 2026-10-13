import { Container } from '~/components/ui/Container'
import { BorderBeam } from 'border-beam';

export default function AskMeAnythingPage() {
  return (
    <Container className="mt-16 sm:mt-24">
      {/* 必须用一个有 relative 和 overflow-hidden 的容器包裹，BorderBeam 才能正常渲染 */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 p-8 dark:border-zinc-800">
        毕业一年，大脑皮层已如气球般光滑，没有一丝感悟。
        
        <BorderBeam />
      </div>
    </Container>
  )
}
