/**
 * 模块配置主页面
 * 创建、修改、删除、查询模块配置，根据模块配置生成模块
 */
import React, { Component } from 'react'
import Popconfirm from 'antd/lib/popconfirm'
import Spin from 'antd/lib/spin'
import TableEx from '../../components/TableEx'
import Search from '../../components/Search'
import Modify from './modify'
import New from './new'
import * as Action from '../../action/moudleConfig'
import {configToColumn, configToItemProps} from '../../components/PageCreator'
import FieldsConfig from '../FieldsConfig'
let mainSearchFeilds = [];
let moreSearchFeilds = [];
/**
 * 页面字段配置
 */
const getConfig = () => {
    return [
        {"name":"模块名称","showName":"模块名称","dataIndex":"moduleName","isRequire": "1","isShow":"1","width":120,"dataType":"STRING","propValues":"","defaultValue":"","isQuery":"1","isSort":"1"},
        {"name":"生成菜单","showName":"生成菜单","dataIndex":"isMenu","isShow":"1","width":120,"dataType":"SELECT","propValues":"否/是","defaultValue":"是","isQuery":"1","isSort":"1"},
        {"name":"数据模型","showName":"数据模型","dataIndex":"dataMoudle","isRequire": "1","isShow":"1","width":80,"dataType":"SELECT","propValues":"线型/树形","defaultValue":"线形","isQuery":"1","isSort":"1"},
        {"name":"流程","showName":"流程","dataIndex":"hasProcess","isRequire": "1","isShow":"1","width":120,"dataType":"SELECT","propValues":"否/是","defaultValue":"否","isQuery":"1","isSort":"1"},
        {"name":"附件","showName":"附件","dataIndex":"hasFile","isRequire": "0","isShow":"0","width":120,"dataType":"SELECT","propValues":"否/是","defaultValue":"否","isQuery":"1","isSort":"1"},
        {"name":"描述","showName":"描述","dataIndex":"descripe","isRequire": "0","isShow":"1","width":120,"dataType":"STRING","propValues":"","defaultValue":"","isQuery":"1","isSort":"1"},
        {"name":"创建时间","showName":"创建时间","dataIndex":"createdAt","isRequire": "0","isShow":"1","width":120,"dataType":"TIME","propValues":"","defaultValue":"","isQuery":"1","isSort":"1"},
        {"name":"修改时间","showName":"修改时间","dataIndex":"modifiedAt","isRequire": "0","isShow":"1","width":120,"dataType":"TIME","propValues":"","defaultValue":"","isQuery":"1","isSort":"1"},
    ];
}
class List extends Component {
    /**
     * 使用全局变量保存页面状态
     */
    constructor() {
        super();
        global.MoudleConfig = global.MoudleConfig || {};
        this.state = {
            searchFields: global.MoudleConfig.searchFields || {},
            showMore: global.MoudleConfig.showMore || false,
            page: global.MoudleConfig.page || 1,
            pageSize: global.MoudleConfig.pageSize || 10,
            list: global.MoudleConfig.list || [],
            totalElements: global.MoudleConfig.totalElements || 0,
            tableConfig: global.MoudleConfig.tableConfig || [],
            sorter: global.MoudleConfig.sorter || {},
            loading: global.MoudleConfig.loading || false,
            query: global.MoudleConfig.query || {},
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
     * 获取列表（分页）
     * @param {*} page          当前页
     * @param {*} pageSize      分页条数
     * @param {*} query         查询条件
     * @param {*} sorter        排序条件
     */
    getList(page, pageSize, query, sorter) {
        global.storeData(this, 'MoudleConfig', {loading: true})
        Action.getList(page, pageSize, query, sorter, (body) => {
            if (body === {}) {
                return;
            }
            const {list, totalElements} = body;
            global.storeData(this, 'MoudleConfig', {
                page, pageSize, query, sorter, list, totalElements, loading: false
            });
        });
    }

    /**
     * 清空搜索条件
     */
    resetSearch() {
        global.storeData(this, 'MoudleConfig', { searchFields: {}, query: {}});
    }

    /**
     * 显示更多搜索条件
     */
    handleMore() {
        global.storeData(this, 'MoudleConfig', {showMore: !this.state.showMore});
    }

    /**
     * 搜索按钮响应函数
     * @param {*} query 
     * @param {*} searchFields 
     */
    onSearch(query, searchFields) {
        global.storeData(this, 'MoudleConfig', {searchFields: searchFields });
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
    del(_id) {
        global.storeData(this, 'MoudleConfig', {loading: true});
        Action.del(_id, () => {
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
        let tableConfig = getConfig();
        let {searchFields, showMore, list, totalElements, page, pageSize} = this.state;
        let scrollx = 0;
        let columns = [];
        let searchFormFields = [];
        tableConfig.forEach(config => {
            if (config.isShow === '1') {
                if (config.isQuery === '1') {
                    searchFormFields.push(configToItemProps(config, null, searchFields[config.dataIndex], null, true));
                }
                scrollx += config.width;
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
            dataIndex: '_id',
            key: 'operation',
            width: 160,
            render: (text, record) => {
                let split = <span className="ant-divider"/>
                let del = <Popconfirm title="确定要删除这条数据吗？" onConfirm={this.del.bind(this, text)}>
                    <a>删除</a>
                </Popconfirm>
                let edit = <Modify data={record} tableConfig={tableConfig} refresh={this.refresh.bind(this)}/>;
                let configField = <FieldsConfig data={record} refresh={this.refresh.bind(this)}/>
                return <span>{edit}{split}{configField}{split}{del}</span>;
            }
        })

        mainSearchFeilds = [];
        moreSearchFeilds = [];
        searchFormFields.forEach(field => {
            if (['moduleName'].indexOf(field.id) !== -1) {
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
                placeholder='请输入模块名称'
                searchFields={searchFields}
                showMore={showMore}
                btnName='搜索'
                simpleText='精简搜素条件'
                moreText='更多搜索条件'
            />
            <New tableConfig={tableConfig} refresh={this.refresh.bind(this)}/>
            <TableEx
                scroll={{ x: scrollx }}
                columns={columns}
                dataSource={list}
                onChange={this.handleTableChange.bind(this)}
                rowKey={record => record._id}
                pagination={pagination}
            />
        </Spin>
    }
}
export default List