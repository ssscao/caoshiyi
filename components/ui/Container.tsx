// ============================== 文件依赖导入模块 ==============================

// 从 @zolplay/utils 工具库中导入 clsxm 函数。
// clsxm 通常用于组合多个 CSS 类名，支持将默认类名与外部传入的 className 合并。
// 在本文件中，它主要用于合并容器组件内部定义的 Tailwind CSS 类名和调用者自定义的类名。
import { clsxm } from '@zolplay/utils'

// 导入 React 库。
// 本文件使用 React 的 forwardRef、ComponentPropsWithoutRef 等 API，
// 以实现组件的属性类型推导、DOM 引用转发以及可复用的容器组件。
import React from 'react'


// ============================== 容器组件属性类型定义模块 ==============================

// 定义 ContainerProps 类型，用于描述容器组件能够接收的属性。
// React.ComponentPropsWithoutRef<'div'> 表示获取原生 HTML <div> 元素支持的所有 React 属性类型，
// 例如 className、id、style、onClick、title、role、aria-* 等。
// 其中不包含由 React 自动处理的 ref 属性，因此可以单独通过 forwardRef 转发 ref。
// 这样定义可以使容器组件像普通 <div> 一样接收标准 HTML 属性，
// 同时避免手动重复声明每一个属性的类型。
type ContainerProps = React.ComponentPropsWithoutRef<'div'>


// ============================== 外层容器组件模块 ==============================

// 使用 React.forwardRef 创建 OuterContainer 组件。
// React.forwardRef 用于将父组件传入的 ref 转发给组件内部的指定 DOM 元素。
// HTMLDivElement 表示 ref 最终指向 HTML <div> 元素。
// ContainerProps 表示组件接收的属性类型，即原生 <div> 支持的属性。
// 这种写法可以让调用者通过 ref 获取外层容器对应的真实 DOM 节点。
const OuterContainer = React.forwardRef<HTMLDivElement, ContainerProps>(

  // 定义 OuterContainer 的实际渲染函数。
  // 这里使用具名函数 OuterContainer，便于调试时识别组件名称。
  // 第一个参数是组件接收的 props，第二个参数 ref 是 forwardRef 转发进来的引用。
  function OuterContainer({ className, children, ...props }, ref) {

    // 返回组件需要渲染的 JSX 结构。
    return (

      // 外层 <div> 是 OuterContainer 的根 DOM 元素。
      // ref={ref} 将父组件传入的 ref 绑定到当前这个真实的 HTML <div> 元素上。
      // className={clsxm('sm:px-8', className)} 用于合并 CSS 类名：
      // 'sm:px-8' 是组件默认设置的响应式水平内边距类名。
      // sm:px-8 表示在 Tailwind CSS 的 sm 断点及以上应用左右各 2rem 的内边距，
      // 通常默认 sm 断点为 640px，具体取决于项目的 Tailwind 配置。
      // className 是从组件外部传入的自定义 CSS 类名。
      // clsxm 将默认类名与外部类名组合，使调用者能够进一步定制样式。
      // {...props} 将剩余的所有属性展开并传递给当前 <div>。
      // 例如，调用者传入的 id、style、onClick、data-* 等属性都会被继续传递。
      <div ref={ref} className={clsxm('sm:px-8', className)} {...props}>

        {/* 内层 <div> 用于控制内容区域的水平居中和最大宽度。 */}
        {/* mx-auto 表示左右外边距自动分配，从而在可用空间中实现水平居中。 */}
        {/* max-w-7xl 设置最大宽度为 Tailwind CSS 的 7xl 尺寸， */}
        {/* 默认配置下通常对应 80rem，即 1280px。 */}
        {/* lg:px-8 表示在 lg 断点及以上设置左右各 2rem 的内边距。 */}
        {/* {children} 用于渲染调用 OuterContainer 时传入的所有子节点， */}
        {/* 例如文本、按钮、其他 React 组件或多个 JSX 元素。 */}
        <div className="mx-auto max-w-7xl lg:px-8">{children}</div>

      {/* 结束 OuterContainer 内部的内容容器。 */}
      </div>

    // 结束 JSX 返回结构。
    )

  // 结束 OuterContainer 的实际渲染函数。
  }

// 结束 React.forwardRef 的函数参数，并将创建的组件赋值给 OuterContainer。
)


// ============================== 内层容器组件模块 ==============================

// 使用 React.forwardRef 创建 InnerContainer 组件。
// HTMLDivElement 表示 ref 指向的 DOM 节点类型是 HTML <div> 元素。
// ContainerProps 表示组件可以接收所有常规 <div> 属性。
// 通过 forwardRef，外部调用者可以将 ref 转发给 InnerContainer 的根 <div>。
const InnerContainer = React.forwardRef<HTMLDivElement, ContainerProps>(

  // 定义 InnerContainer 的实际渲染函数。
  // 这里使用具名函数 InnerContainer，方便 React 开发工具识别组件。
  // className 用于接收外部传入的自定义 CSS 类名。
  // children 用于接收组件内部的子节点。
  // ...props 用于收集剩余的所有属性，例如 id、style、onClick 等。
  // ContainerProps 显式标注第一个参数的类型，保证属性类型检查。
  // ref 是 React.forwardRef 自动传入的引用参数。
  function InnerContainer(
    { className, children, ...props }: ContainerProps,
    ref
  ) {

    // 返回 InnerContainer 的 JSX 结构。
    return (

      // 当前 <div> 是 InnerContainer 的根 DOM 元素。
      // ref={ref} 将外部传入的 ref 绑定到当前 <div> 上。
      // className 属性通过 clsxm 合并默认样式和外部自定义样式。
      // 默认类名 'relative px-4 sm:px-8 lg:px-12' 包含以下含义：
      // relative：设置 position: relative，使该元素成为内部绝对定位元素的定位参考。
      // px-4：默认情况下设置左右各 1rem 的内边距。
      // sm:px-8：在 sm 断点及以上设置左右各 2rem 的内边距。
      // lg:px-12：在 lg 断点及以上设置左右各 3rem 的内边距。
      // 当不同响应式断点同时生效时，较高断点的 px-12 会覆盖较低断点的水平内边距设置。
      // className：允许调用者传入额外的 CSS 类名，以扩展或调整默认样式。
      // {...props}：将其他 HTML 属性全部展开并传递给当前 <div>。
      <div
        // 将父组件传入的 ref 绑定到当前内层容器的根 DOM 元素。
        ref={ref}

        // 合并内层容器的默认 Tailwind CSS 类名与外部传入的 className。
        className={clsxm('relative px-4 sm:px-8 lg:px-12', className)}

        // 将解构后剩余的 HTML 属性传递给当前 <div>。
        {...props}
      >

        {/* 内部内容区域用于限制内容的最大宽度，并使内容水平居中。 */}
        {/* mx-auto 表示左右外边距自动分配，实现水平居中。 */}
        {/* max-w-2xl 设置默认最大宽度为 Tailwind CSS 的 2xl 尺寸， */}
        {/* 默认配置下通常为 42rem，即 672px。 */}
        {/* lg:max-w-5xl 表示在 lg 断点及以上，将最大宽度调整为 5xl， */}
        {/* 默认配置下通常为 64rem，即 1024px。 */}
        {/* 因此，在较小屏幕上，内容区域相对较窄；在较大屏幕上，内容区域可以更宽。 */}
        {/* {children} 用于渲染调用 InnerContainer 时传入的所有子节点。 */}
        <div className="mx-auto max-w-2xl lg:max-w-5xl">{children}</div>

      {/* 结束 InnerContainer 根 <div> 的 JSX 标签。 */}
      </div>

    // 结束 JSX 返回结构。
    )

  // 结束 InnerContainer 的实际渲染函数。
  }

// 结束 React.forwardRef 的函数参数，并将创建的组件赋值给 InnerContainer。
)


// ============================== 组合容器组件模块 ==============================

// 使用 React.forwardRef 创建 ContainerComponent 组件。
// 该组件负责组合 OuterContainer 和 InnerContainer，
// 将两个容器的布局规则组合成一个可以直接使用的通用容器组件。
// HTMLDivElement 表示 ref 对应的 DOM 元素类型。
// ContainerProps 表示组件接收的属性类型。
const ContainerComponent = React.forwardRef<HTMLDivElement, ContainerProps>(

  // 定义 ContainerComponent 的实际渲染函数。
  // children 表示调用 ContainerComponent 时传入的子节点。
  // ...props 用于收集其他传入属性，例如 className、id、style 等。
  // ContainerProps 显式声明 props 的类型。
  // ref 是通过 React.forwardRef 从外部传递进来的引用。
  function Container({ children, ...props }: ContainerProps, ref) {

    // 返回组合后的 JSX 结构。
    return (

      // 使用 OuterContainer 作为最外层容器。
      // ref={ref} 将 ContainerComponent 接收到的 ref 继续传递给 OuterContainer。
      // 由于 OuterContainer 本身也使用 forwardRef，
      // 因此这个 ref 最终会绑定到 OuterContainer 根节点对应的真实 HTML <div>。
      // {...props} 将 ContainerComponent 接收到的其他属性传递给 OuterContainer。
      // 例如，外部传入的 className、id、style 等属性会应用于 OuterContainer 的根 <div>。
      <OuterContainer ref={ref} {...props}>

        {/* 在 OuterContainer 内部嵌套 InnerContainer。 */}
        {/* InnerContainer 负责进一步设置内容区域的水平内边距、最大宽度和定位方式。 */}
        {/* 这里没有显式传递其他属性，因此 InnerContainer 使用自己的默认属性值。 */}
        {/* {children} 将 ContainerComponent 接收到的子节点传递给 InnerContainer。 */}
        {/* 通过这种嵌套结构，内容会依次经过外层和内层容器的布局约束。 */}
        <InnerContainer>{children}</InnerContainer>

      {/* 结束 OuterContainer 标签，同时结束其内部的 InnerContainer。 */}
      </OuterContainer>

    // 结束 JSX 返回结构。
    )

  // 结束 ContainerComponent 的实际渲染函数。
}

// 结束 React.forwardRef 的函数参数，并将创建的组件赋值给 ContainerComponent。
)


// ============================== 导出容器组件及其子组件模块 ==============================

// 使用 Object.assign 将 ContainerComponent 与一个对象合并，并导出最终的 Container。
// Object.assign 的第一个参数是 ContainerComponent，即基础容器组件。
// 第二个参数是一个对象，包含 Outer 和 Inner 两个属性。
// Outer 属性指向 OuterContainer，可以单独使用外层容器。
// Inner 属性指向 InnerContainer，可以单独使用内层容器。
// Object.assign 会将第二个对象中的属性赋值到第一个对象上，
// 并返回修改后的 ContainerComponent。
// 因此，最终导出的 Container 既可以直接作为组合容器使用，
// 也可以通过 Container.Outer 或 Container.Inner 单独使用内部的容器组件。
export const Container = Object.assign(ContainerComponent, {

  // 将 OuterContainer 挂载到 Container.Outer 属性上。
  // 使用者可以通过 <Container.Outer>...</Container.Outer> 单独使用外层容器。
  // 这种写法适用于只需要外层最大宽度、水平居中或外部间距的场景。
  Outer: OuterContainer,

  // 将 InnerContainer 挂载到 Container.Inner 属性上。
  // 使用者可以通过 <Container.Inner>...</Container.Inner> 单独使用内层容器。
  // 这种写法适用于只需要内层内容宽度限制、水平内边距或相对定位的场景。
  Inner: InnerContainer,

// 结束 Object.assign 的第二个参数对象，并结束函数调用。
})
