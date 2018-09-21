/* eslint no-plusplus:0 */
import React, { Component } from 'react';
import {
  Table,
  Button,
  Icon,
  Pagination,
  DatePicker,
  moment,
} from '@icedesign/base';
import DataBinder from '@icedesign/data-binder';
import IceContainer from '@icedesign/container';
import global, { tableDefault } from '@/utils/global';
import { handleRES, getToken } from '@/utils/request';
import DeleteBalloon from '@/hoc/deleteBtn';
import TableBasic from '@/hoc/tableBasic';
import Model from '@/hoc/modal';

// component
import Form from './components/form';

// css
import './Record.scss';

const { RangePicker } = DatePicker;
const { get } = global;

const collectionName = 'records';
let formParams = {
  data: {}, // 传给form的数据
  type: 'add', // 传给form的表单类型  add/update
};

@DataBinder({
  dataList: {
    url: `${collectionName}/list`,
    method: 'post',
    data: {},
    headers: {
      'x-access-token': getToken(),
    },
    defaultBindingData: {
      docs: [],
      total: 0,
    },
    responseFormatter: (responseHandler, res, originResponse) => {
      handleRES(res);
      // 回传给处理函数
      // 不做回传处理会导致数据更新逻辑中断
      responseHandler({ data: res.result }, originResponse);
    },
  },
})
@TableBasic({ collectionName })
export default class Record extends Component {
  static displayName = 'Record';

  static propTypes = {};

  static defaultProps = {};

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState === this.state) {
      return false;
    }
    return true;
  }

  constructor(props) {
    super(props);

    // 表格可以勾选配置项
    this.rowSelection = {
      // 表格发生勾选状态变化时触发
      onChange: _id => {
        this.setState({
          selectedRowKeys: _id,
        });
      },
    };

    this.state = {
      isLoading: false, // 表格加载状态
      selectedRowKeys: [],
      visible: false,
      title: '新增',
      delModel: {
        // 弹出警告的model
        visible: false,
        text: '确认删除选中数据吗？',
      },
    };

    // 表格参数
    this.tableData = {
      currentPage: 1, // 当前页
      sdate: '',
      edate: '',
      ...tableDefault, // size
    };
  }

  // 增加btn click
  onAdd = () => {
    formParams = {
      data: {},
      type: 'add',
    };

    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  // 表格渲染 - 操作列
  tableOperator = (value, index, record) => {
    return (
      <div>
        <Button
          size="small"
          type="secondary"
          style={{ marginRight: '5px' }}
          onClick={this.handleSingleUpdate.bind(this, record)}
        >
          编辑
        </Button>
        <DeleteBalloon
          collectName={collectionName}
          // eslint-disable-next-line
          id={record._id}
          successDel={this.handleDataUpdate}
        />
      </div>
    );
  };

  // 单行更新 -- 编辑
  handleSingleUpdate = record => {
    // eslint-disable-next-line
    get(`${collectionName}/find/${record._id}`).then(res => {
      formParams = {
        data: res.result,
        type: 'update',
      };
      this.setState({
        visible: true,
        title: '编辑',
      });
    });
  };

  // 重置表单
  handleReset = () => {};

  // 处理表格更新
  handleDataUpdate = () => {
    this.setState({ isLoading: true });
    const { currentPage, sdate, edate, size } = this.tableData;
    const data = {
      query: {
        sdate,
        edate,
      },
      options: {
        page: currentPage,
        limit: size,
      },
    };

    this.props.updateBindingData('dataList', { data }, () => {
      // console.log(res);
      this.setState({ isLoading: false });
    });
  };

  // 处理表单成功的回调
  handleFormSuccess = () => {
    this.setState({
      visible: false,
    });
    // 刷新表格
    this.handleDataUpdate();
  };

  render() {
    const { docs, total } = this.props.bindingData.dataList;
    const { isLoading, title, visible, delModel } = this.state;
    const { currentPage, size } = this.tableData;

    return (
      <div className="selectable-table users">
        <IceContainer className="IceContainer">
          <div>
            <Button onClick={this.onAdd} size="small" className="batchBtn">
              <Icon type="add" />
              增加
            </Button>
            <Button
              onClick={this.props.deleteSelectedKeys}
              size="small"
              className="batchBtn"
              disabled={!this.state.selectedRowKeys.length}
            >
              <Icon type="ashbin" />
              删除
            </Button>
            {/* <Button
              onClick={this.clearSelectedKeys}
              size="small"
              className="batchBtn"
            >
              <Icon type="close" />
              清空选中
            </Button> */}
            <RangePicker
              // onChange={(val, str) => console.log(val, str)}
              onStartChange={val => (this.tableData.sdate = val || '')}
              onEndChange={val => {
                if (val) {
                  val.setHours(23);
                  val.setMinutes(59);
                  val.setSeconds(59);
                }

                this.tableData.edate = val || '';
              }}
            />
            <Button
              size="small"
              style={{ marginLeft: '10px' }}
              onClick={this.handleDataUpdate}
            >
              <Icon type="search" />
              查找
            </Button>
            {/* <Button
              size="small"
              style={{ marginLeft: '10px' }}
              onClick={this.handleReset}
            >
              <Icon type="reset" />
              重置
            </Button> */}
          </div>
        </IceContainer>
        <IceContainer>
          <Table
            primaryKey="_id"
            dataSource={docs}
            isLoading={isLoading}
            rowSelection={{
              ...this.rowSelection,
              selectedRowKeys: this.state.selectedRowKeys,
            }}
          >
            {/* <Table.Column title="用户" dataIndex="userId" width={120} /> */}
            <Table.Column title="用户名" dataIndex="username" width={120} />
            <Table.Column
              title="事件类型"
              dataIndex="classifyName"
              width={120}
            />
            {/* <Table.Column title="事件类型" dataIndex="classifyId" width={120} /> */}
            <Table.Column
              title="操作类型"
              cell={value => {
                return value ? '收入' : '支出';
              }}
              dataIndex="type"
              width={80}
            />
            <Table.Column
              title="金额"
              cell={(value, index, record) => {
                value = value.toFixed(2);
                return record.type ? `+${value}` : `-${value}`;
              }}
              dataIndex="balance"
              width={100}
            />
            <Table.Column
              title="创建时间"
              cell={value => {
                return moment(new Date(value)).format('YYYY/MM/DD hh:mm:ss');
              }}
              dataIndex="createDate"
              width={100}
            />
            <Table.Column title="描述" dataIndex="content" width={120} />
            <Table.Column
              title="操作"
              cell={this.tableOperator}
              lock="right"
              width={140}
            />
          </Table>
          <div className="pagination">
            <Pagination
              hideOnlyOnePage
              showJump
              shape="arrow-only"
              pageSize={size}
              total={total}
              current={currentPage}
              onChange={this.props.handlePagechange} // hoc tableBasic
            />
          </div>
        </IceContainer>
        {/* 隐藏的表单 */}
        <Model
          visible={delModel.visible}
          title="警告"
          footer={false}
          handleModelChange={state =>
            this.setState({ ...this.state, ...state })
          }
        >
          <div>{delModel.text}</div>
        </Model>
        <Model
          visible={visible}
          title={title}
          footer={false}
          handleModelChange={state =>
            this.setState({ ...this.state, ...state })
          }
        >
          <Form
            handleFormSuccess={this.handleFormSuccess}
            formParams={formParams}
            collectionName={collectionName}
          />
        </Model>
      </div>
    );
  }

  componentDidMount() {
    // 拉取第一页的数据
    this.handleDataUpdate();
  }
}
