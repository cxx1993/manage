/**
 * 处理请求前data
 * 处理请求后token
 * @author：chenxin
 */
import { createHashHistory } from 'history';

import { Feedback } from '@icedesign/base';
import { setAuthority, getAuthority } from '@/utils/authority';

const history = createHashHistory();

// 处理请求前
export const handleREQ = (req = {}) => {
  const token = getAuthority();
  if (token) {
    return { ...req, ...{ token } };
  }
  return req;
};

//  处理请求后
export const handleRES = res => {
  const { tk, message, token } = res;
  if (tk === 0) {
    // token有问题
    Feedback.toast.error(message);
    // 清除token
    // setAuthority('');    // 貌似有问题，不能清除
    // 跳转至login页
    history.push('/user/login');
  }
  if (token) {
    setAuthority(token); // 更新token，不让他过期
  }
  return token;
};

export const getToken = getAuthority;
