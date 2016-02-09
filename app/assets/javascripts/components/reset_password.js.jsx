var ResetPassword = React.createClass({

  getInitialState: function() {
    return {
      passwordChanged: false,
      submitEnabled: false
    }
  },

  reloadMainPage: function() {
    window.location.href = "/"
  },

  toggleButtonEnabled: function(e) {

    var passwordVal = this.refs.password_field.value;
    var confirmVal = this.refs.confirm_field.value;

    this.setState({
      submitEnabled: passwordVal !== "" && confirmVal !== "" && passwordVal === confirmVal
    })
  },

  submitChange: function() {
    var passwordVal = this.refs.password_field.value;
    var confirmVal = this.refs.confirm_field.value;

    if (this.state.submitEnabled !== true ||
      !(passwordVal !== "" && confirmVal !== "" && passwordVal === confirmVal)) { return }

    $.ajax({
      method: "POST",
      url: 'api/v1/users/reset_password.json',
      data: { email: this.props.email, reset_token: this.props.reset_token, password: passwordVal },
      success: function() {
        if (this.isMounted()) {
          this.setState({
            passwordChanged: true
          })
        }
      }.bind(this),
      error: function(err) {

      }.bind(this)
    })
  },

  render: function() {

    var mainContent;

    if (this.state.passwordChanged === true) {
      mainContent = "wow";
    } else if (this.props.success === true) {

       var submitClasses = classNames(
        'change-password',
        'button',
        'tiny',
        'radius',
        { 'disabled' : this.state.submitEnabled !== true }
      )

      mainContent = (
        <div>
          <input type="password" placeholder="password" onChange={this.toggleButtonEnabled} ref="password_field" />
          <input type="password" placeholder="confirm" onChange={this.toggleButtonEnabled} ref="confirm_field" />
          <a className={submitClasses} onClick={this.submitChange}>Change Password</a>
        </div>
      )
    } else {

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

              {mainContent}
            </div>
          </div>
        </div>
      </div>
    )

  }

})
