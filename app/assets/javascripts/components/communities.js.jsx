var Communities = React.createClass({
  
  getInitialState: function() {
    return { loaded: false };
  },
  
  componentDidMount: function() {
    var auth_token = "s2erStcfxkL-mifC2jsc";
    var user_id = "6c08a62f-7971-4928-8d7d-cef07e2a675d";
    
    $.ajax({
      method: "GET",
      url: "/api/v1/communities.json?auth_token=" + auth_token +"&user_id=" + user_id,
      success: function(res) {
        if (this.isMounted()) {
          this.setState({
            communities: res.communities,
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
  
  addCommunity: function(community) {
    var communities = React.addons.update(this.state.communities, { $push: [community] })
    
    communities.sort( function(a, b) {
      return a.normalized_name.localeCompare(b.normalized_name)
    });
    
    this.setState({ communities: communities });
  },
  
  
  removeCommunity: function(community) {
    var index = this.state.communities.indexOf(community);
    var communities = React.addons.update(this.state.communities, { $splice: [[index, 1]] });
    
    this.setState({ communities: communities });
  },
  
  renderLoading: function() {
    return (
      <div className='communities'>
        <h2 className='title'>
          LOADING
        </h2>
      </div>
    )
  },
  
  renderList: function() {
    return (
      <div className='communities'>
        <h2 className='title'>
          Communities
        </h2>
        <ul className="no-bullet">
          {this.state.communities.map(function(community) {
            return <Community key={community.normalized_name} 
                              community={community}
                              handleSelectCommunity={this.props.handleSelectCommunity}
                              handleAddCommunity={this.addCommunity}
                              handleRemoveCommunity={this.removeCommunity} />
                        
          }.bind(this))}
        </ul>
      </div>
    )
  },
  
  renderEmpty: function() {
    return (
      <div className='communities'>
        <h2 className='title'>
          Communities
        </h2>
        You haven not joined any communities
      </div>
    )
  },
  
  render: function() {
    if (this.state.loaded === false) {
      return this.renderLoading();
    } else if (this.state.error === true) {
      return this.renderEmpty();
    } else if (this.state.communities.length === 0) {
      return this.renderEmpty();
    } else {
      return this.renderList();
    }
  }
  
});