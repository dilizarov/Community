var SessionBox = React.createClass({

  getInitialState: function() {
    return {
      login: true,
      forgotPassword: false,
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

  togglePrimaryState: function() {
    this.setState({
      login: !this.state.login
    })
  },

  toggleForgotPassword: function() {
    this.setState({
      forgotPassword: !this.state.forgotPassword
    })
  },

  processForgotPassword: function() {

    var data = {
      email: $("#session-email").val()
    }

    $.ajax({
      method: "POST",
      url: "api/v1/users/forgot_password.json",
      data: data,
      success: function(res) {
        //TODO: email sent message
      }.bind(this),
      error: function(err) {
        alert('blergh')
      }.bind(this)
    })
  },

  processLogin: function() {

    var data = {
      user: {
        email: $("#session-email").val(),
        password: $("#session-password").val()
      }
    }

    $.ajax({
      method: "POST",
      url: "api/v1/sessions.json",
      data: data,
      success: function(res) {
        Session.login(res.user.username,
          res.user.email,
          res.user.external_id,
          res.user.auth_token,
          res.user.created_at,
          res.user.avatar_url)

          this.props.handleSessionChange()
      }.bind(this),
      error: function(err) {
        alert('GAH')
      }.bind(this)
    })
  },

  processRegistration: function() {
    //TODO: Wanna transfer data? pop-up

    var data = {
      user: {
        email: $("#session-email").val(),
        password: $("#session-password").val(),
        username: $("#session-username").val()
      }
    }

    $.ajax({
      method: "POST",
      url: "api/v1/registrations.json",
      data: data,
      success: function(res) {
        Session.login(res.user.username,
          res.user.email,
          res.user.external_id,
          res.user.auth_token,
          res.user.created_at,
          res.user.avatar_url)

          this.props.handleSessionChange()
      }.bind(this),
      error: function(err) {
        alert("FAKKKKK")
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

  render: function() {

    var userInfo = Session.userInfo();
    var sessionContent;
    var box;

    if (this.state.sessionBoxOpened === true) {
      if (Session.loggedIn() === true) {
        sessionContent = <a className="button tiny radius logout-btn" onClick={this.logout}>Log out</a>
      } else {
        if (this.state.forgotPassword === true) {
          sessionContent = (<div className="forgot-password">
                     <input type="text" placeholder="email" id="session-email" />
                      <a className="button tiny radius success" onClick={this.processForgotPassword}>Send Email</a>
                      <br />
                      <a className="button tiny radius" onClick={this.toggleForgotPassword}>Whoops</a>
                   </div>)
        } else if (this.state.login === true) {
          sessionContent = (<div className="login">
                     <input type="text" placeholder="EMAIL" id="session-email" />
                     <input type="text" placeholder="PASSWORDO" id="session-password" />
                     <a className="button tiny radius success" onClick={this.processLogin}>Log In</a>
                     <br />
                     <a className="button tiny radius" onClick={this.togglePrimaryState}>Create Account</a>
                     <a className="button tiny radius" onClick={this.toggleForgotPassword}>Forgot Password</a>
                   </div>)
        } else {
          sessionContent = (<div className="create-account">
                     <input type="text" placeholder="USERNAME" id="session-username" />
                     <input type="text" placeholder="EMAIL" id="session-email" />
                     <input type="text" placeholder="PASSWORDOOOO" id="session-password" />
                     <input type="text" placeholder="CONFIRM ITTTT" id="session-confirm" />
                     <a className="button tiny radius success" onClick={this.processRegistration}>Create Account</a>
                     <br />
                     <a className="button tiny radius login-btn" onClick={this.togglePrimaryState}>Log In</a>
                   </div>)
        }
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

    return (
      <span className="session-handler">
        <Avatar source={userInfo.avatar_url} size="sm" onClick={this.toggleSessionBox} whiteRays />
        {box}
      </span>
    )
  }

})
