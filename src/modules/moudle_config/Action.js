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
 * @param {} id 
 */
export function del(id, cb) {
    api.del('/table', {
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
 * @param {*} id 
 * @param {*} cb 
 */
export function getOne(id, cb) {
    api.get('/table', {
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
export function modify(id, record, cb) {
    api.put('/table', {
        params: { id },
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
export function addField(id, num, cb) {
    api.post('/table_field', {
        params: { id, num },
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 删除一个配置字段
 */
export function delOneField(id, dataIndex, cb) {
    api.del('/table_field', {
        params: { id, dataIndex },
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 修改一个配置字段
 */
export function modifyOneField(id, record, cb) {
    api.put('/table_field', {
        params: { id, record },
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 上移一个配置字段
 */
export function fieldUp(id, dataIndex, cb) {
    api.put('/table_field/up', {
        params: { id, dataIndex },
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 下移一个配置字段
 */
export function fieldDown(id, dataIndex, cb) {
    api.put('/table_field/down', {
        params: { id, dataIndex },
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 上移一个配置字段到顶部
 */
export function fieldUpToTop(id, dataIndex, cb) {
    api.put('/table_field/up_top', {
        params: { id, dataIndex },
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 下移一个配置字段到底部
 */
export function fieldDownToBottom(id, dataIndex, cb) {
    api.put('/table_field/down_bottom', {
        params: { id, dataIndex },
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}

/**
 * 插入一个字段
 */
export function insertField(id, dataIndex, cb) {
    api.put('/table_field/insert', {
        params: { id, dataIndex },
    }).then(payload => {
        cb && cb();
    }, () => {
        cb && cb();
    })
}
