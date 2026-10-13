import { Container } from '~/components/ui/Container'
import { BorderBeam } from 'border-beam'

export default function AskMeAnythingPage() {
  return (
    <Container className="mt-16 sm:mt-24">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 p-8 dark:border-zinc-800">
        毕业一年，大脑皮层已如气球般光滑，没有一丝感悟。
        
        {/* 移除了报错的 size 属性，只保留支持的 duration 和 delay */}
        <BorderBeam duration={12} delay={9} />
      </div>
    </Container>
  )
}
