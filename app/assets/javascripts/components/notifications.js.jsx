var Notifications = React.createClass({

  getInitialState: function() {
    return {
      notificationsCount: 0,
      notifications: [],
      opened: false
    };
  },

  componentDidMount: function() {
    this.startPolling();
  },

  componentWillUnmount: function() {
    $(document).unbind('click', this.hideNotifications)

    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.state.opened && !prevState.opened) {
      $(document).bind('click', this.hideNotifications);
    } else if (!this.state.opened && prevState.opened) {
      $(document).unbind('click', this.hideNotifications);
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

          // If they're the same, we assume no notification count prepends it.
          // If they're not, we assume there is a notification count prepending
          // and we replace it.
          if (document.title === this.props.currentCommunity) {
            document.title = "(" + res.notifications_count + ") " + document.title
          } else {
            var str = document.title
            var closeParenOnwards = str.substring(str.indexOf(")"))

            document.title = "(" + res.notifications_count + closeParenOnwards
          }

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
            notificationsCount: 0,
            opened: true
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

  hideNotifications: function(e) {

    var node = ReactDOM.findDOMNode(this);
    var target = e.target;

    while (target.parentNode) {
      if (target === node) {
        return;
      }

      target = target.parentNode;
    }

    this.setState({
      opened: false
    })
  },

  notificationPressed: function(notification) {
    this.props.handleNotificationPressed(notification)
    this.setState({
      opened: false
    })
  },

  render: function() {

    var content;

    if (this.state.opened === true) {
      content = (<div className="arrow_box">
      <ul className="no-bullet notifications-list">
        {this.state.notifications.map(function(notification) {
          return (<Motification notification={notification}
                                handleNotificationPressed={this.notificationPressed} />)

        }.bind(this))}
      </ul>
      </div>)
    }

    return (
      <span className="notifications">
        <i className="fa fa-bell fa-2x" onClick={this.getNotifications}>
          <NotificationBadge count={this.state.notificationsCount} duration={100} className='notification-counter' />
        </i>
        {content}
        {/*<span className="notifications-count" onClick={this.getNotifications}>
          {'COUNT: ' + this.state.notificationsCount}
        </span>*/}
      </span>
    )
  }

})
