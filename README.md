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

### node
mongodb+srv://root:root:123456gqh@cluster0-bq95b.mongodb.net/test?retryWrites=true

mongodb://root:root:123456gqh@cluster0-shard-00-00-bq95b.mongodb.net:27017,cluster0-shard-00-01-bq95b.mongodb.net:27017,cluster0-shard-00-02-bq95b.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true

### shell
mongo "mongodb+srv://cluster0-bq95b.mongodb.net/test" --username root

mongo "mongodb://cluster0-shard-00-00-bq95b.mongodb.net:27017,cluster0-shard-00-01-bq95b.mongodb.net:27017,cluster0-shard-00-02-bq95b.mongodb.net:27017/test?replicaSet=Cluster0-shard-0" --ssl --authenticationDatabase admin --username root --password <PASSWORD>
