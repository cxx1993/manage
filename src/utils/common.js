/**
 * 公共方法
 */
import cityJSON from '@/assets/json/city.json';

// 返回是否为‘空值’
export function isEmpty(v) {
  return v === null || v === undefined || trim(v) === '';
}

// 检查是否为空对象
export function isEmptyObject(obj) {
  if (obj) {
    for (key in obj) {  // eslint-disable-line
      return false;
    }
  }

  return true;
}

// 去除两端空格
export function trim(str) {
  return str.toString().replace(/^\s*$/g, '');
}

/**
 * ==== table handle start ====
 */
export function handleGender(gender) {
  return gender ? '男' : '女';
}

// 城市传入code 返回具体值
export function handleCity(code) {
  let city = '';
  const getCity = function (arr, plabel) {
    // eslint-disable-next-line
    for (const v of arr) {
      if (v.value === code) {
        city = `${plabel}/${v.label}`;
        break;
      }
      if (v.children && v.children.length) {
        getCity(v.children, `${plabel}/${v.label}`);
      }
    }
  };
  getCity(cityJSON, '');
  return city && city.replace('/', '');
}

/**
 * ==== form start ====
 */
export function checkMobile(mobile) {
  const res = {
    message: '',
    result: true,
  };

  if (isEmpty(mobile)) {
    return { result: false, message: '不能为空' };
  } else if (isNaN(mobile) || mobile.toString().length !== 11) {
    return { result: false, message: '格式不正确' };
  }

  return res;
}
