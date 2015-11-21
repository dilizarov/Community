var GrowingTextarea = React.createClass({

  getInitialState: function() {
    return {
      baseScrollHeight: undefined,
      rows: this.props.rows || this.props.minRows || 2
    };
  },

  haltEnter: function(e) {
    if (e.keyCode === 13 && !e.shiftKey && $.trim(e.target.value) !== '') {
      e.preventDefault()
    }
  },

  clearTextarea: function() {
    ReactDOM.findDOMNode(this).value = ''
  },

  render: function() {

    var emptyFunction = function(){}

    return (<textarea rows={this.state.rows}
                      onFocus={this.onFocus}
                      onChange={this.onChange}
                      onKeyDown={this.props.keyDownEnterHalt ? this.haltEnter : emptyFunction}
                      onKeyUp={this.props.handleKeyUp}></textarea>)
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
