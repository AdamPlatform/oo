import React from 'react';
const {dateFormatCon, dateCon} = require('../utils/common/date');
const Select = require('antd/lib/select');
const Form = require('antd/lib/form');
const Row = require('antd/lib/row');
const Col = require('antd/lib/col');
const Option = Select.Option;
const FormItem = Form.Item;
let _extends = Object.assign || function (target) { for (let i = 1; i < arguments.length; i++) { let source = arguments[i]; for (let key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * 根据数据类型生成FormItem
 * @param  {any} getFieldDecorator
 * @param  {String} dataType 数据类型 根据数据类型创建不同组件
 * 'text' => Input, 'number' => InputNumber, 'date'=> DatePicker, 'object'=>TreeSelect 其他类型根据名字在 src/components路径下寻找同名组件
 * @param  {String} id 组件id
 * @param  {Object} param 组件参数 param {props: props(FormItem中组件的参数), formProps: formProps(FormItem参数)}
 * @param  {Bool} isSelect 是否为选择组件
 * @param  {Bool} disabled 值为true时直接显示文本， 值为false时使用组件
 */
export function createFormItem(getFieldDecorator, dataType, id, param, isSelect, disabled) {
	let params = param || {};
	let props = params.props || {};
	let formProps = params.formProps || {};
	let objProps = {};
	let funcProps = {};
	for (let key in props) {
		let prop = props[key];
		if (['initialValue', 'onChange', 'valuePropName', 'trigger', 'validateTrigger', 'exclusive', 'rules'].indexOf(key) !== -1 ) {
			funcProps[key] = prop;
		} else {
			objProps[key] = prop;
		}
		if (dataType === 'number') {
			objProps.min = 0;
		}
	}
	let component;
	/*let name;
	if (['text', 'number', 'date', 'object'].indexOf(dataType) === -1) {
		name = require(`./${dataType}.js`);
	} */
	if (disabled) {
		component = <span>{funcProps.initialValue}</span>;
		if (funcProps.initialValue) {
			if (isSelect) {
				if (objProps.children) {
					for (let obj of objProps.children) {
						if (funcProps.initialValue === obj.props.value) {
							component = <span>{obj.props.children}</span>;
							break;
						}
					}
				}
			} else if (dataType === 'date') {
				if (objProps.showTime) {
					component = <span>{dateCon(funcProps.initialValue)}</span>;
				} else {
					component = <span>{dateFormatCon(funcProps.initialValue)}</span>;
				}
			} else if (dataType === 'object') {
				let label;
				let handlechildren = (chs) => {
					if (chs) {
						chs.map((child) => {
							return tree(child);
						});
					}
				}
				function tree(item) {
					if (item.value === funcProps.initialValue) {
						label = item.label;
					}
					handlechildren(item.children);
				}
				handlechildren(objProps.treeData);
				component = <span>{label}</span>;
			} else if (dataType == null || dataType === '' || dataType === 'text' || dataType === 'number') {
				component = <span>{funcProps.initialValue}</span>;
			} /*else {
				objProps.disabled = true;
				component = getFieldDecorator(id, funcProps)(React.createElement(name, _extends({}, objProps)));
			}	*/
		}
	} 
	
	formProps.children = component;
	formProps.key = id;
	return React.createElement(FormItem, formProps);
}
/**
 * 使用元素参数数组创建n列等宽表格排版的表单
 * @param  {any} getFieldDecorator
 * @param  {Number} cols 表单列数
 * @param  {Number} gutter 表单行间隔
 * @param  {Array<param>} formItems 创建表单的元素参数数组 param {props: props(FormItem中组件的参数), formProps: formProps(FormItem参数)}
 * @param  {Bool} disabled 值为true时直接显示文本， 值为false时使用组件
 * @return {Array} children antd component FormItem Array
 */
export function createFormItems(getFieldDecorator, cols, gutter, formItems, disabled) {
	let children = [];
	let colSpan = parseInt(24 / cols, 10);
	let len = formItems.length; 
	for (let i = 0; i < len; i += cols) {
		let childs = [];
		for (let j = 0; j < cols && i + j < len; ++j) {
			let params = formItems[i + j] || {};
			let component = createFormItem(getFieldDecorator, params.dataType, params.id, params.param, params.isSelect, disabled);
			let colId = params.id + j;
			childs.push(React.createElement(Col, _extends({}, {children: component}, {span: colSpan}, {key: colId})));	
		}
		if (childs.length < cols) {
			let restEmptyCol = cols - childs.length;	
			for (let i = 0; i < restEmptyCol; ++i) {
				let colId = 'restEmptyCol' + i;
				childs.push(React.createElement(Col, _extends({}, {span: colSpan}, {key: colId})));
			}
		}
		children.push(React.createElement(Row, {type: "flex", justify: "space-between", children: childs, gutter: gutter, key: 'row' + i}));
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
 */
export function createFormItemsByOneRow(getFieldDecorator, colSpans, gutter, formCols, disabled) {
	let childs = [];
	for (let i = 0; i < formCols.length; i++) {	
		let formItems = formCols[i];
		let colSpan = colSpans[i];
		let items = []
		for (let j = 0; j < formItems.length; ++j) {		
			let params = formItems[j] || {};
			let component = createFormItem(getFieldDecorator, params.dataType, params.id, params.param, params.isSelect, disabled);
			items.push(component);	
		}	
		childs.push(React.createElement(Col, _extends({}, {children: items}, {span: colSpan}, {key: 'col' + i})));	
	}
	return React.createElement(Row, {type: "flex", justify: "space-between", children: childs, gutter: gutter});
}

/**
 * 字段配置转换成FormItem props
 * @param  {} field 字段配置
 * @param  {} index 字段在配置数组中的索引
 * @param  {} initialValue 初始值
 * @param  {} specialFields2FormProps 特殊处理
 */
export function fields2FormProps(field, index, initialValue, specialFields2FormProps) {
	let formField = {};
	formField.id = field.id;
	formField.param = {};
	formField.param.formProps = {label: field.name, labelCol: { span: 10}, wrapperCol: { span: 14 }};
	formField.param.props = {};
	if (field.dataType === 'date') {
		if (initialValue) {
			initialValue = new Date(initialValue);
		}
	} else if (field.dataType === 'number') {
		if (initialValue) {
			initialValue = parseInt(initialValue, 10);
		}
	} else if (field.inputWay === '1') {
		let idx = 0;
		let propValues = field.propValues.split('/');
		let children = propValues.map((prop) => {
			return <Option key={idx.toString()} value={prop}>{prop}</Option>;
		});
		formField.param.props.children = children;
		formField.param.props.allowClear = true;
		formField.isSelect = true;
	}
	formField.param.props.initialValue = initialValue;
	formField.param.props.style = { width: '100%' };
	formField.dataType = field.dataType;
	formField.param.props.disabled = field.disabled;
	
	formField = specialFields2FormProps(formField, index)
	return formField;
}