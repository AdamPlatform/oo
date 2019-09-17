/**
 * 新增页面
 */
import React, { Component } from 'react'
import Button from 'antd/lib/button'
import Modal from 'antd/lib/modal'
import Fields from './Fields'
import Spin from '../../components/Spin'
import * as Action from './Action'

class New extends Component {
    /**
     * 构造函数 初始化
     */
    constructor() {
        super();
        this.state = {
            visible: false,
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
        Action.add(record, () => {
            this.props.refresh && this.props.refresh({page: 1});
            this.setState({visible: false, loading: false});
        });
    }
    
    /**
     * 渲染函数
     */
    render() {
        let data = {};
        this.props.tableConfig.forEach(config => {
            data[config.dataIndex] = config.defaultValue;
        })
        return <span>
            <Button type='primary' style={{marginLeft: 8}} onClick={() => { this.setState({visible: true})}}>新增</Button>
            {this.state.visible && <Modal
                title='新增'
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