import api from '../utils/api';
/**
 * 查询
 * @param {*} searchFields 
 * @param {*} mainSearchFeilds 
 * @param {*} moreSearchFeilds 
 */
export function getList(searchFields, mainSearchFeilds, moreSearchFeilds, cb) {
    api.get('/table').then(payload => {
        console.log(payload, 'payload--------');
        cb && cb(payload.body || []);
    }, error => {

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
    }, error => {

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
    }, error => {

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
    }, error => {

    })
}