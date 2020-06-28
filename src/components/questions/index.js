import React from 'react'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import { Row, Col, Button } from 'antd'


const Questions = () => {
  const newest = () => {

  }

  const oldest = () => {

  }

  return (
    <div style={{border: '5px solid blue', width: '100%', height: window.screen.height / 4}}>
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
            <Button type="primary" style={{borderRadius: '2px', height: '40px', backgroundColor: 'green', width: '100%'}}><span style={{fontSize: '16px'}}>Click Here to Submit a Question</span></Button>
          </Col>
        </Row>
        <Row justify={'center'}>
          <Col span={23} style={{marginTop: '5px'}}>
            <Row>
              <Col span={12}>
                <Button type="primary" style={{borderRadius: '2px', backgroundColor: 'grey', width: '100%'}} onClick={newest}>Newest</Button>
              </Col>
              <Col span={12}>
                <Button type="primary" style={{borderRadius: '2px', backgroundColor: 'grey', width: '100%'}} onClick={oldest}>Oldest</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Questions