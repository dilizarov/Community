var SignupModalHandler = React.createClass({

  getInitialState: function() {
    return {
      signupButtonEnabled: false
    }
  },

  open: function() {
    this.setState({
      signupButtonEnabled: false,
      signupLoading: false,
      signupButtonWidth: null,
      signupError: false
    }, function() {
      this.refs.modal.show();
    })
  },

  openForgotPassModal: function() {
    this.refs.forgotPassModal.open()
  },

  toggleSignupButton: function() {

    var usernameVal = $.trim(this.refs.signup_username_field.value);
    var emailVal = $.trim(this.refs.signup_email_field.value);
    var passVal = this.refs.signup_password_field.value;
    var confVal = this.refs.signup_confirm_field.value;

    this.setState({
      signupButtonEnabled: usernameVal !== "" && /.+@.+/.test(emailVal) && passVal !== "" && confVal !== "" && passVal === confVal
    })

  },

  processSignup: function() {
    var usernameVal = $.trim(this.refs.signup_username_field.value);
    var emailVal = $.trim(this.refs.signup_email_field.value);
    var passVal = this.refs.signup_password_field.value;
    var confVal = this.refs.signup_confirm_field.value;

    if (this.state.signupButtonEnabled !== true || this.state.signupLoading ||
        !(usernameVal !== "" && /.+@.+/.test(emailVal) && passVal !== "" && confVal !== "" && passVal === confVal)) { return }


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
            signupLoading: false,
            signupError: true,
            signupErrorMsg: errorMsg
          }, function() {
            this.refs.signup_tooltip.show()
          })

        }.bind(this)
      })
    },

    hideModal: function() {
      this.refs.modal.hide();
    },

    render: function() {
      var signupBtnClass = classNames(
        'small',
        'button',
        'radius',
        {
          disabled: !this.state.signupButtonEnabled || this.state.signupLoading === true,
          alert: this.state.signupError
        }
      )

      var otherProps = {};
      otherProps.style = { marginBottom: '0' }

      if (this.state.signupLoading === true) {
        if (this.state.signupButtonWidth) {
          otherProps.style.width = this.state.signupButtonWidth
        }
      }

      var compositeButton = <a className={signupBtnClass} onClick={this.processSignup} ref="signup_button" { ...otherProps }>{this.state.signupLoading === true ? <Spinner type="inverted" /> : 'Sign up'}</a>

      if (this.state.signupError) {
        compositeButton = (
          <Tooltip ref="signup_tooltip" title={this.state.signupErrorMsg ? this.state.signupErrorMsg : "Something went wrong trying to log in"} position='right'>
            {compositeButton}
          </Tooltip>
        )
      }

      return (
        <DropModal className="signup-modal" ref="modal" modalStyle={{borderRadius: '3'}} contentStyle={{padding: '30'}}>

          <form>
            <input type="text" placeholder="username"
              ref="signup_username_field" disabled={this.state.signupLoading} onChange={this.toggleSignupButton} />
            <input type="text" placeholder="email"
              ref="signup_email_field" disabled={this.state.signupLoading} onChange={this.toggleSignupButton} />
            <input type="password" placeholder="password"
              ref="signup_password_field" disabled={this.state.signupLoading} onChange={this.toggleSignupButton} />
            <input type="password"  placeholder="confirm"
              ref="signup_confirm_field" disabled={this.state.signupLoading} onChange={this.toggleSignupButton} />
          </form>

          <div style={{textAlign: 'right'}}>
            <a className="secondary small button radius" onClick={this.hideModal} style={{marginRight: '20', marginBottom: '0'}}>Cancel</a>
            {compositeButton}
          </div>
        </DropModal>
      )
    }

})
