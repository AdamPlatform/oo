import api from '../api';
export async function getSysConfig (propKey) {
    let res = await api.get('/encoder/configinfos/datas/foruse', {
        params: {
            propKey: propKey
        }
    });
    if (res.status !== 200) {
        const Modal = require('antd/lib/modal');
        Modal.warning({
            title: '获取配置项[' + propKey + ']错误',
            content: res.body.message,
        });
    }
    return res.body;
}