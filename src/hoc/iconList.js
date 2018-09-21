// 不是HOC
// 作为子组件
import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Feedback } from '@icedesign/base';
import global from '../utils/global';

const { CustomIcon } = global;

const all = ['zhangbei', 'riyongbaihuo', 'yule-copy', 'lvxing', 'qita', 'liwu', 'fangyuan', 'xuexi', 'haizi', 'yundong', 'gouwu', 'shucai', 'yiliao', 'shengjilijin', 'jiaotong', 'dianhua'];

export default class IconList extends Component {
    copied = () => {
      Feedback.toast.success('复制成功！');
    };

    renderIcon = (type, idx) => {
      const ntype = type.replace('icon-', '');
      return (
        <div
          style={{
            display: 'inline-block',
            minWidth: '150px',
            paddingBottom: '15px',
            cursor: 'pointer',
          }}
          key={idx}
        >
          <CustomIcon size="large" type={ntype} style={{ position: 'relative', top: '3px' }} />
          <CopyToClipboard text={ntype} onCopy={this.copied}>
            <span style={{ marginLeft: '5px' }}>{ntype}</span>
          </CopyToClipboard>
        </div>
      );
    };

    render() {
      return <div>{all.map(this.renderIcon)}</div>;
    }
}
