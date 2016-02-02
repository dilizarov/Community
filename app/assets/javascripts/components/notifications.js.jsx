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

          var title = this.props.currentCommunity === '' ? 'Community' : this.props.currentCommunity

          if (res.notifications_count > 0) {
            document.title = "(" + res.notifications_count + ") " + title
          } else {
            document.title = title
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

    document.title = this.props.currentCommunity === '' ? 'Community' : this.props.currentCommunity;

    this.setState({
      notificationsCount: 0
    })

    var data = { auth_token: Session.authToken() }

    $.ajax({
      method: "GET",
      url: "/api/v1/users/" + Session.userId() + "/notifications.json",
      data: data,
      success: function(res) {
        if (this.isMounted()) {

          this.setState({
            notifications: res.notifications,
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

  notificationPressed: function(notification) {
    this.props.handleNotificationPressed(notification)
    this.setState({
      opened: false
    })
  },

  toggleMenu: function() {
    if (this.state.opened === true) {
      this.setState({
        opened: false
      })
    } else {
      this.getNotifications()
    }
  },

  closeMenu: function() {
    this.setState({
      opened: false
    })
  },

  render: function() {

    var toggle = (
        <i className="fa fa-bell-o" onClick={this.toggleMenu}>
          <NotificationBadge count={this.state.notificationsCount} duration={100} className='notification-counter' />
        </i>
    )

    var menuOptions = {
      isOpen: this.state.opened,
      close: this.closeMenu,
      toggle: toggle,
      align: 'left',
      size: 'md',
      inverse: false
    }

    return (
      <div>
        
      </div>
      // <DropdownMenu {...menuOptions}>
      //   {this.state.notifications.map(function(notification) {
      //     return (<Motification key={notification.id}
      //                           notification={notification}
      //                           handleNotificationPressed={this.notificationPressed} />)
      //   }.bind(this))}
      // </DropdownMenu>
    )

    // var content;
    //
    // if (this.state.opened === true) {
    //   content = (<div className="arrow_box">
    //   <ul className="no-bullet notifications-list">
    //     {this.state.notifications.map(function(notification) {
    //       return (<Motification notification={notification}
    //                             handleNotificationPressed={this.notificationPressed} />)
    //
    //     }.bind(this))}
    //   </ul>
    //   </div>)
    // }
    //
    // return (
    //   <span className="notifications">
    //
    //     <i className="fa fa-bell fa-2x" onClick={this.getNotifications}>
    //       <NotificationBadge count={this.state.notificationsCount} duration={100} className='notification-counter' />
    //     </i>
    //     {content}
    //     {/*<span className="notifications-count" onClick={this.getNotifications}>
    //       {'COUNT: ' + this.state.notificationsCount}
    //     </span>*/}
    //   </span>
    //)
  }

})
