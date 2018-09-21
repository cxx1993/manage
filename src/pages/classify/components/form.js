import React from 'react';
import { Form, Input, Button, Field, Feedback, Range } from '@icedesign/base';
// import PropTypes from 'prop-types';

import IconList from '../../../hoc/iconList';
import Model from '../../../hoc/modal';
import { post, put } from '../../../utils/http';

const { Item: FormItem } = Form;
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
    this.state = {
      visible: false, // iconlist modal show/hide
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('nextState', nextState);
    // console.log('this.state', this.state);
    // console.log(nextState.toString() === this.state.toString());
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

  handleAdd = params => {
    post(`/${this.props.collectionName}/add`, params)
      .then(res => {
        Toast.success(res.message);
        this.field.reset();
        this.setState({
          visible: false,
        });
        this.props.handleFormSuccess({ visible: false });
      })
      .catch(err => {
        console.log('ERR', err);
      });
  };

  handleUpdate = params => {
    put(
      `/${this.props.collectionName}/update/${this.props.formParams.data._id}`,
      params
    )
      .then(res => {
        Toast.success(res.message);
        this.field.reset();
        this.setState({
          visible: false,
        });

        this.props.handleFormSuccess({ visible: false });
      })
      .catch(err => {
        console.log('ERR', err);
      });
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //   return true;
  // }

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
    const { name, stName, level, desc } = data;
    // const { name, stName, _id } = formData;

    return (
      <div>
        <Form field={this.field}>
          <FormItem label="名称：" {...formItemLayout}>
            <Input
              maxLength={40}
              hasLimitHint
              placeholder="输入icon名称"
              defaultValue={name}
              {...init('name', {
                rules: [
                  { required: true, min: 2, message: '至少为 2 个字符' },
                  // { validator: this.userExists },
                ],
              })}
            />
          </FormItem>

          <FormItem label="图标样式：" {...formItemLayout}>
            {/* <Search
              size="medium"
              inputWidth={300}
              defaultValue={stName}
              autoWidth
              placeholder="粘贴icon样式"
              searchText="选择"
              onSearch={() => {
                // e.preventDefault();
                this.setState({ visible: true });
              }}
              {...init('stName', {
                rules: [{ required: true, min: 2, message: '至少为 2 个字符' }],
              })}
            /> */}
            <Input
              style={{ width: '80%' }}
              maxLength={40}
              hasLimitHint
              defaultValue={stName}
              placeholder="选择icon样式"
              {...init('stName', {
                rules: [{ required: true, min: 2, message: '至少为 2 个字符' }],
              })}
            />
            <Button
              type="secondary"
              style={{ float: 'right' }}
              onClick={e => {
                e.preventDefault();
                this.setState({ visible: true });
              }}
            >
              选择图标
            </Button>
          </FormItem>

          <FormItem label="等级：" {...formItemLayout} required>
            <Range
              defaultValue={level === undefined ? 0 : level}
              scales={[0, 100]}
              // marks={10}
              style={{ marginTop: '15px' }}
              {...init('level')}
            />
          </FormItem>

          <FormItem label="备注：" {...formItemLayout}>
            <Input
              multiple
              maxLength={50}
              hasLimitHint
              placeholder="输入备注"
              defaultValue={desc}
              {...init('desc', {
                // rules: [{ required: false, message: '真的不打算写点什么吗？' }],
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

        <Model
          visible={this.state.visible}
          title="选择icon"
          style={{ width: '60%' }}
          handleModelChange={state =>
            this.setState({ ...this.state, ...state })
          }
        >
          <IconList />
        </Model>
      </div>
    );
  }
}
