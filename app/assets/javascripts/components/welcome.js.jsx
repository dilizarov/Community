var Welcome = React.createClass({
  
  getInitialState: function() {
    return {
      loaded: false
    }
  },
  
  componentDidMount: function() {
    $.ajax({
      method: "POST",
      url: "api/v1/sessions/meta_account.json",
      success: function(res) {
        Session.createMetaAccount(res.user.username, res.user.external_id, res.user.created_at, res.user.auth_token)
        
        this.setState({
          loaded: true
        })
      }.bind(this),
      error: function(err) {
        alert('fak')
      }.bind(this)
    })
  },
    
  changeUsername: function() {
    $.ajax({
      method: "POST",
      url: "api/v1/users/" + localStorage.getItem("meta_user_id") + "/meta_username.json",
      data: { auth_token: localStorage.getItem("meta_auth_token") },
      success: function(res) {
        Session.changeMetaUsername(res.user.username)
        
        this.setState({
          loaded: true
        })
      }.bind(this),
      error: function(err) {
        
      }.bind(this)
    })
  },
  
  render: function() {
    return(
      <div className="generated_username">
        { localStorage.getItem("meta_username") }
        <a className="button tiny radius" onClick={this.changeUsername}>Try another</a>
        <a className="button tiny radius" onClick={this.props.segueToApp}>Go To App</a>
      </div>
    )
  }
  
})