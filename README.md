## oo系统介绍
oo系统是一个可以按照用户自己需求来定制的一个软件系统，该软件由平台级的服务来管理企业或个人的登陆管理。
## 软件概要设计
* 登陆模块（平台级）
* 配置模块（平台级和用户级）
* 人员管理模块（用户级）
* 权限管理（用户级）
* 编码管理模块（平台级和用户级）
* 系统配置模块（平台级和用户级）
* 动态生成的模块（用户级）
## 软件的详细设计
* 登录模块

  软件采用mongoDB做服务，平台级的数据库专门用来管理所有用户的登陆，登陆成功后，用户会跳转到自己的数据库中，来生成自己的系统。登陆模块代码中有一个固定的数据库URL，已经经过多重算法的加密，所以是比较安全的。

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
$ set OO_VERNO=版本号
$ npm run build | yarn build
```
## 本地服务发布
```shell
npm run build | yarn build
npm run serve | yarn serve
```

### node
mongodb+srv://root:root:123456gqh@cluster0-bq95b.mongodb.net/test?retryWrites=true

mongodb://root:root:123456gqh@cluster0-shard-00-00-bq95b.mongodb.net:27017,cluster0-shard-00-01-bq95b.mongodb.net:27017,cluster0-shard-00-02-bq95b.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true

### shell
mongo "mongodb+srv://cluster0-bq95b.mongodb.net/test" --username root

mongo "mongodb://cluster0-shard-00-00-bq95b.mongodb.net:27017,cluster0-shard-00-01-bq95b.mongodb.net:27017,cluster0-shard-00-02-bq95b.mongodb.net:27017/test?replicaSet=Cluster0-shard-0" --ssl --authenticationDatabase admin --username root --password <PASSWORD>
