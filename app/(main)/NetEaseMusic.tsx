import React from "react";

export function NetEaseMusic() {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"，
  };

  return (
    <div style={containerStyle}>
      <iframe
        frameBorder="0"
        marginWidth="0"
        marginHeight="0"
        width="330"
        height="110"
        src="//music.163.com/outchain/player?type=0&id=6673286917&auto=1&height=90"
        allow="autoplay"
      />
    </div>
  );
}
