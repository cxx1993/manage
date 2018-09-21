import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

export default class Logo extends PureComponent {
  render() {
    return (
      <div className="logo" style={{}}>
        <Link to="/" className="logo-text" style={{ color: 'white', fontSize: '26px' }}>
          后台管理系统
        </Link>
      </div>
    );
  }
}
