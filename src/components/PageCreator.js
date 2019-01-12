import React from 'react'
import moment from 'moment';
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Select from 'antd/lib/select'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import InputNumber from 'antd/lib/input-number'
import Cascader from 'antd/lib/cascader'
import DatePicker from 'antd/lib/date-picker'
import Checkbox from 'antd/lib/checkbox'
import Radio from 'antd/lib/radio'
import Slider from 'antd/lib/slider'
import Switch from 'antd/lib/switch'
import TimePicker from 'antd/lib/time-picker'
import Transfer from 'antd/lib/transfer'
import TreeSelect from 'antd/lib/tree-select'
import Upload from 'antd/lib/upload'
import NumberArea from './NumberArea.js';
const Option = Select.Option;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const toFixedEx = function (source, precision) {
    let num = parseFloat(source);
    if (isNaN(num)) {
        return '';
    }
    return (parseInt(num * Math.pow(10, precision) + 0.5, 10) / Math.pow(10, precision)).toString();
};
const antdNameObj = {
    Input,
    InputNumber,
    DatePicker,
    Checkbox,
    Cascader,
    Radio,
    Select,
    Slider,
    Switch,
    TimePicker,
    Transfer,
    TreeSelect,
    Upload
}

/**
 * 根据数据类型生成FormItem
 * @param  {any} getFieldDecorator
 * @param  {String} dataType 数据类型 根据数据类型创建不同组件
 * 'STRING' => Input, 'NUMBER' => InputNumber, 'DATE'=> DatePicker, 然后匹配antd组件, 其他类型根据名字在当前文件所在目录寻找同名组件
 * @param  {String} id 组件id
 * @param  {Object} param 组件参数 param {props: props(FormItem中组件的参数), formProps: formProps(FormItem参数)}
 * @param  {Bool} disabled 值为true时直接显示文本， 值为false时使用组件
 * @param  {Bool} isForSearch 是否用于搜索
 */
export function createItem(getFieldDecorator, dataType, id, param, disabled, gutter, isForSearch) {
    let params = param || {};
    let props = params.props || {};
    let formProps = params.formProps || {};
    let objProps = {};
    objProps.key = id;
    let funcProps = {};
    for (let key in props) {
        let prop = props[key];
        if (['initialValue', 'onChange', 'valuePropName', 'trigger', 'validateTrigger', 'exclusive', 'rules', 'step'].indexOf(key) !== -1) {
            funcProps[key] = prop;
        } else {
            objProps[key] = prop;
        }
        if (dataType === 'NUMBER') {
            objProps.min = 0;
        }
    }
    let component;
    let name;
    if (['STRING', 'NUMBER', 'DATE', 'TIME', 'TEXT'].indexOf(dataType) === -1) {
        if (antdNameObj[dataType]) {
            name = antdNameObj[dataType]
        }
    }
    if (disabled) {
        component = React.createElement('span', {children: funcProps.initialValue});
        if (funcProps.initialValue) {
            if (dataType === 'TEXT') {
                objProps.disabled = true;
                component = React.createElement(Input.TextArea, Object.assign({}, objProps));
            } else if (dataType === 'DATE') {
                component = React.createElement('span', {children: moment(funcProps.initialValue).format('YYYY-MM-DD')});
            } else if (dataType === 'TIME') {
                component = React.createElement('span', {children: moment(funcProps.initialValue).format('YYYY-MM-DD HH:mm:ss')});
            } else {
                objProps.disabled = true;
                component = getFieldDecorator(id, funcProps)(React.createElement(name, Object.assign({}, objProps)));
            }
        }
    } else {
        if (dataType === 'SELECT') {
            component = getFieldDecorator(id, funcProps)(React.createElement(Select, Object.assign({}, objProps)));
        } else if (dataType === 'STRING') {
            component = getFieldDecorator(id, funcProps)(React.createElement(Input, Object.assign({}, objProps)));
        } else if (dataType === 'TEXT') {
            component = getFieldDecorator(id, funcProps)(React.createElement(Input.TextArea, Object.assign({}, objProps)));
        } else if (dataType === 'NUMBER') {
            if (isForSearch) {
                name = NumberArea;
            } else {
                name = Input;
                objProps.type = 'NUMBER';
                objProps.min = 0;
                objProps.step = 0.0001;
            }
            component = getFieldDecorator(id, funcProps)(React.createElement(name, Object.assign({}, objProps)));
        } else if (dataType === 'DATE' || dataType === 'TIME') {
            if (dataType === 'TIME') {
                objProps.showTime = true;
                objProps.format = 'YYYY-MM-dd HH:mm:ss';
            }
            if (isForSearch) {
                name = RangePicker;
            } else {
                name = DatePicker
            }
            component = getFieldDecorator(id, funcProps)(React.createElement(name, Object.assign({}, objProps)));
        } else if (dataType === '') {
            component = getFieldDecorator(id, funcProps)(React.createElement('span', {children: funcProps.initialValue}))
        } else {
            component = getFieldDecorator(id, funcProps)(React.createElement(name, Object.assign({}, objProps)));
        }
    }

    formProps.children = component;
    formProps.key = id;
    formProps.style = { marginBottom: gutter }
    return React.createElement(FormItem, formProps);
}
/**
 * 使用元素参数数组创建n列等宽表格排版的表单
 * @param  {any} getFieldDecorator
 * @param  {Number} cols 表单列数
 * @param  {Number} gutter 表单行间隔
 * @param  {Array<param>} formItems 创建表单的元素参数数组 param {props: props(FormItem中组件的参数), formProps: formProps(FormItem参数)}
 * @param  {Bool} disabled 值为true时直接显示文本， 值为false时使用组件
 * @param  {Bool} isForSearch 是否用于搜索
 * @return {Array} children antd component FormItem Array
 */
export function createItems(getFieldDecorator, cols, gutter, formItems, disabled, isForSearch) {
    let children = [];
    let colSpan = parseInt(24 / cols, 10);
    let len = formItems.length;
    for (let i = 0; i < len; i += cols) {
        let childs = [];
        for (let j = 0; j < cols && i + j < len; ++j) {
            let params = formItems[i + j] || {};
            let component = createItem(getFieldDecorator, params.dataType, params.id, params.param, disabled, gutter, isForSearch);
            let colId = params.id + j;
            childs.push(React.createElement(Col, Object.assign({}, { children: component }, { span: colSpan }, { key: colId })));
        }
        if (childs.length < cols) {
            let restEmptyCol = cols - childs.length;
            for (let i = 0; i < restEmptyCol; ++i) {
                let colId = 'restEmptyCol' + i;
                childs.push(React.createElement(Col, Object.assign({}, { span: colSpan }, { key: colId })));
            }
        }
        children.push(React.createElement(Row, { type: "flex", justify: "space-between", children: childs, gutter: gutter, key: 'row' + i }));
    }
    return children;
}
/**
 * 使用元素参数数组创建n列不同宽度排版的表单 colSpans为formCols 相同索引的列span值
 * @param  {} getFieldDecorator
 * @param  {Array<Number>} colSpans 列span值数据
 * @param  {Number} gutter 行间距
 * @param  {Array< Array<param> >} formCols 创建表单的元素参数数组 param {props: props(FormItem中组件的参数), formProps: formProps(FormItem参数)}
 * @param  {Bool} disabled 值为true时直接显示文本， 值为false时使用组件
 * @return {Array} children antd component FormItem Array
 * @param  {Bool} isForSearch 是否用于搜索
 */
export function createItemsByOneRow(getFieldDecorator, colSpans, gutter, formCols, disabled, isForSearch) {
    let childs = [];
    for (let i = 0; i < formCols.length; i++) {
        let formItems = formCols[i];
        let colSpan = colSpans[i];
        let items = []
        for (let j = 0; j < formItems.length; ++j) {
            let params = formItems[j] || {};
            let component = createItem(getFieldDecorator, params.dataType, params.id, params.param, disabled, gutter, isForSearch);
            items.push(component);
        }
        childs.push(React.createElement(Col, Object.assign({}, { children: items }, { span: colSpan }, { key: 'col' + i })));
    }
    return React.createElement(Row, { type: "flex", justify: "space-between", children: childs, gutter: gutter });
}

/**
 * 字段配置转换成FormItem props
 * @param  {} field 字段配置
 * @param  {} index 字段在配置数组中的索引
 * @param  {} initialValue 初始值
 * @param  {} specialItemProps 特殊处理
 * @param  {Bool} isForSearch 是否用于搜索
 */
export function configToItemProps(field, index, initialValue, specialItemProps, isForSearch) {
    let formField = {};
    formField.id = field.dataIndex;
    formField.param = {};
    formField.param.formProps = {
        label: field.showName || field.name,
        labelCol: {
            span: 10
        },
        wrapperCol: {
            span: 14
        }
    };
    formField.param.props = {};
    formField.param.props.rules = [];
    let dataType = field.dataType;
    formField.param.props.placeholder = '请输入' + (field.showName || field.name);
    if (dataType === 'TIME') {
        formField.param.props.showTime = true;
        formField.param.props.format = 'YYYY-MM-dd HH:mm:ss';
    }
    if ((dataType === 'DATE' || dataType === 'TIME') && !isForSearch) {
        if (initialValue) {
            initialValue = moment(initialValue);
        }
        formField.param.props.placeholder = '请选择' + (field.showName || field.name);
    } else if (dataType === 'NUMBER') {
        formField.param.props.min = 0;
        formField.param.props.step = 0.0001;
        if (initialValue) {
            initialValue = parseFloat(initialValue);
            if (isNaN(initialValue)) {
                initialValue = 0;
            } else {
                initialValue = toFixedEx(initialValue, 4);
            }
        }
    } else if (dataType === 'SELECT') {
        let propValues = field.propValues.split('/');
        let children = propValues.map((prop, index) => {
            return React.createElement(Option, {
                key: index.toString(),
                value: prop,
                children: prop
            });
        });
        formField.param.props.children = children;
        formField.param.props.allowClear = true;
        formField.param.props.placeholder = '请选择' + (field.showName || field.name);
    }
    if ((dataType === 'DATE' || dataType === 'TIME') && isForSearch) {
        delete formField.param.props.placeholder;
    }
    formField.param.props.initialValue = initialValue;
    formField.param.props.style = {
        width: '100%'
    };
    formField.dataType = field.dataType;
    let disabled = false;
    if ((field.disabled === '1' || field.disabled === true || field.isDisabled === '0') && !isForSearch) {
        disabled = true;
    }
    formField.param.props.disabled = disabled;
    // 必填项校验
    if (field.isRequire === '1' && !isForSearch) {
        if (['STRING', 'TEXT'].indexOf(dataType) !== -1) {
            formField.param.props.rules.push({
                required: true,
                whitespace: true,
                message: field.name + '必须输入!'
            });
        } else {
            formField.param.props.rules.push({
                required: true,
                message: field.name + '必须输入!'
            });
        }
    }

    if (specialItemProps) {
        formField = specialItemProps(formField, index);
    }
    return formField;
}

/**
 * 生成Mongodb查询条件
 * fieldsValue {Object} 查询条件值对象
 * mainSearchFeilds {Array<Object>} 精简查询条件
 * moreSearchFeilds {Array<Object>} 更多查询条件
 */
export function generateSql(fieldsValue, mainSearchFeilds, moreSearchFeilds) {
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
        if (dataType === 'NUMBER') {
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
                obj['$gte'] = {'$date': date};
            }
            if (end) {
                let date = new Date(end);
                date.setHours(23);
                date.setMinutes(59);
                date.setSeconds(59);
                obj['$lte'] = {'$date': date};
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
                let date = new Date(start);
                obj['$gte'] = {'$date': date};
            }
            if (end) {
                let date = new Date(end);
                obj['$lte'] = {'$date': date};
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

/**
 * 字段配置转换成Table column
 * @param  {} config 字段配置
 * @param  {} specialColumn 特殊处理
 */
export function configToColumn(config, specialColumn) {
    let item = Object.assign({}, config);
    item.width = parseInt(config.width, 10);
    item.title = config.showName || config.name;
    if (config.isSort === '1') {
        item.sorter = true;
    } else {
        item.sorter = false;
    }
    item.key = config.dataIndex;
    item.dataIndex = config.dataIndex;
    let dataType = config.dataType;
    if (dataType === 'TIME') {
        item.render = text => text && moment(text).format('YYYY-MM-DD HH:mm:ss')
    } else if (dataType === 'DATE') {
        item.render = text => text && moment(text).format('YYYY-MM-DD')
    } else if (dataType === 'NUMBER') {
        item.render = text => text && toFixedEx(text, 4);
    }

    if (specialColumn) {
        item = specialColumn(item);
    }
    return item;
}