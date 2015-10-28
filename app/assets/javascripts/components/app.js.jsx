var App = React.createClass({
  
  getInitialState: function() {
    return {
      communitySelected: false
    };
  },
  
  selectCommunity: function(community) {
    var normalizedCommunity = $.trim(community.toLowerCase()).split(' ').join('_')
    
    this.setState({
      communitySelected: true,
      communityName: community,
      communityNameNormalized: normalizedCommunity
    })
  },
  
  notificationPressed: function() {
    alert('well, damn')
  },
  
  render: function() {
    return (
      <div className='app'>
        <div className='row'>
          <Search handleSelectCommunity={this.selectCommunity} />
        </div>
        <div className='row'>
          <div className='small-4 column'>
            <Communities handleSelectCommunity={this.selectCommunity} />
          </div>
          <div className='small-7 column'>
            <Feed communityName={this.state.communitySelected ? this.state.communityName : 'No Community'}
                  communityNameNormalized={this.state.communitySelected ? this.state.communityNameNormalized : 'No Community'}/>
          </div>
          <div className='small-1 column'>
            <Notifications handleNotificationPressed={this.notificationPressed} />
          </div>
        </div>
      </div>
    )
  }
  
})