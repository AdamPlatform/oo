/**
 * 新增页面
 */
import React, { Component } from 'react'
import { Prompt } from 'react-router-dom'
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
        this.pageKey = props.moduleName + 'new';
        this.moduleName = props.moduleName;
        global[this.pageKey] = global[this.pageKey] || {};
        this.state = {
            loading: global[this.pageKey].loading || false,
            saved: false
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
        global.storeData(this, this.pageKey, {loading: true, saved: true})
        Action.add(this.props.moduleName, record, () => {
            global.storeData(this, this.pageKey, {loading: false});
            this.props.history.goBack();
        });
    }
    
    /**
     * 渲染函数
     */
    render() {
        let data = {};
        this.props.tableConfig.forEach(config => {
            data[`${this.moduleName}_${config.name}`] = config.defaultValue;
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
            <Prompt message="页面正在编辑中, 您确定要离开吗?" when={!this.state.saved} />
        </Spin>
    }
}
export default New;