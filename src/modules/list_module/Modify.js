/**
 * 修改页面
 */
import React, { Component } from 'react'
import Spin from '../../components/Spin'
import Modal from 'antd/lib/modal'
import Fields from './Fields'
import * as Action from './Action'

class Modify extends Component {
    /**
     * 构造函数 初始化
     */
    constructor() {
        super();
        this.state = {
            visible: false,
            classConfig: [],
            loading: false,
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
        let hasError = false;
        // 校验数据
		this.formRef.props.form.validateFields((errors, values) => {
			if (!!errors) {
                hasError = true;
				return;
			}
        });
        if (hasError) {
            return;
        }
        let record = this.formRef.props.form.getFieldsValue();
        this.setState({loading: true});
        Action.modify(this.props.tableName, this.props.data[`${this.props.tableName}_id`], record, () => {
            this.props.refresh && this.props.refresh();
            this.setState({visible: false, loading: false,});
        });
    }
    
    /**
     * 渲染函数
     */
    render() {
        return <span>
            <a onClick={() => { this.setState({visible: true}); }}>修改</a>
            {this.state.visible && <Modal
                title='修改'
                visible={this.state.visible}
                onCancel={this.onCancel.bind(this)}
                onClose={this.onCancel.bind(this)}
                maskClosable={false}
                width={global.clientWidth - 100}
                onOk={this.onOk.bind(this)}
            >
                <Spin spinning={this.state.loading}>
                    <Fields
                        {...this.props}
                        wrappedComponentRef={(inst) => this.formRef = inst} 
                        action='modify'
                    />
                </Spin>
            </Modal>
            }
        </span>
    }
}
export default Modify;