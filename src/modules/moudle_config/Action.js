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
export function getList(page, pageSize, query, sorter, cb) {
    let data = { page, pageSize, query, sorter }
    api.put('/table_list', { data }).then(payload => {
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
 * 获取一条表格配置
 * @param {*} _id 
 * @param {*} cb 
 */
export function getOne(_id, cb) {
    api.get('/table', {
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
export function modify(_id, record, cb) {
    api.put('/table', {
        params: { _id },
        data: record
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 新增配置字段
 */
export function addField(_id, num, cb) {
    api.post('/table_field', {
        params: { _id, num },
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 删除一个配置字段
 */
export function delOneField(_id, dataIndex, cb) {
    api.del('/table_field', {
        params: { _id, dataIndex },
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 修改一个配置字段
 */
export function modifyOneField(_id, record, cb) {
    api.put('/table_field', {
        params: { _id, record },
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 上移一个配置字段
 */
export function fieldUp(_id, dataIndex, cb) {
    api.put('/table_field/up', {
        params: { _id, dataIndex },
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 下移一个配置字段
 */
export function fieldDown(_id, dataIndex, cb) {
    api.put('/table_field/down', {
        params: { _id, dataIndex },
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 上移一个配置字段到顶部
 */
export function fieldUpToTop(_id, dataIndex, cb) {
    api.put('/table_field/up_top', {
        params: { _id, dataIndex },
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 下移一个配置字段到底部
 */
export function fieldDownToBottom(_id, dataIndex, cb) {
    api.put('/table_field/down_bottom', {
        params: { _id, dataIndex },
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

