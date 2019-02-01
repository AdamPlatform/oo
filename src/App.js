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
			update: false,
			folded: false,
			page: null,
			moduleConfigs: [],
		};
		global.cols = this.getCols();
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
	}
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.onWindowResize.bind(this));
	}

	getCols() {
		let cols = 1;
		let cw = global.clientWidth;
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
		global.clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
		global.cols = this.getCols();
		this.setState({ update: !this.state.update });
	}

	render() {
		const foldedstyle = {
			width: '72px',
		};
		const toggermenustyle = this.state.folded ? 'menu-unfold' : 'menu-fold';
		const mode = this.state.folded ? 'vertical' : 'inline';
		let moduleMenus = this.state.moduleConfigs.map(config => {
			let page = null
			if (config.dataMoudle === '树') {
				page = <TreeModule config={config}/>
			} else {
				page = <ListModule config={config}/>
			}
			return <Menu.Item key={config.tableName}>
				<a onClick={() => {this.setState({page})}}>{config.moduleName}</a>
			</Menu.Item>
		})
		return (
			<div>
				<aside className="ant-layout-sider" style={this.state.folded ? foldedstyle : {}}>
					<Menu mode={mode} selectedKeys={[]}>
						<Menu.Item key="sysconfig">
							<a onClick={() => {this.setState({page: <MoudleConfig refresh={this.getModuleConfigs.bind(this)}/>})}}>系统设置</a>
						</Menu.Item>
						{moduleMenus}
					</Menu>
				</aside>
				<div className="ant-layout-main" style={this.state.folded ? { marginLeft: '72px' } : {}}>
					<Row className='ant-layout-header'>
						<Col span={2} style={{paddingTop: 16, paddingLeft: 8, width: '64px', height: '64px' }}>
							<a onClick={() => {this.setState({folded: !this.state.folded})}}>
								<Icon type={toggermenustyle} style={{ fontSize: '20px' }} />
							</a>
						</Col>
						<Col></Col>
					</Row>
					<div className="ant-layout-container">
						{this.state.page || <MoudleConfig refresh={this.getModuleConfigs.bind(this)}/>}
					</div>
				</div>
			</div>
		);
	}
}

export default App;
