// The Post component relies on Feed to update look of liked state.
// This is self contained
var NotificationPost = React.createClass({

  getInitialState: function() {
    return {
      replies: [],
      repliesLoaded: false,
      submittingReply: false,
      post: null,
      loaded: false
    };
  },

  componentDidMount: function() {
    document.title = "Community"

    this.componentWillReceiveProps(this.props)
  },

  componentWillReceiveProps: function(props) {

    this.setState({
      replies: [],
      repliesLoaded: false,
      submittingReply: false,
      post: null,
      loaded: false
    })

    this.props.handleSidebarLoadedState(false)

    $.ajax({
      method: "GET",
      url: "/api/v1/posts/" + props.postId + "/replies.json",
      data: { auth_token: Session.authToken(), user_id: Session.userId(), include_post: true },
      success: function(res) {
        if (this.isMounted()) {

          this.setState({
            replies: res.replies,
            post: res.post,
            repliesLoaded: res.replies.length > 0,
            loaded: true,
            loadPostError: false
          });

          this.props.handleSidebarLoadedState(true)
        }
      }.bind(this),
      error: function(err) {
        if (this.isMounted()) {
          this.setState({
            loaded: true,
            loadPostError: true
          });

          this.props.handleSidebarLoadedState(true)
        }
      }.bind(this)
    })
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
        url: "/api/v1/posts/" + this.state.post.external_id + "/replies.json",
        data: data,
        success: function(res) {
          if (this.isMounted()) {

            var replies = data.include_replies === true
                          ? res.replies
                          : React.addons.update(this.state.replies, { $push: [res.reply]})

            var post = this.state.post;
            post.replies_count = replies.length;

            this.setState({
              repliesLoaded: true,
              submittingReply: false,
              repliesLoading: false,
              replies: replies,
              post: post,
              submitReplyError: false
            }, function() {
              this.refs.writeReply.value = ""
            });
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

    if (this.state.post.liked === true) {
      data.dislike = true
    }

    this.toggleLike();

    $.ajax({
      method: "GET",
      url: "/api/v1/posts/" + this.state.post.external_id + "/like.json",
      data: data,
      error: function(err) {
        if (this.isMounted()) {
           this.toggleLike()
        }
      }.bind(this)
    })
  },

  toggleLike: function() {
    var post = this.state.post;

    if (post.liked === true) {
      post.liked = false

      if (post.likes > 0) {
        post.likes -= 1
      }
    } else {
      post.liked = true
      post.likes += 1
    }

    this.setState({
      post: post
    })
  },

  showReplies: function(e) {

    this.setState({
      repliesLoading: true
    })

    $.ajax({
      method: "GET",
      url: "/api/v1/posts/" + this.state.post.external_id + "/replies.json",
      data: { auth_token: Session.authToken(), user_id: Session.userId() },
      success: function(res) {
        if (this.isMounted()) {
          this.setState({
            replies: res.replies,
            repliesLoaded: res.replies.length > 0,
            repliesLoading: false
          });
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
    } else {
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

  retryLoadingNotification: function() {
    this.componentWillReceiveProps(this.props)
  },

  renderLoading: function() {
    return <div></div>
  },

  renderError: function() {
    //@TODO Styling and text
    return (
      <div className="panel error-box">
        <h5>Uh oh</h5>
        <p>We had trouble getting the post</p>
        <a onClick={this.retryLoadingNotification} style={{cursor: 'pointer'}}>Retry</a>
      </div>
    )
  },

  renderPost: function() {

    var repliesContent;

    if (this.state.repliesLoaded === false) {
      repliesContent;
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

    var heartLikesClass = classNames('fa', {'fa-heart': this.state.post.liked, 'fa-heart-o': !this.state.post.liked}),
        likesCount = this.state.post.likes.toThousandsString(),
        repliesCount = this.state.post.replies_count.toThousandsString(),
        postTitle = this.state.post.title ? this.state.post.title + ' ' : '';

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

    var rel = this.props.notification.recipient_relationship;
    var user_avatar_url;

    var sessData = Session.userInfo();

    if (rel && rel.user) {
      user_avatar_url = rel.user.avatar_url ? rel.user.avatar_url : sessData.avatar_url;
    } else {
      user_avatar_url = sessData.avatar_url;
    }

    return (
      <ul className="no-bullet">
        <li className="post clearfix">
          <div className="post-heading clearfix">
            <Avatar source={this.state.post.user.avatar_url} style={{float: 'left'}}/>
            <span className="post-username">{this.state.post.user.username}</span>
            <span className="post-timestamp">{timestamp(this.state.post.created_at)}</span>
          </div>
          <div className="post-title">{postTitle}</div>
          <div className="post-body">{this.state.post.body}</div>
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
      </ul>
    )
  },

  render: function() {
    if (this.state.loaded === false) {
      return this.renderLoading();
    } else if (this.state.loadPostError === true) {
      return this.renderError();
    } else {
      return this.renderPost();
    }
  }

});
