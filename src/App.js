import React, { Component } from 'react'
import Menu from 'antd/lib/menu'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Icon from 'antd/lib/icon'

import MoudleConfig from './modules/moudle_config/List'
import {getList} from './modules/moudle_config/Action'
import ListModule from './modules/list_module/ListModule'
import TreeModule from './modules/tree_module/TreeModule'

class App extends Component {
	constructor() {
		super();
		this.state = {
			folded: false,
			page: null,
			moduleConfigs: [],
			cols: 4,
			selectedKeys: ['sysconfig']
		};
	}

	getModuleConfigs() {
		getList(1, 9999, {}, {}, (body => {
			let moduleConfigs = body.list || [];
			this.setState({moduleConfigs: moduleConfigs.filter(item => item.isMenu === '是')});
		}))
	}

	componentWillMount() {
		window.addEventListener('resize', this.onWindowResize.bind(this));
		this.getModuleConfigs();
		this.setState({ cols: this.getCols() });
	}
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.onWindowResize.bind(this));
	}

	getCols() {
		let cols = 1;
		let menuWidth = this.state.folded ? global.menuWidth : 0;
		global.clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
		let cw = global.clientWidth - menuWidth;
		if (cw >= 1280) {
			cols = 4
		} else if (cw >= 960 && cw < 1280) {
			cols = 3
		} else if (cw >= 640 && cw < 960) {
			cols = 2
		} else {
			cols = 1
		}
		return cols;
	}

	onWindowResize() {
		this.setState({ cols: this.getCols() });
	}

	render() {
		const toggermenustyle = this.state.folded ? 'menu-unfold' : 'menu-fold';
		const mode = this.state.folded ? 'vertical' : 'inline';
		let moduleMenus = this.state.moduleConfigs.map(config => {
			let page = null
			if (config.dataMoudle === '树') {
				page = <TreeModule cols={this.state.cols} config={config}/>
			} else {
				page = <ListModule cols={this.state.cols} config={config}/>
			}
			return <Menu.Item key={config.tableName}>
				<a onClick={() => {this.setState({page, selectedKeys: [config.tableName]})}}>{config.moduleName}</a>
			</Menu.Item>
		})
		return (
			<div>
				{!this.state.folded && <aside className="ant-layout-sider">
					<Menu mode={mode} selectedKeys={this.state.selectedKeys}>
						<Menu.Item key="sysconfig">
							<a onClick={() => {this.setState({
								page: <MoudleConfig cols={this.state.cols} refresh={this.getModuleConfigs.bind(this)}/>,
								selectedKeys: ['sysconfig']
							})}}>系统设置</a>
						</Menu.Item>
						{moduleMenus}
					</Menu>
				</aside>}
				<div className="ant-layout-main" style={this.state.folded ? { marginLeft: 0 } : {}}>
					<Row className='ant-layout-header'>
						<Col span={2} style={{paddingTop: 16, paddingLeft: 8, width: '64px', height: '64px' }}>
							<a onClick={() => {this.setState({folded: !this.state.folded})}}>
								<Icon type={toggermenustyle} style={{ fontSize: '20px' }} />
							</a>
						</Col>
					</Row>
					<div className="ant-layout-container">
						{this.state.page || <MoudleConfig cols={this.state.cols} refresh={this.getModuleConfigs.bind(this)}/>}
					</div>
				</div>
			</div>
		);
	}
}

export default App;
