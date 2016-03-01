var LoginModalHandler = React.createClass({

  getInitialState: function() {
    return {
      loginButtonEnabled: false,
      emailVal: ""
    }
  },

  open: function() {
    this.setState({
      loginButtonEnabled: false,
      loginLoading: false,
      loginButtonWidth: null,
      loginError: false
    }, function() {
      this.refs.modal.show();
    })
  },

  openForgotPassModal: function() {
    this.refs.forgotPassModal.open()
  },

  toggleLoginButton: function() {

    var emailVal = $.trim(this.refs.login_email_field.value);
    var passVal = this.refs.login_password_field.value;

    this.setState({
      emailVal: emailVal,
      loginButtonEnabled: /.+@.+/.test(emailVal) && passVal !== ""
    })

  },

  processLogin: function() {
    var emailVal = $.trim(this.refs.login_email_field.value);
    var passVal = this.refs.login_password_field.value;

    if (this.state.loginButtonEnabled !== true || this.state.loginLoading ||
      !(/.+@.+/.test(emailVal) && passVal !== "")) { return }

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

          window.location.reload()

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

    hideModal: function() {
      this.refs.modal.hide();
    },

    render: function() {
      var loginBtnClass = classNames(
        'small',
        'button',
        'radius',
        {
          disabled: !this.state.loginButtonEnabled || this.state.loginLoading === true,
          alert: this.state.loginError
        }
      )

      var otherProps = {};
      otherProps.style = { marginBottom: '0' }

      if (this.state.loginLoading === true) {
        if (this.state.loginButtonWidth) {
          otherProps.style.width = this.state.loginButtonWidth
        }
      }

      var compositeButton = <a className={loginBtnClass} onClick={this.processLogin} ref="login_button" { ...otherProps }>{this.state.loginLoading === true ? <Spinner type="inverted" /> : 'Log in'}</a>

      if (this.state.loginError) {
        compositeButton = (
          <Tooltip ref="login_tooltip" title={this.state.loginErrorMsg ? this.state.loginErrorMsg : "Something went wrong trying to log in"} position='right'>
            {compositeButton}
          </Tooltip>
        )
      }

      return (
        <DropModal className="login-modal" ref="modal" modalStyle={{borderRadius: '3'}} contentStyle={{padding: '30'}}>

          <form>
            <input type="text" name="email" disabled={this.state.loginLoading} placeholder="email"
              ref="login_email_field" onChange={this.toggleLoginButton} autoComplete="on" />
            <input type="password" name="password" disabled={this.state.loginLoading} placeholder="password"
              ref="login_password_field" onChange={this.toggleLoginButton} autoComplete="on" />
          </form>

          <a className="secondary small button radius" onClick={this.openForgotPassModal} style={{marginBottom: '0'}}>Forgot password</a>

          <span style={{float: 'right'}}>
            <a className="secondary small button radius" onClick={this.hideModal} style={{marginRight: '20', marginBottom: '0'}}>Cancel</a>
            {compositeButton}
          </span>
          <ForgotPasswordModalHandler ref="forgotPassModal" email={this.state.emailVal}/>
        </DropModal>
      )
    }

})
