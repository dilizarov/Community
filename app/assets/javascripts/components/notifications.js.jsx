var Notifications = React.createClass({

  getInitialState: function() {
    return {
      notificationsCount: 0,
      notifications: []
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

    var data = { auth_token: Session.authToken() }

    $.ajax({
      method: "GET",
      url: "/api/v1/users/" + Session.userId() + "/notifications_count.json",
      data: data,
      timeout: 1 * 60 * 1000, // request has 1 minute max... ensures this is within 5 minute poll.
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

  getNotifications: function() {

    var data = { auth_token: Session.authToken() }

    $.ajax({
      method: "GET",
      url: "/api/v1/users/" + Session.userId() + "/notifications.json",
      data: data,
      success: function(res) {
        if (this.isMounted()) {

          this.setState({
            notifications: res.notifications,
            notificationsCount: 0
          });

        }
      }.bind(this),
      error: function(err) {
        if (this.isMounted()) {
          alert('FAILURE SUCKS')
        }
      }.bind(this)
    })
  },

  render: function() {

    return (
      <div className="notifications">
        <div className="notifications-count" onClick={this.getNotifications}>
          {'COUNT: ' + this.state.notificationsCount}
        </div>
        <ul className="no-bullet notifications-list">
          {this.state.notifications.map(function(notification) {
            return (<Motification notification={notification}
                                  handleNotificationPressed={this.props.handleNotificationPressed} />)

          }.bind(this))}
        </ul>
      </div>
    )
  }

})
