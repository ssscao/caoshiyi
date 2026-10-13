```tsx
// 从 @zolplay/utils 工具库中导入 clsxm 函数。
// clsxm 通常用于组合多个 CSS 类名，并处理条件类名、空值或重复的类名等情况。
// 在当前代码中，它主要用于将组件默认使用的 Tailwind CSS 类名与外部传入的 className 合并。
// 这样既可以保证组件具有默认布局样式，也允许使用者通过 className 对组件进行个性化定制。
// 注意：clsxm 的具体合并规则取决于 @zolplay/utils 中的实际实现，不能仅凭函数名称断定它一定会进行 Tailwind CSS 冲突消解。
import { clsxm } from '@zolplay/utils'

// 导入 React。
// React.forwardRef、React.ComponentPropsWithoutRef 等 API 都通过 React 命名空间访问。
// React.forwardRef 用于创建能够接收并向内部 DOM 元素转发 ref 的 React 组件。
// ComponentPropsWithoutRef 用于提取指定 JSX 元素所支持的属性类型，同时排除其 ref 属性。
import React from 'react'


// ============================================================
// 第一部分：定义 Container 组件的公共属性类型
// ============================================================

// 使用 TypeScript 的类型别名语法定义 ContainerProps。
// ContainerProps 是一个类型名称，不会在运行时生成 JavaScript 对象或变量。
//
// React.ComponentPropsWithoutRef<'div'> 的含义是：
// 1. 获取 React 中原生 div 元素对应的完整 JSX 属性类型。
// 2. 包含 div 支持的常见属性，例如 className、id、style、title、role、onClick 等。
// 3. 由于使用 WithoutRef，因此不会将 ref 作为该类型自身的普通属性包含进去。
// 4. 该类型能够跟随 React 类型定义，获得 div 元素属性的静态类型检查。
//
// 例如，以下属性通常都属于 ContainerProps 支持的范围：
// className：指定 CSS 类名。
// id：指定 HTML 元素的唯一标识。
// style：传入内联样式对象。
// title：设置元素的提示文本。
// onClick：指定鼠标点击事件处理函数。
// children：指定组件内部需要渲染的 React 子节点。
//
// 使用该类型的优点：
// 不必手动重复声明原生 div 的全部属性。
// 调用组件时，TypeScript 可以自动检查传入属性是否符合 div 的规范。
// 当 React 类型定义更新时，该类型也能相应地反映原生元素属性的变化。
//
// 为什么这里使用 ComponentPropsWithoutRef 而不是 ComponentProps？
// 因为当前组件通过 React.forwardRef 单独接收 ref，
// 不需要把 ref 混入普通属性类型中，避免类型职责混淆。
type ContainerProps = React.ComponentPropsWithoutRef<'div'>


// ============================================================
// 第二部分：定义外层容器 OuterContainer
// ============================================================

// 使用 React.forwardRef 创建 OuterContainer 组件。
// forwardRef 是 React 提供的 ref 转发 API，允许组件的调用者将 ref 传递给组件，
// 再由组件将该 ref 转发给内部真正的 DOM 元素。
//
// 第一个泛型参数 HTMLDivElement：
// 指定 ref 最终指向的 DOM 元素类型为 HTMLDivElement。
// 这样，调用者通过 ref.current 获取元素时，
// TypeScript 就能够知道它是一个 div 对应的 DOM 对象。
//
// 第二个泛型参数 ContainerProps：
// 指定该组件接收的普通属性类型。
// 这意味着 OuterContainer 可以接收标准 div 属性，
// 例如 className、id、style、事件处理函数以及 children 等。
//
// 整体类型可以理解为：
// 创建一个接收 ContainerProps 属性、
// 并将 ref 转发给 HTMLDivElement 的 React 组件。
const OuterContainer = React.forwardRef<HTMLDivElement, ContainerProps>(

  // 定义 OuterContainer 内部的渲染函数。
  //
  // 这里采用具名函数表达式，而不是直接传入匿名箭头函数。
  // 函数名 OuterContainer 可以提高代码可读性，
  // 并有助于 React DevTools 和调试工具识别组件名称。
  //
  // React.forwardRef 会将外部传入的 ref 作为第二个参数传给该渲染函数。
  //
  // 第一个参数是组件的普通属性对象：
  // { className, children, ...props }
  //
  // 第二个参数 ref 是需要向内部 DOM 元素转发的引用对象或回调引用。
  function OuterContainer(
    // 使用对象解构，从传入的 props 对象中提取指定属性。
    //
    // className：
    // 获取外部调用者传入的 CSS 类名。
    // 例如：<Container.Outer className="bg-white" />。
    //
    // children：
    // 获取组件内部嵌套的 React 子节点。
    // 例如：
    // <Container.Outer>
    //   <p>Hello</p>
    // </Container.Outer>
    // 此时 children 就是内部的 p 元素对应的 React 节点。
    //
    // ...props：
    // 使用剩余属性语法，收集除 className 和 children 以外的所有属性。
    // 例如 id、style、title、role、onClick、aria-label 等。
    //
    // 解构不会修改原始 props 对象。
    // 这里的 ...props 也不是 React 特有语法，而是标准 JavaScript 对象解构语法。
    { className, children, ...props },

    // 接收 React.forwardRef 传入的第二个参数 ref。
    //
    // 该 ref 将在下方 JSX 中直接绑定到最外层 div。
    // 因此，外部调用者可以通过 ref 访问最外层 div 对应的真实 DOM 元素。
    //
    // 注意：ref 是由 forwardRef 单独传入的参数，
    // 而不是从上面的 props 对象中解构出来的。
    ref
  ) {

    // 返回 OuterContainer 对应的 JSX 结构。
    // React 会根据该 JSX 创建或更新对应的 DOM 节点。
    return (

      // 第一层 div：OuterContainer 的最外层 DOM 容器。
      //
      // ref={ref}：
      // 将外部传入的 ref 转发到当前 div。
      // 使用者可以通过 ref.current 获取该元素，
      // 进而进行 DOM 测量、聚焦、滚动定位等操作。
      //
      // className={clsxm('sm:px-8', className)}：
      // 调用 clsxm 合并默认类名与外部传入的类名。
      //
      // 'sm:px-8'：
      // Tailwind CSS 响应式间距类。
      // sm: 表示在 sm 断点及以上的屏幕宽度下生效。
      // 默认 Tailwind CSS 配置中，sm 通常对应 min-width: 640px。
      // px-8 表示左右内边距均为 2rem，默认根字体大小为 16px 时约为 32px。
      // 在默认 Tailwind CSS 配置下，相当于：
      // @media (min-width: 640px) {
      //   padding-left: 2rem;
      //   padding-right: 2rem;
      // }
      //
      // 注意：这里没有指定基础状态下的水平内边距，
      // 因此在 sm 断点以下，这个类本身不会添加水平内边距。
      //
      // className：
      // 外部调用者传入的附加类名。
      // 通过 clsxm 合并之后，组件使用者能够扩展或调整布局样式。
      //
      // {...props}：
      // 将前面通过 ...props 收集到的剩余属性展开到当前 div。
      // 例如外部传入的 id、style、onClick、aria-* 等属性，
      // 会被传递给这个最外层 div。
      //
      // 注意属性透传的目标：
      // id、style、onClick 等属性最终作用于最外层 div，
      // 而不是下方嵌套的内层 div。
      <div ref={ref} className={clsxm('sm:px-8', className)} {...props}>

        {/* 
          第二层 div：OuterContainer 内部的居中布局容器。

          className="mx-auto max-w-7xl lg:px-8"：

          1. mx-auto
             mx 表示水平方向的 margin。
             auto 表示左右外边距自动分配。
             当元素具有小于可用空间的宽度时，
             左右自动外边距通常会使元素在水平方向居中。

          2. max-w-7xl
             限制当前元素的最大宽度。
             在默认 Tailwind CSS 配置中，max-w-7xl 通常为 80rem，
             根字体大小为 16px 时约为 1280px。
             当可用空间较小时，元素仍会受父容器宽度约束，
             不会因为最大宽度限制而强行超出父容器。

          3. lg:px-8
             在 lg 断点及以上的屏幕宽度下，
             为当前 div 设置左右各 2rem 的内边距。
             默认 Tailwind CSS 配置中，lg 通常对应 min-width: 1024px。
             在较小屏幕下，这个类本身不添加内边距。

          这里的内部 div 负责限制内容区域的最大宽度并实现居中，
          而外层 div 负责响应式水平内边距和接收外部传入的属性。

          这种嵌套结构可以将页面外围的留白控制
          与实际内容的最大宽度控制分开处理。
        */}
        <div className="mx-auto max-w-7xl lg:px-8">

          {/* 
            渲染传入 OuterContainer 的所有子节点。

            children 是 React 组件接收的子节点属性，
            可以是普通文本、单个 JSX 元素、多个 JSX 元素、Fragment，
            也可以是数组或其他合法的 React 子节点类型。

            React 会按照 children 中的节点结构进行渲染。
            如果没有传入子节点，通常就不会在此处渲染内容。

            将 children 放置在内部布局容器中，
            可以使所有子内容共同受到 max-w-7xl 的最大宽度限制。
          */}
          {children}

        </div>
      </div>
    )
  }
)


// ============================================================
// 第三部分：定义内层容器 InnerContainer
// ============================================================

// 与 OuterContainer 类似，InnerContainer 同样使用 React.forwardRef。
// 它接收普通 div 属性，并将 ref 转发给自己的最外层 div。
//
// HTMLDivElement：表示 ref 对应的目标是 div 元素。
// ContainerProps：表示组件接受标准 div 属性。
//
// InnerContainer 与 OuterContainer 的主要区别在于：
// 1. 默认水平内边距不同。
// 2. 内容区域的最大宽度不同。
// 3. 默认设置了 relative 定位。
// 4. 它不负责最外层的大范围 max-w-7xl 布局，而是定义更窄的内容区域。
const InnerContainer = React.forwardRef<HTMLDivElement, ContainerProps>(

  // 定义 InnerContainer 的渲染函数。
  //
  // 这里的函数分为多行书写，仅仅是格式上的换行，
  // 不会改变函数的执行方式或组件的功能。
  function InnerContainer(

    // 从传入的属性对象中解构出 className 和 children，
    // 并使用 ...props 收集剩余属性。
    //
    // 与 OuterContainer 不同，这里显式写出了参数类型 ContainerProps。
    // 这样可以明确说明传入的普通属性对象符合 ContainerProps 类型。
    //
    // className 用于接收外部追加的 CSS 类名。
    // children 用于接收需要渲染的内部节点。
    // ...props 用于保留其他 div 属性，例如 id、style、onClick 等。
    { className, children, ...props }: ContainerProps,

    // 接收 forwardRef 转发进来的 ref。
    // 下方 JSX 会将该 ref 绑定到 InnerContainer 最外层的 div。
    ref
  ) {

    // 返回 InnerContainer 对应的 JSX 结构。
    return (

      // InnerContainer 的最外层 div。
      //
      // ref={ref}：
      // 将 ref 绑定到当前 div，使外部可以通过 ref.current 访问它。
      //
      // className={clsxm('relative px-4 sm:px-8 lg:px-12', className)}：
      // 合并组件默认类名和外部传入的 className。
      //
      // 默认类名逐项解释：
      //
      // 1. relative
      //    将当前元素的 position 设置为 relative。
      //    在默认 Tailwind CSS 配置下，相当于 position: relative。
      //
      //    相对定位通常不会改变元素在普通文档流中的原始占位方式，
      //    但会使元素可以通过 top、right、bottom、left 等属性
      //    相对于自身正常位置进行偏移。
      //
      //    此外，relative 元素通常可以作为内部 absolute 绝对定位元素的定位参考祖先，
      //    前提是该绝对定位元素使用的定位包含块确实由此元素建立。
      //
      //    即使当前 div 没有显式设置 top、left 等偏移属性，
      //    relative 仍然具有定位上下文方面的意义。
      //
      // 2. px-4
      //    设置基础状态下左右内边距各为 1rem。
      //    默认根字体大小为 16px 时，相当于左右各 16px。
      //
      //    因为这是没有响应式前缀的类，
      //    所以它在所有屏幕尺寸下都会生效，
      //    除非其他样式规则对其产生覆盖。
      //
      // 3. sm:px-8
      //    在 sm 断点及以上，将左右内边距设置为 2rem，
      //    默认根字体大小为 16px 时，相当于左右各 32px。
      //
      //    在默认 Tailwind CSS 配置下，
      //    sm 通常表示 min-width: 640px。
      //
      //    当屏幕进入 sm 断点时，px-8 会覆盖基础状态的 px-4，
      //    从而让容器在较宽屏幕上获得更大的水平留白。
      //
      // 4. lg:px-12
      //    在 lg 断点及以上，将左右内边距设置为 3rem，
      //    默认根字体大小为 16px 时，相当于左右各 48px。
      //
      //    在默认 Tailwind CSS 配置下，
      //    lg 通常表示 min-width: 1024px。
      //
      //    因此，在默认配置下，这三个类共同形成如下响应式效果：
      //
      //    屏幕宽度小于 640px：
      //      左右内边距为 1rem。
      //
      //    屏幕宽度大于等于 640px 且小于 1024px：
      //      左右内边距为 2rem。
      //
      //    屏幕宽度大于等于 1024px：
      //      左右内边距为 3rem。
      //
      //    上述断点数值以默认 Tailwind CSS 配置为前提；
      //    如果项目自定义了 screens 配置，实际断点可能不同。
      //
      // className：
      // 外部调用者传入的自定义类名。
      // 例如：
      // <Container.Inner className="bg-slate-50" />
      //
      // {...props}：
      // 将剩余属性全部透传给当前最外层 div。
      // 因此，外部传入的 id、style、事件处理函数和无障碍属性等，
      // 都会作用于 InnerContainer 自己的外层 DOM 元素。
      <div
        ref={ref}
        className={clsxm('relative px-4 sm:px-8 lg:px-12', className)}
        {...props}
      >

        {/* 
          InnerContainer 内部的内容宽度控制容器。

          className="mx-auto max-w-2xl lg:max-w-5xl"：

          1. mx-auto
             设置左右外边距为 auto。
             当内容容器的实际宽度小于父容器的可用宽度时，
             左右自动外边距会让它在水平方向居中。

          2. max-w-2xl
             设置默认状态下的最大宽度。
             在默认 Tailwind CSS 配置中，max-w-2xl 通常为 42rem，
             根字体大小为 16px 时约为 672px。

             该限制有助于控制正文、文章、说明文字等内容的行长，
             避免内容区域过宽而降低阅读体验。

          3. lg:max-w-5xl
             在 lg 断点及以上，将最大宽度调整为 64rem，
             默认根字体大小为 16px 时约为 1024px。

             这意味着：
             在较窄的屏幕上，内容最大宽度通常受 42rem 限制；
             在较宽的屏幕上，内容最大宽度可以扩大到 64rem。

          需要特别注意：
          max-w-2xl 和 max-w-5xl 设置的是最大宽度，而不是固定宽度。
          元素的实际宽度还会受到父元素可用宽度、内边距、
          默认布局规则以及其他 CSS 样式的共同影响。

          此外，当前 div 位于前一个设置了 px-* 的父 div 内部，
          所以父容器的水平内边距会进一步影响内容的实际可用空间。
        */}
        <div className="mx-auto max-w-2xl lg:max-w-5xl">

          {/* 
            将 InnerContainer 接收到的 children 渲染到内部内容区域。

            所有传入的子节点都会受到此内部 div 的最大宽度限制。
            例如，传入文章、卡片列表、表单或者其他 React 组件时，
            这些节点都会作为当前 div 的子节点进行渲染。

            注意：InnerContainer 只负责容器布局，
            不会自动修改 children 内部元素自身的字体、颜色或业务逻辑。
          */}
          {children}

        </div>
      </div>
    )
  }
)


// ============================================================
// 第四部分：定义组合容器 ContainerComponent
// ============================================================

// 使用 React.forwardRef 创建最终对外使用的 Container 组件。
//
// 该组件的主要职责不是重复实现 CSS 布局，
// 而是将 OuterContainer 与 InnerContainer 组合在一起。
//
// HTMLDivElement：
// 指定 Container 接收到的 ref 最终对应一个 HTML div 元素。
//
// ContainerProps：
// 指定 Container 接收标准 div 属性。
//
// 注意：ContainerComponent 自己不会额外创建一个 div。
// 它返回的是 OuterContainer 组件，
// 而 OuterContainer 和 InnerContainer 内部各自会创建相应的 DOM 元素。
const ContainerComponent = React.forwardRef<HTMLDivElement, ContainerProps>(

  // 定义最终组合组件的渲染函数。
  //
  // children：提取调用者传入的子节点。
  // ...props：收集调用者传入的其他属性。
  // ref：接收 React.forwardRef 传入的引用。
  //
  // 这里将 children 与其他属性分开处理，
  // 是为了将 children 明确放入 InnerContainer 的嵌套结构中，
  // 同时将其他属性传递给 OuterContainer。
  function Container(
    { children, ...props }: ContainerProps,

    // 接收外部传入的 ref。
    // 该 ref 不会直接绑定到 ContainerComponent 自身，
    // 而是通过下面的 JSX 传递给 OuterContainer。
    ref
  ) {

    // 返回组合后的容器结构。
    return (

      // 第一层组件：OuterContainer。
      //
      // ref={ref}：
      // 将 ContainerComponent 接收到的 ref 传递给 OuterContainer。
      // OuterContainer 随后会把它绑定到自己的最外层 div。
      //
      // {...props}：
      // 将 ContainerComponent 接收到的其他属性全部传递给 OuterContainer。
      //
      // 例如，调用者写：
      // <Container id="main-content" className="bg-white">
      //   ...
      // </Container>
      //
      // 那么 id 和 className 会先进入 ContainerComponent，
      // 再通过 {...props} 传递给 OuterContainer。
      //
      // 由于 OuterContainer 会解构 className 并与默认类名合并，
      // 所以这里传入的 className 最终会参与 OuterContainer 的类名组合。
      //
      // 注意：这些属性不会自动继续传递给 InnerContainer。
      // 当前代码中，OuterContainer 与 InnerContainer 是不同的组件，
      // 它们各自的属性传递路径是独立的。
      <OuterContainer ref={ref} {...props}>

        {/* 
          第二层组件：InnerContainer。

          将 ContainerComponent 接收到的 children
          作为 InnerContainer 的子节点传入。

          由于这里没有显式向 InnerContainer 传递其他属性，
          因此 InnerContainer 会使用自己的默认属性和默认类名。

          具体来说：
          - InnerContainer 会应用 relative。
          - InnerContainer 会应用 px-4 sm:px-8 lg:px-12。
          - 内部内容区域会应用 mx-auto max-w-2xl lg:max-w-5xl。

          这里也没有给 InnerContainer 单独传递 ref，
          因此 ContainerComponent 接收到的 ref 不会指向 InnerContainer。

          整体形成如下嵌套关系：

          ContainerComponent
          └── OuterContainer
              └── OuterContainer 内部的 max-w-7xl div
                  └── InnerContainer
                      └── InnerContainer 内部的 max-w-2xl / max-w-5xl div
                          └── children

          注意：组件层级与 DOM 层级并不完全相同。
          ContainerComponent 本身没有直接生成 DOM 节点，
          它通过返回其他组件来构建最终的 DOM 结构。
        */}
        <InnerContainer>{children}</InnerContainer>

      </OuterContainer>
    )
  }
)


// ============================================================
// 第五部分：导出最终的 Container API
// ============================================================

// 使用 ES Module 的命名导出语法导出 Container。
//
// Object.assign(target, source) 是 JavaScript 原生对象方法。
// 它会将 source 对象自身的可枚举属性复制到 target 对象上，
// 然后返回 target 对象。
//
// 在这里：
// target 是 ContainerComponent。
// source 是包含 Outer 和 Inner 两个属性的对象。
//
// 因此，这段代码为 ContainerComponent 附加了两个属性：
// Container.Outer：指向 OuterContainer 组件。
// Container.Inner：指向 InnerContainer 组件。
//
// 同时，Container 本身仍然是 ContainerComponent。
// 因此调用者可以使用三种形式：
//
// 1. <Container>内容</Container>
//    使用完整的组合容器，自动包含 OuterContainer 和 InnerContainer。
//
// 2. <Container.Outer>内容</Container.Outer>
//    只使用外层容器，适用于需要单独控制外部最大宽度布局的场景。
//
// 3. <Container.Inner>内容</Container.Inner>
//    只使用内层容器，适用于需要单独使用正文宽度和响应式内边距的场景。
//
// 这里并没有创建新的 React 组件，也没有改变原有组件的渲染函数。
// Object.assign 只是给 ContainerComponent 对应的函数对象附加属性。
//
// 需要注意：
// Object.assign 的返回值仍然是 ContainerComponent 对应的对象。
// TypeScript 通常可以根据 Object.assign 的类型定义推导出附加属性，
// 从而允许调用者使用 Container.Outer 和 Container.Inner。
//
// 最终导出的 Container 同时具备：
// 1. React 组件的调用能力。
// 2. Outer 属性，用于访问外层容器。
// 3. Inner 属性，用于访问内层容器。
//
// 这是一种常见的 React 复合组件（Compound Components）组织方式。
// 它能够在保留统一组件入口的同时，
// 允许使用者根据布局需求选择完整容器或其中某一层。
export const Container = Object.assign(ContainerComponent, {
  // 将 OuterContainer 暴露为 Container 的 Outer 静态属性。
  // 调用方式：<Container.Outer>...</Container.Outer>
  Outer: OuterContainer,

  // 将 InnerContainer 暴露为 Container 的 Inner 静态属性。
  // 调用方式：<Container.Inner>...</Container.Inner>
  Inner: InnerContainer,
})
```
