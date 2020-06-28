import React from 'react'
import { useAppContext } from '../../lib'

const Preview = () => {
  const { src } = useAppContext();

  return (
    <div style={{border: '5px solid blue', backgroundColor: 'skyblue', height: window.screen.height * 3 / 4 + 15}}>
      <div>
        <img alt={'Preview'} src={src} width={'100%'}></img>
      </div>
    </div>
  )
}

export default Preview