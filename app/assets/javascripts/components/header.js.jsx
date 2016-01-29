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
        <span className='community-logo'><a onClick={this.reloadMainPage}>&</a>{this.props.communityNameNormalized}</span>
        <Search handleSelectCommunity={this.props.handleSelectCommunity} />
        <span className="top-notifications-wrapper">
          <Notifications currentCommunity={this.props.currentCommunity}
                         handleNotificationPressed={this.props.handleNotificationPressed}/>
          <SessionBox handleSessionChange={this.reloadWindow} />
        </span>
      </div>
    )
  }

})
