/**
 * 新增页面
 */
import React, { Component } from 'react'
import Button from 'antd/lib/button'
import Fields from './Fields'
import Spin from '../../components/Spin'
import * as Action from './Action'

class New extends Component {
    /**
     * 使用全局变量保存页面状态
     */
    constructor(props) {
        super();
        this.pageKey = props.tableName + 'new';
        global[this.pageKey] = global[this.pageKey] || {};
        this.state = {
            loading: global[this.pageKey].loading || false,
        };
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
        global.storeData(this, this.pageKey, {loading: true})
        Action.add(this.props.tableName, record, () => {
            global.storeData(this, this.pageKey, {loading: false})
            this.props.history.goBack();
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
        return <Spin spinning={this.state.loading}>
            <Button type='primary' onClick={this.onOk.bind(this)}>保存</Button>
            <Button style={{marginLeft: 16}} onClick={this.props.history.goBack}>取消</Button>
            <Fields 
                {...this.props}
                data={data}
                wrappedComponentRef={(inst) => this.formRef = inst} 
                action='new'
            />
        </Spin>
    }
}
export default New;