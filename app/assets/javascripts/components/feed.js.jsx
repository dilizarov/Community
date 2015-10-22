var Feed = React.createClass({
  
  getInitialState: function() {
    return { loaded: false };
  },
  
  componentDidMount: function() {
    var auth_token = "s2erStcfxkL-mifC2jsc";
    var user_id = "6c08a62f-7971-4928-8d7d-cef07e2a675d";
    
    $.ajax({
      method: "GET",
      url: "/api/v1/posts.json?auth_token=" + auth_token +"&user_id=" + user_id + "&community=cfb",
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
  },
  
  renderLoading: function() {
    return (
      <div className='feed'>
        <h2 className='title'>
          LOADING
        </h2>
      </div>
    )
  },
  
  renderEmpty: function() {
    return (
      <div className='feed'>
        <h2 className='title'>
          Feed
        </h2>
        You haven not joined any communities
      </div>
    )
  },
  
  renderFeed: function() {
    return (
      <div className='feed'>
        <h2 className='title'>
          Feed
        </h2>
        <ul className="no-bullet">
          {this.state.posts.map(function(post) {
            return <Post key={post.external_id} 
                              post={post} />
                        
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