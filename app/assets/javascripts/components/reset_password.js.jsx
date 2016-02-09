var ResetPassword = React.createClass({

  getInitialState: function() {
    return {
      passwordChanged: false,
      changePasswordEnabled: false,
      sendEmailEnabled: this.props.email !== null,
      emailSent: false,
      loading: false
    }
  },

  reloadMainPage: function() {
    window.location.href = "/"
  },

  toggleChangePassEnabled: function(e) {

    var passwordVal = this.refs.password_field.value;
    var confirmVal = this.refs.confirm_field.value;

    this.setState({
      changePasswordEnabled: passwordVal !== "" && confirmVal !== "" && passwordVal === confirmVal
    })
  },

  toggleSendEmailEnabled: function(e) {

    var emailVal = $.trim(this.refs.email_field.value);

    // Really simple regex. Ensures @ with text on both sides
    this.setState({
      sendEmailEnabled: /.+@.+/.test(emailVal)
    })

  },

  submitChange: function() {
    var passwordVal = this.refs.password_field.value;
    var confirmVal = this.refs.confirm_field.value;

    if (this.state.changePasswordEnabled !== true || this.state.loading === true ||
      !(passwordVal !== "" && confirmVal !== "" && passwordVal === confirmVal)) { return }

    this.setState({
      loading: true
    })

    $.ajax({
      method: "POST",
      url: 'api/v1/users/reset_password.json',
      data: { email: this.props.email, reset_token: this.props.reset_token, password: passwordVal },
      success: function() {
        if (this.isMounted()) {
          this.setState({
            passwordChanged: true,
            loading: false
          })
        }
      }.bind(this),
      error: function(err) {

      }.bind(this)
    })
  },

  sendEmail: function() {
    var emailVal = $.trim(this.refs.email_field.value);

    if (this.state.sendEmailEnabled !== true || this.state.loading === true) { return }

    if (/.+@.+/.test(emailVal)) {

      this.setState({
        loading: true
      })

      $.ajax({
          method: "POST",
          url: "api/v1/users/forgot_password.json",
          data: { email: emailVal },
          success: function() {
            if (this.isMounted()) {
              this.setState({
                emailSent: emailVal,
                loading: false
              })
            }
          }.bind(this),
          error: function(err) {
            console.log(err)
          }.bind(this)
      })
    }
  },

  toggle: function() {
    this.setState({
      passwordChanged: !this.state.passwordChanged
    })
  },

  render: function() {

    var mainContent;

    if (this.state.passwordChanged === true) {
      mainContent = (
        <div>
          <div className="content-header">
            Reset your password
          </div>
          <div className="user-info">
            <Avatar source={this.props.avatar} style={{float: 'left', marginRight: 10}} />
            <div className="user-info-details">
              <b>{this.props.username}</b>
              <br/>
              <span className="user-email">{this.props.email}</span>
            </div>
          </div>

          <div className="success-msg">
            Your password has been reset
          </div>

          <a href="/" className="success-link">&</a>
        </div>

      );
    } else if (this.props.success === true) {

       var submitClasses = classNames(
        'button',
        'tiny',
        'radius',
        { 'disabled' : this.state.changePasswordEnabled !== true || this.state.loading === true }
      )

      mainContent = (
        <div>
          <div className="content-header">
            Reset your password
          </div>
          <div className="user-info">
            <Avatar source={this.props.avatar} style={{float: 'left', marginRight: 10}} />
            <div className="user-info-details">
              <b>{this.props.username}</b>
              <br/>
              <span className="user-email">{this.props.email}</span>
            </div>
          </div>

          <input type="password" placeholder="password" onChange={this.toggleChangePassEnabled} ref="password_field" />
          <input type="password" placeholder="confirm" onChange={this.toggleChangePassEnabled} ref="confirm_field" />
          <a className={submitClasses} onClick={this.submitChange}>{this.state.loading === true ? <Spinner type="inverted" /> : 'Change Password'}</a>
        </div>
      )
    } else {

      var submitClasses = classNames(
       'button',
       'tiny',
       'radius',
       { 'disabled' : this.state.sendEmailEnabled !== true || this.state.loading === true }
     )

     if (this.state.emailSent !== false) {
       mainContent = (
         <div>
           <div className="content-header" style={{fontSize: '25px'}}>
             We ran into problems finding an account. Try requesting another email.
           </div>

           <div className="success-msg">
             An email has been sent to <b>{this.state.emailSent}</b>
           </div>

           <a href="/" className="success-link">&</a>
         </div>
       )
     } else {
       mainContent = (
         <div>
           <div className="content-header" style={{fontSize: '25px'}}>
             We ran into problems finding an account. Try requesting another email.
           </div>

           <input placeholder="email" ref="email_field" onChange={this.toggleSendEmailEnabled} defaultValue={this.props.email === null ? '' : this.props.email} />
           <a className={submitClasses} onClick={this.sendEmail}>{this.state.loading === true ? <Spinner type="inverted" /> : 'Send Email'}</a>
         </div>
       )
     }
    }

    return (
      <div className="reset-password-wrapper">
        <div className="header-row">
          <div className='header-wrapper'>
            <div className="row">
              <div className="small-6 small-centered column">
                <a className="main-page-link" onClick={this.reloadMainPage}>&</a>
                <span className='page-title'>Password Reset</span>
              </div>
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="row">
            <div className="small-6 small-centered column">
              {mainContent}
            </div>
          </div>
        </div>
      </div>
    )

  }

})
