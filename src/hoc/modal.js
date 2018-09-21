// 不是HOC
// 作为父组件

import React, { Component } from 'react';
import { Dialog } from '@icedesign/base';

// 默认父组件fn，改变父组件的对应state
export default class Modal extends Component {
  static defaultProps = {
    handleModelChange: () => {},
  }

  constructor(props) {
    super(props);

    this.bob = {
      visible: false,
      title: 'title',
      style: {
        width: '80%',
      },
      closable: 'esc,mask,close',
    };
  }

  onOk = () => {

  }
  onClose = () => {
    // console.log('onClose');
    this.bob.visible = false;
    const { handleModelChange } = this.props;
    handleModelChange({ visible: false });
    this.forceUpdate();
  }

  shouldComponentUpdate(nextProps) { // nextState
    const a = String(nextProps.visible);
    const b = String(this.bob.visible);

    if (a === b) {
      return false;
    }

    if (nextProps === this.props) {
      // 自身改变的
      this.bob = {
        ...nextProps,
        ...this.bob,
      };
    } else {
      // 外部传入的
      this.bob = {
        ...this.bob,
        ...nextProps,
      };
    }


    return true;
  }

  componentWillMount() {
    this.bob = {
      ...this.bob,
      ...this.props,
    };
  }

  render() {
    // console.log('render', this.state.visible);

    const children = this.props.children.length ? this.props.children : [this.props.children];
    // const { visible, title, style, closable } = this.bob;

    return (
      <Dialog
        onOk={this.onClose}
        onCancel={this.onClose}
        onClose={this.onClose}
        // visible={visible}
        // onClose={this.onClose}
        // title={title}
        // style={style}
        {...this.bob}
      >
        {
           children.map((child, i) => <div key={{ i }}>{child}</div>)
        }
      </Dialog>
    );
  }
}

// const modelHoc = WrappedComponent => class extends Component {

//   constructor(props) {
//     super(props);

//     this.state = {
//       visible: false,
//     };
//   }


//   onOk() {}

//   onCancel() {}

//   render() {
//     return (
//       <Dialog
//         visible={this.state.visible}
//         onOk={this.onClose}
//         closable="esc,mask,close"
//         onCancel={this.onClose}
//         onClose={this.onClose}
//         title="Alibaba.com"
//         style={{ width: '80%' }}
//       >
//         <WrappedComponent
//           {...this.props}
//           ref={(instanceComponent => {
//             console.log(instanceComponent);
//             this.instanceComponent = instanceComponent;
//           })}
//         />
//       </Dialog>
//     );
//   }

//   componentDidMount() {
//     // this.instanceComponent = WrappedComponent;
//     console.log(this.instanceComponent, 'instanceComponent');
//   }
// };


// export default modelHoc;
