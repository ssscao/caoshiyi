// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        // 定义一个呼吸闪烁的透明度轨迹
        typing: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        }
      },
      animation: {
        // 绑定动画：每 0.8 秒无限循环，采用 step 步进让它更像纯文本光标
        typing: 'typing 0.8s steps(2, start) infinite',
      }
    },
  },
}
