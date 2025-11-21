import React from 'react';  // 导入React模块，用于创建React组件

export function NetEaseMusic() {  // 定义名为NetEaseMusic的React函数组件
  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
      }}
    >
      {/* 使用flex布局样式，将内容水平和垂直居中显示 */}

      <iframe
        frameBorder="yes"  // 设置iframe边框为无
        width="330"  // 设置iframe标签的宽度为330像素
        height="120"  // 设置iframe标签的高度为120像素

        // ⚠ 修复：必须加 https:// 否则 React 与浏览器会视为非法 URL
        src="https://music.163.com/outchain/player?type=0&id=13056897678&auto=0&height=90"
        
        className="rounded shadow-lg"  // 添加类名，应用圆角和阴影样式
        style={{ verticalAlign: 'middle' }}  // 设置内联样式，使iframe垂直居中对齐
      ></iframe>
    </div>
  );
}
