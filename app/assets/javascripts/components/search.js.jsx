var Search = React.createClass({

  maybeGoToCommunity: function(e) {
    if (e.keyCode === 13) {
      this.props.handleSelectCommunity(
        e.target.value
      )
    }
  },

  render: function() {
    return (
      <div className="search">
        <input type="text"
               id="search"
               placeholder="Visit a community"
               onKeyUp={this.maybeGoToCommunity} />
      </div>
    )
  }

})
