import React, { Component } from 'react'
import Menu from 'antd/lib/menu'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Icon from 'antd/lib/icon'
import MoudleConfig from './modules/moudle_config/List'

class App extends Component {
	constructor() {
		super();
		this.state = {
			update: false,
			folded: false,
			page: null,
		};
		global.cols = this.getCols();
	}

	componentWillMount() {
		window.addEventListener('resize', this.onWindowResize.bind(this));
		
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
		return (
			<div>
				<aside className="ant-layout-sider" style={this.state.folded ? foldedstyle : {}}>
					<Menu mode={mode} selectedKeys={[]}>
						<Menu.Item key="sysconfig">
							<a onClick={() => {this.setState({page: <MoudleConfig/>})}}>系统设置</a>
						</Menu.Item>
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
						{this.state.page || <MoudleConfig/>}
					</div>
				</div>
			</div>
		);
	}
}

export default App;
