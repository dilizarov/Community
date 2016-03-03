var Welcome = React.createClass({

  viewStates: {
    meta: 0,
    login: 1,
    signup: 2
  },

  getInitialState: function() {
    return {
      metaLoaded: false,
      currentState: this.viewStates.meta,
      loginButtonEnabled: false,
      loginLoading: false,
      signupButtonEnabled: false,
      signupLoading: false,
      loginEmailVal: "",
      signupUsernameVal: "",
      signupEmailVal: ""
    }
  },

  componentDidMount: function() {
    document.title = "Welcome"

    this.createMetaAccount();
  },

  createMetaAccount: function() {

    this.setState({
      metaLoaded: false
    })

    $.ajax({
      method: "POST",
      url: "api/v1/sessions/meta_account.json",
      success: function(res) {
        Session.createMetaAccount(res.user.username, res.user.external_id, res.user.created_at, res.user.auth_token)

        this.setState({
          metaLoaded: true,
          metaUsername: res.user.username,
          createMetaError: false
        })
      }.bind(this),
      error: function(err) {

        this.setState({
          metaLoaded: true,
          createMetaError: true
        })

      }.bind(this)
    })
  },

  changeUsername: function() {

    this.setState({
      metaLoaded: false
    })

    $.ajax({
      method: "POST",
      url: "api/v1/users/" + localStorage.getItem("meta_user_id") + "/meta_username.json",
      data: { auth_token: localStorage.getItem("meta_auth_token") },
      success: function(res) {
        Session.changeMetaUsername(res.user.username)

        this.setState({
          metaLoaded: true,
          metaUsername: res.user.username,
          requestChangeError: false
        })

      }.bind(this),
      error: function(err) {

        this.setState({
          metaLoaded: true,
          requestChangeError: true
        })

      }.bind(this)
    })
  },

  requestUsernameClicked: function() {

    if (this.state.metaLoaded) {
      if (this.state.createMetaError) {
        this.createMetaAccount();
      } else {
        this.changeUsername();
      }
    }

  },

  toggleLogin: function() {
    document.title = "Log in"

    this.setState({
      currentState: this.viewStates.login,
      loginButtonEnabled: false
    }, function() {
      this.refs.login_email_field.value = this.state.loginEmailVal;
      this.refs.login_password_field.value = "";
    })
  },

  toggleLoginButton: function() {

    var emailVal = $.trim(this.refs.login_email_field.value);
    var passVal = this.refs.login_password_field.value;

    this.setState({
      loginEmailVal: emailVal,
      loginButtonEnabled: /.+@.+/.test(emailVal) && passVal !== "" && !this.state.createMetaError
    })
  },

  processLogin: function() {
    var emailVal = $.trim(this.refs.login_email_field.value);
    var passVal = this.refs.login_password_field.value;

    if (this.state.loginButtonEnabled !== true || this.state.loginLoading ||
        !(/.+@.+/.test(emailVal) && passVal !== "" && !this.state.createMetaError)) { return }

    this.setState({
      loginLoading: true,
      loginButtonWidth: ReactDOM.findDOMNode(this.refs.login_button).getBoundingClientRect().width
    })

    $.ajax({
      method: "POST",
      url: "api/v1/sessions.json",
      data: { user: { email: emailVal, password: passVal }},
      success: function(res) {

        Session.login(
          res.user.username,
          res.user.email,
          res.user.external_id,
          res.user.auth_token,
          res.user.created_at,
          res.user.avatar_url
        )

        this.props.segueToApp()

      }.bind(this),
      error: function(e) {

        var errorMsg = "";

        if (e.status === 422 && e.responseJSON) {
          var errors = e.responseJSON.errors;

          for (var i = 0; i < errors.length; i++) {
            if (i !== 0) { errorMsg += "\n\n" }

            errorMsg += errors[i]
          }
        }

        this.setState({
          loginLoading: false,
          loginError: true,
          loginErrorMsg: errorMsg
        }, function() {
          this.refs.login_tooltip.show()
        })

      }.bind(this)
    })

  },

  toggleSignup: function() {
    document.title = "Sign up"

    this.setState({
      currentState: this.viewStates.signup,
      signupButtonEnabled: false
    }, function() {
      this.refs.signup_username_field.value = this.state.signupUsernameVal;
      this.refs.signup_email_field.value = this.state.signupEmailVal;
      this.refs.signup_password_field.value = "";
      this.refs.signup_confirm_field.value = "";
    })
  },

  toggleSignupButton: function() {

    var usernameVal = $.trim(this.refs.signup_username_field.value);
    var emailVal = $.trim(this.refs.signup_email_field.value);
    var passVal = this.refs.signup_password_field.value;
    var confVal = this.refs.signup_confirm_field.value;

    this.setState({
      signupUsernameVal: usernameVal,
      signupEmailVal: emailVal,
      signupButtonEnabled: usernameVal !== "" && /.+@.+/.test(emailVal) && passVal !== "" && confVal !== "" && passVal === confVal && !this.state.createMetaError
    })
  },

  processRegistration: function() {
    var usernameVal = $.trim(this.refs.signup_username_field.value);
    var emailVal = $.trim(this.refs.signup_email_field.value);
    var passVal = this.refs.signup_password_field.value;
    var confVal = this.refs.signup_confirm_field.value;

    if (this.state.signupButtonEnabled !== true || this.state.signupLoading ||
        !(usernameVal !== "" && /.+@.+/.test(emailVal) && passVal !== "" && confVal !== "" && passVal === confVal && !this.state.createMetaError)) { return }

    this.setState({
      signupLoading: true,
      signupButtonWidth: ReactDOM.findDOMNode(this.refs.signup_button).getBoundingClientRect().width
    })

    $.ajax({
      method: "POST",
      url: "api/v1/registrations.json",
      data: { user: { username: usernameVal, email: emailVal, password: passVal }},
      success: function(res) {

        Session.login(
          res.user.username,
          res.user.email,
          res.user.external_id,
          res.user.auth_token,
          res.user.created_at,
          res.user.avatar_url
        )

        this.props.segueToApp()

      }.bind(this),
      error: function(e) {

        var errorMsg = "";

        if (e.status === 422 && e.responseJSON) {
          var errors = e.responseJSON.errors;

          for (var i = 0; i < errors.length; i++) {
            if (i !== 0) { errorMsg += "\n\n" }

            errorMsg += errors[i]
          }
        }

        this.setState({
          signupLoading: false,
          signupError: true,
          signupErrorMsg: errorMsg
        }, function() {
          this.refs.signup_tooltip.show()
        })

      }.bind(this)
    })
  },

  toggleMeta: function() {
    document.title = "Welcome"

    this.setState({
      currentState: this.viewStates.meta
    })
  },

  render: function() {

    var mainContent;

    if (this.state.currentState === this.viewStates.login) {

      var lgnBtnClass = classNames(
        'tiny',
        'button',
        'radius',
        { disabled: !this.state.loginButtonEnabled || this.state.loginLoading === true,
          alert: this.state.loginError }
      )

      var otherProps = {};

      if (this.state.loginLoading === true) {
        if (this.state.loginButtonWidth) {
          otherProps.style = { width: this.state.loginButtonWidth }
        }
      }

      var compositeButton = <a className={lgnBtnClass} onClick={this.processLogin} ref="login_button" { ...otherProps }>{this.state.loginLoading === true ? <Spinner type="inverted" /> : 'Log in'}</a>

      if (this.state.loginError) {
        //TODO error text
          compositeButton = (
            <Tooltip ref="login_tooltip" title={this.state.loginErrorMsg ? this.state.loginErrorMsg : "Something went wrong trying to log in"} position='right'>
              {compositeButton}
            </Tooltip>
          )
      }

      var accountDisclaimerClass = classNames({
        "account-disclaimer" : !this.state.createMetaError,
        "account-disclaimer-error" : this.state.createMetaError
      })

      var accountDisclaimerContent;

      if (this.state.createMetaError) {
        accountDisclaimerContent = (
          <div className={accountDisclaimerClass} onClick={this.toggleMeta} style={{textDecoration: 'none'}}>
            The previous page ran into an issue. Click to head back and resolve it.
          </div>
        )
      } else {
        accountDisclaimerContent = (
          <div className={accountDisclaimerClass} onClick={this.toggleMeta} style={{textDecoration: 'none'}}>
            When logged out, you'll be able to post as {this.state.metaLoaded ? <a>{this.state.metaUsername}</a> : <Spinner style={{marginLeft: '4px'}}/>}
          </div>
        )
      }

      mainContent = (
        <div>
          <div className="content-header" style={{marginBottom: 0}}>
            Log in
          </div>

          {accountDisclaimerContent}

          <input type="text" disabled={this.state.loginLoading} placeholder="email"
            ref="login_email_field" onChange={this.toggleLoginButton} />
          <input type="password" disabled={this.state.loginLoading} placeholder="password"
            ref="login_password_field" onChange={this.toggleLoginButton} />

          <div style={{marginTop: '35px'}}>
            {compositeButton}
            <div style={{color: "#333", marginTop: '10px'}}>
              By using Community, you agree to our <a href="/terms-of-service" target="_blank">Terms</a> and understand our <a href="https://www.iubenda.com/privacy-policy/908716" target="_blank">Privacy Policy</a>
            </div>
          </div>
        </div>
      )
    } else if (this.state.currentState === this.viewStates.signup) {

      var signupBtnClass = classNames(
        'tiny',
        'button',
        'radius',
        { disabled: !this.state.signupButtonEnabled || this.state.signupLoading === true,
          alert: this.state.signupError }
      )

      var otherProps = {};

      if (this.state.signupLoading === true) {
        if (this.state.signupButtonWidth) {
          otherProps.style = { width: this.state.signupButtonWidth }
        }
      }

      var compositeButton = <a className={signupBtnClass} onClick={this.processRegistration} ref="signup_button" { ...otherProps }>{this.state.signupLoading === true ? <Spinner type="inverted" /> : 'Sign up'}</a>

      if (this.state.signupError) {
        //TODO error text
          compositeButton = (
            <Tooltip ref="signup_tooltip" title={this.state.signupErrorMsg ? this.state.signupErrorMsg : "Something went wrong trying to sign up"} position='right'>
              {compositeButton}
            </Tooltip>
          )
      }

      var accountDisclaimerClass = classNames({
        "account-disclaimer" : !this.state.createMetaError,
        "account-disclaimer-error" : this.state.createMetaError
      })

      var accountDisclaimerContent;

      if (this.state.createMetaError) {
        accountDisclaimerContent = (
          <div className={accountDisclaimerClass} onClick={this.toggleMeta} style={{textDecoration: 'none'}}>
            The previous page ran into an issue. Click to head back and resolve it.
          </div>
        )
      } else {
        accountDisclaimerContent = (
          <div className={accountDisclaimerClass} onClick={this.toggleMeta} style={{textDecoration: 'none'}}>
            When logged out, you'll be able to post as {this.state.metaLoaded ? <a>{this.state.metaUsername}</a> : <Spinner style={{marginLeft: '4px'}} />}
          </div>
        )
      }

      mainContent = (
        <div>
          <div className="content-header" style={{marginBottom: 0}}>
            Sign up
          </div>

          {accountDisclaimerContent}

          <input type="text" placeholder="username"
            ref="signup_username_field" disabled={this.state.signupLoading} onChange={this.toggleSignupButton} />
          <input type="text" placeholder="email"
            ref="signup_email_field" disabled={this.state.signupLoading} onChange={this.toggleSignupButton} />
          <input type="password" placeholder="password"
            ref="signup_password_field" disabled={this.state.signupLoading} onChange={this.toggleSignupButton} />
          <input type="password"  placeholder="confirm"
            ref="signup_confirm_field" disabled={this.state.signupLoading} onChange={this.toggleSignupButton} />

          <div style={{marginTop: '35px'}}>
            {compositeButton}
            <div style={{color: "#333", marginTop: '10px'}}>
              By using Community, you agree to our <a href="/terms-of-service" target="_blank">Terms</a> and understand our <a href="https://www.iubenda.com/privacy-policy/908716" target="_blank">Privacy Policy</a>
            </div>
          </div>
        </div>
      )
    } else {

      var usernameClasses = classNames(
        'username-generated',
        { 'username-error' : this.state.createMetaError || this.state.requestChangeError }
      )

      var onClickFunc = function() {}

      if (this.state.createMetaError && this.state.metaLoaded) {
        onClickFunc = this.createMetaAccount;
      }

      var usernameContent;

      if (this.state.metaLoaded) {
        if (this.state.createMetaError) {
          usernameContent = 'Ran into problems making a username'
        } else {
          if (this.state.requestChangeError) {
            usernameContent = 'Had trouble changing your username. Right now, your username is ' + this.state.metaUsername
          } else {
            usernameContent = this.state.metaUsername
          }
        }
      } else {
        usernameContent = <Spinner />
      }

      var otherProps = {};

      if (!this.state.metaLoaded) {
        otherProps.style = { color: "#DDD", cursor: 'text' }
      }

      mainContent = (
        <div>
          <div className="content-header" style={{fontSize: '24px'}}>
            Community doesn't need an account<br/>Below is a username made for you
          </div>

          <div className="account-disclaimer">
            <Tooltip title="An account is accessible on different devices and won't be lost if you clear your browser settings or cache" position="right">
              <span>Why do we recommend an account?</span>
            </Tooltip>
          </div>

          <div className={usernameClasses} onClick={onClickFunc} style={{cursor: this.state.createMetaError ? 'pointer' : 'auto'}}>
            {usernameContent}
          </div>

          <a onClick={this.requestUsernameClicked} {...otherProps}>Request another username</a>

          <div style={{marginTop: '100px'}}>
            <a className="tiny button radius" onClick={this.props.segueToApp}>Go to main page</a>
            <div style={{color: "#333", marginTop: '10px'}}>
              By using Community, you agree to our <a href="/terms-of-service" target="_blank">Terms</a> and understand our <a href="https://www.iubenda.com/privacy-policy/908716" target="_blank">Privacy Policy</a>
            </div>
          </div>
        </div>
      )
    }

    return(
      <div className="welcome-wrapper">
        <div className="header-row">
          <div className='header-wrapper'>
            <div className="row">
              <div className="small-6 small-centered column">
                <a className="main-page-link" onClick={this.reloadMainPage}>&</a>
                <span className='page-title'>Hi, use these links to <a style={{cursor: 'pointer'}} onClick={this.toggleLogin}>log in</a> or <a style={{cursor: 'pointer'}} onClick={this.toggleSignup}>sign up</a></span>
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
