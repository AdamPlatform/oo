import React from 'react'
const Button = require('antd/lib/button');
const Icon = require('antd/lib/icon');
export default class NotFound extends React.Component {

  render() {
    return (
      <div style = {{ width: '800px', height: '200px', textalign: 'center', margin: '0 auto' }}>
        <img title="请联系管理员"  alt='' src = '../../media/images/underconstruction.jpg'/>
        <span><h2>页面未找到或可能正在建设中，敬请期待..................
          <Button type="primary" size="large" onClick={ () => {window.location.href="about:blank";window.close()} }><Icon type="left" />关闭</Button>
        </h2></span>
      </div>
    )
  }

}
