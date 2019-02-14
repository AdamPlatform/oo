/**
 * 修改页面
 */
import React, { Component } from 'react'
import Spin from '../../components/Spin'
import Button from 'antd/lib/button'
import Fields from './Fields'
import * as Action from './Action'

class Modify extends Component {
    /**
     * 使用全局变量保存页面状态
     */
    constructor(props) {
        super();
        this.pageKey = props.tableName + props.match.params.id;
        global[this.pageKey] = global[this.pageKey] || {};
        this.state = {
            data: global[this.pageKey].data || {},
            loading: global[this.pageKey].loading || false,
        };
    }
    
    /**
     * 组件加载时
     */
    componentWillMount() {
        global.storeData(this, this.pageKey, {loading: true})
        Action.getOne(this.props.tableName, this.props.match.params.id, (data) => {
            global.storeData(this, this.pageKey, {
                data, loading: false
            });
        })
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
        Action.modify(this.props.tableName, this.props.match.params.id, record, () => {
            global.storeData(this, this.pageKey, {loading: false});
            this.props.history.goBack();
        });
    }
    
    /**
     * 渲染函数
     */
    render() {
        return <Spin spinning={this.state.loading}>
            <Button type='primary' onClick={this.onOk.bind(this)}>保存</Button>
            <Button style={{marginLeft: 16}} onClick={this.props.history.goBack}>取消</Button>
            <Fields
                {...this.props}
                wrappedComponentRef={(inst) => this.formRef = inst} 
                action='modify'
                data={this.state.data}
            />
        </Spin>
    }
}
export default Modify;