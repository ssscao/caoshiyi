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
      <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=110 src="//music.163.com/outchain/player?type=0&id=6673286917&auto=1&height=90"></iframe>
    </div>
  );
}
