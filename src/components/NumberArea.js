/**
 * 数字范围组件
 */
import React, { Component } from 'react'
import Input from 'antd/lib/input'
const InputGroup = Input.Group;
export default class NumberArea extends Component {
    /**
     * 构造函数 初始化
     */
    constructor() {
        super();
        this.state = {
            leftValue: null,
            rightValue: null,
        }
    }

    /**
     * 左边输入框发生变化
     * @param {*} e 
     */
    LonChange(e) {
        let value = e.target.value;
        this.setState({leftValue: value});
        this.props.onChange([value, this.state.rightValue]);
    }

    /**
     * 右边输入框发生变化
     * @param {*} e 
     */
    RonChange(e) {
        let value = e.target.value;
        this.setState({rightValue: value});
        this.props.onChange([this.state.leftValue, value]);
    }

    /**
     * 值转换成state
     * @param {*} value 
     */
    propsValue2State(value) {
        let leftValue;
        let rightValue;
        if (value && value.length === 2) {
            leftValue = value[0];
            rightValue = value[1]
        } else {
            leftValue = null;
            rightValue = null;
        }
        this.setState({leftValue: leftValue, rightValue: rightValue});
    }

    /**
     * 组件加载时
     */
    componentWillMount() {
        const {value} = this.props;
        this.propsValue2State(value);
    }

    /**
     * props发生变化时
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        const {value} = nextProps;
        this.propsValue2State(value);
    }

    /**
     * 渲染函数
     */
    render () {  
        return React.createElement(InputGroup, {
            compact: true,
            children: [
                React.createElement(Input, {
                    key: 'input1',
                    style: { width: '43%', textAlign: 'center' },
                    placeholder: this.props.placeholder,
                    type: 'number',
                    onChange: this.LonChange.bind(this),
                    value: this.state.leftValue
                }),
                React.createElement(Input, {
                    key: 'input2',
                    style: { width: '14%', borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' },
                    placeholder: '~',
                    disabled: true
                }),
                React.createElement(Input, {
                    key: 'input3',
                    style: { width: '43%', textAlign: 'center', borderLeft: 0 },
                    placeholder: this.props.placeholder,
                    type: 'number',
                    onChange: this.RonChange.bind(this),
                    value: this.state.rightValue
                })
            ]
        })
    }
}