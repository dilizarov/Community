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

    var twitterUrl = "https://www.get.community/&" + this.props.communityNameNormalized;

    if (this.props.notificationPresent === true || this.props.communityNameNormalized === '') {
      if (this.state.notificationLoaded === false) {
        membershipStatus = <div style={{textAlign: 'center', marginTop: 12}}><Spinner size="sm" /></div>
      }
    } else if (this.state.joining === true) {
      membershipStatus = (
        <span>
          <a className="sidebar-link disabled"><Spinner /></a>
          <a className='sidebar-link' onClick={this.shareFB}>Share on FB</a>
          <a className='sidebar-link' href={twitterUrl} ref="tweet_button" onClick={this.tweet}>Tweet</a>
        </span>
      )
    } else if (this.state.errorGettingRelations === true) {
      membershipStatus;
    } else if (this.state.hasJoined === null) {
      membershipStatus = <span><div style={{textAlign: 'center', marginTop: 12}}><Spinner size="sm" /></div></span>
    } else if (this.state.hasJoined === true) {
      membershipStatus = (
        <span>
          <a className='sidebar-link' onClick={this.showCommunitySettings}>Settings</a>
          <a className='sidebar-link' onClick={this.shareFB}>Share on FB</a>
          <a className='sidebar-link' href={twitterUrl} ref="tweet_button" onClick={this.tweet}>Tweet</a>
        </span>
      )
    } else if (this.state.errorOnJoin){
      //@TODO Style text etc.
      membershipStatus = (
        <span>
          <Tooltip ref="tooltip" title="Had trouble joining community" position='right'>
            <a className='sidebar-link failed-join' onClick={this.joinCommunity}>Join</a>
          </Tooltip>
          <a className='sidebar-link' onClick={this.shareFB}>Share on FB</a>
          <a className='sidebar-link' href={twitterUrl} ref="tweet_button" onClick={this.tweet}>Tweet</a>
        </span>
      )
    } else {
      membershipStatus = (
        <span>
          <a className='sidebar-link' onClick={this.joinCommunity}>Join</a>
          <a className='sidebar-link' onClick={this.shareFB}>Share on FB</a>
          <a className='sidebar-link' href={twitterUrl} ref="tweet_button" onClick={this.tweet}>Tweet</a>
        </span>
      )
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

  shareFB: function() {
    FB.ui(
      {
        method: 'share',
        href: 'https://www.get.community/&' + this.props.communityNameNormalized,
        title: '&'+ this.props.communityNameNormalized + ' on Community',
        picture: 'https://www.get.community/android-chrome-192x192.png',
        description: 'Head to &' + this.props.communityNameNormalized + ' and join the conversation!'
      },
      function(res){
      }
    )
  },

  tweet: function(e) {
    e.preventDefault();

    var loc = encodeURIComponent(this.refs.tweet_button.href);
    var title = encodeURIComponent("Head to &" + this.props.communityNameNormalized + " and join the conversation!");
    var hashtag = "Community";

    window.open('http://twitter.com/share?url=' + loc + '&text=' + title + '&hashtags=' + hashtag + "&", 'twitterwindow', 'height=450, width=550, top='+($(window).height()/2 - 225) +', left='+$(window).width()/2 +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
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
          <a href="https://itunes.apple.com/app/community-home-to-communities/id1090506668?mt=8" target="_blank">iOS App</a>
          <a href="https://www.iubenda.com/privacy-policy/908716" target="_blank">Privacy</a>
          <a href="/terms-of-service" target="_blank">Terms</a>
        </div>
      </div>
    )
  }

})
