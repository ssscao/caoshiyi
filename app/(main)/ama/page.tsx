import Image from 'next/image'
import Balancer from 'react-wrap-balancer'

import { RichLink } from '~/components/links/RichLink'
import { Container } from '~/components/ui/Container'

// 图片导入
import AlipayQR from './alipay-qr.jpg'
import ThankYouLetterScreenshot1 from './Arc aagD26w9@2x.png'
import ThankYouLetterScreenshot2 from './Arc ynleUdHy@2x.png'

export default function AskMeAnythingPage() {
  return (
    <Container className="mt-16 sm:mt-24">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          Ask Me Anything / 一对一咨询
        </h1>
      </header>

      <article className="prose dark:prose-invert">
        {/* 定价部分 - 包含支付宝二维码图片 */}
        <h2>定价</h2>
        <p>我的一对一咨询的价格为：</p>
        <ul>
          <li>
            <strong>¥150 - 30分钟</strong>
          </li>
          <li>
            <strong>¥300 - 60分钟</strong>
          </li>
        </ul>

        <p className="flex justify-center md:block md:justify-start">
          <span className="inline-flex flex-col items-center">
            {/* 支付宝二维码图片 */}
            <Image src={AlipayQR} alt="支付宝二维码" className="w-44 dark:brightness-90" />
            <span className="mt-1 text-sm font-medium">支付宝二维码</span>
          </span>
        </p>

        {/* 感谢信部分 - 包含两个截图图片 */}
        <h2>感谢信</h2>
        <p>
          下面两个截图摘选自两名 Twitter
          朋友的私信，能够帮助到更多的人一直是我的使命：
        </p>
        <p className="grid items-center gap-4 lg:grid-cols-2">
          {/* 感谢信截图1 */}
          <Image
            src={ThankYouLetterScreenshot1}
            alt="感谢信截图1"
            className="max-w-full"
          />
          {/* 感谢信截图2 */}
          <Image
            src={ThankYouLetterScreenshot2}
            alt="感谢信截图2"
            className="max-w-full"
          />
        </p>
      </article>
    </Container>
  )
}
