// 时间处理函数 add by zhaohj 20160923
let now = new Date() // 当前日期
let dayMSec = 24 * 3600 * 1000;
let nowDayOfWeek = now.getDay()// 今天本周的第几天
let nowDay = now.getDate()// 当前日
let nowMonth = now.getMonth()// 当前月
let nowYear = now.getFullYear()// 当前年
/**
 * @export
 * @param {date} date
 * @returns 不带时分秒的八位年月日字符串
 */
export function dateFormatCon(date) { // 时间格式转换方法(不带时分秒)
    let year = new Date(date).getFullYear()
    let month
    let day
    if ((new Date(date).getMonth() + 1) < 10) {
        month = '0' + (new Date(date).getMonth() + 1)
    } else {
        month = new Date(date).getMonth() + 1
    }
    if ((new Date(date).getDate()) < 10) {
        day = '0' + new Date(date).getDate()
    } else {
        day = new Date(date).getDate()
    }
    let newDate = year + '-' + month + '-' + day
    return newDate
};
/**
 * @export
 * @param {any} date
 * @returns 带时分秒的字符串
 */
export function dateCon(date) {
    let year = new Date(date).getFullYear()
    let month
    let day
    let hour
    let min = new Date(date).getMinutes()
    let seconds = new Date(date).getSeconds()
    if ((new Date(date).getMonth() + 1) < 10) {
        month = '0' + (new Date(date).getMonth() + 1)
    } else {
        month = new Date(date).getMonth() + 1
    }
    if ((new Date(date).getDate()) < 10) {
        day = '0' + new Date(date).getDate()
    } else {
        day = new Date(date).getDate()
    }
    if (new Date(date).getHours() < 10) {
        hour = '0' + new Date(date).getHours()
    } else {
        hour = new Date(date).getHours()
    }
    if (min < 10) {
        min = '0' + min
    }
    if (seconds < 10) {
        seconds = '0' + seconds
    }
    let newDate = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + seconds
    return newDate
};
/**
 * 获取本周开始时间
 * @export
 * @returns 本周开始日期字符串
 */
export function getWeekStartDate() {

    let weekStartDate = new Date();
    if (nowDayOfWeek === 0) { // 判断是否是周天
        weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 6)
    } else {
        weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1)
    }
    return weekStartDate
}
//得到今天距离本周一的天数  
export function getDayBetweenMonday() {
    //得到今天的星期数(0-6),星期日为0  
    var weekday = now.getDay();
    //周日  
    if (weekday === 0) {
        return 6;
    } else {
        return weekday - 1;
    }
}
// 获得本周的结束日期
export function getWeekEndDate() {
    let weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek))
    return weekEndDate
}
// 获得本月的开始日期
export function getMonthStartDate() {
    let monthStartDate = new Date(nowYear, nowMonth, 1)
    return monthStartDate
}
// 获得某月的天数
export function getMonthDays(myMonth) {
    let monthStartDate = new Date(nowYear, myMonth, 1)
    let monthEndDate = new Date(nowYear, myMonth + 1, 1)
    let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
    return days
}
// 获得本月的结束日期
export function getMonthEndDate() {
    let monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth))
    return monthEndDate
}
// 获得本季度的开始月份
export function getQuarterStartMonth() {
    var quarterStartMonth = 0
    if (nowMonth < 3) {
        quarterStartMonth = 0
    }
    if (nowMonth > 2 && nowMonth < 6) {
        quarterStartMonth = 3
    }
    if (nowMonth > 5 && nowMonth < 9) {
        quarterStartMonth = 6
    }
    if (nowMonth > 8) {
        quarterStartMonth = 9
    }
    return quarterStartMonth
}
// 获得本季度的开始日期
export function getQuarterStartDate() {
    let quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1)
    return quarterStartDate
}
// 获取本季度的结束日期
export function getQuarterEndDate() {
    var quarterEndMonth = getQuarterStartMonth() + 2
    var quarterEndDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth))
    return quarterEndDate
}
/**
 * 获取本年的第一天
 * @export
 * @returns 本年的第一天
 */
export function getYearFirstDate() {
    let yearFirstDate = new Date(nowYear, 0, 1)
    return yearFirstDate
}
/**
 * 获取本年的最后一天
 * @export
 * @returns 本年的最后一天
 */
export function getYearLastDate() {
    let yearLastDate = new Date(nowYear, 11, 31)
    return yearLastDate
}
// 获取本年的开始时间
export function getYearStartDate() {
    return new Date(nowYear, 0, 1)
}
// 获取当前时间
export function getNow() {
    return now;
}
/**
 * 获取昨天时间
 * @export
 * @returns 
 */
export function getLastDay() {
    var yesterdayMSec = now.getTime() - dayMSec;
    var yesterday = new Date(yesterdayMSec);
    return yesterday.format('yyyy-MM-dd')
}
export function getLastWeek() {
    var weekdayBetween = getDayBetweenMonday();
    //得到本周星期一的毫秒值  
    var nowMondayMSec = now.getTime() - weekdayBetween * dayMSec;
    //得到上周一的毫秒值  
    var lastMondayMSec = nowMondayMSec - 7 * dayMSec;
    //得到上周日的毫秒值  
    var lastSundayMSec = nowMondayMSec - 1 * dayMSec;
    var lastMonday = new Date(lastMondayMSec);
    var lastSunday = new Date(lastSundayMSec);
    return { lastMonday: lastMonday.format('yyyy-MM-dd'), lastSunday: lastSunday.format('yyyy-MM-dd') }
}
export function getLastMonth() {
    //得到上一个月的第一天  
    var lastMonthFirstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    //得到本月第一天  
    var nowMonthFirstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    //得到上一个月的最后一天的毫秒值  
    var lastMonthLastDayMSec = nowMonthFirstDay.getTime() - 1 * dayMSec;
    var lastMonthLastDay = new Date(lastMonthLastDayMSec);
    return { lastMonthFirstDay: lastMonthFirstDay.format('yyyy-MM-dd'), lastMonthLastDay: lastMonthLastDay.format('yyyy-MM-dd') }
}
export function getLastQuarter() {
    var lastQuarterStartMonth = 0;
    var lastQuarterStartYear = nowYear;
    if (nowMonth < 3) {
        lastQuarterStartMonth = 9;
        lastQuarterStartYear = nowYear - 1;
    }
    if (nowMonth > 2 && nowMonth < 6) {
        lastQuarterStartMonth = 0
    }
    if (nowMonth > 5 && nowMonth < 9) {
        lastQuarterStartMonth = 3
    }
    if (nowMonth > 8) {
        lastQuarterStartMonth = 6
    }
    var lastQuarterFirstDay = new Date(lastQuarterStartYear, lastQuarterStartMonth, 1);
    //得到上一个季度的最后一天  
    var lastQuarterLastDay = new Date(lastQuarterStartYear, lastQuarterStartMonth + 2, getMonthDays(lastQuarterStartMonth + 2));
    return { lastQuarterFirstDay: lastQuarterFirstDay.format('yyyy-MM-dd'), lastQuarterLastDay: lastQuarterLastDay.format('yyyy-MM-dd') }
}
export function getLastYear() {
    let lastYearFirstDate = new Date(nowYear - 1, 0, 1)
    let lastYearLastDate = new Date(nowYear - 1, 11, 31)
    return { lastYearFirstDate: lastYearFirstDate.format('yyyy-MM-dd'), lastYearLastDate: lastYearLastDate.format('yyyy-MM-dd') }
}
/**
 * 获取四位年
 * @export
 * @returns
 */
export function getFullYear() {
    return now.getFullYear()
}
/**
 * 获取两位月份
 * @export
 * @returns
 */
export function getMonth() {
    let month
    if (now.getMonth() + 1 < 10) {
        month = '0' + (now.getMonth() + 1)
    } else {
        month = now.getMonth() + 1
    }
    return month
}

/**
 * 根据输入yyMMddmmdd等字符串生成相应的日期
 * 例如输入yyMMdd 输出的结果为170222（17年02月22日）
 * @export
 * @returns
 */
export function Format(fmt) { //author: meizz 
    var o = {
        "M+": now.getMonth() + 1, //月份 
        "d+": now.getDate(), //日 
        "H+": now.getHours(), //小时 
        "m+": now.getMinutes(), //分 
        "s+": now.getSeconds(), //秒 
        "q+": Math.floor((now.getMonth() + 3) / 3), //季度 
        "S": now.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (now.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1 ) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
export function GetRadio(value) {
    let radio
    let now = new Date()
    if (value===null || (value[0]===null && value[1]===null)) {
        radio = '';
    }
    else if (dateFormatCon(value[0])===dateFormatCon(now) && dateFormatCon(value[1])===dateFormatCon(now)) {
        //今天
        radio = 'today';
    }
    else if (dateFormatCon(value[0])===dateFormatCon(getWeekStartDate()) && dateFormatCon(value[1])===dateFormatCon(now)) {
        //本周
        radio = 'week';
    }
    else if (dateFormatCon(value[0])===dateFormatCon(getMonthStartDate()) && dateFormatCon(value[1])===dateFormatCon(now)) {
        //本月
        radio = 'month';
    }
    else if (dateFormatCon(value[0])===dateFormatCon(getQuarterStartDate()) && dateFormatCon(value[1])===dateFormatCon(now)) {
        //本季
        radio = 'quarter';
    }
    else if (dateFormatCon(value[0])===dateFormatCon(getYearFirstDate()) && dateFormatCon(value[1])===dateFormatCon(now)) {
        //本年
        radio = 'year';
    }
    else if (dateFormatCon(value[0])===getLastDay() && dateFormatCon(value[1])===getLastDay()) {
        //昨天
        radio = 'yesterday';
    }
    else if (dateFormatCon(value[0])===getLastWeek().lastMonday && dateFormatCon(value[1])===getLastWeek().lastSunday) {
        //上周
        radio = 'lastWeek';
    }
    else if (dateFormatCon(value[0])===getLastMonth().lastMonthFirstDay && dateFormatCon(value[1])===getLastMonth().lastMonthLastDay) {
        //上月
        radio = 'lastMonth';
    }
    else if (dateFormatCon(value[0])===getLastQuarter().lastQuarterFirstDay && dateFormatCon(value[1])===getLastQuarter().lastQuarterLastDay) {
        //上季
        radio = 'lastQuarter';
    }
    else if (dateFormatCon(value[0])===getLastYear().lastYearFirstDate && dateFormatCon(value[1])===getLastYear().lastYearLastDate) {
        //上年
        radio = 'lastYear';
    }
    else {
        radio = '';
    }
    return radio;
}
