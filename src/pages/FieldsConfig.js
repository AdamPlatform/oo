import React, { Component } from 'react';
import Modal from 'antd/lib/modal'
import Button from 'antd/lib/button'
import Select from 'antd/lib/select'
import Input from 'antd/lib/input'
import InputNumber from 'antd/lib/input-number'
import Popconfirm from 'antd/lib/popconfirm'
import Spin from 'antd/lib/spin'
import Menu from 'antd/lib/menu'
import Dropdown from 'antd/lib/dropdown'
import Icon from 'antd/lib/icon'

import Search from '../components/Search'
import TableEx from '../components/TableEx';
import * as Action from '../action/moudleConfig'
import {configToItemProps} from '../components/PageCreator'

const Option = Select.Option;
const aStyle = {
	color: '#1890ff', //  hover #40a9ff
}
class FieldsConfig extends Component {
	/**
     * 构造函数 初始化
     * @param {*} props 
     */
	constructor(props) {
		super();
		this.state = {
			configJSON: '[]',
			config: [],
			allConfig: [],
			sorter: {},
			page: 1,
			pageSize: 10,
			searchFields: {},
			query: {},
			addNum: 1,
			loading: false,
		}
	}

	/**
     * 页面开始加载时
     */
	componentWillMount() {
		let config = this.props.data.fields_config || [];
		this.setState({allConfig: config, config: config, configJSON: JSON.stringify(config)});
	}

	refresh() {
		Action.getOne(this.props.data._id, doc => {
			let config = doc.fields_config || [];
			this.setState({allConfig: config, config: config, configJSON: JSON.stringify(config), loading: false});
		})
	}
	
	/**
     * 保存
     * @param {*} id 
     * @param {*} record 
     * @param {*} index 
     */
	onSave(id, record, index) {
		this.setState({loading: true});
		Action.modifyOneField(this.props.data._id, record, () => {
			this.refresh();
		});
		return true;
    }
	
	/**
	 * 上移
	 * @param {*} text 
	 * @param {*} record 
	 */
	up(record) {
		this.setState({loading: true});
		Action.fieldUp(this.props.data._id, record.dataIndex, () => {
			this.refresh();
		})
    }
	
	/**
	 * 下移
	 * @param {*} text 
	 * @param {*} record 
	 */
	down(record) {
		this.setState({loading: true});
		Action.fieldDown(this.props.data._id, record.dataIndex, () => {
			this.refresh();
		})
	}
	
	/**
	 * 上移至顶部
	 */
	upToTop(record) {
		this.setState({loading: true});
		Action.fieldUpToTop(this.props.data._id, record.dataIndex, () => {
			this.refresh();
		})
	}

	/**
	 * 下移至底部
	 */
	downToBottom(record) {
		this.setState({loading: true});
		Action.fieldDownToBottom(this.props.data._id, record.dataIndex, () => {
			this.refresh();
		})
	}

	/**
	 * 直接修改
	 */
    modifyDirect() {
		let config = global.parseArray(this.state.configJSON);
		let record = {};
		record.fields_config = config;
		Action.modify(this.props.data._id, record, () => {
			this.refresh();
		});
    }

	/**
	 * 表格发生变化时回调函数
	 * @param {*} pagination 
	 * @param {*} filters 
	 * @param {*} sorter 
	 */
    onTableChange(pagination, filters, sorter) {
        let page = pagination.current;
		let pageSize = pagination.pageSize;
		if (pageSize !== this.state.pageSize) {
			page = 1;
		}
        if (sorter.field !== this.state.sorter.field || sorter.order !== this.state.sorter.order) {
            this.setState({sorter: sorter});
			page = 1;		
        }
        this.setState({page: page, pageSize:pageSize});
	}
	
	/**
	 * 取消
	 */
	onCancel() {
		this.setState({visible: false});
		this.props.refresh && this.props.refresh();
	}

	/**
     * 搜索按钮响应函数
     * @param {*} query 
     * @param {*} searchFields 
     */
    onSearch(query, searchFields) {
		let value = searchFields.mainKey || '';
		value = value.trim();
		if (value === '') {
			this.setState({config: this.state.allConfig});
		} else {
			let config = this.state.allConfig.filter(item => item.name.indexOf(value) !== -1);
			this.setState({config: config});
		}
	}

	/**
	 * 新增字段
	 */
	addField() {
		this.setState({loading: true});
		Action.addField(this.props.data._id, this.state.addNum, () => {
			this.refresh();
		})
	}

	/**
	 * 删除一个字段
	 * @param {*} dataIndex 
	 */
	delOneField(dataIndex) {
		this.setState({loading: true})
		Action.delOneField(this.props.data._id, dataIndex, () => {
			this.refresh();
		})
	}
	
	/**
	 * 渲染函数
	 */
	render(){
		let mainSearchFeilds = [configToItemProps({"dataIndex":`${this.props.data.tableName}_name`,"name":"名称","isShow":"1", "disabled":"1","isQuery":"1","width":160,"dataType":"STRING"})];
		const {config, page, pageSize, visible, addNum, loading, configJSON, searchFields} = this.state;
        const pagination = {//分页
			total: config.length,
			showSizeChanger: true,
			pageSizeOptions: ['10', '20', '30', '40', '100', '200', '500', '1000'],
			showQuickJumper: true,
			pageSize: pageSize,
			current: page,
			showTotal: () => `共 ${config.length} 条`,
		};
		let generateOption = (optionArray) => {
			return optionArray.map((item, index) => {
				return <Option key={index} value={item.value}>{item.label}</Option>;
			});
        }
        const disabledArray = [{value: '1', label: '不可修改'}, {value: '0', label: '可修改'}]
        let disabledOption = generateOption(disabledArray);
		const optionArray = [{value: '1', label: '显示'}, {value: '0', label: '不显示'}]
		let children = generateOption(optionArray);
		const isQueryArray = [{value: '1', label: '查询'}, {value: '0', label: '不查询'}]
		let isQuery = generateOption(isQueryArray);
		const isSortArray = [{value: '1', label: '排序'}, {value: '0', label: '不排序'}]
		let isSort = generateOption(isSortArray);
		const dataTypeArray = [{value: 'STRING', label: '文本'}, 
			{value: 'TEXT', label: '文本域'}, 
			{value: 'NUMBER', label: '数字'}, 
			{value: 'MONEY', label: '金额'}, 
            {value: 'DATE', label: '日期'}, 
            {value: 'TIME', label: '时间'},
		];
        let dataType = generateOption(dataTypeArray);
        const isRequireArray = [{value: '1', label: '必填'}, {value: '0', label: '选填'}]
		let isRequireOption = generateOption(isRequireArray);
		let selectValueToLable = (value, children) => {
			for (let obj of children) {
				if (value === obj.props.value) {
					return obj.props.children;
				}
			}
			return value;
		}
		let columns = [
			{title: '序号', dataIndex: 'index', key: 'index', width: 60},
			{title: '字段名', dataIndex: 'dataIndex', key: 'dataIndex', width: 160},
			{title: '列名', dataIndex: 'name', key: 'name', width: 120,
				component: {
					name: Input,
					props: {
						rules: [{ required: true, message: '列名必须输入', }]
					}
				}
			},
			{title: '是否显示', dataIndex: 'isShow', key: 'isShow', width: 100, 
				render: text => selectValueToLable(text, children),
				component: (text, record, index) => {
					return {
						name: Select,
						props: {
							children: children,
							disabled: record.isShowDisabled === '1',
						}
					}
				},
				sorter: (a,b) => a.isShow - b.isShow
            },
			{title: '是否必填', dataIndex: 'isRequire', key: 'isRequire', width: 80, 
				render: text => selectValueToLable(text, isRequireOption),
                component: (text, record, index) => {
                    return {
                        name: Select,
                        props: {
                            children: isRequireOption,
                            disabled: record.isRequireDisabled === '1'
                        }
                    }
                }
            },
			{title: '是否修改', dataIndex: 'disabled', key: 'disabled', width: 80, 
				render: text => selectValueToLable(text, disabledOption),
                component: (text, record, index) => {
                    return {
                        name: Select,
                        props: {
                            children: disabledOption,
                            disabled: record.disabledDisabled === '1'
                        }
                    }
                }
            },
			{title: '是否查询', dataIndex: 'isQuery', key: 'isQuery', width: 80, 
				render: text => selectValueToLable(text, isQuery),
				component: (text, record, index) => {
                    return {
                        name: Select,
                        props: {
                            children: isQuery,
                            disabled: record.isQueryDisabled === '1'
                        }
                    }
                }
			},
			{title: '是否排序', dataIndex: 'isSort', key: 'isSort', width: 80, 
				render: text => selectValueToLable(text, isSort),
				component: (text, record, index) => {
                    return {
                        name: Select,
                        props: {
                            children: isSort,
                            disabled: record.isSortDisabled === '1'
                        }
                    }
                }
			},
			{title: '列宽', dataIndex: 'width', key: 'width', width: 100,
				component: {
					name: InputNumber,
					props: {
						step: 1,
						min: 100,
					}
				}
			},
			{title: '数据类型', dataIndex: 'dataType', key: 'dataType', width: 80, 
				render: text => selectValueToLable(text, dataType),
				component: (text, record, index) => {
                    return {
                        name: Select,
                        props: {
                            disabled: record.dataTypeDisabled === '1',
							children: dataType
                        }
                    }
                }
			}, 
			{title: '参数', dataIndex: 'valueLen', key: 'valueLen', width: 120,
				component: {
					name: Input.TextArea
				}
			},
			{title: '默认值', dataIndex: 'defaultValue', key: 'defaultValue', width: 120,
				component: (text, record, index) => {
					return {
						name: Input
					}
				}
			},
			{title: '操作', dataIndex: 'dataIndex', key: 'operation', width: 240,
				render: (text, record)=>{
					let index = record.index;
					let moreOptions = [];
					if (index > 3) {
						let up = <Menu.Item key={moreOptions.length + 1} >
							<a style={aStyle} onClick={this.up.bind(this, record)}>上移</a>
						</Menu.Item>
						moreOptions.push(up);
					}
					if (index > 2 && index < config.length) {
						let down = <Menu.Item key={moreOptions.length + 1} >
							<a style={aStyle} onClick={this.down.bind(this, record)}>下移</a>
						</Menu.Item>
						moreOptions.push(down);
					}
					if (index > 3) {
						let up = <Menu.Item key={moreOptions.length + 1} >
							<a style={aStyle} onClick={this.upToTop.bind(this, record)}>上移至顶部</a>
						</Menu.Item>
						moreOptions.push(up);
					}
					if (index > 2 && index < config.length) {
						let down = <Menu.Item key={moreOptions.length + 1} >
							<a style={aStyle} onClick={this.downToBottom.bind(this, record)}>下移至底部</a>
						</Menu.Item>
						moreOptions.push(down);
					}
					
					return (record.isShow !== '0' && index > 2 && <span key='updown'>
						{index > 2 && <Popconfirm title="确定要删除这条数据吗？" onConfirm={this.delOneField.bind(this, text)}>
							<a>删除</a>
						</Popconfirm>}
						{index > 2 && <span className="ant-divider"/>}
						{index > 2 && <Dropdown overlay={<Menu>{moreOptions}</Menu>}>
							<a className="ant-dropdown-link">更多  <Icon type="down" /></a>
						</Dropdown>}
					</span>);
				}
			},
		];
		
		return (<span>
            <a onClick={() => { this.setState({visible: true}); }}>配置字段</a>
            {visible && <Modal
                title='配置字段'
                visible={visible}
                onCancel={this.onCancel.bind(this)}
                onClose={this.onCancel.bind(this)}
                maskClosable={false}
                width={global.clientWidth - 100}
				footer={[<Button key='1' type='primary' onClick={this.onCancel.bind(this)} children='关闭'/>]}
			>
				<Spin spinning={loading}>
					<Search
						simple
						mainSearchFeilds={mainSearchFeilds}
						onSearch={this.onSearch.bind(this)}
						placeholder='请输入字段名称'
						searchFields={searchFields}
						btnName='搜索'
					/>
					<div style={{marginTop: 16, marginBottom: 8}}>
						<Button type='primary' onClick={this.addField.bind(this)} style={{marginRight: 16}}>新增</Button>
						<InputNumber
							value={addNum}
							min={1}
							max={100}
							formatter={value => `${value}个`}
							parser={value => value.replace('个', '')}
							onChange={value => this.setState({addNum: value})}
						/>
					</div>
					<TableEx 
						saveName='保存' 
						rowKey={record => record.index}
						columns={columns} 
						dataSource={config.map((item, index) => {
							item.index = index + 1;
							return item;
						})}
						onChange={this.onTableChange.bind(this)}
						onSave={this.onSave.bind(this)}
						pagination={pagination}
					/>
					<div><Button style={{marginBottom: 8}} onClick={this.modifyDirect.bind(this)}>直接修改</Button>&nbsp;&nbsp;&nbsp;&nbsp;</div>
					<Input.TextArea style={{width: '100%', height: 300}} value={configJSON} onChange={e => {this.setState({configJSON: e.target.value})}}/>
				</Spin>
			</Modal>}
		</span>);
	}
}

export default FieldsConfig;
