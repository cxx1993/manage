// 非hoc
// 表格通用的删除btn（带确认气泡的）
import React, { PureComponent } from 'react';
import { Feedback, Button, Balloon } from '@icedesign/base';
import PropTypes from 'prop-types';
import { del } from '../utils/http';


const Toast = Feedback.toast;

// 传入handleRemove：del确认后的操作
// 传入collectName：rest的对应表名
export default class DeleteBalloon extends PureComponent {
  static propTypes = {
    handleRemove: PropTypes.func,
    successDel: PropTypes.func,
    errDel: PropTypes.func,
    collectName: PropTypes.string,
    id: PropTypes.string,
  };

  static defaultProps = {
    handleRemove: () => {},
    successDel: () => {},
    errDel: () => {},
    collectName: '',
    id: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleHide = (visible, code) => {
    if (code === 1) {
      // rest 执行删除操作
      const { collectName, id } = this.props;
      if (collectName && id) {
        del(`${collectName}/delete/${id}`).then(res => {
          Toast.success(res.message);
          this.props.successDel(); // 执行父组件传来的回调函数(success)
        }).catch(err => {
          Toast.error(err.message);
          this.props.errDel(); // 执行父组件传来的回调函数(fail)
        });
      }
      this.props.handleRemove(); // 执行父组件传来的回调函数(public)
    }
    this.setState({
      visible: false,
    });
  };

  handleVisible = (visible) => {
    this.setState({ visible });
  };

  render() {
    const visibleTrigger = (
      <Button size="small" type="normal">
        删除
      </Button>
    );

    const content = (
      <div>
        <div style={styles.contentText}>确认删除？</div>
        <Button
          id="confirmBtn"
          size="small"
          type="normal"
          shape="warning"
          style={{ marginRight: '5px' }}
          onClick={(visible) => this.handleHide(visible, 1)}
        >
          确认
        </Button>
        <Button
          id="cancelBtn"
          size="small"
          onClick={(visible) => this.handleHide(visible, 0)}
        >
          关闭
        </Button>
      </div>
    );

    return (
      <Balloon
        trigger={visibleTrigger}
        triggerType="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisible}
      >
        {content}
      </Balloon>
    );
  }
}

const styles = {
  contentText: {
    padding: '5px 0 15px',
  },
};
