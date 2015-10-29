var Notification = React.createClass({
  
  goToPost: function(e) {
    this.props.handleNotificationPressed(this.props.notification)
  },
  
  render: function() {
    return (
      <li onClick={this.goToPost}>
        {this.props.notification.post_id}
      </li>
    )
  }
  
})