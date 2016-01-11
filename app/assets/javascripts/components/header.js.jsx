var Header = React.createClass({

  //@TODO: reloadWindow in SessionBox
  reloadWindow: function() {
    window.location.reload()
  },

  render: function() {
    return (
      <div className='header-wrapper'>
        <span className='community-logo'>&{this.props.communityNameNormalized}</span>
        <Search handleSelectCommunity={this.props.handleSelectCommunity} />
        <span className="top-notifications-wrapper">
          <Notifications currentCommunity={this.props.currentCommunity}
                         handleNotificationPressed={this.props.handleNotificationPressed}/>
          <SessionBox handleSessionChange={this.reloadWindow} />
        </span>
          {/* <a className="button tiny radius" href="#" onClick={this.changeProfilePic} >Browse</a>
          <input type="file" id="profile-pic-picker" accept="image/jpeg, image/png, image/jpg" onChange={this.cropImageUI} style={{visibility: 'hidden'}} />
          <img id="profile-pic" /> */}
      </div>
    )
  }

})
