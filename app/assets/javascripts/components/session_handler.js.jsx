var SessionHandler = React.createClass({
  
  getInitialState: function() {
    return {
      login: true,
      forgotPassword: false
    }
  },
  
  logout: function() {
    console.log("paul")
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
  
  render: function() {
    if (Session.loggedIn() === true) {
      return(
        <div className="logged-in-session">
          LOGGED IN, HELL YEAH!
          <a className="button tiny radius" onClick={this.logout}>LOG OUT PLS</a>
        </div>
      )
    } else {
      
      var accessAccount;
      
      if (this.state.forgotPassword === true) {
        accessAccount = (<div className="forgot-password">
                   <input type="text" placeholder="EMAIL" />
                    <a className="button tiny radius">Send Email</a>
                    <a className="button tiny radius" onClick={this.toggleForgotPassword}>Whoops</a>
                 </div>)
      } else if (this.state.login === true) {
        accessAccount = (<div className="login">
                   <input type="text" placeholder="EMAIL" />
                   <input type="text" placeholder="PASSWORDO" />
                    <a className="button tiny radius" onClick={this.togglePrimaryState}>Create Account</a>
                    <a className="button tiny radius" onClick={this.toggleForgotPassword}>Forgot Password</a>
                 </div>)
      } else {
        accessAccount = (<div className="create-account">
                   <input type="text" placeholder="USERNAME" />
                   <input type="text" placeholder="EMAIL" />
                   <input type="text" placeholder="PASSWORDOOOO" />
                   <input type="text" placeholder="CONFIRM ITTTT" />
                   <a className="button tiny radius" onClick={this.togglePrimaryState}>Log In</a>
                 </div>)
      }
      
      return(
        <div className="meta-session">
          I AINT LOGGED IN YET, PAUL
          {accessAccount}
        </div>
      )
    }
  }
  
})