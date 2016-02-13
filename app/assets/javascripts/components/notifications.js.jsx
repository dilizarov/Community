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
            loadingError: false
          });

        }
      }.bind(this),
      error: function(err) {
        if (this.isMounted()) {

          this.setState({
            isLoading: false,
            loadingError: true
          });

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

    var errorProps = {};

    /*
      The reason why we use display none instead of simply not having
      it in the DOM is because its callback, this.getNotifications,
      is called before the document callback, this.handleClickOutside,
      and by simply not having it, we run into the issue where it loses
      its parentNode in handleClickOutside. By always keeping it in the DOM,
      it acts fine in handleClickOutside.
    */
    if (!this.state.loadingError || this.state.isLoading) {
      //@TODO text for the error and empty, which is below.
      errorProps.style = { display: 'none' }
    }

    return (
      <span className="notifications-wrapper">
        <i className="fa fa-bell-o" onClick={this.toggleMenu}>
          <NotificationBadge count={this.state.notificationsCount} className='notification-counter' effect={[null, null, {top: '-30px'}, {top: '-25px'}]} />
        </i>

        {this.state.isOpen &&
          <div className="notifications-holder" ref="notifsHolder">
            <div className="notifications-header">Notifications</div>
            <div className={notificationBodyClasses} onMouseEnter={this.stopBodyScroll} onMouseLeave={this.resumeBodyScroll}>
              <div className="notifications-error" onClick={this.getNotifications} {...errorProps}>Trouble loading notifications</div>
              {(this.state.isLoading &&
                <Spinner size="sm" />
               ) || (
                 !this.state.loadingError &&
                 ((this.state.notifications.length > 0 &&
                   this.state.notifications.map(function(notification) {
                     return (
                       <Motification key={notification.id}
                                     notification={notification}
                                     handleNotificationPressed={this.notificationPressed} />
                     )
                   }.bind(this))
                 ) || (
                   <div className="notifications-empty">
                     No notifications
                   </div>
                 ))
               )
              }
            </div>
          </div>
        }
      </span>
    )
  }

})
