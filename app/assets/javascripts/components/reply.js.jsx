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

    return (
      <li className="reply">
        <div className="reply-username">{this.props.reply.user.username}</div>
        <div className="reply-body">{this.props.reply.body}</div>
        <div className="reply-liked" onClick={this.likeReply}>{this.props.reply.liked.toString()}: liked?</div>
        <div className="reply-likes">{this.props.reply.likes} likes</div>
      </li>
    );
  }

});
