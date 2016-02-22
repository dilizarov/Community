var Header = React.createClass({

  reloadWindow: function() {
    window.location.reload()
  },

  reloadMainPage: function() {
    window.location.href = "/"
  },

  render: function() {
    return (
      <div className='header-wrapper'>
        <span className='community-logo'><a onClick={this.reloadMainPage} style={{cursor: 'pointer'}}>&</a>{this.props.communityNameNormalized}</span>
        <Search handleSelectCommunity={this.props.handleSelectCommunity} />
        <span className="header-right-side">
          <Notifications currentCommunity={this.props.currentCommunity}
                         handleNotificationPressed={this.props.handleNotificationPressed}/>
          <SessionBox handleSessionChange={this.reloadWindow} forceAppUpdate={this.props.forceAppUpdate} />
        </span>
      </div>
    )
  }

})
