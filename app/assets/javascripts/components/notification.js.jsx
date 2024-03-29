// Notification is a browser API
var Motification = React.createClass({

  goToPost: function(e) {
    this.props.handleNotificationPressed(this.props.notification)
  },

  render: function() {

    var kind = this.props.notification.kind;
    var username = this.props.notification.user.username;
    var communityName = this.props.notification.community_normalized;
    var avatar = this.props.notification.user.avatar_url;

    var connectionText;

    if (kind === "post_created") {
      connectionText = " posted in "
    } else if (kind === "post_liked") {
      connectionText = " likes your post in "
    } else if (kind === "reply_liked") {
      connectionText = " likes your reply"
    } else {
      connectionText = " replied to a post in "
    }

    var endText;

    if (kind !== "reply_liked") {
      endText = <b>{"&" + communityName}</b>
    }

    return (
      <li className="notification-item clearfix" onClick={this.goToPost}>
        <Avatar source={avatar} style={{float: 'left'}}/>
        <div style={{overflow: 'hidden'}}>
          <span className="notification-text"><b>{username}</b>{connectionText}{endText}</span>
          <span className="notification-timestamp">{timestamp(this.props.notification.created_at)}</span>
        </div>
      </li>
    )
  }

})
