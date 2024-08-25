import React from 'react';
import { BorderBeam } from "@/components/magicui/border-beam";  // 导入BorderBeam组件

export function NetEaseMusic() {  // 定义名为NetEaseMusic的React函数组件
  return (
    <div className="relative h-[120px] w-[330px] rounded-xl">
      {/* 添加 BorderBeam 组件 */}
      <BorderBeam 
        size={240} 
        duration={10} 
        borderWidth={2} 
        colorFrom="#ffaa40" 
        colorTo="#9c40ff" 
        delay={1}
      />
      <iframe
        frameBorder="no"
        width="330"
        height="120"
        src="//music.163.com/outchain/player?type=0&id=12272157557&auto=1&height=90"
        className="rounded-xl shadow-lg"
        style={{ verticalAlign: 'middle' }}
      ></iframe>
    </div>
  );
}
