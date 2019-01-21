import React, { Component } from 'react';
import Modal from 'antd/lib/modal'
import Button from 'antd/lib/button'
import TableEx from '../components/TableEx';
import {setConfig} from '../defautConfig'
import * as Action from '../action/moudleConfig'
const {
	Input,
	InputNumber,
	Select,
} = require('antd');
const Option = Select.Option;

class Config extends Component {
	constructor(props) {
		super();
		this.state = {
			configJSON: '[]',
			config: [],
			sorter: {},
			page: 1,
            pageSize: 10,
		}
	}
	componentWillMount() {
		let config = this.props.tableConfig.fields_config || [];
		this.setState({config: config, configJSON: JSON.stringify(config)});
	}
    
	onSave(dataIndex, record) {
		let config = this.state.config.map(item => Object.assign({}, item));
		for (let i in config) {
			if (record.dataIndex === config[i].dataIndex) {
				config[i] = record;
			}
		}
		
		this.setState({config: config, configJSON: JSON.stringify(config)});
		return true;
    }
    
	up(text, record) {
		let config = this.state.config.map(item => Object.assign({}, item));
		let pos = 0;
		for (let i in config) {
			if (config[i].dataIndex === record.dataIndex) {
				pos = i;
				break;
			}
		}
		if (pos > 0) {
			config.splice(pos, 1);		
			config.splice(pos - 1, 0, record);
			setConfig(config);
			this.setState({config});
		}
    }
    
	down(text, record) {
		let config = this.state.config.map(item => Object.assign({}, item));
		let pos = 0;
		for (let i in config) {
			if (config[i].dataIndex === record.dataIndex) {
				pos = i;
				break;
			}
		}

		if (pos < config.length - 1) {
			config.splice(pos, 1);		
			config.splice(parseInt(pos, 10) + 1, 0, record);
			setConfig(config);
			this.setState({config});
		}
	}
    modifyDirect() {
		let config = global.parseArray(this.state.configJSON);
		let record = {};
		record.fields_config = config;
		Action.modify(this.props.tableConfig._id, record);
		this.setState({config: config});
    }

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
	onCancel() {
		this.setState({visible: false});
		this.props.refresh && this.props.refresh();
    }
	render(){
        const pagination = {//分页
			total: this.state.config.length,
			showSizeChanger: true,
			pageSizeOptions: ['10', '20', '30', '40'],
			showQuickJumper: true,
			pageSize: this.state.pageSize,
			current: this.state.page,
			showTotal: () => `共 ${this.state.config.length} 条`,
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
			{title: '字段名', dataIndex: 'dataIndex', key: 'dataIndex', width: 200},
			{title: '列名', dataIndex: 'name', key: 'name', width: 200,
				component: {
					name: Input,
					props: {
						rules: [{ required: true, message: '列名必须输入', }]
					}
				}
			},
			{title: '是否显示', dataIndex: 'isShow', key: 'isShow', width: 200, 
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
			{title: '是否必填', dataIndex: 'isRequire', key: 'isRequire', width: 200, 
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
			{title: '是否修改', dataIndex: 'disabled', key: 'disabled', width: 200, 
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
			{title: '是否查询', dataIndex: 'isQuery', key: 'isQuery', width: 200, 
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
			{title: '是否排序', dataIndex: 'isSort', key: 'isSort', width: 200, 
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
			{title: '列宽', dataIndex: 'width', key: 'width', width: 200,
				component: {
					name: InputNumber,
					props: {
						step: 1,
						min: 100,
					}
				}
			},
			{title: '数据类型', dataIndex: 'dataType', key: 'dataType', width: 240, 
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
			{title: '参数', dataIndex: 'valueLen', key: 'valueLen', width: 200,
				component: {
					name: Input.TextArea
				}
			},
			{title: '默认值', dataIndex: 'defaultValue', key: 'defaultValue', width: 200,
				component: (text, record, index) => {
					return {
						name: Input
					}
				}
			},
			{title: '操作', dataIndex: 'dataIndex', key: 'operation', width: 400,
				render: (text,record)=>{
					return (record.isShow !== '0' && <span key='updown'>
						<a onClick={this.up.bind(this, text, record)}>上移</a>
						<span className="ant-divider"/>
						<a onClick={this.down.bind(this, text, record)}>下移</a>
					</span>);
				}
			},
		];
		let cw = document.documentElement.clientWidth || document.body.clientWidth;
		return (<span>
            <a onClick={() => { this.setState({visible: true}); }}>配置字段</a>
            {this.state.visible && <Modal
                title='配置字段'
                visible={this.state.visible}
                onCancel={this.onCancel.bind(this)}
                onClose={this.onCancel.bind(this)}
                maskClosable={false}
                width={cw - 100}
				footer={[<Button key='1' type='primary' onClick={this.onCancel.bind(this)} children='关闭'/>]}
            >
				<TableEx 
					saveName='保存' 
					rowKey={record => record.dataIndex}
					columns={columns} 
					dataSource={this.state.config}
					onChange={this.onTableChange.bind(this)}
					onSave={this.onSave.bind(this)}
					pagination={pagination}
				/>
				<div><Button style={{marginBottom: 8}} onClick={this.modifyDirect.bind(this)}>直接修改</Button>&nbsp;&nbsp;&nbsp;&nbsp;</div>
				<Input.TextArea style={{width: '100%', height: 300}} value={this.state.configJSON} onChange={e => {this.setState({configJSON: e.target.value})}}/>
			</Modal>}
		</span>);
	}
}

export default Config;
