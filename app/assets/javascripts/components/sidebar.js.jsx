var Sidebar = React.createClass({

  getInitialState: function() {
    return {
      hasJoined: null
    };
  },

  setHasJoinedStatus: function(hasJoined) {
    this.setState({hasJoined: hasJoined});
  },

  handleMembershipStatus: function() {
    var membershipStatus;

    if (this.state.hasJoined === null) {
      membershipStatus = <a className='join-settings-link disabled'></a>
    } else if (this.state.hasJoined === true) {
      membershipStatus = <a className='join-settings-link' onClick={this.showCommunitySettings}>Settings</a>
    } else {
      membershipStatus = <a className='join-settings-link' onClick={this.joinCommunity}>Join</a>
    }

    return membershipStatus;
  },

  joinCommunity: function() {

    $.ajax({
      method: "POST",
      url: "api/v1/communities.json",
      data: { auth_token: Session.authToken(), user_id: Session.userId(), community: this.props.communityName },
      success: function(res) {
        this.setState({hasJoined: true});
        this.props.handleAddCommunityToList(res.community);
      }.bind(this),
      error: function(err) {
        alert('fuckkkk')
      }.bind(this)
    })
  },

  showCommunitySettings: function() {
  },

  render: function() {
    var membershipStatus = this.handleMembershipStatus();

    return (
      <div className='sidebar-container'>
        <div className='side-wrapper'>
          <span style={{wordWrap: 'break-word'}}>{this.props.communityName}</span>
          <p></p>
          {membershipStatus}
        </div>
        <div className='terms-fineprint'>
          iOS App, <a href="https://www.iubenda.com/privacy-policy/908716" target="_blank">Privacy</a>, <a href="/terms-of-service" target="_blank">Terms</a>
        </div>
      </div>
    )
  }

})
