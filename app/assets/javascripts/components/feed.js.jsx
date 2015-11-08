var Feed = React.createClass({

  getInitialState: function() {
    return { loaded: false, posts: [], joined: null };
  },

  componentDidMount: function() {

    if (this.props.forceReceiveProps === true) {
      this.componentWillReceiveProps(this.props);
    }
  },

  componentWillReceiveProps: function(props) {
    this.setState({
      loaded: false
    })

    $.ajax({
      method: "GET",
      url: "/api/v1/posts.json",
      data: { auth_token: Session.authToken(), user_id: Session.userId(), community: props.communityNameNormalized},
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
      data: { auth_token: Session.authToken(), user_id: Session.userId(), community: props.communityNameNormalized },
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

  submitPost: function() {
    var data = { auth_token: Session.authToken(), user_id: Session.userId() }

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

    $.ajax({
      method: "POST",
      url: "api/v1/communities.json",
      data: { auth_token: Session.authToken(), user_id: Session.userId(), community: this.props.communityNameNormalized },
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

  renderNoCommunity: function() {
    return (
      <div className='feed'>
        <h2 className='title'>
          No Community Selected
        </h2>
      </div>
    )
  },

  renderLoading: function() {

    var opts = {
      lines: 13,
      length: 20,
      radius: 15,
      width: 5,
      color: '#056A85',
      trail: 60,
      scale: 1.00,
      top: '50%',
      left: '50%'
    }

    return (
      <div className='feed'>
        <Loader loaded={false} className="spiner" options={opts} />
      </div>
    )
  },

  renderEmpty: function() {
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
          <input type="text" id='write-post' placeholder="Write a Post"/>
          <a className="button tiny radius" onClick={this.submitPost}>Post</a>
        </div>
        You have not joined any communities
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
          <input type="text" id='write-post' placeholder="Write a new post" />
        <a className="button tiny radius" onClick={this.submitPost}>Post</a>
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

    if (this.props.communityNameNormalized === '') {
      return this.renderNoCommunity();
    } else if (this.state.loaded === false) {
      return this.renderLoading();
    } else if (this.state.error === true) {
      // I need an actual renderError(), but this suffices to take its place for now.
      return this.renderEmpty();
    } else if (this.state.posts.length === 0) {
      return this.renderEmpty();
    } else {
      return this.renderFeed();
    }
  }

});
