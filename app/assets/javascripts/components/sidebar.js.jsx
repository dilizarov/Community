var Sidebar = React.createClass({

  getInitialState: function() {
    return {
      hasJoined: null,
      notificationLoaded: null
    };
  },

  componentWillReceiveProps: function(props) {

    if (this.avatarAboutToChange) {
      this.avatarAboutToChange = null;
      return;
    }

    this.setState({
      hasJoined: null,
      notificationLoaded: null,
      errorGettingRelations: false,
      errorOnJoin: false
    })
  },

  prepForAvatarChange: function() {
    this.avatarAboutToChange = true;
  },

  setCommunityRelations: function(hasJoined, relationship, error) {
    this.setState({hasJoined: hasJoined, relationship: relationship, errorGettingRelations: !!error});
  },

  handleMembershipStatus: function() {
    var membershipStatus;

    if (this.props.notificationPresent === true || this.props.communityNameNormalized === '') {
      if (this.state.notificationLoaded === false) {
        membershipStatus = <div style={{textAlign: 'center', marginTop: 12}}><Spinner size="sm" /></div>
      }
    } else if (this.state.joining === true) {
      membershipStatus = <a className="join-settings-link disabled"><Spinner /></a>
    } else if (this.state.errorGettingRelations === true) {
      membershipStatus;
    } else if (this.state.hasJoined === null) {
      membershipStatus = <div style={{textAlign: 'center', marginTop: 12}}><Spinner size="sm" /></div>
    } else if (this.state.hasJoined === true) {
      membershipStatus = <a className='join-settings-link' onClick={this.showCommunitySettings}>Settings</a>
    } else if (this.state.errorOnJoin){
      //@TODO Style text etc.
      membershipStatus = (
        <Tooltip ref="tooltip" title="Had trouble joining community" position='right'>
          <a className='join-settings-link failed-join' onClick={this.joinCommunity}>Join</a>
        </Tooltip>
      )
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
        this.setState({hasJoined: true, relationship: res.community, joining: false, errorOnJoin: false});
        this.props.handleAddCommunityToList(res.community);
      }.bind(this),
      error: function(err) {
        this.setState({hasJoined: false, joining: false, errorOnJoin: true},
        function() {
          this.refs.tooltip.show()
        })
      }.bind(this)
    })
  },

  showCommunitySettings: function() {
    this.props.handleOpenSettings(this.state.relationship)
  },

  updateCommunitySettings: function (relationship) {
    if (this.state.relationship && this.state.relationship.normalized_name) {
      if (this.state.relationship.normalized_name === relationship.normalized_name) {
        this.setState({
          relationship: relationship
        })
      }
    }
  },

  goToCommunity: function () {
    if (this.props.notification) {
      this.props.handleSelectCommunity(this.props.notification.community_normalized);
    }
  },

  toggleNotificationLoaded: function (loaded) {
    this.setState({
      notificationLoaded: loaded
    })
  },

  render: function() {
    var membershipStatus = this.handleMembershipStatus();

    var sidewrapperClass = classNames(
      'side-wrapper',
      { 'empty' : this.props.communityNameNormalized === '' && this.props.notificationPresent === false }
    );

    var termsFineprintClass = classNames(
      'terms-fineprint',
      { 'empty' : this.props.communityNameNormalized === '' && this.props.notificationPresent === false }
    );

    var title;

    if (this.props.notificationPresent === true) {
      title = <span style={{wordWrap: 'break-word'}}>Notification from <a onClick={this.goToCommunity} style={{cursor: 'pointer'}}>{'&' + this.props.notification.community_normalized}</a></span>
    } else {
      title = <span style={{wordWrap: 'break-word'}}>{this.props.communityName}</span>;
    }

    return (
      <div className='sidebar-container'>
        <div className={sidewrapperClass}>
          {title}
          {membershipStatus}
        </div>
        <div className={termsFineprintClass}>
          <a href="#">iOS App</a>
          <a href="https://www.iubenda.com/privacy-policy/908716" target="_blank">Privacy</a>
          <a href="/terms-of-service" target="_blank">Terms</a>
        </div>
      </div>
    )
  }

})
