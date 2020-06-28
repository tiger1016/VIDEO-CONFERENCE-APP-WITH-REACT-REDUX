import React from 'react'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import { Row, Col, Button } from 'antd'
import Slide from '../slide'
import Img from './img.png'
import Img2 from './image.png'

const Deck = () => {
  const back = () => {

  }

  const forward = () => {

  }

  return (
    <div style={{border: '5px solid blue', width: '100%', height: window.screen.height * 3 / 4 + 15}}>
      <div style={{backgroundColor: 'blue', height: '23px'}}>
        <Row>
          <Col span={12}>
            <h4 style={{color: 'white'}}>Slide Deck</h4>
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
          <Col span={23} style={{marginTop: '-1px'}}>
            <Row>
              <Col span={12}>
                <Button type="primary" style={{borderRadius: '2px', backgroundColor: 'grey', width: '100%'}} onClick={back}>Back</Button>
              </Col>
              <Col span={12}>
                <Button type="primary" style={{borderRadius: '2px', backgroundColor: 'grey', width: '100%'}} onClick={forward}>Forward</Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row justify={'center'} style={{marginTop: '5px'}}>
          <Col span={23} style={{height: window.screen.height * 2 / 4 + 205, border: '2px solid black'}}>
            <Slide src={Img} id={'1'} key={1}/>
            <Slide src={Img2} id={'2'} key={2}/>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Deck