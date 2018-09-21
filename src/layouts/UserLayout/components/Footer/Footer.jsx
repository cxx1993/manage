import React from 'react';

export default () => {
  return (
    <div style={styles.footer}>
      <div style={styles.copyright}>chenxin © 2018 版权所有</div>
    </div>
  );
};

const styles = {
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    left: '0',
    right: '0',
    bottom: '20px',
  },
  copyright: {
    fontSize: '13px',
    color: 'rgba(0, 0, 0, .45)',
    lineHeight: 1.5,
    textAlign: 'right',
  },
};
