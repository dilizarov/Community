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

  processForgotPassword: function() {

    // var data = {
    //   email: $("#session-email").val()
    // }
    //
    // $.ajax({
    //   method: "POST",
    //   url: "api/v1/users/forgot_password.json",
    //   data: data,
    //   success: function(res) {
    //     //TODO: email sent message
    //   }.bind(this),
    //   error: function(err) {
    //     alert('blergh')
    //   }.bind(this)
    // })
  },

  processLogin: function() {

    // var data = {
    //   user: {
    //     email: $("#session-email").val(),
    //     password: $("#session-password").val()
    //   }
    // }
    //
    // $.ajax({
    //   method: "POST",
    //   url: "api/v1/sessions.json",
    //   data: data,
    //   success: function(res) {
    //     Session.login(res.user.username,
    //       res.user.email,
    //       res.user.external_id,
    //       res.user.auth_token,
    //       res.user.created_at,
    //       res.user.avatar_url)
    //
    //       this.props.handleSessionChange()
    //   }.bind(this),
    //   error: function(err) {
    //     alert('GAH')
    //   }.bind(this)
    // })
  },

  processRegistration: function() {
    //TODO: Wanna transfer data? pop-up

    // var data = {
    //   user: {
    //     email: $("#session-email").val(),
    //     password: $("#session-password").val(),
    //     username: $("#session-username").val()
    //   }
    // }
    //
    // $.ajax({
    //   method: "POST",
    //   url: "api/v1/registrations.json",
    //   data: data,
    //   success: function(res) {
    //     Session.login(res.user.username,
    //       res.user.email,
    //       res.user.external_id,
    //       res.user.auth_token,
    //       res.user.created_at,
    //       res.user.avatar_url)
    //
    //       this.props.handleSessionChange()
    //   }.bind(this),
    //   error: function(err) {
    //     alert("FAKKKKK")
    //   }.bind(this)
    // })
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

    if (this.state.sessionBoxOpened === true) {
      if (loggedIn) {
        sessionContent = <a className="button tiny radius logout-btn" onClick={this.logout}>Log out</a>
      } else {
        sessionContent = (<span><a className="button tiny radius logout-btn" onClick={this.processLogin}>Log in</a>
       <a className="button tiny radius logout-btn" onClick={this.processRegistration}>Sign up</a></span>)
     }

      box = (<div className="session-box" ref="sessionBox">
        <div className="user-email">{Session.loggedIn() === true ? userInfo.email : ''}</div>
        <Avatar source={userInfo.avatar_url} size="sm" changeable />
        <span className="username">{userInfo.username}</span>
        <div className="session-box-bottom">
          {sessionContent}
        </div>
      </div>)
    }

    var loginModal;
    var signupModal;

    if (!loggedIn) {

      loginModal = (
        <Modal ref="loginModal" modalStyle={{borderRadius: '3'}} contentStyle={{textAlign: 'center', padding: '30'}}>
          <h3 style={{wordWrap: 'break-word'}}>Log In</h3><br/>
          <a className="secondary small button radius" onClick={this.hideModal} style={{marginRight: '20'}}>Cancel</a>
          <a className="alert small button radius" onClick={this.leaveCommunity}>Confirm</a>
        </Modal>
      )

      signupModal = (
        <Modal ref="signupModal" modalStyle={{borderRadius: '3'}} contentStyle={{textAlign: 'center', padding: '30'}}>
          <h3 style={{wordWrap: 'break-word'}}>Sign Up</h3><br/>
          <a className="secondary small button radius" onClick={this.hideModal} style={{marginRight: '20'}}>Cancel</a>
          <a className="alert small button radius" onClick={this.leaveCommunity}>Confirm</a>
        </Modal>
      )
    }


    return (
      <span className="session-handler">
        <Avatar source={userInfo.avatar_url} size="sm" onClick={this.toggleSessionBox} whiteRays />
        {box}
        {loginModal}
        {signupModal}
      </span>
    )
  }

})
