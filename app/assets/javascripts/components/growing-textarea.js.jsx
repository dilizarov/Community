var GrowingTextarea = React.createClass({

  getInitialState: function() {
    return {
      baseScrollHeight: undefined,
      rows: this.props.rows || this.props.minRows || 2
    };
  },

  render: function() {
    return (<textarea id={this.props.textId} rows={this.state.rows} onFocus={this.onFocus} onChange={this.onChange}></textarea>)
  },

  onChange: function() {
    var minRows = this.props.minRows;
    ReactDOM.findDOMNode(this).rows = minRows;
    var scrollHeight = ReactDOM.findDOMNode(this).scrollHeight;
    var rows = Math.ceil((scrollHeight - this.state.baseScrollHeight) / 16) + minRows;
    this.setState({rows: rows});
    ReactDOM.findDOMNode(this).rows = rows;
  },

  onFocus: function() {
    var value = ReactDOM.findDOMNode(this).value
    ReactDOM.findDOMNode(this).value = ''
    this.setState({
      baseScrollHeight: ReactDOM.findDOMNode(this).scrollHeight
    });
    ReactDOM.findDOMNode(this).value = value;
  }
});
