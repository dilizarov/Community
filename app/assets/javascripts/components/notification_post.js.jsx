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

    $.ajax({
      method: "GET",
      url: "/api/v1/posts/" + props.postId + "/replies.json",
      data: { auth_token: Session.authToken(), user_id: Session.userId(), include_post: true },
      success: function(res) {
        if (this.isMounted()) {

          this.setState({
            replies: res.replies,
            post: res.post,
            repliesLoaded: true,
            loaded: true,
            error: false
          });

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

  maybeCreateReply: function(e) {
    if (e.keyCode === 13 && !e.shiftKey && $.trim(e.target.value) !== '') {

      var data = { auth_token: Session.authToken(), user_id: Session.userId() }

      data.reply = { body: $.trim(e.target.value) }

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

            this.refs.writeReply.value = ""

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
              post: post
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
            repliesLoaded: true,
            repliesLoading: false,
            error: false
          });
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

  renderLoading: function() {
    return <div style={{textAlign: 'center'}}><Spinner size="md" /></div>
  },

  renderError: function() {
    return <div>Fetching issues, brah. D:</div>
  },

  renderPost: function() {

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

    var heartLikesClass = classNames('fa', {'fa-heart': this.state.post.liked, 'fa-heart-o': !this.state.post.liked}),
        likesCount = this.state.post.likes.toThousandsString(),
        repliesCount = this.state.post.replies_count.toThousandsString(),
        postTitle = this.state.post.title ? this.state.post.title + ' ' : '';

    var writeReplyClass = classNames('write-reply', {'write-reply-disabled': this.state.submittingReply})

    var rel = this.props.notification.recipient_relationship;
    var user_avatar_url;

    var sessData = Session.userInfo();

    if (rel && rel.user) {
      user_avatar_url = rel.user.avatar_url ? rel.user.avatar_url : sessData.avatar_url;
    } else {
      user_avatar_url = sessData.avatar_url;
    }

    return (
      <div className="post clearfix">
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
            <TextareaAutosize placeholder="Write a reply..."
                              className={writeReplyClass}
                              disabled={this.state.submittingReply}
                              rows={1}
                              minRows={1}
                              ref="writeReply"
                              onKeyDown={this.haltEnter}
                              onKeyUp={this.maybeCreateReply} />
          </div>
        </div>
      </div>
    )
  },

  render: function() {
    if (this.state.loaded === false) {
      return this.renderLoading();
    } else if (this.state.error === true) {
      //TODO: Need to render an error screen. Probably a retry to fetching
      return this.renderPostInitial();
    } else {
      return this.renderPost();
    }
  }

});
