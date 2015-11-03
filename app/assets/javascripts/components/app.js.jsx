var App = React.createClass({
  
  getInitialState: function() {
    return {
      communitySelected: false,
      notificationPresent: false,
      triggerWelcome: Session.needsMetaAccount()    
    };
  },
  
  componentDidMount: function() {
    var communityParam = getUrlParameter("c")
    
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

      var communityParam = getUrlParameter("c")
    
      if (communityParam !== undefined && communityParam !== true) {
        this.selectCommunity(communityParam)
      }
    }.bind(this));
  },
  
  selectCommunity: function(community) {
    var normalizedCommunity = normalizeCommunity(community)
    
    if (history.pushState) {
        var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?c=' + encodeURIComponent(normalizedCommunity);
        if (window.location.href !== newUrl) {
          window.history.pushState({ path: newUrl },'',newUrl);          
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
    window.location.reload()
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
        mainContent = <Feed communityName={this.state.communitySelected ? this.state.communityName : ''}
                    communityNameNormalized={this.state.communitySelected ? this.state.communityNameNormalized : ''}
                    forceReceiveProps={this.state.forceReceiveProps}
                    handleAddCommunityToList={this.addCommunityToList} />
      }
    
      return (
        <div className='app'>
          <div className='row'>
            <SessionHandler handleSessionChange={this.sessionChanged} />
            <a className="button tiny radius" href="#" onClick={this.changeProfilePic} >Browse</a>
            <input type="file" id="profile-pic-picker" accept="image/jpeg, image/png, image/jpg" onChange={this.cropImageUI} style={{visibility: 'hidden'}} />
            <img id="profile-pic" />
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