'use client'
import React from 'react'
import { motion } from 'framer-motion'

export function NetEaseMusic() {
  return (
    <motion.div
      // 外层容器：居中 + 悬浮漂浮动画
      initial={{ opacity: 0, y: 20 }}  // 初始透明 + 下移
      animate={{ opacity: 1, y: 0 }}   // 进入时上移并显现
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex justify-center items-center mt-4"
    >
      {/* 卡片容器，附带玻璃拟态 + 发光 + 悬停缩放效果 */}
      <motion.div
        whileHover={{
          scale: 1.05,                // 悬停放大
          boxShadow: '0 0 30px rgba(255,255,255,0.25)', // 悬停发光
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
        }}
        className="
          p-3 rounded-2xl shadow-xl 
          backdrop-blur-xl bg-white/10 
          dark:bg-black/20 border border-white/20
        "
        style={{
          // 背景发光脉冲动画（可选）
          animation: 'pulseGlow 3.5s infinite',
        }}
      >
        <iframe
          frameBorder="no"
          width="330"
          height="120"
          src="//music.163.com/outchain/player?type=0&id=6673286917&auto=1&height=90"
          className="rounded-xl shadow-lg"
        ></iframe>
      </motion.div>

      {/* 自定义脉冲动画 */}
      <style>
        {`
          @keyframes pulseGlow {
            0% { box-shadow: 0 0 10px rgba(255,255,255,0.05); }
            50% { box-shadow: 0 0 25px rgba(255,255,255,0.25); }
            100% { box-shadow: 0 0 10px rgba(255,255,255,0.05); }
          }
        `}
      </style>
    </motion.div>
  )
}
