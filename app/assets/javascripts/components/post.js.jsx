var Post = React.createClass({
  
  getInitialState: function() {
    return { repliesLoaded: false, replies: [] };
  },
  
  componentDidMount: function() {
    $('#write-reply-' + this.props.post.external_id).keyup(function (e) {
      if (e.keyCode === 13) {
        var auth_token = "s2erStcfxkL-mifC2jsc";
        var user_id = "6c08a62f-7971-4928-8d7d-cef07e2a675d";
    
        var data = { auth_token: auth_token, user_id: user_id }
        
        data.reply = { body: $('#write-reply-' + this.props.post.external_id).val() }
        
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
    }.bind(this));
  },
    
  likePost: function() {    
    var auth_token = "s2erStcfxkL-mifC2jsc";
    var user_id = "6c08a62f-7971-4928-8d7d-cef07e2a675d";
    
    var data = { auth_token: auth_token, user_id: user_id }
    
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
    var auth_token = "s2erStcfxkL-mifC2jsc";
    var user_id = "6c08a62f-7971-4928-8d7d-cef07e2a675d";
    
    $.ajax({
      method: "GET",
      url: "/api/v1/posts/" + this.props.post.external_id + "/replies.json",
      data: {auth_token: auth_token, user_id: user_id},
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
  
  renderPostInitial: function() {
    return(
      <li>
        <div className="post-username">{this.props.post.user.username}</div>
        <div className="post-title">{this.props.post.title}</div>
        <div className="post-body">{this.props.post.body}</div>
        <div className="post-likes">likes {this.props.post.likes}</div>
        <div className="post-replies-count">replies {this.props.post.replies_count}</div>
        <div className="post-like" onClick={this.likePost} >{this.props.post.liked.toString()}</div>
        <a className="button tiny radius" onClick={this.showReplies}>
          Replies
        </a>
        <div className="reply-to-post" style={{maxWidth: 600 + 'px'}}>
          <input type="text" id={'write-reply-' + this.props.post.external_id}>what</input>
        </div>
      </li>
    );
  },
  
  renderPostNoReplies: function() {
    return(
      <li>
        <div className="post-username">{this.props.post.user.username}</div>
        <div className="post-title">{this.props.post.title}</div>
        <div className="post-body">{this.props.post.body}</div>
        <div className="post-likes">likes {this.props.post.likes}</div>
        <div className="post-replies-count">replies {this.props.post.replies_count}</div>
        <div className="post-like" onClick={this.likePost} >{this.props.post.liked.toString()}</div>
        <div className="post-noreplies">No Replies</div>
      </li>
    );
  },
  
  renderPostReplies: function() {
    
    return(
      <li>
        <div className="post-username">{this.props.post.user.username}</div>
        <div className="post-title">{this.props.post.title}</div>
        <div className="post-body">{this.props.post.body}</div>
        <div className="post-likes">likes {this.props.post.likes}</div>
        <div className="post-replies-count">replies {this.props.post.replies_count}</div>
        <div className="post-like" onClick={this.likePost} >{this.props.post.liked.toString()}</div>
        <ul className="post-replies no-bullet">
          {this.state.replies.map(function(reply) {
            return <Reply key={reply.external_id}
                          reply={reply} />
            
          }.bind(this))}
        </ul>
        <div className="reply-to-post" style={{maxWidth: 600 + 'px'}}>
          <input type="text" id={'write-reply-' + this.props.post.external_id}>what</input>
        </div>
      </li>
    );
  },
      
  render: function() {
    if (this.state.repliesLoaded === false) {
      return this.renderPostInitial();
    } else if (this.state.error === true) {
      return this.renderPostInitial();
    } else if (this.state.replies.length === 0) {
      return this.renderPostNoReplies();
    } else {
      return this.renderPostReplies();
    }
  }
  
});