/**
 * 详情页面
 */
import React, { Component } from 'react'
import { Prompt } from 'react-router-dom'
import Spin from '../../components/Spin'
import Button from 'antd/lib/button'
import Fields from './Fields'
import Modal from 'antd/lib/modal'
import * as Action from './Action'

class Detial extends Component {
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
            editing: global[this.pageKey].editing || false,
        };
    }
    
    /**
     * 组件加载时
     */
    componentWillMount() {
        this.getData();
    }

    /**
     * 获取页面数据
     */
    getData() {
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
            global.storeData(this, this.pageKey, {editing: false});
            this.getData();
        });
    }

    /**
     * 返回按钮响应函数
     */
    onGoBack() {
        if (this.state.editing) {
            Modal.warning({title: '页面正在编辑中，请先保存'});
            return;
        }
        this.props.history.goBack();
    }

    /**
     * 渲染函数
     */
    render() {
        const {loading, editing} = this.state;
        return <Spin spinning={loading}>
            <Button onClick={this.onGoBack.bind(this)}>返回</Button>
            {!editing && <Button type='primary' onClick={() => global.storeData(this, this.pageKey, {editing: true})} style={{marginLeft: 16}}>修改</Button>}
            {editing && <Button type='primary' style={{marginLeft: 16}} onClick={this.onOk.bind(this)}>保存</Button>}
            {editing && <Button style={{marginLeft: 16}} onClick={() => global.storeData(this, this.pageKey, {editing: false})}>取消</Button>}
            <Fields 
                {...this.props}
                wrappedComponentRef={(inst) => this.formRef = inst} 
                action={editing ? 'modify': 'detail'}
                data={this.state.data}
            />
            <Prompt message="页面正在编辑中, 您确定要离开吗?" when={editing} />
        </Spin>
    }
}

export default Detial