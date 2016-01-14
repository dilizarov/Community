var ConfirmLeaveCommunityModalHandler = React.createClass({

  getInitialState: function() {
    return {
      revealContent: ''
    }
  },

  openForCommunity: function(community, successCallback) {

    var that = this;

    var wrapperCallback = function () {
      successCallback()
      that.refs.foundationReveal.closeModal();
    }

    var revealContent = (<div>
      <h2 style={{wordWrap: 'break-word'}}>Leave &{community.normalized_name}?</h2>
      <a className="secondary button" onClick={this.refs.foundationReveal.closeModal}>Cancel</a> <a className="alert button" onClick={wrapperCallback}>Confirm</a>
    </div>)

    this.setState({
      revealContent: revealContent
    }, function () {
      this.refs.foundationReveal.handleClick();
    })

  },

  render: function() {
    return (
      <div>
        <FoundationReveal ref="foundationReveal" revealContent={this.state.revealContent} />
      </div>
    )
  }

})
