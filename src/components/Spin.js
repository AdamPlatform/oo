/**
 * antd Spin  改装 本地数据库不等待
 */
import React, { Component } from 'react'
import Spin from 'antd/lib/spin'
export default class SpinEx extends Component {
    render () {
        // process.env.LOCALDB !== '1' && 
        return <Spin {...this.props} spinning={this.props.spinning}/>
    }
}