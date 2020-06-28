import React from 'react'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import { Row, Col, Button } from 'antd'


const Resources = () => {
  const uploadFiles = () => {

  }

  const addHyperlinks = () => {

  }
  
  return (
    <div style={{border: '5px solid blue', width: '100%', height: window.screen.height / 4}}>
      <div style={{backgroundColor: 'blue', height: '23px'}}>
        <Row>
          <Col span={12}>
            <h4 style={{color: 'white'}}>Resources</h4>
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
          <Col span={20} style={{marginTop: '10px'}}>
            <Row>
              <Col span={12}>
                <Button type="primary" style={{borderRadius: '2px', backgroundColor: 'green', width: '100%'}} onClick={uploadFiles}>Upload File</Button>
              </Col>
              <Col span={12}>
                  <Button type="primary" style={{borderRadius: '2px', backgroundColor: 'green', width: '100%'}} onClick={addHyperlinks}>Add Hyperlink</Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} gutter={[16,0]} justify={'space-around'}>
          <Col span={23}>
            <h4 style={{fontWeight: 'bold'}}>Downloadable Files</h4>
          </Col>
        </Row>
        <Row gutter={[16,0]} justify={'space-around'}>
          <Col span={23}>
            <h4 style={{fontWeight: 'bold'}}>External Hyperlinks</h4>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Resources