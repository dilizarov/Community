var SessionBox = React.createClass({

  getInitialState: function() {
    return {
      login: true,
      forgotPassword: false
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

  render: function() {

    return <span/>
    // if (Session.loggedIn() === true) {
    //   return(
    //     <span className="logged-in-session">
    //       LOGGED IN, HELL YEAH!
    //       <a className="button tiny radius" onClick={this.logout}>LOG OUT PLS</a>
    //     </span>
    //   )
    // } else {
    //
    //   var accessAccount;
    //
    //   if (this.state.forgotPassword === true) {
    //     accessAccount = (<div className="forgot-password">
    //                <input type="text" placeholder="EMAIL" id="session-email" />
    //                 <a className="button tiny radius success" onClick={this.processForgotPassword}>Send Email</a>
    //                 <br />
    //                 <a className="button tiny radius" onClick={this.toggleForgotPassword}>Whoops</a>
    //              </div>)
    //   } else if (this.state.login === true) {
    //     accessAccount = (<div className="login">
    //                <input type="text" placeholder="EMAIL" id="session-email" />
    //                <input type="text" placeholder="PASSWORDO" id="session-password" />
    //                <a className="button tiny radius success" onClick={this.processLogin}>Log In</a>
    //                <br />
    //                <a className="button tiny radius" onClick={this.togglePrimaryState}>Create Account</a>
    //                <a className="button tiny radius" onClick={this.toggleForgotPassword}>Forgot Password</a>
    //              </div>)
    //   } else {
    //     accessAccount = (<div className="create-account">
    //                <input type="text" placeholder="USERNAME" id="session-username" />
    //                <input type="text" placeholder="EMAIL" id="session-email" />
    //                <input type="text" placeholder="PASSWORDOOOO" id="session-password" />
    //                <input type="text" placeholder="CONFIRM ITTTT" id="session-confirm" />
    //                <a className="button tiny radius success" onClick={this.processRegistration}>Create Account</a>
    //                <br />
    //                <a className="button tiny radius" onClick={this.togglePrimaryState}>Log In</a>
    //              </div>)
    //   }
    //
    //   return(
    //     <span className="meta-session">
    //       I AINT LOGGED IN YET, PAUL
    //       {accessAccount}
    //     </span>
    //   )
  }

})
