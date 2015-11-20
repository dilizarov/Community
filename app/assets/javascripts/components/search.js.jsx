var Search = React.createClass({

  goToCommunity: function(e) {
    if (e.keyCode === 13) {
      this.props.handleSelectCommunity(
        this.refs.searchInput.value
      )
    }
  },

  render: function() {
    return (
      <div className="search">
        <input type="text"
               id="search"
               placeholder="Visit a community"
               ref="searchInput"
               onKeyUp={this.goToCommunity} />
      </div>
    )
  }

})
