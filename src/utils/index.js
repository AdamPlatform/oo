/**
 * 全局变量和函数
 */
import moment from 'moment'
import './common/div2Excel'

/**
 * 网页宽度
 */
global.clientWidth = document.documentElement.clientWidth || document.body.clientWidth;

/**
 * 菜单宽度
 */
global.menuWidth = 220;

/**
 * 保留几位小数，默认6位，小数位数不够不补0
 */
global.toFixedEx = function (source, precision = 6) {
    let num = parseFloat(source);
    if (isNaN(num)) {
        return '';
    }
    return (parseInt(num * Math.pow(10, precision) + 0.5, 10) / Math.pow(10, precision)).toString();
};

/**
 * 保留几位小数，默认2位，小数位数不够补0
 */
global.toFixed = function (source, precision = 2) {
    let num = parseFloat(source);
    if (isNaN(num)) {
        return '';
    }
    return num.toFixed(precision);
};

/**
 * 浏览器地址栏携带参数解析
 */
global.parseSearchStr = () => {
    let search = window.location.search || '';
    search = decodeURI(search, "UTF-8");
    // 解析url携带参数
    let paramObj = search
        .substr(1, search.length - 1)
        .split('&')
        .reduce((obj, param) => {
            let index = param.indexOf('=');
            if (index !== -1) {
                let key = param.substr(0, index).trim();
                let value = param.substr(index + 1, param.length - index - 1).trim();
                obj[key] = value;
            }
            return obj;
        }, {});
    return paramObj;
};

/**
 * 将null或undefined转化为空字符串
 * @param {*} obj 
 */
global.n2s = (obj) => {
    if (obj === null || obj === undefined || obj === 'null') {
        return '';
    }
    return obj;
}
/**
 * 将文本或数字统一转换为数字
 * @param {*} obj 
 */
global.o2n = (obj) => {
    let num = parseFloat(obj);
    if (isNaN(num)) {
        num = 0;
    }
    return num;
}
/**
 * 将NaN、null、undefined转换为0
 * @param {*} obj 
 */
global.n2zero = (obj) => {
    if (obj === null || obj === undefined || isNaN(obj) || obj === 'null') {
        return 0;
    }
    return obj;
}

/**
 * js 数据判断严格相等
 */
global.equals = (a, b) => {
    if ((a instanceof Object) && (b instanceof Object)) {
        return Object.keys(a).reduce((ret, key) => {
            if (ret === false) {
                return false;
            }
            return global.equals(a[key], b[key]);
        }, true);
    } else {
        return a === b;
    }
}

/**
 * js 深拷贝
 */
global.copy = (a) => {
    if (a instanceof Array) {
        return a.map(item => global.copy(item));
    } else if (a instanceof Object) {
        return Object.keys(a).reduce((obj, key) => {
            obj[key] = global.copy(a[key])
            return obj;
        }, {});
    } else {
        return a;
    }
}

/**
 * 搜索树
 * treeData []
 */
global.searchTree = (text, treeData, key) => {
    let res = [];
    for (let item of treeData) {
        let { children, ...restProps } = item;
        if (children && children.length > 0) {
            restProps.children = global.searchTree(text, children, key);
        }
        if (item[key].indexOf(text) !== -1 || (restProps.children && restProps.children.length > 0)) {
            res.push(restProps);
        }
    }
    return res
}

/**
 * 判断字符串是否全为ASCII码
 */
global.isASCII = (str) => {
    let regexpObj = new RegExp(/a-zA-Z0-9_].+/g)
    return regexpObj.test(str);
}

/**
 * JSON字符串转对象
 */
global.parse = (str) => {
    try {
        return JSON.parse(str) || {};
    } catch (error) {
        console.error(error);
        return {};
    }
};
/**
 * JSON字符串转数组
 */
global.parseArray = (str) => {
    try {
      return JSON.parse(str) || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  
/**
* sortByKeyAndType
* 根据数据类型生成排序函数
* key 指定排序字段
* type 字段类型
* order 排序类型，默认升序
*/
global.sortByKeyAndType = (key, type, order) => (a, b) => {
    if (type === 'STRING') {
        let aa = a[key] || '';
        let bb = b[key] || '';
        if (order === "descend") {
            return bb.localeCompare(aa);
        } else {
            return aa.localeCompare(bb);
        }
    } else if (type === 'DATE') {
        if (order === "descend") {
            return moment(b[key]).valueOf() - moment(a[key]).valueOf();
        } else {
            return moment(a[key]).valueOf() - moment(b[key]).valueOf();
        }
    } else {
        let aa = a[key] || 0;
        let bb = b[key] || 0;
        if (order === "descend") {
            return bb - aa;
        } else {
            return aa - bb;
        }
    }
};

/**
 * 将数据保存为全局变量
 * obj 页面this对象
 * key 模块名称
 * data 要保存的数据
 */
global.storeData = (obj, key, data) => {
    global[key] = global[key] || {};
    global[key] = Object.assign(global[key], data);
    obj.setState(data);
}
