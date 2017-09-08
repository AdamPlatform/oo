import React, {Component} from 'react';

const Form = require('antd/lib/form');
const FormItem = Form.Item
const Input = require('antd/lib/input');
const Row = require('antd/lib/row');
const Col = require('antd/lib/col');
const Modal = require('antd/lib/modal');
const api = require('../utils/api').default;
class Page extends Component {
  constructor(props) {
    super();
    this.state = {
      //图片验证
      piccode: null,
      counter: 0,
      visible: true,
      sid: null,
    }
  }
  componentDidMount() {
    let sid = Math.random();
    this.setState({
      piccode: api.opts.baseURI+"/auth/piccode?sid=" + sid,
      sid: sid
    });
  }
  submitHandler(e) {
    const data = this.props.form.getFieldsValue();
    let loginAction = () => {
      api.put('/auth/login', {
        data: {
            user: data.user,
            password: data.password
        }
      }).then(res => {
        const {setCookie} = require('../utils/cookie');
        const {entid, id} = res.body.user || {};
        if (id) {
          global.entid = entid;
          setCookie('token', id);
          setCookie('entid', entid);
          setCookie('id', id);
        }
        this.setState({visible: false});
      }, err => {
        console.log(err, 'error');
        Modal.warning({
          message:'登录失败',
          content:err.body.message
        })
        let sid = Math.random();
        this.setState({
          counter: this.state.counter + 1,
          piccode: api.opts.baseURI+"/auth/piccode?sid=" + sid,
          sid: sid
        });
      })
    }
    if (!data.user) {
      Modal.warning({
        content: '用户名不能为空'
      });
    } else if (!data.password) {
      Modal.warning({
        content: '密码不能为空'
      });
    } else {
      loginAction();
      /*
      if (this.state.counter >= 3) {
        const {getFieldValue} = this.props.form;
        var picCode = getFieldValue('picCode');
        let checkCodeAction = () => {
          let res = api.get('/auth/piccodechk', {
            params: {
              //sid: this.state.sid,
              picCode: picCode,
            }
          }).then(res => {
            loginAction();
          }, err => {
            Modal.warning({
              content: '请输入正确的图片验证码'
            });
          });
        }
        checkCodeAction();
      } else {
        loginAction();
      }*/
    }

  }
  handlePicCode() {
    let sid = Math.random();
    this.setState({
      piccode: api.opts.baseURI+"/auth/piccode?sid=" + sid,
      sid: sid
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const userProps = getFieldDecorator('user', {
      rules: [
        {
          required: true,
          message: '请输入用户名',
        }, {
          validator: this.isEmptyUser,
        }],
    });
    const passwordProps = getFieldDecorator('password', {
      rules: [
        {
          required: true,
          message: '请输入密码',
        }, {
          validator: this.isEmptyPassword,
        }],
    });
   
    let yanzheng = ((counter) => {
      if (counter >= 3) {
        return (
          <FormItem
            label="验证码"
            {...formItemLayout}
            >
            <Row type="flex">
              <Col span={11}>
              {getFieldDecorator("picCode")(
                <Input placeholder='请输入验证码' onPressEnter={this.submitHandler.bind(this)} />
              )}
              </Col>
              <Col span={13}>
                <img src={this.state.piccode} alt="点击刷新验证码" title="看不清可单击图片刷新" onClick={this.handlePicCode.bind(this)} />
              </Col>
            </Row>
          </FormItem>
        )
      }
    })(this.state.counter);
    return (
      <Modal
        width={330}
        visible={this.state.visible}
        title='账号登录'
        maskClosable={false}
        okText='登录'
        onOk={this.submitHandler.bind(this)}
        onCancel={()=>{window.location.href="about:blank";window.close()}}
      >
      <Form ref='login' >
        <FormItem
          label="账号"
          {...formItemLayout}
          >
          {userProps(
          <Input placeholder="请输入管理账号或手机号" />
          )
          }
        </FormItem>

        <FormItem
          label="密码"
          {...formItemLayout}
          >
          {passwordProps(
          <Input type="password" autoComplete="off" placeholder="请输入密码" onPressEnter={this.submitHandler.bind(this)}
            />
          )}
        </FormItem>
        {yanzheng}
      </Form>
      </Modal>
    );
  }
}

Page = Form.create()(Page);

export default Page