var App = React.createClass({
  
  getInitialState: function() {
    return {
      communitySelected: false,
      notificationPresent: false,
      triggerWelcome: Session.needsMetaAccount()
    };
  },
  
  selectCommunity: function(community) {
    var normalizedCommunity = $.trim(community.toLowerCase()).split(' ').join('_')
    
    this.setState({
      communitySelected: true,
      communityName: community,
      communityNameNormalized: normalizedCommunity,
      notificationPresent: false,
      forceReceiveProps: true
    })
  },
  
  notificationPressed: function(notification) {
    this.setState({
      communitySelected: false,
      notificationPresent: true,
      notification: notification
    });
  },
  
  addCommunityToList: function(community) {
    this.refs.communitiesList.addCommunity(community)
  },
  
  goToApp: function() {
    this.setState({
      triggerWelcome: false
    })
  },
  
  sessionChanged: function() {
    
  },
  
  render: function() {
    
    if (this.state.triggerWelcome === true) {
      return (
        <div className="welcome">
          <Welcome segueToApp={this.goToApp} />
        </div>
      )
    } else {
      var mainContent;
    
      if (this.state.notificationPresent === true) {
        mainContent = <NotificationPost postId={this.state.notification.post_id} />
      } else {
        mainContent = <Feed communityName={this.state.communitySelected ? this.state.communityName : 'No Community'}
                    communityNameNormalized={this.state.communitySelected ? this.state.communityNameNormalized : 'No Community'}
                    forceReceiveProps={this.state.forceReceiveProps}
                    handleAddCommunityToList={this.addCommunityToList}/>
      }
    
      return (
        <div className='app'>
          <div className='row'>
            <SessionHandler handleSessionChange={this.sessionChanged} />
          </div>
          <div className='row'>
            <Search handleSelectCommunity={this.selectCommunity} />
          </div>
          <div className='row'>
            <div className='small-4 column'>
              <Communities handleSelectCommunity={this.selectCommunity} ref='communitiesList' />
            </div>
            <div className='small-7 column'>
              {mainContent}
            </div>
            <div className='small-1 column'>
              <Notifications handleNotificationPressed={this.notificationPressed} />
            </div>
          </div>
        </div>
      )
    }
  }
  
})