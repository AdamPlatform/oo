/**
 * 详情页面
 */
import React, { Component } from 'react'
import Modal from 'antd/lib/modal'
import Button from 'antd/lib/button'
import Fields from './fields'

class Detial extends Component {
    /**
     * 构造函数 初始化
     */
    constructor() {
        super();
        this.state = {
            visible: false,
            classConfig: [],
            update: false,
        }
    }

    /**
     * 取消
     */
    onCancel() {
        this.setState({visible: false});
    }

    /**
     * 确定
     */
    onOk() {
        this.setState({visible: false});
    }
    
    /**
     * 渲染函数
     */
    render() {
        return <span>
            <a onClick={() => { this.setState({visible: true});}}>详情</a>
            {this.state.visible && <Modal
                title='详情'
                visible={this.state.visible}
                onCancel={this.onCancel.bind(this)}
                onClose={this.onCancel.bind(this)}
                maskClosable={false}
                width={global.clientWidth - 100}
                onOk={this.onOk.bind(this)}
                footer={[<Button key='1' type='primary' onClick={this.onCancel.bind(this)} children='关闭'/>]}
            >
                <Fields 
                    {...this.props}
                    wrappedComponentRef={(inst) => this.formRef = inst} 
                    action='detail'
                />
            </Modal>
            }
        </span>
    }
}
export default Detial;