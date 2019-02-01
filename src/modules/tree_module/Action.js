/**
 * 模块管理接口
 */
import api from '../../utils/api';
/**
 * 查询
 */
export function getTree(tableName, cb) {
    api.put(`/${tableName}/tree`).then(payload => {
        cb && cb(payload.body || []);
    }, () => {
        cb && cb({});
    })
}

/**
 * 删除
 * @param {} id 
 */
export function del(tableName, id, cb) {
    api.del(`/${tableName}`, {
        params: { id }
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 新增
 */
export function add(tableName, pid, record, cb) {
    api.post(`/${tableName}`, {
        params: {pid},
        data: record
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 获取一条表格配置
 * @param {*} id 
 * @param {*} cb 
 */
export function getOne(tableName, id, cb) {
    api.get(`/${tableName}`, {
        params: { id }
    }).then(payload => {
        cb && cb(payload.body || {});
    }, () => {
        cb && cb({});
    })
}

/**
 * 修改
 */
export function modify(tableName, id, record, cb) {
    api.put(`/${tableName}`, {
        params: { id },
        data: record
    }).then(payload => {
        cb && cb(payload.body);
    }, () => {
        cb && cb();
    })
}