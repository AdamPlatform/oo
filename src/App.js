import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Dashboard from './modules/layout/Dashboard'
class App extends Component {
	render() {
		return <BrowserRouter>
			<Route path='/' component={Dashboard}/>
		</BrowserRouter>
	}
}

export default App;
