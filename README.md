## NOMES前端界面

## 关键技术

- [React](https://facebook.github.io/react/)
- [Ant.Design](http://ant.design/)
- [Babel](https://babeljs.io/)
- [webpack](https://webpack.github.io/)

## 目录结构


## 环境搭建

下载代码并执行下列命令:

```shell
$ git 
$ cd oo
$ npm install | yarn install
$ npm start | yarn start
```

## 单元测试

```shell
$ npm run test | yarn test
```

## 编译打包

```shell
$ set NOMES_VERNO=版本号
$ npm run build | yarn build
```
## 本地服务发布
```shell
npm run build | yarn build
npm run serve | yarn serve
```

## 开发者
### 1. 所有页面组件都统一放在目录 ./src/pages 下
### 2. 在./src/Route.js 中添加url 和页面名对应关系
### 3. 使用antd组件请参考 ./antd.md 
### 4. 使用静态资源时请使用相对路径


## 注意 
### 1. 所有使用JSX语法的文件都要 import React from 'react';
### 2. 尽量少使用全局变量
### 3. 请不要忽略警告，严格修改警告的问题

