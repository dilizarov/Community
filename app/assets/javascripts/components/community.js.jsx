var Community = React.createClass({

  getInitialState: function() {
    return {
      settingsHighlighted: false,
      settingsCogShown: false,
      isMenuOpen: false
    }
  },

  bringUpSettings: function(e) {
    e.stopPropagation();
  },

  leaveCommunity: function(e) {
    e.stopPropagation();

    this.props.handleRemoveCommunity(this.props.community);

    var data = { community: this.props.community.normalized_name, auth_token: Session.authToken(), user_id: Session.userId() };

    $.ajax({
      method: 'DELETE',
      url: '/api/v1/communities/destroy.json',
      data: data,
      dataType: 'text json',
      error: function(err) {
        // Maybe I should have handleAddCommunity(this.props.community, errorMessage)
        // so that I can animate error.
        this.props.handleAddCommunity(this.props.community);

        try {
          var errorJson = $.parseJSON(err.responseText);
        } catch (e) {
          alert('damn');
        }
      }.bind(this)
    })
  },

  goToCommunity: function(e) {
    this.props.handleSelectCommunity(this.props.community.name)
  },

  showCommunitySettings: function(e) {
    this.setState({
      settingsCogShown: true
    })
  },

  hideCommunitySettings: function(e) {
    this.setState({
      settingsCogShown: false
    })
  },

  highlightSettings: function(e) {
    this.setState({
      settingsHighlighted: true
    })
  },

  unHighlightSettings: function(e) {
    this.setState({
      settingsHighlighted: false
    })
  },

  toggleMenu: function() {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen
    })
  },

  closeMenu: function() {
    this.setState({
      isMenuOpen: false
    })
  },

  settingsClicked: function() {
    console.log("settings")
  },

  leaveClicked: function() {
    console.log("leave")
  },

  render: function() {

    var cogClass = classNames(
      "fa",
      "fa-cog",
      { solid: this.state.settingsHighlighted },
      { opaque: this.state.settingsCogShown }
    )

    var menuOptions = {
      isOpen: this.state.isMenuOpen,
      close: this.closeMenu,
      toggle: <i className={cogClass} onClick={this.toggleMenu} onMouseOver={this.highlightSettings} onMouseLeave={this.unHighlightSettings}></i>,
      align: 'left',
      size: 'sm',
      inverse: false
    }

    return(
      <li>
        <div className="community-line" onMouseOver={this.showCommunitySettings} onMouseLeave={this.hideCommunitySettings}>
          <DropdownMenu {...menuOptions}>
            <li><a onClick={this.settingsClicked}>Settings</a></li>
            <li><a onClick={this.leaveClicked}>Leave</a></li>
          </DropdownMenu>
          <span className='community-name' onClick={this.goToCommunity}>{this.props.community.name}</span>
        </div>
        <a className='button tiny radius' onClick={this.bringUpSettings}>
          Settings
        </a>
        <a className='button tiny radius' onClick={this.leaveCommunity}>
          Leave
        </a>
      </li>
    );
  }

});
