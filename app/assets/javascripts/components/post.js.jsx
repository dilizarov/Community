var Post = React.createClass({

  getInitialState: function() {
    return {
      repliesLoaded: false,
      submittingReply: false,
      replies: []
    };
  },

  maybeCreateReply: function(e) {
    if (e.keyCode === 13 && !e.shiftKey && $.trim(e.target.value) !== '') {

      var data = { auth_token: Session.authToken(), user_id: Session.userId() }

      var replyBody = $.trim(e.target.value);

      data.reply = { body: replyBody }

      if (this.state.repliesLoaded === false) {
        data.include_replies = true
      }

      this.setState({
        submittingReply: true,
        repliesLoading: true
      })

      $.ajax({
        method: "POST",
        url: "/api/v1/posts/" + this.props.post.external_id + "/replies.json",
        data: data,
        success: function(res) {
          if (this.isMounted()) {

            var replies = data.include_replies === true
                          ? res.replies
                          : React.addons.update(this.state.replies, { $push: [res.reply]})

            this.setState({
              repliesLoaded: true,
              submittingReply: false,
              repliesLoading: false,
              replies: replies,
              submitReplyError: false
            }, function() {
              this.refs.writeReply.value = ""
            });

            this.props.handleUpdateRepliesCount(this.props.post, replies.length);
          }
        }.bind(this),
        error: function(err) {
          if (this.isMounted()) {

            this.setState({
              submittingReply: false,
              repliesLoading: false,
              submitReplyError: true
            }, function() {
              this.refs.writeReply.value = replyBody;
              this.refs.tooltip.show();
            })
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

    this.setState({
      repliesLoading: true
    })

    $.ajax({
      method: "GET",
      url: "/api/v1/posts/" + this.props.post.external_id + "/replies.json",
      data: { auth_token: Session.authToken(), user_id: Session.userId() },
      success: function(res) {
        if (this.isMounted()) {
          this.setState({
            replies: res.replies,
            repliesLoaded: res.replies > 0,
            repliesLoading: false
          });

          this.props.handleUpdateRepliesCount(this.props.post, res.replies.length);
        }
      }.bind(this),
      error: function(err) {
        if (this.isMounted()) {
          this.setState({
            repliesLoading: false
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

  haltEnter: function(e) {
    if (e.keyCode === 13 && !e.shiftKey && $.trim(e.target.value) !== '') {
      e.preventDefault()
    }
  },

  //TODO: Handle error handling/display
  render: function() {

    var repliesContent;

    if (this.state.repliesLoaded === false) {
      repliesContent = ''
    } else if (this.state.error === true) {
      //TODO: Located here
      repliesContent = 'Error loading replies'
    } else if (this.state.replies.length !== 0) {
      repliesContent = (<ul className="post-replies no-bullet">
        {this.state.replies.map(function(reply) {
          return (<Reply key={reply.external_id}
                         reply={reply}
                         toggleLikeReply={this.likeReply} />)
        }.bind(this))}
      </ul>)
    }

    var repliesLoader;

    if (this.state.repliesLoading === true) {
      repliesLoader = <Spinner />
    }

    var heartLikesClass = classNames('fa', {'fa-heart': this.props.post.liked, 'fa-heart-o': !this.props.post.liked}),
        likesCount = this.props.post.likes.toThousandsString(),
        repliesCount = this.props.post.replies_count.toThousandsString(),
        postTitle = this.props.post.title ? this.props.post.title + ' ' : '';

    var writeReplyClass = classNames(
      'write-reply',
      {'write-reply-disabled': this.state.submittingReply,
       'submit-error': this.state.submitReplyError}
     );

     var writeReplyTextArea = (
       <TextareaAutosize placeholder="Write a reply..."
         className={writeReplyClass}
         disabled={this.state.submittingReply}
         rows={1}
         minRows={1}
         ref="writeReply"
         onKeyDown={this.haltEnter}
         onKeyUp={this.maybeCreateReply} />
     );

     if (this.state.submitReplyError) {
       //TODO Error Text
       writeReplyTextArea = (
         <Tooltip ref="tooltip" title="Issues submitting reply" position='top'>
           <TextareaAutosize placeholder="Write a reply..."
             className={writeReplyClass}
             disabled={this.state.submittingReply}
             rows={1}
             minRows={1}
             ref="writeReply"
             onKeyDown={this.haltEnter}
             onKeyUp={this.maybeCreateReply} />
         </Tooltip>
       )
     }

    var rel = this.props.relationship;
    var user_avatar_url;

    var sessData = Session.userInfo();

    if (rel && rel.user) {
      user_avatar_url = rel.user.avatar_url ? rel.user.avatar_url : sessData.avatar_url;
    } else {
      user_avatar_url = sessData.avatar_url;
    }

    return (
      <li className="post clearfix">
        <div className="post-heading clearfix">
          <Avatar source={this.props.post.user.avatar_url} style={{float: 'left'}}/>
          <span className="post-username">{this.props.post.user.username}</span>
          <span className="post-timestamp">{timestamp(this.props.post.created_at)}</span>
        </div>
        <div className="post-title">{postTitle}</div>
        <div className="post-body">{this.props.post.body}</div>
        <div className="post-stats">
          <span className="post-likes" onClick={this.likePost}><i className={heartLikesClass}></i>{likesCount} {likesCount === '1' ? 'like' : 'likes'}</span>
          <span className="post-replies-stats" onClick={this.toggleReplies}>
            <i className="fa fa-comment-o"></i>
            <span className="post-replies-count">{repliesCount} {repliesCount === '1' ? 'reply' : 'replies'}</span>
          </span>
          {repliesLoader}
        </div>
        {repliesContent}
        <div className="reply-to-post-wrapper">
          <Avatar size="sm" source={user_avatar_url} style={{float: 'left', marginRight: 0, marginTop: 7}}/>
          <div className="reply-to-post">
            {writeReplyTextArea}
          </div>
        </div>
      </li>
    )
  }

});
