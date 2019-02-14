/**
 * 详情页面
 */
import React, { Component } from 'react'
import Spin from '../../components/Spin'
import Button from 'antd/lib/button'
import Fields from './Fields'
import * as Action from './Action'

export default class Detial extends Component {
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
     * 渲染函数
     */
    render() {
        return <Spin spinning={this.state.loading}>
            <Button type='primary' onClick={this.props.history.goBack}>返回</Button>
            <Fields 
                {...this.props}
                wrappedComponentRef={(inst) => this.formRef = inst} 
                action='detail'
                data={this.state.data}
            />
        </Spin>
    }
}