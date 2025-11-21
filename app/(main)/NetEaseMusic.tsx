import React, { useRef, useState } from 'react';

export function FloatingNetEaseMusic() {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 20, y: 20 });

  let startX, startY;

  function startDrag(e) {
    startX = e.clientX - pos.x;
    startY = e.clientY - pos.y;

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  }

  function onDrag(e) {
    setPos({
      x: e.clientX - startX,
      y: e.clientY - startY,
    });
  }

  function stopDrag() {
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  }

  return (
    <div
      ref={ref}
      onMouseDown={startDrag}
      className="fixed cursor-move shadow-xl rounded-xl"
      style={{
        width: "330px",
        height: "120px",
        left: pos.x,
        top: pos.y,
        zIndex: 9999,
      }}
    >
      <iframe
        frameBorder="no"
        width="330"
        height="120"
        className="rounded-xl"
        src="https://music.163.com/outchain/player?type=0&id=13056897678&auto=1&height=90"
      ></iframe>
    </div>
  );
}
