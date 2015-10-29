var SessionHandler = React.createClass({
  
  getInitialState: function() {
    return {
      login: true
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
    console.log("wut")
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
      
      if (this.state.login === true) {
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