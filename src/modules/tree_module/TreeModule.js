/**
 * 模块配置主页面
 * 创建、修改、删除、查询模块配置，根据模块配置生成模块
 */
import React, { Component } from 'react'
import Popconfirm from 'antd/lib/popconfirm'
import Spin from 'antd/lib/spin'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Button from 'antd/lib/button'

import Tree from '../../components/Tree'
import Detail from './Detail'
import Fields from './Fields'
import New from './New'
import * as Action from './Action'
import {configToItemProps} from '../../components/PageCreator'
import { Modal } from 'antd';
import { Record } from 'immutable';

class TreeModule extends Component {
    /**
     * 使用全局变量保存页面状态
     */
    constructor(props) {
        super();
        this.tableName = props.config.tableName;
        global[this.tableName] = global[this.tableName] || {};
        this.state = {
            loading: false,
            editing: false,
            node: global[this.tableName].node || {},
        };
    }

    /**
     * componentDidMount 页面加载完成后获取数据
     */
    componentDidMount() {
        this.getTree();
    }

    /**
     * componentWillReceiveProps 页面获取新的props
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.config !== this.props.config) {
            this.tableName = nextProps.config.tableName;
            this.refresh();
        }
    }

    /**
     * 获取列表（分页）
     * @param {*} page          当前页
     * @param {*} pageSize      分页条数
     * @param {*} query         查询条件
     * @param {*} sorter        排序条件
     */
    getTree() {
        global.storeData(this, this.tableName, {loading: true})
        Action.getTree(this.tableName, treeData => {
            treeData = treeData || [];
            global.storeData(this, this.tableName, {
                treeData, loading: false
            });
            if (global.equals(this.state.node, {})) {
                global.storeData(this, this.tableName, {
                    node: treeData[0]
                });
            }
        });
    }

    /**
     * 刷新页面
     */
    refresh() {
        this.getTree();
    }

    /**
     * 点击树节点
     */
    onSelect(selectedKeys, info) {
        global.storeData(this, this.tableName, {
            node: info.node
        });
    }

    /**
     * 点击保存时
     */
    onSave() {
        this.setState({editing: false});
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
        Action.modify(this.tableName, this.state.node[`${this.tableName}_id`], record, (data) => {
            if (data) {
                data.key = data[`${this.tableName}_id`];
                data.label = data[`${this.tableName}_name`];
                global.storeData(this, this.tableName, {
                    node: data
                });
            }
            this.refresh();
        })
    }

    /**
     * 删除节点
     */
    onDel() {
        if (this.state.node[`${this.tableName}_pid`] === null) {
            Modal.warning({title: '根节点不能删除'});
            return;
        }
        this.setState({loading: true});
        Action.del(this.tableName, this.state.node[`${this.tableName}_id`], () => {
            global.storeData(this, this.tableName, {
                node: this.state.treeData[0]
            });
            this.refresh();
        })
    }

    /**
     * 页面渲染
     */
    render () {
        let tableConfig = this.props.config.fields_config || [];
        const {treeData, editing, node} = this.state;
        return <Spin spinning={this.state.loading}>
            <Row>
                <Col span={4}>
                    <Tree treeData={treeData} onSelect={this.onSelect.bind(this)} selectedKeys={[node.key]}/>
                </Col>
                <Col span={20}>
                    <div style={{margin: 8}}>
                        {!editing && <New 
                            pid={node.key} 
                            tableName={this.tableName} 
                            tableConfig={tableConfig} 
                            refresh={this.refresh.bind(this)}
                        />}
                        {!editing && <Button onClick={() => this.setState({editing: true})} style={{marginLeft: 16}}>修改</Button>}
                        {!editing && <Popconfirm title="确定要删除这条数据吗？" onConfirm={this.onDel.bind(this)}>
                            <Button style={{marginLeft: 16}}>删除</Button>
                        </Popconfirm>}
                        {editing && <Button type='primary' onClick={this.onSave.bind(this)} style={{marginLeft: 16}}>保存</Button>}
                        {editing && <Button onClick={() => this.setState({editing: false})} style={{marginLeft: 16}}>取消</Button>}
                    </div>
                    <Fields
                        tableConfig={tableConfig}
                        tableName={this.tableName}
                        data={node}
                        wrappedComponentRef={(inst) => this.formRef = inst} 
                        action={ editing ? 'modify' : 'detail' }
                    />
                </Col>
            </Row>
        </Spin>
    }
}
export default TreeModule