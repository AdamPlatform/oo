/**
 * 生成Mongodb查询条件
 * query{
 *   searchFields {Object} 查询条件值对象
 *   mainFeilds {Array<Object>} 精简查询条件
 *   moreFeilds {Array<Object>} 更多查询条件
 * }
 */
module.exports = {
    generateSql: (options) => {
        options = options || {};
        let {searchFields, mainFeilds, moreFeilds} = options;
        fieldsValue = searchFields || {};
        mainSearchFeilds = mainFeilds || [];
        moreSearchFeilds = moreFeilds || [];
        let andQuery = {$and: []}
        let orArr = [];
        // 生成精简查询, 用or连接
        if (fieldsValue.mainKey && fieldsValue.mainKey !== '') {
            for (let field of mainSearchFeilds || []) {
                let dataType = field.dataType;
                if (['STRING', 'TEXT'].indexOf(dataType) !== -1) {
                    orArr.push({[field.id]: {'$regex': fieldsValue.mainKey}});
                }
            }
        }
        if (orArr.length > 0) {
            andQuery.$and.push({$or: orArr});
        }
        
        let query = {};
        // 生成更多查询条件sql 用and连接
        for (let field of moreSearchFeilds || []) {
            let dataType = field.dataType;
            let value = fieldsValue[field.id];
            let key = field.id;
            if (value === undefined || value === null) {
                continue;
            }
            if (typeof value === 'string') {
                value = value.trim();
                if (value === '') {
                    continue;
                }
            }
            if (-1 !== ['NUMBER', 'MONEY'].indexOf(dataType)) {
                if (value.length !== 2) {
                    continue;
                }
                let start = value[0];
                let end = value[1];
                let obj = {}
                if (start !== null || start !== undefined || start !== '') {
                    obj['$gte'] = start;
                }
                if (end !== null || end !== undefined || end !== '') {
                    obj['$lte'] = end;
                }
                query[key] = obj;
            } else if (dataType === 'DATE') {
                if (value.length !== 2) {
                    continue;
                }
                let start = value[0];
                let end = value[1];
                let obj = {}
                if (start) {
                    let date = new Date(start);
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    obj['$gte'] = date;
                }
                if (end) {
                    let date = new Date(end);
                    date.setHours(23);
                    date.setMinutes(59);
                    date.setSeconds(59);
                    obj['$lte'] = date;
                }
                if (start || end) {
                    query[key] = obj;
                }
            } else if (dataType === 'TIME') {
                if (value.length !== 2) {
                    continue;
                }
                let start = value[0];
                let end = value[1];
                let obj = {}
                if (start) {
                    obj['$gte'] = new Date(start);
                }
                if (end) {
                    obj['$lte'] = new Date(end);
                }
                if (start || end) {
                    query[key] = obj;
                }
            } else {
                query[key] = {'$regex': value}
            }
        }
        if (query !== {}) {
            andQuery.$and.push(query);
        }
        if (andQuery.$and.length === 0) {
            andQuery = {};
        }
        return andQuery;
    }
}
