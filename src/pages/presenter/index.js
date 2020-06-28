import React, { useState } from 'react';
import { Row, Col } from 'antd'
import Polling from '../../components/polling'
import Questions from '../../components/questions'
import Resources from '../../components/resources'
import Deck from '../../components/deck'
import Preview from '../../components/preview'
import Chat from '../../components/chat'
import Mod from '../../components/mod'
import { AppContext } from '../../lib'

const Presenter = ({room}) => {
  const [src, setSrc] = useState('');
  
  return (
    <AppContext.Provider value={{src, setSrc}}>
      <Row gutter={[0,0]}>
        <Col span={24}>
          <Row align={"middle"}>
            <Col span={4} style={{textAlign: 'center'}}>
              <p style={{fontSize: '50px'}}>PCE</p> 
            </Col>
            <Col span={20}>
              <h1>
                COVID-19: Update for NPs and PAs
              </h1>
              <p>
                Connected: 1&nbsp;&nbsp;&nbsp;&nbsp;EOS: 2412 minutes
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={[8,0]}>
        <Col span={4}>
          <Row gutter={[0,8]}>
            <Col span={24}>
              <Polling/>
            </Col>
            <Col span={24}>
              <Questions/>
            </Col>
            <Col span={24}>
              <Resources/>
            </Col>
          </Row>
        </Col>
        <Col span={4}>
          <Deck/>
        </Col>
        <Col span={12}>
          <Preview/>
        </Col>
        <Col span={4}>
          <Row gutter={[0,8]}>
            <Col span={24}>
              <Chat/>
            </Col>
            <Col span={24}>
              <Mod/>
            </Col>
          </Row>
        </Col>
      </Row>
    </AppContext.Provider>
  );
}

export default Presenter