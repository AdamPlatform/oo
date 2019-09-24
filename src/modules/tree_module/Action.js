/**
 * 模块管理接口
 */
import api from '../../utils/api';
/**
 * 查询
 */
export function getTree(moduleName, cb) {
    api.put(`/${moduleName}/tree`).then(payload => {
        cb && cb(payload.body || []);
    }, () => {
        cb && cb({});
    })
}

/**
 * 删除
 * @param {} id 
 */
export function del(moduleName, id, cb) {
    api.del(`/${moduleName}`, {
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
export function add(moduleName, pid, record, cb) {
    api.post(`/${moduleName}`, {
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
export function getOne(moduleName, id, cb) {
    api.get(`/${moduleName}`, {
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
export function modify(moduleName, id, record, cb) {
    api.put(`/${moduleName}`, {
        params: { id },
        data: record
    }).then(payload => {
        cb && cb(payload.body);
    }, () => {
        cb && cb();
    })
}