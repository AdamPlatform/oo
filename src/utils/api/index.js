import Api from './api';
const envObj = {
  development: 'http://localhost:32087',
  production: 'http://oo.com',
}
let evn = {};
let envName = process.env.NODE_ENV || 'development';
evn.baseURI = envObj[envName] || 'http://localhost:32087';

export const baseURI = evn.baseURI;
/**
 * json数据格式
 */
const api = new Api({
  baseURI: baseURI,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

export default api


