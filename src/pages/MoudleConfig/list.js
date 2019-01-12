import React, { Component } from 'react'
import Popconfirm from 'antd/lib/popconfirm'
import Spin from 'antd/lib/spin'
import TableEx from '../../components/TableEx'
import Search from '../../components/Search'
import Modify from './modify'
import New from './new'
import * as Action from '../../action/moudleConfig'
import {configToColumn, configToItemProps} from '../../components/PageCreator'
let mainSearchFeilds = [];
let moreSearchFeilds = [];
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

    componentDidMount() {
        const {page, pageSize, query, sorter} = this.state;
        this.getList(page, pageSize, query, sorter);
    }

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

    resetSearch() {
        global.storeData(this, 'MoudleConfig', { searchFields: {}, query: {}});
    }

    handleMore() {
        global.storeData(this, 'MoudleConfig', {showMore: !this.state.showMore});
    }

    onSearch(query, searchFields) {
        global.storeData(this, 'MoudleConfig', {searchFields: searchFields });
        const {pageSize, sorter} = this.state;
        this.getList(1, pageSize, query, sorter);
    }

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
    del(_id) {
        global.storeData(this, 'MoudleConfig', {loading: true});
        Action.del(_id, () => {
            this.refresh();
        });
    }

    refresh() {
        const {page, pageSize, query, sorter} = this.state;
        this.getList(page, pageSize, query, sorter);
    }
    onConfigField(record) {
        
    }
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
            width: 220,
            render: (text, record) => {
                let split = <span className="ant-divider"/>
                let del = <Popconfirm title="确定要删除这条数据吗？" onConfirm={this.del.bind(this, text)}>
                    <a>删除</a>
                </Popconfirm>
                let edit = <Modify data={record} tableConfig={tableConfig} refresh={this.refresh.bind(this)}/>;
                let configField = <a onClick={this.onConfigField.bind(this, record)}>配置字段</a>
                return <span>{edit}{split}{configField}{split}{del}</span>;
            }
        })
        scrollx += 280;
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
        pagination.pageSizeOptions = ['10', '20', '50', '100'];
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