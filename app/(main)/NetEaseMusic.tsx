import React from 'react';

export function NetEaseMusic() {
  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
      }}
    >
      <iframe
        frameBorder="no"
        width="330"
        height="120"
        src="https://music.163.com/outchain/player?type=0&id=13056897678&auto=1&height=90"
        className="rounded shadow-lg"
        style={{ verticalAlign: 'middle' }}
      ></iframe>
    </div>
  );
}
