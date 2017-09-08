import '../utils';
import 'antd/dist/antd.css';
import jsdom from 'jsdom';

if (typeof document === 'undefined') {
  document = jsdom.jsdom('<!doctype html><html><body></body></html>');
  window = document.defaultView;
  window.localStorage = window.localStorage || {};
  global.navigator = global.window.navigator;
  console.log(document, 'document');
}