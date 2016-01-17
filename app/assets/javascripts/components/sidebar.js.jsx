var Sidebar = React.createClass({

  getInitialState: function() {
    return {
      hasJoined: null
    };
  },

  componentWillReceiveProps: function(props) {
    this.setState({
      hasJoined: null
    })
  },

  setCommunityRelations: function(hasJoined, relationship) {
    this.setState({hasJoined: hasJoined, relationship: relationship});
  },

  handleMembershipStatus: function() {
    var membershipStatus;

    membershipStatus = <div style={{textAlign: 'center'}}><Spinner size="sm" /></div>

    if (this.state.joining === true) {
      membershipStatus = <a className="join-settings-link disabled"><Spinner /></a>
    } else if (this.state.hasJoined === null) {
      membershipStatus = <div style={{textAlign: 'center'}}><Spinner size="sm" /></div>
    } else if (this.state.hasJoined === true) {
      membershipStatus = <a className='join-settings-link' onClick={this.showCommunitySettings}>Settings</a>
    } else {
      membershipStatus = <a className='join-settings-link' onClick={this.joinCommunity}>Join</a>
    }

    return membershipStatus;
  },

  joinCommunity: function() {

    this.setState({
      joining: true
    })

    $.ajax({
      method: "POST",
      url: "api/v1/communities.json",
      data: { auth_token: Session.authToken(), user_id: Session.userId(), community: this.props.communityName },
      success: function(res) {
        this.setState({hasJoined: true, relationship: res.community, joining: false});
        this.props.handleAddCommunityToList(res.community);
      }.bind(this),
      error: function(err) {
        this.setState({hasJoined: false, joining: false})
      }.bind(this)
    })
  },

  showCommunitySettings: function() {
    this.props.handleOpenSettings(this.state.relationship)
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
          <a href="#">iOS App</a>
          <a href="https://www.iubenda.com/privacy-policy/908716" target="_blank">Privacy</a>
          <a href="/terms-of-service" target="_blank">Terms</a>
        </div>
      </div>
    )
  }

})
