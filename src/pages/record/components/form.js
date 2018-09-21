import React from 'react';
import {
  Form,
  Input,
  Button,
  Field,
  Feedback,
  Radio,
} from '@icedesign/base';
// import PropTypes from 'prop-types';
import { post, put, get } from '@/utils/http';
import AutoSuggest from '@/hoc/autoSuggest';

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

    const { data } = this.props.formParams;
    const { userId, classifyId } = data;
    this.state = {
      sUserId: userId || '',
      sClassifyId: classifyId || '',
      username: '',
      classifyname: '',
    };
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
    // console.log(value);
    // console.log(data);
    this.city = extra;
    // console.log(this.city);
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

  balanceCheck = (rule, value, callback) => {
    if (!value) {
      callback();
    } else if (isNaN(value)) {
      callback([new Error('金额不正确')]);
    }
    callback();
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
    const { balance, type, content } = data;
    const { sUserId, sClassifyId, username, classifyname } = this.state; // 如果这两个值存在，则默认值为这两个值
    return (
      <div>
        <Form field={this.field}>
          <FormItem label="金额：" {...formItemLayout}>
            <Input
              maxLength={40}
              hasLimitHint
              placeholder="输入操作金额，保留两位小数..."
              defaultValue={balance}
              {...init('balance', {
                rules: [
                  { required: true, message: '金额不能为空' },
                  { validator: this.balanceCheck },
                ],
              })}
            />
          </FormItem>
          {/* sUserId：
          {sUserId}--{username} */}
          <FormItem label="用户：" {...formItemLayout}>
            <AutoSuggest
              url="users/find/username"
              urlQueryKey="username"
              mapToParamText="text"
              mapToParamValue="value"
              defaultValue={username}
              placeholder="请输入用户名关键字，选择系统中存在的用户"
              handleAutoBack={backId => {
                this.setState({ sUserId: backId });
              }}
            />
            <Input
              style={{ display: 'none' }}
              maxLength={40}
              hasLimitHint
              placeholder="用户ID"
              defaultValue={sUserId}
              value={sUserId}
              {...init('userId', {
                rules: [
                  {
                    required: true,
                    message: '用户ID不能为空，请选择系统中存在的用户',
                  },
                ],
              })}
            />
          </FormItem>
          {/* sClassifyId：
          {sClassifyId}--{sClassifyId || classifyId}--{classifyname} */}
          <FormItem label="事件类型：" {...formItemLayout}>
            <AutoSuggest
              url="classify/find/name"
              urlQueryKey="name"
              defaultValue={classifyname}
              mapToParamText="text"
              mapToParamValue="value"
              placeholder="请输入图标名关键字，选择系统中存在的图标"
              handleAutoBack={backId => {
                this.setState({ sClassifyId: backId });
              }}
            />
            <Input
              style={{ display: 'none' }}
              hasLimitHint
              placeholder="事件类型ID"
              defaultValue={sClassifyId}
              value={sClassifyId}
              {...init('classifyId', {
                rules: [{ required: true, message: '图标ID不能为空' }],
              })}
            />
          </FormItem>
          <FormItem required label="收支：" {...formItemLayout}>
            <RadioGroup
              defaultValue={type === undefined ? '0' : `${type}`}
              {...init('type', {})}
            >
              <Radio value="0">支出</Radio>
              <Radio value="1">收入</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="内容：" {...formItemLayout}>
            <Input
              multiple
              maxLength={50}
              hasLimitHint
              placeholder="输入内容"
              defaultValue={content}
              {...init('content', {
                rules: [{ required: true, min: 2, message: '至少为 2 个字符' }],
              })}
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

  componentDidMount() {
    const { data } = this.props.formParams;
    const { classifyId, userId } = data;
    // 查找用户名
    if (userId) {
      get(`users/find/${userId}`).then(res => {
        setTimeout(() => {
          this.setState({
            username: res.result.username,
            sUserId: userId,
          });
        }, 0);
      });
    }

    // 查找事件名
    if (classifyId) {
      get(`classify/find/${classifyId}`).then(res => {
        setTimeout(() => {
          this.setState({
            classifyname: res.result.name,
            sClassifyId: classifyId,
          });
        }, 0);
      });
    }
  }
}
