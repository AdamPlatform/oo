/**
 * 模块管理接口
 */
import api from '../utils/api';
/**
 * 查询
 * @param {*} searchFields 
 * @param {*} mainSearchFeilds 
 * @param {*} moreSearchFeilds 
 */
export function getList(page, pageSize, query, sorter, cb) {
    let cond = { page, pageSize, query, sorter }
    api.put('/table_list', {
        data : cond
    }).then(payload => {
        cb && cb(payload.body || {});
    }, () => {
        cb && cb({});
    })
}

/**
 * 删除
 * @param {} _id 
 */
export function del(_id, cb) {
    api.del('/table', {
        params: {
            _id: _id
        }
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 新增
 */
export function add(record, cb) {
    api.post('/table', {
        data: record
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 修改
 */
export function modify(_id, record, cb) {
    api.put('/table', {
        params: {
            _id: _id
        },
        data: record
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}