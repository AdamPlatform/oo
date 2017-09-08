import superagent from 'superagent';
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
        let pathArray = path.split('/')
        
        let entid = global.entid && global.entid != null &&  global.entid !== 'null'? '/' + global.entid : ''
        if (pathArray[1] === 'personal' || pathArray[1] === 'enterprise') {
          entid = ''
        }
        let url = this.opts.baseURI + entid + path;

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
          err ? reject({ body: res&&res.body, status: res&&res.status, error: err }) 
          : resolve({ body: res.body, status: res.status })}
        );
      })
    );
  }
}

const Api = _Api;

export default Api;
