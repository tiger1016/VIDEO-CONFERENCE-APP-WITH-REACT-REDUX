import React from 'react'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import { Row, Col, Button } from 'antd'


const Mod = () => {
  const queue = () => {

  }

  const picks = () => {

  }

  return (
    <div style={{border: '5px solid blue', width: '100%', height: window.screen.height / 3 + 50}}>
      <div style={{backgroundColor: 'blue', height: '23px'}}>
        <Row>
          <Col span={12}>
            <h4 style={{color: 'white'}}>Questions</h4>
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
          <Col span={23}>
            <Row>
              <Col span={12}>
                <Button type="primary" style={{borderRadius: '2px', backgroundColor: 'grey', width: '100%'}} onClick={queue}>Queue</Button>
              </Col>
              <Col span={12}>
                <Button type="primary" style={{borderRadius: '2px', backgroundColor: 'grey', width: '100%'}} onClick={picks}>Picks</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Mod