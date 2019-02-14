import React, { Component } from 'react'

import { Route, Link } from 'react-router-dom'
import Menu from 'antd/lib/menu'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Icon from 'antd/lib/icon'

import MoudleConfig from '../moudle_config/List'
import {getList} from '../moudle_config/Action'
import ListModule from '../list_module/ListModule'
import New from '../list_module/New'
import Modify from '../list_module/Modify'
import Detail from '../list_module/Detail'
import TreeModule from '../tree_module/TreeModule'
import Home from './Home'
class Dashboard extends Component {
	/**
	 * 构造函数
	 */
	constructor() {
		super();
		this.state = {
			folded: false,
			page: null,
			moduleConfigs: [],
			cols: 1,
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
		window && window.addEventListener('resize', this.onWindowResize.bind(this));
		this.getModuleConfigs();
		let selectedKeys = this.getMenuSelectKeysFromPathName(this.props);
		this.setState({ cols: cols, selectedKeys: selectedKeys});
    }

    /**
	 * 将要离开组件时
	 */
	componentWillUnmount() {
		window && window.removeEventListener('resize', this.onWindowResize.bind(this));
	}

    /**
     * componentWillReceiveProps 页面获取新的props
     */
    componentWillReceiveProps(nextProps) {
        let selectedKeys = this.getMenuSelectKeysFromPathName(nextProps);
		this.setState({selectedKeys: selectedKeys});
    }

    /**
     * 根据路径获取选中菜单key
     * @param {*} props 
     */
    getMenuSelectKeysFromPathName(props) {
        let pathname = props.location.pathname;
        pathname = pathname.substring(1, pathname.length);
        let selectedKeys = [];
		if (pathname !== '') {
			let pathArr = pathname.split('/');
            let menukey = pathArr[0];
            selectedKeys.push(menukey);
        }
        return selectedKeys;
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
        //const { item, keyPath } = info;
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
		let dashboardRoute = <Route key='dashboard' path='/' exact render={props => <Home 
            cols={this.state.cols} 
            config={this.state.moduleConfigs} 
			{...props}
        />}/>;
        let sysRoute = <Route key='sysconfig' path='/sysconfig' render={props => <MoudleConfig 
			cols={this.state.cols} 
			refresh={this.getModuleConfigs.bind(this)} 
			{...props}
        />}/>;
        routes.push(dashboardRoute);
        routes.push(sysRoute);
        let moduleName = null;
        if (this.state.selectedKeys[0] === 'sysconfig') {
            moduleName = '系统设置';
        }
		let moduleMenus = this.state.moduleConfigs.map(config => {
			if (config.dataMoudle === '树') {
				let route = <Route key={config.tableName} path={`/${config.tableName}`} render={props => <TreeModule 
					cols={this.state.cols} 
					config={config} 
					{...props}
				/>}/>
				routes.push(route);
			} else {
				let route = <Route key={config.tableName} exact path={`/${config.tableName}`} render={props => <ListModule 
					cols={this.state.cols} 
					config={config} 
					{...props}
				/>}/>
				let newRoute = <Route key={config.tableName + 'new'} path={`/${config.tableName}/new`} render={props => <New 
					cols={this.state.cols} 
					tableConfig={config.fields_config}
					tableName={config.tableName} 
					{...props}
				/>}/>
				let modifyRoute = <Route key={config.tableName + 'modify'} path={`/${config.tableName}/modify/:id`} render={props => <Modify 
					cols={this.state.cols} 
					tableConfig={config.fields_config}
					tableName={config.tableName} 
					{...props}
				/>}/>
				let detailRoute = <Route key={config.tableName + 'detail'} path={`/${config.tableName}/detail/:id`} render={props => <Detail 
					cols={this.state.cols} 
					tableConfig={config.fields_config}
					tableName={config.tableName} 
					{...props}
				/>}/>
				routes.push(route);
				routes.push(newRoute);
				routes.push(modifyRoute);
				routes.push(detailRoute);
            }
            if (this.state.selectedKeys[0] === config.tableName) {
                moduleName = config.moduleName;
            }
			
			return <Menu.Item key={config.tableName}>
				<Link to={`/${config.tableName}`}>{config.moduleName}</Link>
			</Menu.Item>
		})
		return <div>
            {!this.state.folded && <aside className="ant-layout-sider">
                <Menu mode={mode} onClick={this.onMenuItemClick.bind(this)} selectedKeys={this.state.selectedKeys}>
                    <Menu.Item key="sysconfig">
                        <Link to='/sysconfig'>系统设置</Link>
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
                <div className="ant-layout-breadcrumb">
                    <Link to='/'><Icon type="home" />首页 / </Link>{moduleName}
                </div>
                <div className="ant-layout-container">
                    <div className="ant-layout-content">
                        {routes}
                    </div>
                </div>
            </div>
        </div>
	}
}

export default Dashboard;
