/**
 * 模块管理接口
 */
import api from '../../utils/api';
/**
 * 查询
 * @param {*} searchFields 
 * @param {*} mainSearchFeilds 
 * @param {*} moreSearchFeilds 
 */
export function getList(tableName, page, pageSize, query, sorter, cb) {
    let data = { page, pageSize, query, sorter }
    api.put(`/${tableName}/list`, { data }).then(payload => {
        cb && cb(payload.body || {});
    }, () => {
        cb && cb({});
    })
}

/**
 * 删除
 * @param {} _id 
 */
export function del(tableName, _id, cb) {
    api.del(`/${tableName}`, {
        params: { _id }
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 新增
 */
export function add(tableName, record, cb) {
    api.post(`/${tableName}`, {
        data: record
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 获取一条表格配置
 * @param {*} _id 
 * @param {*} cb 
 */
export function getOne(tableName, _id, cb) {
    api.get(`/${tableName}`, {
        params: { _id }
    }).then(payload => {
        cb && cb(payload.body || {});
    }, () => {
        cb && cb({});
    })
}

/**
 * 修改
 */
export function modify(tableName, _id, record, cb) {
    api.put(`/${tableName}`, {
        params: { _id },
        data: record
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}