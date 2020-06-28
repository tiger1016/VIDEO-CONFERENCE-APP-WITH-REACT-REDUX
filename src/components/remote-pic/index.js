import React from 'react'

const RemotePic = () => {
  return (
    <div style={{width: '100%', height: window.screen.height * 3 / 5 + 110}}>
      <video id="remote-video" autoplay playsinline></video>
    </div>
  )
}

export default RemotePic