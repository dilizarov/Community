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
      loading: true,
      buttonWidth: ReactDOM.findDOMNode(this.refs.change_password).getBoundingClientRect().width
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
        if (this.isMounted()) {
          this.setState({
            errorChangingPassword: true,
            loading: false
          }, function() {
            this.refs.tooltip.show();
          })
        }
      }.bind(this)
    })
  },

  sendEmail: function() {
    var emailVal = $.trim(this.refs.email_field.value);

    if (this.state.sendEmailEnabled !== true || this.state.loading === true) { return }

    if (/.+@.+/.test(emailVal)) {

      this.setState({
        loading: true,
        buttonWidth: ReactDOM.findDOMNode(this.refs.send_email).getBoundingClientRect().width
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

            var errorMsg = false;

            if (err.status === 404 && err.responseJSON) {
              errorMsg = err.responseJSON.error;
            }

            this.setState({
              errorSendingEmail: true,
              errorMsg: errorMsg,
              loading: false
            }, function() {
              this.refs.tooltip.show();
            })
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

    //@TODO error msging

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

          <a href="/" className="success-link">Go back to the home page</a>
        </div>

      );
    } else if (this.props.success === true) {

       var submitClasses = classNames(
        'button',
        'tiny',
        'radius',
        { 'disabled' : this.state.changePasswordEnabled !== true || this.state.loading === true,
          'alert' : this.state.errorChangingPassword }
      )

      var otherProps = {};

      if (this.state.loading === true) {
        if (this.state.buttonWidth) {
          otherProps.style = { width: this.state.buttonWidth }
        }
      }

      var compositeButton = <a ref="change_password" className={submitClasses} onClick={this.submitChange} {...otherProps} >{this.state.loading === true ? <Spinner type="inverted" /> : 'Change Password'}</a>

      if (this.state.errorChangingPassword) {
        compositeButton = (
          <Tooltip ref="tooltip" title={"Something went wrong with this request"} position='right'>
            <a ref="change_password" className={submitClasses} onClick={this.submitChange} {...otherProps} >{this.state.loading === true ? <Spinner type="inverted" /> : 'Change Password'}</a>
          </Tooltip>
        )
      }

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
          {compositeButton}
        </div>
      )
    } else {

      var submitClasses = classNames(
       'button',
       'tiny',
       'radius',
       { 'disabled' : this.state.sendEmailEnabled !== true || this.state.loading === true,
         'alert' : this.state.errorSendingEmail }
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

           <a href="/" className="success-link">Go back to the home page</a>
         </div>
       )
     } else {

       var otherProps = {};

       if (this.state.loading === true) {
         if (this.state.buttonWidth) {
           otherProps.style = { width: this.state.buttonWidth }
         }
       }

       var compositeButton = <a ref="send_email" className={submitClasses} onClick={this.sendEmail} {...otherProps} >{this.state.loading === true ? <Spinner type="inverted" /> : 'Send Email'}</a>

       if (this.state.errorSendingEmail) {
         compositeButton = (
           <Tooltip ref="tooltip" title={this.state.errorMsg ? this.state.errorMsg : "Something went wrong with this request"} position='right'>
             <a ref="send_email" className={submitClasses} onClick={this.sendEmail} {...otherProps} >{this.state.loading === true ? <Spinner type="inverted" /> : 'Send Email'}</a>
           </Tooltip>
         )
       }

       mainContent = (
         <div>
           <div className="content-header" style={{fontSize: '25px'}}>
             We ran into problems finding an account. Try requesting another email.
           </div>

           <input placeholder="email" ref="email_field" onChange={this.toggleSendEmailEnabled} defaultValue={this.props.email === null ? '' : this.props.email} />
           {compositeButton}
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
