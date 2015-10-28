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
          <div className='small-8 column'>
            <Feed communityName={this.state.communitySelected ? this.state.communityName : 'No Community'}
                  communityNameNormalized={this.state.communitySelected ? this.state.communityNameNormalized : 'No Community'}/>
          </div>
        </div>
      </div>
    )
  }
  
})