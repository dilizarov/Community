var Notifications = React.createClass({

  getInitialState: function() {
    return {
      notificationsCount: 0,
      notifications: [],
      isOpen: false,
      isLoading: false
    };
  },

  componentDidMount: function() {
    this.startPolling();
  },

  componentDidUpdate: function(prevProps, prevState) {

    if (this.state.isOpen === prevState.isOpen) {
      return;
    }

    if (this.state.isOpen === true && prevState.isOpen === false) {
      this.lastWindowClickEvent = this.handleClickOutside;
      document.addEventListener('click', this.lastWindowClickEvent);
    } else if (this.state.isOpen === false && prevState.isOpen === true) {
      document.removeEventListener('click', this.lastWindowClickEvent);

      this.lastWindowClickEvent = null;
    }

    if (!this.state.isOpen) {
      this.resumeBodyScroll();
    }
  },

  handleClickOutside: function(e) {

    var target = e.target;

    while (target.parentNode) {
      if (target === this.refs.notifsHolder) {
        return;
      }

      target = target.parentNode;
    }

    this.setState({
      isOpen: false
    })
  },

  componentWillUnmount: function() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }

    if (this.lastWindowClickEvent) {
      document.removeEventListener('click', this.lastWindowClickEvent);
      this.lastWindowClickEvent = null;
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
          console.log("nu mah sides")
        }
      }.bind(this)
    })
  },

  getNotifications: function() {

    document.title = this.props.currentCommunity === '' ? 'Community' : this.props.currentCommunity;

    this.setState({
      notificationsCount: 0,
      isOpen: true,
      isLoading: true
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
            isLoading: false,
            isOpen: true
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
      isOpen: false
    })
  },

  toggleMenu: function() {
    if (this.state.isOpen) {
      this.setState({
        isOpen: false
      })
    } else {
      this.getNotifications()
    }
  },

  closeMenu: function() {
    this.setState({
      isOpen: false
    })
  },

  stopBodyScroll: function(e) {
    document.body.style.overflow = 'hidden';
  },

  resumeBodyScroll: function(e) {
    document.body.style.overflow = '';
  },

  render: function() {

    var notificationBodyClasses = classNames('notifications-body', {
      'are-loading' : this.state.isLoading
    })

    return (
      <span className="notifications-wrapper">
        <i className="fa fa-bell-o" onClick={this.toggleMenu}>
          <NotificationBadge count={this.state.notificationsCount} className='notification-counter' effect={[null, null, {top: '-30px'}, {top: '-25px'}]} />
        </i>

        {this.state.isOpen &&
          <div className="notifications-holder" ref="notifsHolder">
            <div className="notifications-header">Notifications</div>
            <div className={notificationBodyClasses} onMouseEnter={this.stopBodyScroll} onMouseLeave={this.resumeBodyScroll}>
              {(this.state.isLoading &&
                <Spinner size="sm" />
               ) || (
                 this.state.notifications.map(function(notification) {
                   return (
                     <Motification key={notification.id}
                                   notification={notification}
                                   handleNotificationPressed={this.notificationPressed} />
                   )
                 }.bind(this))
               )
              }
            </div>
          </div>
        }
      </span>
    )
  }

})
