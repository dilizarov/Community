var Feed = React.createClass({
  
  getInitialState: function() {
    return { loaded: false, posts: [], joined: null };
  },
  
  componentDidMount: function() {
    var auth_token = "s2erStcfxkL-mifC2jsc";
    var user_id = "6c08a62f-7971-4928-8d7d-cef07e2a675d";
    
    $('#write-post').keyup(function (e) {
      if (e.keyCode === 13) {
        var auth_token = "s2erStcfxkL-mifC2jsc";
        var user_id = "6c08a62f-7971-4928-8d7d-cef07e2a675d";
    
        var data = { auth_token: auth_token, user_id: user_id }
        
        data.post = { body: $('#write-post').val(), community: this.props.communityNameNormalized }
        
        $.ajax({
          method: "POST",
          url: "/api/v1/posts.json",
          data: data,
          success: function(res) {
            if (this.isMounted()) {
            
              this.setState({
                posts: [res.post].concat(this.state.posts)
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
    
    if (this.props.forceReceiveProps === true) {
      this.componentWillReceiveProps(this.props);
    }
  },
  
  componentWillReceiveProps: function(props) {
    var auth_token = "s2erStcfxkL-mifC2jsc";
    var user_id = "6c08a62f-7971-4928-8d7d-cef07e2a675d";
    
    this.setState({
      loaded: false
    })
    
    $.ajax({
      method: "GET",
      url: "/api/v1/posts.json?auth_token=" + auth_token +"&user_id=" + user_id + "&community=" + props.communityNameNormalized,
      success: function(res) {
        if (this.isMounted()) {
          this.setState({
            posts: res.posts,
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
    
    $.ajax({
      method: "GET",
      url: '/api/v1/communities/show.json',
      data: { auth_token: auth_token, user_id: user_id, community: props.communityNameNormalized },
      success: function(res) {
        if (this.isMounted()) {
          this.setState({
            joined: true
          })
        }
      }.bind(this),
      error: function(err) {
        if (this.isMounted()) {
          this.setState({
            joined: false
          })
        }
      }.bind(this)
    })
  },
  
  likePost: function(post) {
    var index = this.state.posts.indexOf(post);
    if (post.liked === true) {
      post.liked = false
      // Should always hold, but might as well check.
      if (post.likes > 0) {
        post.likes -= 1        
      }
    } else {
      post.liked = true
      post.likes += 1
    }
    
    var posts = React.addons.update(this.state.posts, { $splice: [[index, 1, post]] });
    
    this.setState({ posts: posts });
  },
  
  updateRepliesCount: function(post, count) {
    var index = this.state.posts.indexOf(post);
    
    post.replies_count = count
    
    var posts = React.addons.update(this.state.posts, { $splice: [[index, 1, post]] });
    
    this.setState({ posts: posts });
  },
  
  showCommunitySettings: function() {
    console.log('settings')
  },
  
  joinCommunity: function() {
    var auth_token = "s2erStcfxkL-mifC2jsc";
    var user_id = "6c08a62f-7971-4928-8d7d-cef07e2a675d";
    
    $.ajax({
      method: "POST",
      url: "api/v1/communities.json",
      data: { auth_token: auth_token, user_id: user_id, community: this.props.communityNameNormalized },
      success: function(res) {
        this.setState({
          joined: true
        })
        
        this.props.handleAddCommunityToList(res.community)
      }.bind(this), 
      error: function(err) {
        alert('fuckkkk')
      }.bind(this)
    })
  },
  
  renderLoading: function() {
    return (
      <div className='feed'>
        <h2 className='title'>
          LOADING
        </h2>
        <div className="post-to-community" style={{maxWidth: 600 + 'px'}}>
          <input type="text" id='write-post'>what</input>
        </div>
      </div>
    )
  },
  
  renderEmpty: function() {
    return (
      <div className='feed'>
        <h2 className='title'>
          {this.props.communityName}
        </h2>
        <div className="post-to-community" style={{maxWidth: 600 + 'px'}}>
          <input type="text" id='write-post'>what</input>
        </div>
        You haven not joined any communities
      </div>
    )
  },
  
  renderFeed: function() {
    var join;
    
    if (this.state.joined === null) {
      join = <a className='button tiny radius disabled'>Loading</a> 
    } else if (this.state.joined === true) {
      join = <a className='button tiny radius' onClick={this.showCommunitySettings}>Settings</a>
    } else {
      join = <a className='button tiny radius' onClick={this.joinCommunity}>Join</a>
    }
    
    return (
      <div className='feed'>
        <h2 className='title'>
          {this.props.communityName}
        </h2>
        {join}
        <div className="post-to-community" style={{maxWidth: 600 + 'px'}}>
          <input type="text" id='write-post'>what</input>
        </div>
        <ul className="no-bullet">
          {this.state.posts.map(function(post) {
            return <Post key={post.external_id} 
                         post={post}
                         toggleLikePost={this.likePost}
                         handleUpdateRepliesCount={this.updateRepliesCount} />
                        
          }.bind(this))}
        </ul>
      </div>
    )
  },
  
  render: function() {

    if (this.state.loaded === false) {
      return this.renderLoading();
    } else if (this.state.error === true) {
      return this.renderEmpty();
    } else if (this.state.posts.length === 0) {
      return this.renderEmpty();
    } else {
      return this.renderFeed();
    }
  }
  
});