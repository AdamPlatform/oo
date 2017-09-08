import React, {Component} from 'react';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      page: <div/>,
      login: false,
    }
  }
  componentWillMount() {
    if (typeof require.ensure !== `function`) {
      require.ensure = (d, c) => c(require);
    } 
    const matchPath = (urlPath, pageName) => {
      let pathname = window.location.pathname;
      if (pathname.indexOf(urlPath) !== -1) {
          const Page = require('./pages/' + pageName + '.js').default;
          this.setState({page: <Page/>});
        return true;
      }
      return false;
    }
    const {getCookie} = require('./utils/cookie');
    let token = getCookie('token');
    let id = getCookie('id');
    let entid = getCookie('entid');
    if (!(token && token !== 'null' && id && id !== 'null' && entid && entid !== 'null')) {
      /**
       * 如果未登录，跳转到登录页面
       */
      this.setState({login: true});
    } else {
      const Route = require('./Route');
      let foundPage = false;
      for (let key in Route) {
        let pageName = Route[key]; 
        if (matchPath(key, pageName)) {
          foundPage = true;
          break;
        }
      }
      if (!foundPage) {
        /**
         * 未定义路径
         */
        require.ensure([], (require) => {
          const Notfound = require('./components/notfound').default;
          this.setState({page: <Notfound/>});
        }, 'notfound');
      }
    }
  }
  render() {
    const Login = require('./components/Login').default;
    return <div>
      {this.state.page}
      {this.state.login && <Login/>}
    </div>
  }
}