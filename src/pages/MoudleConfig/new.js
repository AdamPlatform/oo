import React, { Component } from 'react'
import Button from 'antd/lib/button'
import Modal from 'antd/lib/modal'
import Fields from './fields'
import Spin from 'antd/lib/spin'
import * as Action from '../../action/moudleConfig'

class New extends Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            loading: false,
        }
    }
    onCancel() {
        this.setState({visible: false});
    }
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
        Action.add(record, () => {
            this.props.refresh && this.props.refresh({page: 1});
            this.setState({visible: false, loading: false});
        });
    }
    
    render() {
        let data = {};
        this.props.tableConfig.forEach(config => {
            data[config.dataIndex] = config.defaultValue;
        })
        let cw = document.documentElement.clientWidth || document.body.clientWidth;
        return <span>
            <Button type='primary' onClick={() => { this.setState({visible: true})}}>新增</Button>
            {this.state.visible && <Modal
                title='新增'
                visible={this.state.visible}
                onCancel={this.onCancel.bind(this)}
                onClose={this.onCancel.bind(this)}
                maskClosable={false}
                width={cw - 100}
                onOk={this.onOk.bind(this)}
            >
                <Spin spinning={this.state.loading}>
                    <Fields 
                        {...this.props}
                        data={data}
                        wrappedComponentRef={(inst) => this.formRef = inst} 
                        action='new'
                    />
                </Spin>
            </Modal>
            }
        </span>
    }
}
export default New;