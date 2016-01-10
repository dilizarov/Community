var Header = React.createClass({

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

  //@TODO: reloadWindow in SessionBox
  reloadWindow: function() {
    window.location.reload()
  },

  render: function() {
    var membershipStatus = this.handleMembershipStatus();

    return (
      <div className='header-wrapper'>
        <span className='community-logo'>&{this.props.communityNameNormalized}</span>
        {membershipStatus}
        <Search handleSelectCommunity={this.props.handleSelectCommunity} />
        <span className="top-notifications-wrapper">
          <Notifications currentCommunity={this.props.currentCommunity}
                         handleNotificationPressed={this.props.handleNotificationPressed}/>
          <SessionBox handleSessionChange={this.reloadWindow} />
        </span>
          {/* <a className="button tiny radius" href="#" onClick={this.changeProfilePic} >Browse</a>
          <input type="file" id="profile-pic-picker" accept="image/jpeg, image/png, image/jpg" onChange={this.cropImageUI} style={{visibility: 'hidden'}} />
          <img id="profile-pic" /> */}
      </div>
    )
  }

})
