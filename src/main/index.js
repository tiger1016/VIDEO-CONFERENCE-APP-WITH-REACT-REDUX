import React, { useState } from 'react'
import { Modal } from 'antd'
import Presenter from '../pages/presenter'
import Listener from '../pages/listener'
import 'antd/dist/antd.css';

const Main = () => {
  const [roomOpen, setRoomOpen] = useState(false);
  const [room, setRoom] = useState('')
  const [auth, setAuth] = useState('');

  const handleCancel = e => {
    setRoomOpen(false)
    window.location = '/'
  }

  const handleOk = async e => {
    const res = await fetch('http://localhost:3001/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        room
      })
    })
    const data = await res.json();

    if (data.auth) {
      setAuth(data.auth);
      setRoomOpen(true)
    }
  }

  return (
    <div>
      {
        !roomOpen
        &&
        <Modal
          title="Create or Join a room"
          visible={true}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <input onChange={e => setRoom(e.target.value)} placeholder={'please type the room you are creating or joining'} style={{width: '320px', marginLeft: '20px'}}/>
        </Modal>
      }
      {
        auth === 'presenter'
        &&
        <Presenter room={room}/>
      }
      {
        auth === 'listener'
        &&
        <Listener/>
      }
    </div>
  )
}


export default Main;