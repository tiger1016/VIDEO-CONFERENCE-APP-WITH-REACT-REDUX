import React from 'react'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import { Row, Col, Button } from 'antd'

const Polling = () => {
  const openAdmin = () => {

  }
  
  return (
    <div style={{border: '5px solid blue', width: '100%', height: window.screen.height / 4}}>
      <div style={{backgroundColor: 'blue', height: '23px'}}>
        <Row>
          <Col span={12}>
            <h4 style={{color: 'white'}}>Polling</h4>
          </Col>
          <Col span={12}>
            <div style={{float: 'right', marginRight: '3px', color: 'white'}}>
              <CloseOutlined />
            </div>
            <div style={{float: 'right', marginRight: '3px', color: 'white'}}>
              <MenuOutlined />
            </div>
          </Col>
        </Row>
        <Row justify={'center'}>
          <Col span={12} style={{marginTop: '10px'}}>
            <Button type="primary" style={{borderRadius: '6px', backgroundColor: 'green'}} onClick={openAdmin}>Open Admin</Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Polling