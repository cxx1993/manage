import React from 'react';
import {
  Form,
  Input,
  Button,
  Field,
  Feedback,
  Radio,
  CascaderSelect,
} from '@icedesign/base';
// import PropTypes from 'prop-types';
import {
  checkMobile as _checkMobile,
  isEmpty,
  isEmptyObject,
} from '@/utils/common';
import { post, put } from '@/utils/http';
import cityJSON from '@/assets/json/city.json';

const { Item: FormItem } = Form;
const { Group: RadioGroup } = Radio;
const Toast = Feedback.toast;

export default class From extends React.Component {
  // static propTypes = {
  //   formData: PropTypes.object.isRequired,
  // };

  static defaultProps = {
    handleFormSuccess: () => {}, // 组件提交成功回调的父组件的函数
    handleFormError: () => {}, // 组件提交失败回调的父组件的函数
    formParams: {}, // 父组件传递过来的值
    // formParams - data :表单的数据
    // formParams - type :表单的提交类型 add/update
  };

  constructor(props) {
    super(props);
    this.field = new Field(this);
    this.state = {};
    this.city = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState === this.state) {
      return false;
    }

    return true;
  }

  handleReset = e => {
    e.preventDefault();
    this.field.reset();
  };

  handleSubmit = e => {
    e.preventDefault();

    new Promise((resolve, reject) => {
      this.field.validate((errors, values) => {
        if (errors) {
          reject(errors);
        }
        resolve(values);
      });
    })
      .then(params => {
        if (this.props.formParams.type === 'add') {
          // 增加
          this.handleAdd(params);
        } else {
          // 编辑
          this.handleUpdate(params);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleChange = (value, data, extra) => {
    console.log(value);
    console.log(data);
    this.city = extra;
    console.log(this.city);
  };

  handleAdd = params => {
    post(`/${this.props.collectionName}/add`, params)
      .then(res => {
        Toast.success(res.message);
        this.field.reset();
        this.props.handleFormSuccess({ visible: false });
      })
      .catch(err => {
        console.log('ERR', err);
      });
  };

  handleUpdate = params => {
    put(
      // eslint-disable-next-line
      `/${this.props.collectionName}/update/${this.props.formParams.data._id}`,
      params
    )
      .then(res => {
        Toast.success(res.message);
        this.field.reset();
        this.props.handleFormSuccess({ visible: false });
      })
      .catch(err => {
        console.log('ERR', err);
      });
  };

  // 检测手机号
  checkMobile = (rule, value, callback) => {
    if (!value) {
      callback();
    } else {
      const res = _checkMobile(value);
      if (!res.result) {
        callback([`手机号${res.message}`]);
      } else {
        callback();
      }
    }
  };

  // 检测用户是否存在
  // eslint-disable-next-line
  userExists = (rule, value, callback) => {
    const { data } = this.props.formParams;
    const { username } = data;

    if (!value) {
      callback();
    } else if (value === username) {
      callback();
    } else {
      setTimeout(() => {
        post(`${this.props.collectionName}/findOne`, {
          username: value,
        })
          .then(exist => {
            if (isEmptyObject(exist.result) || isEmpty(exist.result)) {
              callback();
            } else {
              callback(['抱歉，该用户名已被占用。']);
            }
          })
          .catch(() => {
            callback();
          });
      });

      // new Promise((resolve, reject) => {
      //   get(`${this.props.collectionName}/findOne`, {
      //     username: value,
      //   });
      // })
      //   .then(res => {
      //     console.log(res);
      //     callback();
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     callback();
      //   });
      // setTimeout(() => {
      //   if (value === 'frank') {
      //     callback([new Error('抱歉，该用户名已被占用。')]);
      //   } else {

      //   }
      // }, 1000);
    }
  };

  render() {
    // const { init, getError, getState } = this.field;
    const { init } = this.field;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };
    const { data } = this.props.formParams;
    const { username, mobile, gender, email, desc, city } = data;
    // const { name, stName, _id } = formData;

    return (
      <div>
        <Form field={this.field}>
          <FormItem label="用户名：" {...formItemLayout}>
            <Input
              maxLength={40}
              hasLimitHint
              placeholder="输入用户名"
              defaultValue={username}
              {...init('username', {
                rules: [
                  { required: true, min: 2, message: '至少为 2 个字符' },
                  { validator: this.userExists.bind(this) },
                ],
              })}
            />
          </FormItem>
          <FormItem label="手机号：" {...formItemLayout}>
            <Input
              maxLength={11}
              hasLimitHint
              placeholder="输入手机号"
              defaultValue={mobile}
              {...init('mobile', {
                rules: [
                  { validator: this.checkMobile },
                  { required: true, min: 2, message: '至少为 2 个字符' },
                ],
              })}
            />
          </FormItem>

          <FormItem label="邮箱：" {...formItemLayout}>
            <Input
              // type="email"
              defaultValue={email}
              placeholder="请输入邮箱地址"
              {...init('email', {
                rules: [
                  {
                    required: true,
                    min: 2,
                    trigger: 'onBlur',
                    message: '至少为 2 个字符',
                  },
                  {
                    type: 'email',
                    message: <span>请输入正确的邮箱地址</span>,
                    trigger: ['onBlur', 'onChange'],
                  },
                ],
              })}
            />
          </FormItem>

          <FormItem label="性别：" {...formItemLayout}>
            <RadioGroup
              defaultValue={gender === undefined ? '1' : `${gender}`}
              {...init('gender', {
                rules: [{ required: true, message: '请选择您的性别' }],
              })}
            >
              <Radio value="1">男</Radio>
              <Radio value="0">女</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem label="所在城市：" {...formItemLayout}>
            <CascaderSelect
              defaultValue={city}
              // eslint-disable-next-line
              onChange={(value, data, extra) => {
                this.city = extra;
              }}
              dataSource={cityJSON}
              {...init('city', {})}
            />
          </FormItem>

          <FormItem label="备注：" {...formItemLayout}>
            <Input
              multiple
              maxLength={50}
              hasLimitHint
              placeholder="输入备注"
              defaultValue={desc}
              {...init('desc', {})}
            />
          </FormItem>
          <FormItem wrapperCol={{ offset: 6 }}>
            <Button type="primary" onClick={this.handleSubmit}>
              确定
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button onClick={this.handleReset}>重置</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
