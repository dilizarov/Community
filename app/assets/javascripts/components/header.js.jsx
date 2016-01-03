var Header = React.createClass({

  getInitialState: function() {
    return {
      hasJoined: null
    };
  },

  setStatus: function(hasJoined) {
    this.setState({hasJoined: hasJoined});
  },

  //Displays membership status - when in the initial state, show nothing
  //Else show 'Join' for non-member status, and 'Settings' for member status
  handleMembershipStatus: function() {
    var membershipStatus = '';
    if(this.state.hasJoined) {
      membershipStatus = 'Settings';
    }
    else if(this.state.hasJoined === false) {
      membershipStatus = 'Join';
    }
    return membershipStatus;
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
        <span className='community-status'>{membershipStatus}</span>
        <Search handleSelectCommunity={this.props.handleSelectCommunity} />
        <span className="top-notifications-wrapper">
          {Session.userInfo().username}
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
