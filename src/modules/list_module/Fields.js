/**
 * 字段排布，新增、修改、详情公用部分
 */
import React, { Component } from 'react'
import Form from 'antd/lib/form'
import {createItems, configToItemProps} from '../../components/PageCreator'

class Fields extends Component {
    /**
     * 构造函数
     */
    constructor(props) {
        super();
        this.moduleName = props.moduleName;
    }
    /**
     * 页面渲染
     */
    render() {
        let data = this.props.data || {}
        const {getFieldDecorator} = this.props.form;
        /**
         * 基本信息处理
         */
        let tableConfig = this.props.tableConfig || [];
        let formFields = [];
        tableConfig.forEach(config => {
            if (config.isShow === '1' && [`创建时间`, `修改时间`].indexOf(config.name) === -1) {
                config.dataIndex = `${this.moduleName}_${config.name}`;
                formFields.push(configToItemProps(config, null, data[`${this.moduleName}_${config.name}`]));
            }
        });

        let formItems = createItems(getFieldDecorator, this.props.cols, 8, formFields, this.props.action === 'detail');
        
        return <div>
            {formItems}
        </div>
    }
}
export default Form.create()(Fields)