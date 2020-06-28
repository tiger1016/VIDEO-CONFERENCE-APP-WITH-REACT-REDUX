import React from 'react'
import { Row, Col } from 'antd'
import Polling from '../../components/listener-polling'
import Questions from '../../components/listener-questions'
import Preview from '../../components/listener-preview'

const Listener = () => {
  return (
    <>
      <Row gutter={[0,0]}>
        <Col span={24}>
          <Row align={"middle"}>
            <Col span={6} style={{textAlign: 'center'}}>
              <p style={{fontSize: '50px'}}>PCE</p> 
            </Col>
            <Col span={14}>
              <p style={{fontSize: '40px'}}>Key Studies Influencing My Practice Following CROI 2020</p> 
            </Col>
            <Col span={4}>
              <p style={{fontSize: '50px'}}>USF Health</p> 
            </Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={[8,0]}>
        <Col span={6}>
          <Row gutter={[0,8]}>
            <Col span={24}>
              <Polling/>
            </Col>
            <Col span={24}>
              <Questions/>
            </Col>
          </Row>
        </Col>
        <Col span={18}>
          <Preview/>
        </Col>
      </Row>
    </>
  )
}

export default Listener