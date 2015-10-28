var Notifications = React.createClass({
  
  getInitialState: function() {
    return {
      notificationsCount: 0
    };
  },
  
  componentDidMount: function() {
    this.startPolling();
  },
  
  componentWillUnmount: function() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  },
  
  startPolling: function() {
    if (this.isMounted()) {
      this.poll()
      // Every 5 minutes
      this._timer = setInterval(this.poll, 5 * 60 * 1000)
    }
  },
  
  poll: function() {
    var auth_token = "s2erStcfxkL-mifC2jsc";
    var user_id = "6c08a62f-7971-4928-8d7d-cef07e2a675d";
    
    var data = { auth_token: auth_token }
        
    $.ajax({
      method: "GET",
      url: "/api/v1/users/" + user_id + "/notifications_count.json",
      data: data,
      timeout: 4 * 60 * 1000, // request has 4 minutes... ensures this is within 5 minute poll.
      success: function(res) {
        if (this.isMounted()) {
        
          this.setState({
            notificationsCount: res.notifications_count
          });

        }
      }.bind(this),
      error: function(err) {
        if (this.isMounted()) {
          alert('blergh that failed.')
        }
      }.bind(this)
    })
  },
  
  render: function() {
      
    return (
      <div className="notifications">
        {'COUNT: ' + this.state.notificationsCount}
      </div>
    )
  }
  
})