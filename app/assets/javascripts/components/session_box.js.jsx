var SessionBox = React.createClass({

  getInitialState: function() {
    return {
      sessionBoxOpened: false
    }
  },

  logout: function() {
    $.ajax({
      method: "POST",
      url: "api/v1/sessions/logout.json",
      data: { user_id: Session.userId() , auth_token: Session.authToken() },
      success: function(res) {
        Session.logout()

        this.props.handleSessionChange()
      }.bind(this),
      error: function(err) {

      }.bind(this)
    })
  },

  toggleSessionBox: function() {

    this.setState({
      sessionBoxOpened: !this.state.sessionBoxOpened
    })
  },

  componentDidUpdate: function(prevProps, prevState) {

    if (this.state.sessionBoxOpened === prevState.sessionBoxOpened) {
      return;
    }

    if (this.state.sessionBoxOpened === true && prevState.sessionBoxOpened === false) {
      this.lastWindowClickEvent = this.handleClickOutside;
      document.addEventListener('click', this.lastWindowClickEvent);
    } else if (this.state.sessionBoxOpened === false && prevState.sessionBoxOpened === true) {
      document.removeEventListener('click', this.lastWindowClickEvent);

      this.lastWindowClickEvent = null;
    }
  },

  handleClickOutside: function(e) {

    var target = e.target;

    while (target.parentNode) {
      if (target === this.refs.sessionBox) {
        return;
      }

      target = target.parentNode;
    }

    this.setState({
      sessionBoxOpened: false
    })
  },

  openLoginModal: function() {
    this.refs.loginModal.open();
  },

  openSignupModal: function() {
    this.refs.signupModal.open();
  },

  componentWillUnmount: function() {
    if (this.lastWindowClickEvent) {
      document.removeEventListener('click', this.lastWindowClickEvent);
      this.lastWindowClickEvent = null;
    }
  },

  render: function() {

    var userInfo = Session.userInfo();
    var sessionContent;
    var box;

    var loggedIn = Session.loggedIn() === true;

    var loginModal;
    var signupModal;

    if (!loggedIn) {

      loginModal = <LoginModalHandler ref="loginModal" />
      signupModal = <SignupModalHandler ref="signupModal" />

    }

    if (this.state.sessionBoxOpened === true) {
      if (loggedIn) {
        sessionContent = <a className="button tiny radius logout-btn" onClick={this.logout}>Log out</a>
      } else {
        sessionContent = (<span><a className="button tiny radius logout-btn" onClick={this.openLoginModal}>Log in</a>
      <a className="button tiny radius logout-btn" onClick={this.openSignupModal}>Sign up</a></span>)
     }

      box = (<div className="session-box" ref="sessionBox">
        {Session.loggedIn() === true ? <div className="user-email">{userInfo.email}</div> : ''}
        <Avatar source={userInfo.avatar_url} size="sm" changeable forceAppUpdate={this.props.forceAppUpdate} />
        <span className="username">{userInfo.username}</span>
        <div className="session-box-bottom">
          {sessionContent}
        </div>
        {loginModal}
        {signupModal}
      </div>)
    }

    return (
      <span className="session-handler">
        <Avatar source={userInfo.avatar_url} size="sm" onClick={this.toggleSessionBox} whiteRays />
        {box}
      </span>
    )
  }

})
