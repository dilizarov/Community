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
      this.avatarAboutToChange = null;
      this.componentWillReceiveProps(this.props);
    }
  },

  componentWillReceiveProps: function(props) {

    if (this.avatarAboutToChange) {
      this.avatarAboutToChange = null;
      return;
    }

    this.waitForRetry = null;

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

          this.props.handleCommunityStatus(res.membership, res.relationship);

          this.setState({
            posts: res.posts,
            relationship: res.relationship,
            loaded: true,
            error: false
          });
        }
      }.bind(this),
      error: function(err) {

        this.props.handleCommunityStatus(null, null, true);

        if (this.isMounted()) {
          this.setState({
            loaded: true,
            error: true
          });
        }
      }.bind(this)
    })
  },

  //We don't want to go through the willReceiveProps flow
  prepForAvatarChange: function() {
    this.avatarAboutToChange = true;
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

  loadMorePosts: function() {

    // Don't process if no posts or
    // If we tried before and 5 seconds have not elapsed
    if (this.state.posts.length === 0 ||
        this.waitForRetry && (Date.now() - this.waitForRetry) < 5000) { return }

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

          this.waitForRetry = null;

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

          this.waitForRetry = Date.now();

          // error is false because we'll just ignore failures for infinite scroll.
          this.setState({
            loaded: true,
            error: false,
            loadingMorePosts: false
          });
        }
      }.bind(this)
    })
  },

  retryLoadingCommunity: function() {
    this.props.handleSelectCommunity(this.props.communityNameNormalized, true);
  },

  goToCommunity: function() {
    this.props.handleSelectCommunity("community");
  },

  renderNoCommunity: function() {
    //@TODO Styling and Text
    return (
      <div className='feed no-community-selected'>
        <h2 className='title'>
          No community selected.
        </h2>
        <a style={{cursor: 'pointer'}} className='visit-community-link' onClick={this.props.triggerSearchBarClick}>Visit a community</a> to see content here.
        <br />
        <br />
        New here? Say hi and ask us anything at <a style={{cursor: 'pointer' }} className="visit-community-link" onClick={this.goToCommunity}>&community</a>.
      </div>
    )
  },

  renderLoading: function() {
    //Loading happens in sidebar
    return (
      <div className='feed'>
      </div>
    )
  },

  renderError: function() {
    //@TODO Styling and text
    return (
      <div className='feed'>
        <div className="panel error-box">
          <p>We had trouble fetching &{this.props.communityNameNormalized}</p>
          <a onClick={this.retryLoadingCommunity} style={{cursor: 'pointer'}}>Retry</a>
        </div>
      </div>
    )
  },

  renderEmpty: function() {
    //@TODO Text
    return (
      <div className='feed'>
        <WritePost communityNameNormalized={this.props.communityNameNormalized}
                   handleAddPostToFeed={this.addPostToFeed}
                   relationship={this.state.relationship} />
        <div className="no-posts-msg">
          This community has no posts
        </div>
      </div>
    )
  },

  renderFeed: function() {
    var waypoint;

    if (this.state.allPostsLoaded === false && this.state.loadingMorePosts === false) {
      waypoint = (<Waypoint
                    onEnter={this.loadMorePosts}
                    threshold={this.waitForRetry ? 0.0 : 2.0}
                 />)
    } else if (this.state.loadingMorePosts === true) {
      waypoint = <div style={{textAlign: 'center'}}><Spinner size="md" /></div>
    }

    return (
      <div className='feed'>
        <WritePost communityNameNormalized={this.props.communityNameNormalized}
                   handleAddPostToFeed={this.addPostToFeed}
                   relationship={this.state.relationship} />
        <ul className="no-bullet">
          {this.state.posts.map(function(post) {
            return (<Post key={post.external_id}
                         post={post}
                         relationship={this.state.relationship}
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
      return this.renderError();
    } else if (this.state.posts.length === 0) {
      return this.renderEmpty();
    } else {
      return this.renderFeed();
    }
  }

});
