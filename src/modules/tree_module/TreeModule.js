/**
 * 模块配置主页面
 * 创建、修改、删除、查询模块配置，根据模块配置生成模块
 */
import React, { Component } from 'react'
import { Prompt } from 'react-router-dom'
import Popconfirm from 'antd/lib/popconfirm'
import Spin from '../../components/Spin'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Button from 'antd/lib/button'
import Modal from 'antd/lib/modal'

import Tree from '../../components/Tree'
import Fields from './Fields'
import * as Action from './Action'

class TreeModule extends Component {
    /**
     * 使用全局变量保存页面状态
     */
    constructor(props) {
        super();
        this.moduleName = props.config['模块名称'];
        global[this.moduleName] = global[this.moduleName] || {};
        this.state = {
            loading: global[this.moduleName].loading || false,
            editing: global[this.moduleName].editing || false,
            adding: global[this.moduleName].adding || false,
            node: global[this.moduleName].node || {},
            treeData: global[this.moduleName].treeData || [],
            expandedKeys: global[this.moduleName].expandedKeys || [],
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
            this.moduleName = nextProps.config['模块名称'];
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
        global.storeData(this, this.moduleName, {loading: true})
        Action.getTree(this.moduleName, treeData => {
            treeData = treeData || [];
            global.storeData(this, this.moduleName, {
                treeData, loading: false
            });
            if (global.equals(this.state.node, {})) {
                // 默认展开根节点
                let expandedKeys = this.state.expandedKeys;
                
                if (expandedKeys.length === 0) {
                    expandedKeys = [treeData[0].key];
                }
                global.storeData(this, this.moduleName, {
                    node: treeData[0],
                    expandedKeys: expandedKeys,
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
        global.storeData(this, this.moduleName, {
            node: info.node
        });
    }

    onExpand(expandedKeys) {
        global.storeData(this, this.moduleName, {
            expandedKeys: expandedKeys
        });
    }

    /**
     * 修改保存时
     */
    onSave() {
        global.storeData(this, this.moduleName, {editing: false});
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
        global.storeData(this, this.moduleName, {loading: true});
        Action.modify(this.moduleName, this.state.node[`${this.moduleName}_id`], record, (data) => {
            if (data) {
                data.key = data[`${this.moduleName}_id`];
                data.label = data[`${this.moduleName}_名称`];
                global.storeData(this, this.moduleName, {
                    node: data
                });
            }
            this.refresh();
        })
    }

    /**
     * 新增保存时
     */
    onAddSave() {
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
        global.storeData(this, this.moduleName, {loading: true});
        Action.add(this.moduleName, this.state.node[`${this.moduleName}_id`], record, () => {
            global.storeData(this, this.moduleName, {adding: false, loading: false});
            this.refresh();
        });
    }

    /**
     * 删除节点
     */
    onDel() {
        if (this.state.node[`${this.moduleName}_pid`] === null) {
            Modal.warning({title: '根节点不能删除'});
            return;
        }
        global.storeData(this, this.moduleName, {loading: true});
        Action.del(this.moduleName, this.state.node[`${this.moduleName}_id`], () => {
            global.storeData(this, this.moduleName, {
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
        const {treeData, editing, adding, node, expandedKeys} = this.state;
        let action = 'detail';
        if (editing) {
            action = 'modify';
        } else if (adding) {
            action = 'new';
        }
        let data = {};
        tableConfig.forEach(config => {
            data[`${this.moduleName}_${config.name}`] = config.defaultValue;
        })
        return <Spin spinning={this.state.loading}>
            <Row>
                <Col span={3}>
                    <Tree 
                        defaultExpandRoot 
                        treeData={treeData} 
                        onSelect={this.onSelect.bind(this)} 
                        selectedKeys={[node.key]}
                        expandedKeys={expandedKeys}
                        onExpand={this.onExpand.bind(this)}
                    />
                </Col>
                <Col span={21}>
                    <div style={{margin: 8}}>
                        {!(editing || adding) && <Button type='primary' onClick={() => { global.storeData(this, this.moduleName, {adding: true})}}>新增</Button>}
                        {!(editing || adding) && <Button onClick={() => global.storeData(this, this.moduleName, {editing: true})} style={{marginLeft: 16}}>修改</Button>}
                        {!(editing || adding) && <Popconfirm title="确定要删除这条数据吗？" onConfirm={this.onDel.bind(this)}>
                            <Button style={{marginLeft: 16}}>删除</Button>
                        </Popconfirm>}
                        {editing && <Button type='primary' onClick={this.onSave.bind(this)} style={{marginLeft: 16}}>保存</Button>}
                        {editing && <Button onClick={() => global.storeData(this, this.moduleName, {editing: false})} style={{marginLeft: 16}}>取消</Button>}
                        {adding && <Button type='primary' onClick={this.onAddSave.bind(this)} style={{marginLeft: 16}}>保存</Button>}
                        {adding && <Button onClick={() => global.storeData(this, this.moduleName, {adding: false})} style={{marginLeft: 16}}>取消</Button>}
                    </div>
                    <Fields
                        cols={this.props.cols}
                        tableConfig={tableConfig}
                        moduleName={this.moduleName}
                        data={action === 'new' ? data : node}
                        wrappedComponentRef={(inst) => this.formRef = inst} 
                        action={action}
                    />
                </Col>
            </Row>
            <Prompt message="页面正在编辑中, 您确定要离开吗?" when={editing || adding} />
        </Spin>
    }
}
export default TreeModule