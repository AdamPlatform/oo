/**
 * 根据系统配置生成模块接口（后端）
 */
module.exports = (app) => {
    let dbo = require('./dbo.js');
    let {connect} = require('../database');
    let listApi = (app, moduleNameUrlCode, moduleName) => {
        // 新增
        app.post(`/${moduleNameUrlCode}`, (req, res) => {
            dbo.add(req.body, moduleName).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            });
        });

        // 删除
        app.delete(`/${moduleNameUrlCode}`, (req, res) => {
            if (req.query == null || req.query.id == null) {
                res.status(400).send({message: 'id不能为空'});
                return;
            }
            dbo.delete(req.query.id, moduleName).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            })
        });

        // 更新
        app.put(`/${moduleNameUrlCode}`, (req, res) => {
            if (req.query == null || req.query.id == null) {
                res.status(400).send({message: 'id不能为空'});
                return;
            }
            dbo.update(req.query.id, req.body, moduleName).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            });
        });

        // 查询列表
        app.put(`/${moduleNameUrlCode}/list`, (req, res) => {
            dbo.getList(req.body, moduleName).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            });
        });

        // 查询单个
        app.get(`/${moduleNameUrlCode}`, (req, res) => {
            dbo.getOne(req.query.id, moduleName).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            });
        });

        // 导入数据
        app.post(`/${moduleNameUrlCode}/upload`, (req, res) => {
            try {
                let multiparty = require('multiparty');
                // console.log(req.files.file.name, req.files.file.path, req.files.file.type)
                let form = new multiparty.Form({uploadDir: './'});
                //let form = new multiparty.Form();
                //上传完成后处理
                form.parse(req, function(err, fields, files) {
                    let filesTmp = JSON.stringify(files,null,2);
                    if(err){
                        console.log('parse error: ' + err);
                    } else {
                        // console.log('parse files: ' + filesTmp);
                        let inputFile = files.file[0];
                        let uploadedPath = inputFile.path;
                        const xlsx = require('node-xlsx');
                        let excelData = [];
                        try {
                            excelData = xlsx.parse(uploadedPath);
                            const fs = require('fs-extra');
                            fs.remove(uploadedPath);
                        } catch (e) {
                            console.log(`/${moduleNameUrlCode}/upload` + e);
                            res.status(400).send({message: '不是正常的Excel文件'});
                            return;
                        }
                        let sheetData = [];
                        if (excelData && excelData.length > 0) {
                            sheetData = excelData[0].data || [];
                        }
                        if (sheetData && sheetData.length > 0) {
                            console.log('/upload moduleName', moduleName)
                            dbo.upload(sheetData, moduleName).then(data => {
                                res.send(data);
                            }, error => {
                                res.status(400).send(error);
                            });
                        } else {
                            res.status(400).send({message: 'Excel文件为空'});
                        }
                    }
                });
            } catch (e) {
                res.status(400).send({message: '接口异常'});
            }
        });
    };

    /***************************************************************************
     * 数据模型树操作
     ***************************************************************************/

    let treeApi = (app, moduleNameUrlCode, moduleName) => {
        // 新增
        app.post(`/${moduleNameUrlCode}`, (req, res) => {
            if (req.query == null || req.query.pid == null) {
                res.status(400).send({message: 'pid不能为空'});
                return;
            }
            dbo.addTreeNode(req.query.pid, req.body, moduleName).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            });
        });

        // 删除
        app.delete(`/${moduleNameUrlCode}`, (req, res) => {
            if (req.query == null || req.query.id == null) {
                res.status(400).send({message: 'id不能为空'});
                return;
            }
            dbo.deleteTreeNode(req.query.id, moduleName).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            })
        });

        // 更新
        app.put(`/${moduleNameUrlCode}`, (req, res) => {
            if (req.query == null || req.query.id == null) {
                res.status(400).send({message: 'id不能为空'});
                return;
            }
            dbo.update(req.query.id, req.body, moduleName).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            });
        });

        // 查询树
        app.put(`/${moduleNameUrlCode}/tree`, (req, res) => {
            dbo.getTree(moduleName).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            });
        });

        // 查询单个
        app.get(`/${moduleNameUrlCode}`, (req, res) => {
            dbo.getOne(req.query.id, moduleName).then(data => {
                res.send(data);
            }, error => {
                res.status(400).send(error);
            });
        });
    };
    connect(db => {
        let oo = db.db('oo');
        let collection = oo.collection("tables_config");
        collection.find({}).toArray().then(list => {
            list.forEach(moudleConfig => {
                let moduleName = moudleConfig['模块名称'];
                if (moudleConfig.dataMoudle === '树') {
                    treeApi(app, encodeURI(moduleName), moduleName)
                } else {
                    listApi(app, encodeURI(moduleName), moduleName)
                }
            })
        }); 
    });
};
