var Feed = React.createClass({

  getInitialState: function() {
    return {
      loaded: false,
      posts: [],
      loadingMorePosts: false,
      allPostsLoaded: false
    };
  },

  componentDidMount: function() {

    if (this.props.forceReceiveProps === true) {
      this.componentWillReceiveProps(this.props);
    }
  },

  componentWillReceiveProps: function(props) {
    this.setState({
      loaded: false,
      loadingMorePosts: false,
      allPostsLoaded: false
    })

    $.ajax({
      method: "GET",
      url: "/api/v1/posts.json",
      data: { auth_token: Session.authToken(), user_id: Session.userId(), community: props.communityNameNormalized, verify_membership: true},
      success: function(res) {
        if (this.isMounted()) {

          this.setState({
            posts: res.posts,
            loaded: true,
            error: false,
            joined: res.membership
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

  addPostToFeed: function(post) {
    if (this.isMounted()) {
      this.setState({
        posts: [post].concat(this.state.posts)
      });
    }
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
  },

  joinCommunity: function() {

    $.ajax({
      method: "POST",
      url: "api/v1/communities.json",
      data: { auth_token: Session.authToken(), user_id: Session.userId(), community: this.props.communityName },
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

  loadMorePosts: function() {
    if (this.state.posts.length === 0) { return }

    this.setState({
      loadingMorePosts: true
    })

    /*
      Pages are 15 posts each

      Infinite Scroll Time Buffer is used to mitigate the fact that
      new posts would push down pages, and you'd see duplicate posts
    */
    var data = {
      auth_token: Session.authToken(),
      user_id: Session.userId(),
      community: this.props.communityNameNormalized,
      page: Math.ceil(this.state.posts.length / 15) + 1,
      infinite_scroll_time_buffer: this.state.posts[0].created_at
    }

    $.ajax({
      method: "GET",
      url: "/api/v1/posts.json",
      data: data,
      success: function(res) {
        if (this.isMounted()) {

          var allPostsLoaded = res.posts.length < 15;

          this.setState({
            posts: this.state.posts.concat(res.posts),
            loaded: true,
            error: false,
            loadingMorePosts: false,
            allPostsLoaded: allPostsLoaded
          });
        }
      }.bind(this),
      error: function(err) {
        if (this.isMounted()) {
          this.setState({
            loaded: true,
            error: true,
            loadingMorePosts: false
            //Do some error data stuff as well.
          });
        }
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

    return (
      <div className='feed'>
        <h2 className='title'>
          {this.props.communityName} <Spinner />
        </h2>
      </div>
    )
  },

  renderEmpty: function() {
    var join;

    if (this.state.joined === null) {
      join = <a className='join-link disabled'>Loading</a>
    } else if (this.state.joined === true) {
      join = <a className='join-link' onClick={this.showCommunitySettings}>Settings</a>
    } else {
      join = <a className='join-link' onClick={this.joinCommunity}>Join</a>
    }

    return (
      <div className='feed'>
        <h2 className='title'>
          {this.props.communityName}
          {join}
        </h2>
        <WritePost communityNameNormalized={this.props.communityNameNormalized}
                   handleAddPostToFeed={this.addPostToFeed}/>
        You have not joined any communities
      </div>
    )
  },

  renderFeed: function() {
    var join;

    if (this.state.joined === false) {
      join = <a className='join-link' onClick={this.joinCommunity}>Join</a>
    } else {
//TODO: Due to feed and communities both being async, there is no guarantee they are linked.
// Avoid hassles by just having a settings button. I think it should be a cog.
// Just leaving this commented out for now due to no settings functionality in app yet.
// Last thing being worked on.
//      join = <a className='button tiny radius' onClick={this.goToSettings}>Settings</a>
    }

    var waypoint;

    if (this.state.allPostsLoaded === false && this.state.loadingMorePosts === false) {
      waypoint = (<Waypoint
                    onEnter={this.loadMorePosts}
                    threshold={2.0}
                 />)
    } else if (this.state.loadingMorePosts === true) {
      waypoint = <div style={{textAlign: 'center'}}><Spinner size="md" /></div>
    }

    return (
      <div className='feed'>
        <h2 className='title'>
          {this.props.communityName}
        </h2>
        {join}
        <WritePost communityNameNormalized={this.props.communityNameNormalized}
                   handleAddPostToFeed={this.addPostToFeed}/>
        <ul className="no-bullet">
          {this.state.posts.map(function(post) {
            var avatar_url = "http://lorempixel.com/500/500/people?dummy=" + Math.ceil(Math.random() * 10000)
            if (Math.ceil(Math.random() * 2) === 1) {
              post.user.avatar_url = avatar_url
            }
            return (<Post key={post.external_id}
                         post={post}
                         toggleLikePost={this.likePost}
                         handleUpdateRepliesCount={this.updateRepliesCount} />)

          }.bind(this))}
        </ul>
        {waypoint}
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
