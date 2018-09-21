import React, { Component } from 'react';
import { Upload } from '@icedesign/base';

import './Upload.scss';

const { ImageUpload } = Upload;

export default class Classify extends Component {
  render() {
    return (
      <ImageUpload
        listType="picture-card"
        action="http://127.0.0.1:3000/upload/image"
        accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
        locale={{
          image: {
            cancel: '取消上传',
            addPhoto: '上传图片',
          },
        }}
        // beforeUpload={beforeUpload}
        // onChange={onChange}
        // onSuccess={onSuccess}
        // onError={onError}
      />
    );
  }
}

// function onSuccess(res, file) {
//   console.log('onSuccess');
//   console.log(res);
//   console.log(file);
// }

// function onError(err, res, file) {
//   console.log('onError');
//   console.log(err);
//   console.log(res);
//   console.log(file);
// }

// function beforeUpload(info) {
//   console.log('beforeUpload callback : ', info);
// }

// function onChange(info) {
//   console.log('onChane callback : ', info);
// }
