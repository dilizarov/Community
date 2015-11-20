var Post = React.createClass({

  getInitialState: function() {
    return {
      repliesLoaded: false,
      replies: []
    };
  },

  maybeCreateReply: function(e) {
    if (e.keyCode === 13 && !e.shiftKey && $.trim(e.target.value) !== '') {

      var data = { auth_token: Session.authToken(), user_id: Session.userId() }

      data.reply = { body: $.trim(e.target.value) }

      $.ajax({
        method: "POST",
        url: "/api/v1/posts/" + this.props.post.external_id + "/replies.json",
        data: data,
        success: function(res) {
          if (this.isMounted()) {

            this.setState({
              replies: this.state.replies.concat([res.reply])
            });

          }
        }.bind(this),
        error: function(err) {
          if (this.isMounted()) {
            alert('blergh that failed.')
          }
        }.bind(this)
      })
    }
  },

  likePost: function() {

    var data = { auth_token: Session.authToken(), user_id: Session.userId() }

    if (this.props.post.liked === true) {
      data.dislike = true
    }

    this.props.toggleLikePost(this.props.post)

    $.ajax({
      method: "GET",
      url: "/api/v1/posts/" + this.props.post.external_id + "/like.json",
      data: data,
      error: function(err) {
        if (this.isMounted()) {
           this.props.toggleLikePost(this.props.post)
        }
      }.bind(this)
    })
  },

  showReplies: function(e) {
    //@TODO: indicate we are loading replies

    $.ajax({
      method: "GET",
      url: "/api/v1/posts/" + this.props.post.external_id + "/replies.json",
      data: { auth_token: Session.authToken(), user_id: Session.userId() },
      success: function(res) {
        if (this.isMounted()) {
          this.setState({
            replies: res.replies,
            repliesLoaded: true,
            error: false
          });

          this.props.handleUpdateRepliesCount(this.props.post, res.replies.length);
        }
      }.bind(this),
      error: function(err) {
        if (this.isMounted()) {
          this.setState({
            loaded: true,
            error: true
            //Do some error data stuff as well.
          });
        }
      }.bind(this)
    })
  },

  hideReplies: function() {
    this.setState({
      repliesLoaded: false
    });
  },

  toggleReplies: function() {
    if(this.state.repliesLoaded === false) {
      this.showReplies();
    }
    else {
      this.hideReplies();
    }
  },

  likeReply: function(reply) {
    var index = this.state.replies.indexOf(reply);
    if (reply.liked === true) {
      reply.liked = false
      // Should always hold, but might as well check.
      if (reply.likes > 0) {
        reply.likes -= 1
      }
    } else {
      reply.liked = true
      reply.likes += 1
    }

    var replies = React.addons.update(this.state.replies, { $splice: [[index, 1, reply]] });

    this.setState({ replies: replies });
  },

  //TODO: Handle error handling/display
  render: function() {

    var repliesContent;

    if (this.state.repliesLoaded === false) {
      repliesContent = ''
    } else if (this.state.error === true) {
      //TODO: Located here
      repliesContent = 'Error loading replies'
    } else if (this.state.replies.length === 0) {
      repliesContent = 'No replies'
    } else {
      repliesContent = (<ul className="post-replies no-bullet">
        {this.state.replies.map(function(reply) {
          return (<Reply key={reply.external_id}
                         reply={reply}
                         toggleLikeReply={this.likeReply} />)
        }.bind(this))}
      </ul>)
    }

    return (
      <li className="post">
        <div className="post-username">{this.props.post.user.username}</div>
        <div className="post-timestamp">{timestamp(this.props.post.created_at)}</div>
        <div className="post-title">{this.props.post.title}</div>
        <div className="post-body">{this.props.post.body}</div>
        <div className="post-stats">
          <span className={this.props.post.liked === true ? 'post-liked' : 'post-not-liked'}
                onClick={this.likePost}>{this.props.post.likes} likes </span>
          <span className="post-replies-count" onClick={this.toggleReplies}>{this.props.post.replies_count} replies </span>
        </div>
        {repliesContent}
        <div className="reply-to-post">
          <GrowingTextarea placeholder="Write a reply..."
                           minRows={1}
                           keyDownEnterHalt={true}
                           handleKeyUp={this.maybeCreateReply} />
        </div>
      </li>
    )
  }

});
