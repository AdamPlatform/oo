import superagent from 'superagent';
import { Modal } from 'antd';
const {getCookie} = require('../cookie');
const methods = [
  'get',
  'head',
  'post',
  'put',
  'del',
  'options',
  'patch'
];

class _Api {

  constructor(opts) {

    this.opts = opts || { headers: {} };

    if (!this.opts.baseURI)
      throw new Error('baseURI option is required');

    methods.forEach(method =>
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        let url = this.opts.baseURI + path;

        const request = superagent[method](url);

        if (params) {
          request.query(params);
        }
        this.opts.headers.token = getCookie('token') || '';
        if (this.opts.headers) {
          request.set(this.opts.headers);
        }

        if (data) {
          request.send(data);
        }
        request.end((err, res) => {
          if (err) {
            reject(res);
            console.log(err, res,'err, res');
            Modal.warning({
              title: '访问后端接口失败',
              content: res && res.body && res.body.message,
            });
          } else {
            resolve({ body: res.body, status: res.status })
          }
        });
      })
    );
  }
}

const Api = _Api;

export default Api;
