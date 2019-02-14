import React, { Component } from 'react'

import { BrowserRouter, Route, Link, withRouter } from 'react-router-dom'

import Menu from 'antd/lib/menu'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Icon from 'antd/lib/icon'

import MoudleConfig from './modules/moudle_config/List'
import {getList} from './modules/moudle_config/Action'
import ListModule from './modules/list_module/ListModule'
import TreeModule from './modules/tree_module/TreeModule'

@withRouter
class App extends Component {
	/**
	 * 构造函数
	 */
	constructor() {
		super();
		this.state = {
			folded: false,
			page: null,
			moduleConfigs: [],
			cols: 4,
			selectedKeys: [],
		};
	}

	/**
	 * 获取系统配置
	 */
	getModuleConfigs() {
		getList(1, 9999, {}, {}, (body => {
			let moduleConfigs = body.list || [];
			this.setState({moduleConfigs: moduleConfigs.filter(item => item.isMenu === '是')});
		}))
	}

	/**
	 * 组件加载时
	 */
	componentWillMount() {
		let cols = this.getCols();
		window.addEventListener('resize', this.onWindowResize.bind(this));
		this.getModuleConfigs();
		let pathname = window.location.pathname;
		pathname = pathname.substring(1, pathname.length);
		let menukey = 'sysconfig'
		if (pathname !== '') {
			let pathArr = pathname.split('/');
			menukey = pathArr[0];
		}
		this.setState({ cols: cols, selectedKeys: [menukey]});
	}
	
	/**
	 * 将要离开组件时
	 */
	componentWillUnmount() {
		window.removeEventListener('resize', this.onWindowResize.bind(this));
	}

	/**
	 * 计算表单自适应的列数
	 */
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

	/**
	 * 窗口大小变化回调函数
	 */
	onWindowResize() {
		this.setState({ cols: this.getCols() });
	}

	/**
	 * 点击菜单回调
	 * @param {*} info 
	 */
	onMenuItemClick(info) {
		const { key } = info;
		//console.log(item, key, keyPath, 'item, key, keyPath');
		this.setState({selectedKeys: [key]});
	}

	/**
	 * 渲染函数
	 */
	render() {
		const toggermenustyle = this.state.folded ? 'menu-unfold' : 'menu-fold';
		const mode = this.state.folded ? 'vertical' : 'inline';
		let routes = [];
		let sysRoute = <Route key='sysconfig' path='/' exact render={props => <MoudleConfig 
			cols={this.state.cols} 
			refresh={this.getModuleConfigs.bind(this)} 
			{...props}
		/>}/>;
		routes.push(sysRoute);
		let moduleMenus = this.state.moduleConfigs.map(config => {
			let route = null
			if (config.dataMoudle === '树') {
				route = <Route key={config.tableName} path={`/${config.tableName}`} render={props => <TreeModule 
					cols={this.state.cols} 
					config={config} 
					{...props}
				/>}/>
			} else {
				route = <Route key={config.tableName} path={`/${config.tableName}`} render={props => <ListModule 
					cols={this.state.cols} 
					config={config} 
					{...props}
				/>}/>
			}
			routes.push(route);
			return <Menu.Item key={config.tableName}>
				<Link to={`/${config.tableName}`}>{config.moduleName}</Link>
			</Menu.Item>
		})
		return <BrowserRouter>
			<div>
				{!this.state.folded && <aside className="ant-layout-sider">
					<Menu mode={mode} onClick={this.onMenuItemClick.bind(this)} selectedKeys={this.state.selectedKeys}>
						<Menu.Item key="sysconfig">
							<Link to='/'>系统设置</Link>
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
						
						{routes}
					</div>
				</div>
			</div>
		</BrowserRouter>
	}
}

export default App;
