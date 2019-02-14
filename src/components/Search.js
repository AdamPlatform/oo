/**
 * 搜索通用组件
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {createItems} from './PageCreator'
import Icon from 'antd/lib/icon'
import Button from 'antd/lib/button'
import Input from 'antd/lib/input'
import Form from 'antd/lib/form'
const ButtonGroup = Button.Group;
class Search extends Component {
    /**
     * 搜索按钮回调函数
     */
    onSearch() {
        const {mainSearchFeilds, moreSearchFeilds} = this.props;
        let searchFields = this.props.form.getFieldsValue();
        for (let key in searchFields) {
            if (typeof searchFields[key] === 'string') {
                searchFields[key] = searchFields[key].trim();
            }
        }
        let mainFeilds = (mainSearchFeilds || []).map(item => {
            const {id, dataType} = item;
            return {id, dataType};
        })
        let moreFeilds = (moreSearchFeilds || []).map(item => {
            const {id, dataType} = item;
            return {id, dataType};
        })
        this.props.onSearch && this.props.onSearch({searchFields, mainFeilds, moreFeilds}, searchFields);
    }

    /**
     * 回车键响应函数
     * @param {*} e 
     */
    keyPress(e) {
        if (e.keyCode === 13) {
            this.onSearch();
        }
    }

    /**
     * 重置搜索条件
     */
    resetSearch() {
        this.props.form.resetFields();
        let dateFields = {};
        let moreSearchFeilds = this.props.moreSearchFeilds || [];
        for (let field of moreSearchFeilds) {
            if (['DATE', 'TIME'].indexOf(field.dataType) !== -1) {
                dateFields[field.id] = [undefined, undefined];
            }
        }
        this.props.form.setFieldsValue(dateFields);
        this.props.resetSearch && this.props.resetSearch();
    }

    /**
     * 更多查询条件
     */
    handleMore() {
        this.props.handleMore && this.props.handleMore();
    }

    /**
     * 页面渲染
     */
    render() {
        const {getFieldDecorator} = this.props.form;
        // 从更多查询条件中剔除精简查询条件及Tabs
        let {cols, gutter, moreSearchFeilds} = this.props;
        moreSearchFeilds = moreSearchFeilds || [];
        moreSearchFeilds.map(field => field.param.props.onKeyDown = this.keyPress.bind(this));
        let searchItems = createItems(getFieldDecorator, cols, gutter || 8, moreSearchFeilds, false, true);
        let arrow = <Icon type="caret-down"/>;
        if (this.props.showMore) {
            arrow = <Icon type="caret-up"/>;
        }
        const searchFields = this.props.searchFields || {}
        
        return <div style={{ marginBottom: 8 }}>
            <nobr>
                <span>
                {getFieldDecorator('mainKey', {initialValue: searchFields.mainKey})(
                    <Input style={{width: 200}} placeholder={this.props.placeholder || "请输入"} onKeyDown={this.keyPress.bind(this)}/>
                )}
                </span>
                <span>
                    <ButtonGroup>
                        <Button type="primary" style={{marginLeft: 8}} onClick={this.onSearch.bind(this)}>
                            <Icon type="search"/>{this.props.btnName || '搜索'}
                        </Button>
                        <Button type="primary" onClick={this.handleMore.bind(this)}>{arrow}</Button>
                    </ButtonGroup>
                    <Button type="ghost" style={{marginLeft: 8}} onClick={this.resetSearch.bind(this)}><Icon type="reload"/>重置</Button>
                </span>
            </nobr>
            {this.props.showMore && searchItems}
        </div>
    }
}

Search.propTypes = {
    mainSearchFeilds: PropTypes.array,
    cols: PropTypes.number, 
    gutter: PropTypes.number, 
    moreSearchFeilds: PropTypes.array,
    handleMore: PropTypes.func,
    onSearch: PropTypes.func,
    resetSearch: PropTypes.func,
    placeholder: PropTypes.string,
    searchFields: PropTypes.object,
    showMore: PropTypes.bool,
    btnName: PropTypes.string,
    simpleText: PropTypes.string,
    moreText: PropTypes.string,
    simple: PropTypes.bool,
};
export default Form.create()(Search)