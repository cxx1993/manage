/**
 * Autosuggest的封装
 * @param {url} string 对应的请求地址url
 * @param {defaultValue} string 默认值
 * @param {urlQueryKey} string 请求对应的key
 * @param {mapToParamText} string 返回的数据中对应的text的key
 * @param {mapToParamValue} string 返回的数据中对应的text的value
 * @param {handleAutoBack} function 将选择的数据中的value以及数据全部传回父组件
 */

import React, { Component } from 'react';
import { Icon } from '@icedesign/base';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import { post } from '@/utils/http';

import './autoSuggest.scss';

let dataSource = [];

export default class AutoSuggest extends Component {
  static displayName = 'Record';

  static propTypes = {
    url: PropTypes.string,
    defaultValue: PropTypes.string,
    urlQueryKey: PropTypes.string,
    mapToParamText: PropTypes.string,
    mapToParamValue: PropTypes.string,
    handleAutoBack: PropTypes.func,
  };

  static defaultProps = {
    url: '',
    defaultValue: '',
    urlQueryKey: 'name',
    mapToParamText: 'text',
    mapToParamValue: 'value',
    handleAutoBack: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      display: 'none', // loading的显隐
      sValue: null,
    };
  }

  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   return true;
  // }

  onChange = (event, { newValue }) => {
    this.setState({
      sValue: newValue,
    });
    this.props.handleAutoBack('');
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    const query = {};
    query[this.props.urlQueryKey] = value;
    this.setState({
      display: 'block',
    });
    post(this.props.url, query).then(res => {
      dataSource = res.isSuccess ? res.result : [];
      this.setState({
        // suggestions: getSuggestions(value),
        suggestions: dataSource,
      });
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    // this.setState({
    //   suggestions: [],
    // });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    // console.log(suggestion, suggestionValue, suggestionIndex, sectionIndex, method);
    const { handleAutoBack, mapToParamValue } = this.props;
    handleAutoBack(suggestion[mapToParamValue], suggestion);
    this.setState({ display: 'none' });
  };

  // render
  getSuggestionValue = suggestion => suggestion[this.props.mapToParamText];

  renderSuggestion = suggestion => (
    <div>{suggestion[this.props.mapToParamText]}</div>
  );

  render() {
    const { suggestions, display, sValue } = this.state;
    const { defaultValue } = this.props;
    const { placeholder } = this.props;
    const inputProps = {
      placeholder,
      value: sValue === null ? defaultValue : sValue,
      onChange: this.onChange,
    };

    return (
      <div className="autoBox">
        <Autosuggest
          // theme={theme}
          suggestions={suggestions}
          onSuggestionsFetchRequested={
            this.props.url ? this.onSuggestionsFetchRequested : null
          }
          onSuggestionSelected={this.onSuggestionSelected}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
        <Icon
          size="small"
          type="loading"
          className="loading"
          style={{ display }}
        />
      </div>
    );
  }
}
