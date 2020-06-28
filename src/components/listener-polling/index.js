import React from 'react'
import { PauseOutlined } from '@ant-design/icons'
import { Row, Col, Button } from 'antd'


const Polling = () => {
  return (
    <div style={{border: '5px solid blue', width: '100%', height: window.screen.height / 3 + 45}}>
      <div style={{backgroundColor: 'blue', height: '23px'}}>
        <Row>
          <Col span={12}>
            <h4 style={{color: 'white'}}>Polling</h4>
          </Col>
          <Col span={12}>
            <div style={{float: 'right', marginRight: '3px', color: 'white'}}>
              <PauseOutlined />
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

export default Polling