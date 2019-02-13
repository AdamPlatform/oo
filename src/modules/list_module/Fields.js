/**
 * 字段排布，新增、修改、详情公用部分
 */
import React, { Component } from 'react'
import Form from 'antd/lib/form'
import {createItems, configToItemProps} from '../../components/PageCreator'

class Fields extends Component {
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
            if (config.isShow === '1' && [`${this.props.tableName}_createdAt`, `${this.props.tableName}_modifiedAt`].indexOf(config.dataIndex) === -1) {
                formFields.push(configToItemProps(config, null, data[config.dataIndex]));
                
            }
        });

        let formItems = createItems(getFieldDecorator, this.props.cols, 8, formFields, this.props.action === 'detail');
        
        return <div>
            <h2 style={{marginTop: 16}}>基本信息</h2>
            {formItems}
        </div>
    }
}
export default Form.create()(Fields)