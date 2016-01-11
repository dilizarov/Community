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

      if (communityParam !== undefined && communityParam !== true) {
        this.selectCommunity(communityParam);
      }
    }.bind(this));
  },

  selectCommunity: function(community) {
    var normalizedCommunity = normalizeCommunity(community)

    if (history.pushState) {

        var newUrl = window.location.protocol + "//" + window.location.host + '/&' + encodeURIComponent(normalizedCommunity);
        if (window.location.href !== newUrl) {
          window.history.pushState({ path: newUrl },'',newUrl);
        }

    }

    var str = document.title

    // If they're the same, we assume no notification count prepends it.
    // If they're not, we assume there is a notification count prepending
    // and we replace it.
    if (str === this.state.communityName || str === 'Community') {
        document.title = community
    } else {
        document.title = str.substring(0, str.indexOf(")") + 2) + community
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
    this.setState({
      communitySelected: false,
      notificationPresent: true,
      notification: notification
    });
  },

  addCommunityToList: function(community) {
    this.refs.communitiesList.addCommunity(community)
  },

  setCommunityMembershipStatus: function(hasJoined) {
    this.refs.sidebar.setHasJoinedStatus(hasJoined);
  },

  goToApp: function() {
    this.setState({
      triggerWelcome: false
    })
  },

  changeProfilePic: function() {
    $('#profile-pic-picker').click()
  },

  cropImageUI: function() {

    var input = $("#profile-pic-picker")[0]

    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $("#profile-pic").attr('src', e.target.result)

        $("#profile-pic").cropper({
          aspectRatio: 1 / 1,
          autoCropArea: 0.85
        })

        $("#profile-pic").on('zoom.cropper', function (e) {

          var maxRatio = 5;
          var imageData = $(this).cropper('getImageData');
          var currentRatio = imageData.width / imageData.naturalWidth;

          if (e.ratio > 0 && currentRatio > maxRatio) {
            e.preventDefault()
          }
        })
      }

      reader.readAsDataURL(input.files[0])
    }
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
        mainContent = <NotificationPost postId={this.state.notification.post_id} />
      } else {
        mainContent = (<Feed communityNameNormalized={communityNameNormalized}
                    forceReceiveProps={this.state.forceReceiveProps}
                    handleCommunityStatus={this.setCommunityMembershipStatus} />)
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
                    ref='header' />
          </div>

          {/* Feed and Communities */}
            <div className='main-content'>
              <div className='row'>
                <div className='small-2 column'>
                  <Sidebar communityName={currentCommunity}
                          communityNameNormalized={communityNameNormalized}
                          handleAddCommunityToList={this.addCommunityToList}
                          ref='sidebar' />
                </div>
                <div className='small-7 column feed-wrapper'>
                  {mainContent}
                </div>
                <div className='small-3 column communities-wrapper'>
                  <Communities handleSelectCommunity={this.selectCommunity} ref='communitiesList' />
                </div>

                {/* document.title === this.state.communityName at this stage */}
                {/*<div className='small-1 column'>
                  <Notifications currentCommunity={this.state.communitySelected ? this.state.communityName : ''}
                                 handleNotificationPressed={this.notificationPressed} />
                </div>*/}
              </div>
            </div>

          </div>

      )
    }
  }
})
