
import React, {Component} from 'react';
import api from '../utils/api'
export default class Page extends Component {
    componentWillMount() {
        api.get('/table').then(payload => {
            console.log(payload, 'payload');
        }, error => {
            console.log(error, 'error')
        })
    }
    render() {
        return <div>
            <h3>通用页面</h3>
        </div>
    }
}