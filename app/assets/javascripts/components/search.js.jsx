var Search = React.createClass({

  maybeGoToCommunity: function(e) {
    if (e.keyCode === 13) {

      var communityName = $.trim(e.target.value)

      if (communityName.length > 0) {
        if (communityName[0] === "&" && communityName.length !== 1) {
          communityName = communityName.substring(1)
        }

        this.props.handleSelectCommunity(
          communityName
        )
      }
    }
  },

  render: function() {
    return (
        <input type="text"
               className="search"
               placeholder="Visit a community"
               onKeyUp={this.maybeGoToCommunity} />
    )
  }

})
