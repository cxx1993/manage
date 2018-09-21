import React, { Component } from 'react';

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

const test = WrappedComponent => {
  console.log('testHoc');
  return class HOC extends Component {
    static displayName = `HOC(${getDisplayName(WrappedComponent)})`
    test = () => {}
    render() {
      return <WrappedComponent {...this.props} test={this.test} />;
    }
  };
};
export default test;
