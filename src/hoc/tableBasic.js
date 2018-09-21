import React, { Component } from 'react';
import global from '@/utils/global';
import { Feedback } from '@icedesign/base';

const { get, post } = global;
const Toast = Feedback.toast;

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

/**
 *
 * 分页拆出 handlePagechange
 * 删除多个拆出 deleteSelectedKeys
 */

export default function (options = {}) {
  return function (WrappedComponent) {
    return class HOC extends Component {
      static displayName = `TableBasicHoc(${getDisplayName(WrappedComponent)})`;

      static defaultProps = {
        ...options,
      };

      constructor(props) {
        super(props);
        this.state = {
          collectionName: '', // 请求的表名
        };
      }


      // 处理分页change
      handlePagechange = current => {
        // current不currentPage大1
        this.instanceComponent.tableData.currentPage = current;
        this.instanceComponent.handleDataUpdate();
      };

      // 删除多个
      deleteSelectedKeys = () => {
        const { selectedRowKeys } = this.instanceComponent.state;
        const ids = JSON.stringify(selectedRowKeys);
        const { collectionName } = this.props;
        post(`${collectionName}/deletes`, { ids })
          .then(res => {
            Toast.success(res.message);
            this.instanceComponent.handleDataUpdate();
          })
          .catch(err => {
            console.log(err);
            Toast.error('删除失败');
          });
      };

      // 单行更新 -- 编辑
      // 暂时废弃，没挪过来
      handleSingleUpdate = (id, cb = () => {}) => {
        // console.log(record);
        const { collectionName } = this.props;
        get(`${collectionName}/find/${id}`).then(res => {
          cb(res);
        });
      };

      render() {
        return (
          <WrappedComponent
            {...this.props}
            ref={instanceComponent =>
              (this.instanceComponent = instanceComponent)
            }
            handlePagechange={this.handlePagechange}
            deleteSelectedKeys={this.deleteSelectedKeys}
          />
        );
      }
    };
  };
}
