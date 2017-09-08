
global.toFixedEx = function (source, precision) {
    let num = parseFloat(source);
    if (isNaN(num)) {
        return '';
    }
    return (parseInt(num * Math.pow( 10, precision ) + 0.5, 10)/ Math.pow( 10, precision )).toString(); 
}

global.toFixed = function (source, precision) {
    let num = parseFloat(source);
    if (isNaN(num)) {
        return '';
    }
    return num.toFixed(precision);
}

global.parse = (str) => {
    try {
        return JSON.parse(str);
    } catch (error) {
        console.error(error);
        return null;
    }
}

global.parseSearchStr = () => {
    let search = window.location.search || '';
    search = decodeURI(search)
    // 解析url携带参数
    let paramObj = search
        .substr(1, search.length - 1)
        .split('&')
        .reduce((obj, param) => {
            let keyValueArr = param.split('=');
            if (keyValueArr.length === 2) {
                let key = keyValueArr[0];
                let value = keyValueArr[1];
                if (key && key !== ''
                    && value && value !== '') {
                    obj[key] = value;
                }
            }
            return obj;
        }, {});
    return paramObj;
}

