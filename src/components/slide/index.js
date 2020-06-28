import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Row, Col } from 'antd'
import styles from './css.module.css'
import { useAppContext } from '../../lib'

const Slide = ({src, id}) => {
  const { setSrc } = useAppContext();

  const clickSlide = () => {
    setSrc(src);
  }

  return (
    <Row className={styles.image} onClick={clickSlide}>
      <Col span={4}>
        <Row style={{marginTop: '5px'}}>
          <Col span={24}>
            <div style={{textAlign: 'center', marginTop: '5px'}}>
              {id}
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div style={{textAlign: 'center'}}>
              <SearchOutlined />
            </div>
          </Col>
        </Row>
      </Col>
      <Col span={20}>
        <img src={src} alt={'slide'} style={{width: '100%'}}></img>
      </Col>
    </Row>
  )
}

export default Slide