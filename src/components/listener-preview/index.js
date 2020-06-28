import React from 'react'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import { Row, Col, Button } from 'antd'
import RemotePic from '../../components/remote-pic'
import RemoteData from '../../components/remote-data'

const Preview = () => {
  return (
    <div style={{border: '5px solid blue', width: '100%', height: window.screen.height * 3 / 4 + 7}}>
      <Row>
        <Col span={12}>
          <div style={{float: 'right', marginRight: '3px', color: 'white'}}>
            <CloseOutlined />
          </div>
        </Col>
      </Row>
      <Row justify={'center'}>
        <Col span={24}>
          <Row gutter={[16,0]} justify={'space-between'}>
            <Col span={10}>
              <RemotePic/>
            </Col>
            <Col span={14}>
              <RemoteData/>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default Preview