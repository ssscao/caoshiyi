import React from 'react';  // 导入React模块，用于创建React组件
//, marginTop: '-100px'
export function NetEaseMusic() {  // 定义名为NetEaseMusic的React函数组件
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>  
      {/* 使用flex布局样式，将内容水平和垂直居中显示，并向上偏移100px */}
      
      <iframe
        frameBorder="no"  // 设置iframe边框为无
        // border="0"  // 可选：如果需要设置iframe标签的border属性，取消注释此行
        // marginWidth={0}  // 可选：设置iframe标签的marginWidth属性为0，取消注释此行
        // marginHeight={0}  // 可选：设置iframe标签的marginHeight属性为0，取消注释此行
        width="330"  // 设置iframe标签的宽度为330像素
        height="120"  // 设置iframe标签的高度为120像素
        src="//music.163.com/outchain/player?type=0&id=13056897678&auto=1&height=90"
        
                
        className="rounded shadow-lg"  // 添加类名，应用圆角和阴影样式
        style={{ verticalAlign: 'middle' }}  // 设置内联样式，使iframe垂直居中对齐
      ></iframe>
    </div>
  );
}
