// The Post component relies on Feed to update look of liked state.
// This is self contained
var NotificationPost = React.createClass({

  getInitialState: function() {
    return {
      replies: [],
      post: null,
      loaded: false
    };
  },

  componentDidMount: function() {

    $.ajax({
      method: "GET",
      url: "/api/v1/posts/" + this.props.postId + "/replies.json",
      data: { auth_token: Session.authToken(), user_id: Session.userId(), include_post: true },
      success: function(res) {
        if (this.isMounted()) {

          this.setState({
            replies: res.replies,
            post: res.post,
            loaded: true,
            error: false
          });

          this.setupWriteReplyHandler();
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

  setupWriteReplyHandler: function() {
    $('#write-reply-' + this.props.postId).keyup(function (e) {
       if (e.keyCode === 13) {

         var data = { auth_token: Session.authToken(), user_id: Session.userId() }

         data.reply = { body: $('#write-reply-' + this.props.postId).val() }

         $.ajax({
           method: "POST",
           url: "/api/v1/posts/" + this.props.postId + "/replies.json",
           data: data,
           success: function(res) {
             if (this.isMounted()) {

               var post = this.state.post

               post.replies_count += 1

               this.setState({
                 replies: this.state.replies.concat([res.reply]),
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
     }.bind(this));
  },

  likePost: function() {

    var data = { auth_token: Session.authToken(), user_id: Session.userId() }

    if (this.state.post.liked === true) {
      data.dislike = true
    }

    this.toggleLike()

    $.ajax({
      method: "GET",
      url: "/api/v1/posts/" + this.props.postId + "/like.json",
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

  renderLoading: function() {
    return(
      <div className='post-loading'>
        LOADING
      </div>
    )
  },

  renderPostNoReplies: function() {
    return(
      <div className="notification-post">
        <div className="post-username">{this.state.post.user.username}</div>
        <div className="post-title">{this.state.post.title}</div>
        <div className="post-body">{this.state.post.body}</div>
        <div className="post-likes">likes {this.state.post.likes}</div>
        <div className="post-replies-count">replies {this.state.post.replies_count}</div>
        <div className="post-like" onClick={this.likePost} >{this.state.post.liked.toString()}</div>
        <div className="post-noreplies">No Replies</div>
      </div>
    );
  },

  renderPost: function() {

    var repliesContent;

    if (this.state.replies.length === 0) {
      repliesContent = 'No replies'
    } else {
      repliesContent = (<ul className="post-replies no-bullet">
        {this.state.replies.map(function(reply) {
          return (<Reply key={reply.external_id}
                        reply={reply} />)

        }.bind(this))}
      </ul>)
    }

    return(
      <div className="notification-post">
        <div className="post-username">{this.state.post.user.username}</div>
        <div className="post-timestamp">{timestamp(this.props.post.created_at)}</div>
        <div className="post-title">{this.state.post.title}</div>
        <div className="post-body">{this.state.post.body}</div>
        <div className="post-stats">
          <span className={this.state.post.liked === true ? 'post-liked' : 'post-not-liked'}
                onClick={this.likePost}>{this.props.post.likes} likes </span>
          <span className="post-replies-count">{this.props.post.replies_count} replies </span>
        </div>
        {repliesContent}
        <div className="reply-to-post">
          <GrowingTextarea placeholder="Write a reply..."
                          minRows={1}
                          keyDownEnterHalt={true}
                          handleKeyUp={this.maybeCreateReply} />
        </div>
      </div>
    );
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
