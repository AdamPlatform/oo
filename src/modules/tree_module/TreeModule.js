/**
 * 模块配置主页面
 * 创建、修改、删除、查询模块配置，根据模块配置生成模块
 */
import React, { Component } from 'react'
import Popconfirm from 'antd/lib/popconfirm'
import Spin from 'antd/lib/spin'
import TableEx from '../../components/TableEx'
import Search from '../../components/Search'
import Detail from './Detail'
import Modify from './Modify'
import New from './New'
import * as Action from './Action'
import {configToColumn, configToItemProps} from '../../components/PageCreator'
let mainSearchFeilds = [];
let moreSearchFeilds = [];

class TreeModule extends Component {
    /**
     * 使用全局变量保存页面状态
     */
    constructor(props) {
        super();
        this.tableName = props.config.tableName;
        global[this.tableName] = global[this.tableName] || {};
        this.state = {
            searchFields: global[this.tableName].searchFields || {},
            showMore: global[this.tableName].showMore || false,
            page: global[this.tableName].page || 1,
            pageSize: global[this.tableName].pageSize || 10,
            list: global[this.tableName].list || [],
            totalElements: global[this.tableName].totalElements || 0,
            tableConfig: global[this.tableName].tableConfig || [],
            sorter: global[this.tableName].sorter || {},
            loading: global[this.tableName].loading || false,
            query: global[this.tableName].query || {},
        };
    }

    /**
     * componentDidMount 页面加载完成后获取数据
     */
    componentDidMount() {
        const {page, pageSize, query, sorter} = this.state;
        this.getList(page, pageSize, query, sorter);
    }

    /**
     * componentWillReceiveProps 页面获取新的props
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.config !== this.props.config) {
            this.tableName = nextProps.config.tableName;
            this.refresh();
        }
    }

    /**
     * 获取列表（分页）
     * @param {*} page          当前页
     * @param {*} pageSize      分页条数
     * @param {*} query         查询条件
     * @param {*} sorter        排序条件
     */
    getList(page, pageSize, query, sorter) {
        global.storeData(this, this.tableName, {loading: true})
        Action.getList(this.tableName, page, pageSize, query, sorter, (body) => {
            if (body === {}) {
                return;
            }
            const {list, totalElements} = body;
            global.storeData(this, this.tableName, {
                page, pageSize, query, sorter, list, totalElements, loading: false
            });
        });
    }

    /**
     * 清空搜索条件
     */
    resetSearch() {
        global.storeData(this, this.tableName, { searchFields: {}, query: {}});
    }

    /**
     * 显示更多搜索条件
     */
    handleMore() {
        global.storeData(this, this.tableName, {showMore: !this.state.showMore});
    }

    /**
     * 搜索按钮响应函数
     * @param {*} query 
     * @param {*} searchFields 
     */
    onSearch(query, searchFields) {
        global.storeData(this, this.tableName, {searchFields: searchFields });
        const {pageSize, sorter} = this.state;
        this.getList(1, pageSize, query, sorter);
    }

    /**
     * 表格发生变化回调函数
     * @param {*} pagination    分页信息
     * @param {*} filters       过滤条件
     * @param {*} sorter        排序信息
     */
    handleTableChange(pagination, filters, sorter) {
		let page = pagination.current;
		let pageSize = pagination.pageSize;
		if (pageSize !== this.state.pageSize) {
			page = 1;
		}
        if (sorter.field !== this.state.sorter.field || sorter.order !== this.state.sorter.order) {
			page = 1;		
        }
        const {query} = this.state;
        this.getList(page, pageSize, query, sorter);
    }

    /**
     * 删除操作
     */
    del(id) {
        global.storeData(this, this.tableName, {loading: true});
        Action.del(this.tableName, id, () => {
            this.refresh();
        });
    }

    /**
     * 刷新页面
     * @param {*} body 
     */
    refresh(body) {
        const {page, pageSize, query, sorter} = this.state;
        this.getList((body && body.page) || page, pageSize, query, sorter);
    }

    /**
     * 页面渲染
     */
    render () {
        let tableConfig = this.props.config.fields_config || [];
        let {searchFields, showMore, list, totalElements, page, pageSize} = this.state;
        let scrollx = 0;
        let columns = [];
        let searchFormFields = [];
        tableConfig.forEach(config => {
            if (config.isShow === '1') {
                if (config.isQuery === '1') {
                    searchFormFields.push(configToItemProps(config, null, searchFields[config.dataIndex], null, true));
                }
                scrollx += parseInt(config.width, 10);
                columns.push(configToColumn(config));
            }
        });
        columns.unshift({
            title: '序号',
            key: 'index',
            width: 60,
            fixed: 'left',
            render: (text, record, index) => {
                let ret = index + 1 + (page - 1) * pageSize;
                return ret;
            }
        });
        columns.push({
            title: '操作',
            dataIndex: `${this.tableName}_id`,
            key: 'operation',
            width: 200,
            fixed: 'right',
            render: (text, record) => {
                let split = <span className="ant-divider"/>
                let del = <Popconfirm title="确定要删除这条数据吗？" onConfirm={this.del.bind(this, text)}>
                    <a>删除</a>
                </Popconfirm>
                let detail = <Detail tableName={this.tableName} data={record} tableConfig={tableConfig}/>;
                let edit = <Modify tableName={this.tableName} data={record} tableConfig={tableConfig} refresh={this.refresh.bind(this)}/>;
                return <span>{detail}{split}{edit}{split}{del}</span>;
            }
        });

        // 如果表格宽度小于正文宽度，去掉固定列设置
        if (scrollx + 224 < global.clientWidth) {
            columns.forEach(col => {
                if (col.fixed) {
                    delete col.fixed;
                }
            })
        }

        mainSearchFeilds = [];
        moreSearchFeilds = [];
        searchFormFields.forEach(field => {
            if ([`${this.tableName}_name`, `${this.tableName}_code`].indexOf(field.id) !== -1) {
                mainSearchFeilds.push(field);
            } else {
                moreSearchFeilds.push(field);
            }
        });
        let pagination = {};
        pagination.showSizeChanger = true;
        pagination.showQuickJumper = true;
        pagination.showTotal = () => `共${totalElements}条`;
        pagination.current = page;
        pagination.pageSize = pageSize;
        pagination.pageSizeOptions = ['10', '20', '50', '100', '200', '500', '1000'];
        pagination.total = totalElements;
        return <Spin style={{margin: 8}} spinning={this.state.loading}>
            <Search
                mainSearchFeilds={mainSearchFeilds}
                cols={global.cols}
                moreSearchFeilds={moreSearchFeilds}
                handleMore={this.handleMore.bind(this)}
                onSearch={this.onSearch.bind(this)}
                resetSearch={this.resetSearch.bind(this)}
                placeholder='请输入名称或编码'
                searchFields={searchFields}
                showMore={showMore}
                btnName='搜索'
                simpleText='精简搜素条件'
                moreText='更多搜索条件'
            />
            <New tableName={this.tableName} tableConfig={tableConfig} refresh={this.refresh.bind(this)}/>
            <TableEx
                scroll={{ x: scrollx }}
                columns={columns}
                dataSource={list}
                onChange={this.handleTableChange.bind(this)}
                rowKey={record => record[`${this.tableName}_id`]}
                pagination={pagination}
            />
        </Spin>
    }
}
export default TreeModule