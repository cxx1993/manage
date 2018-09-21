/**
 * 配置静态值
 */
import DynamicIcon from 'dynamic-icon';

import { get, put, post, del } from './http';

// import { Feedback } from '@icedesign/base';

// const Toast = Feedback.toast;

// 使用 custom 生成自定义 ICON 组件
const CustomIcon = DynamicIcon.create({
  fontFamily: 'iconfont',
  prefix: 'i-icon',
  css: 'https://at.alicdn.com/t/font_789568_rkm2ot5lezm.css',
});

// 脚本for iconfont css
// 提取icon-xxxx的xxxx
// 直接提取整个css文件作为str传入
const GetIconList = function (str) {
  const arr = [];
  str.split('.icon-').forEach(v => {
    if (v.indexOf(':before') !== -1) {
      arr.push(v.split(':before')[0]);
    }
  });
  // console.log(arr);
};

export default {
  CustomIcon,
  GetIconList,
  get,
  put,
  post,
  del,
};

export const tableDefault = {
  size: 8, // 分页数
};
