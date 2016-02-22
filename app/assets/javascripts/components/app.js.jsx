var App = React.createClass({

  getInitialState: function() {
    return {
      communitySelected: false,
      notificationPresent: false,
      triggerWelcome: Session.needsMetaAccount()
    };
  },

  componentDidMount: function() {
    var communityParam;

    if (window.location.pathname.length > 2 && window.location.pathname[1] === "&") {
      communityParam = decodeURIComponent(window.location.pathname.substring(2));
    }

    if (communityParam !== undefined && communityParam !== true) {
      this.selectCommunity(communityParam)
    }

    // Used to detect initial (useless) popstate.
    // If history.state exists, assume browser isn't going to fire initial popstate.
    var popped = ('state' in window.history && window.history.state !== null), initialURL = location.href;

    $(window).bind('popstate', function (event) {
      // Ignore inital popstate that some browsers fire on page load
      var initialPop = !popped && location.href == initialURL
      popped = true
      if (initialPop) return;

      var communityParam;

      if (window.location.pathname.length > 2 && window.location.pathname[1] === "&") {
        communityParam = decodeURIComponent(window.location.pathname.substring(2));
      }

      if (this.isMounted()) {
        if (communityParam !== undefined && communityParam !== true) {
          this.selectCommunity(communityParam);
        } else if (communityParam === undefined) {
          this.setState({
            communitySelected: false,
            notificationPresent: false,
            forceReceiveProps: true
          })
        }
      }
    }.bind(this));
  },

  forceAppUpdate: function() {
    console.log('lol')
    this.forceUpdate();
  },

  selectCommunity: function(community, retrying) {

    var normalizedCommunity = normalizeCommunity(community)

    if (history.pushState && !retrying) {

        var newUrl = window.location.protocol + "//" + window.location.host + '/&' + encodeURIComponent(normalizedCommunity);
        if (window.location.href !== newUrl) {
          window.history.pushState({ path: newUrl },'',newUrl);
        }
    }

    var str = document.title

    // If they're the same, we assume no notification count prepends it.
    // If they're not, we assume there is a notification count prepending
    // and we replace it.

    // Outer if is to not interfere with title when in Welcome state
    if (!this.state.triggerWelcome) {
      if (str === this.state.communityName || str === 'Community') {
          document.title = community
      } else {
          document.title = str.substring(0, str.indexOf(")") + 2) + community
      }
    }

    this.setState({
      communitySelected: true,
      communityName: community,
      communityNameNormalized: normalizedCommunity,
      notificationPresent: false,
      forceReceiveProps: true
    })
  },

  notificationPressed: function(notification) {

    if (history.pushState) {
      var newUrl = window.location.protocol + "//" + window.location.host
      if (window.location.href !== newUrl) {
        window.history.pushState({ path: newUrl },'',newUrl);
      }
    }

    this.setState({
      communitySelected: false,
      notificationPresent: true,
      notification: notification
    });
  },

  addCommunityToList: function(community) {
    this.refs.communitiesList.addCommunity(community)
  },

  setCommunityMembershipStatus: function(hasJoined, relationship, error) {
    this.refs.sidebar.setCommunityRelations(hasJoined, relationship, error);
  },

  openSettingsModal: function(relationship) {
    this.refs.settingsModal.openWithCommunityRelationship(relationship);
  },

  goToApp: function() {
    if (this.state.communitySelected && this.state.communityName) {
      document.title = this.state.communityName;
    } else {
      document.title = "Community"
    }

    this.setState({
      triggerWelcome: false
    })
  },

  propogateCommunitySettings: function (relationship) {
    this.refs.sidebar.updateCommunitySettings(relationship);
    this.refs.communitiesList.updateCommunitySettings(relationship);
  },

  toggleSidebarNotificationLoaded: function (loaded) {
    this.refs.sidebar.toggleNotificationLoaded(loaded);
  },

  render: function() {

    var mainContent, communityNameNormalized, currentCommunity;

    if (this.state.triggerWelcome === true) {
      return (
        <div className="welcome">
          <Welcome segueToApp={this.goToApp} />
        </div>
      )
    } else {

      communityNameNormalized = this.state.communitySelected ? this.state.communityNameNormalized : '';
      currentCommunity = this.state.communitySelected ? this.state.communityName : '';

      if (this.state.notificationPresent === true) {
        mainContent = (<NotificationPost notification={this.state.notification}
                                        postId={this.state.notification.post_id}
                                        handleSidebarLoadedState={this.toggleSidebarNotificationLoaded} />)
      } else {
        mainContent = (<Feed communityNameNormalized={communityNameNormalized}
                    forceReceiveProps={this.state.forceReceiveProps}
                    handleCommunityStatus={this.setCommunityMembershipStatus}
                    handleSelectCommunity={this.selectCommunity} />)
      }

      return (
        <div className='app'>

          {/* Top notifications and avatar */}
          <div className='header-row'>
            <Header communityName={currentCommunity}
                    communityNameNormalized={communityNameNormalized}
                    handleSelectCommunity={this.selectCommunity}
                    currentCommunity={currentCommunity}
                    handleNotificationPressed={this.notificationPressed}
                    forceAppUpdate={this.forceAppUpdate}
                    ref='header' />
          </div>

          {/* Feed and Communities */}
            <div className='main-content'>
              <div className='row'>
                <div className='small-2 column'>
                  <Sidebar communityName={currentCommunity}
                          communityNameNormalized={communityNameNormalized}
                          handleAddCommunityToList={this.addCommunityToList}
                          handleOpenSettings={this.openSettingsModal}
                          notificationPresent={this.state.notificationPresent}
                          notification={this.state.notification}
                          handleSelectCommunity={this.selectCommunity}
                          ref='sidebar' />
                </div>
                <div className='small-7 column feed-wrapper'>
                  {mainContent}
                </div>
                <div className='small-3 column communities-wrapper'>
                  <Communities handleSelectCommunity={this.selectCommunity}
                              handleOpenSettings={this.openSettingsModal}
                              ref='communitiesList' />
                </div>
              </div>
            </div>
            <SettingsModalHandler ref='settingsModal' updateCommunitySettings={this.propogateCommunitySettings} />
          </div>
      )
    }
  }
})
