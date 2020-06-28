import React from 'react'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import { Row, Col, Button } from 'antd'


const Chat = () => {
  return (
    <div style={{border: '5px solid blue', width: '100%', height: window.screen.height / 3 + 45}}>
      <div style={{backgroundColor: 'blue', height: '23px'}}>
        <Row>
          <Col span={12}>
            <h4 style={{color: 'white'}}>Host Chat</h4>
          </Col>
          <Col span={12}>
            <div style={{float: 'right', marginRight: '3px', color: 'white'}}>
              <CloseOutlined />
            </div>
          </Col>
        </Row>
        <Row justify={'center'}>
          <Col span={12} style={{marginTop: '10px'}}>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Chat