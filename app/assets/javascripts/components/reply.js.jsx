var Reply = React.createClass({

  likeReply: function() {

    var data = { auth_token: Session.authToken(), user_id: Session.userId() };

    if (this.props.reply.liked === true) {
      data.dislike = true;
    }

    this.props.toggleLikeReply(this.props.reply);

    $.ajax({
      method: "GET",
      url: "/api/v1/replies/" + this.props.reply.external_id + "/like.json",
      data: data,
      error: function(err) {
        if (this.isMounted()) {
           this.props.toggleLikeReply(this.props.reply);
        }
      }.bind(this)
    });
  },

  render: function() {

    var heartLikesClass = classNames('fa', {'fa-heart': this.props.reply.liked, 'fa-heart-o': !this.props.reply.liked});

    return (
      <li className="reply">
        <Avatar source={this.props.reply.user.avatar_url} size="sm" style={{float: 'left'}} />
        <span className="reply-username">{this.props.reply.user.username}</span>&nbsp;&nbsp;
        <div className="reply-body">{this.props.reply.body}</div>&nbsp;&nbsp;
        <span className="reply-likes" onClick={this.likeReply}><i className={heartLikesClass}></i>{this.props.reply.likes.toThousandsString()}</span>
        <span className="reply-timestamp">{timestamp(this.props.reply.created_at)}</span>
      </li>
    );
  }

});
