var Community = React.createClass({

  getInitialState: function() {
    return {
      settingsHighlighted: false,
      settingsCogShown: false,
      isMenuOpen: false
    }
  },

  leaveCommunity: function() {
    this.refs.modal.hide();
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

  settingsClicked: function(e) {
    e.stopPropagation();

    this.setState({
      settingsCogShown: false,
      settingsHighlighted: false
    })

    this.props.handleOpenSettings(this.props.community)
  },

  leaveClicked: function(e) {
    e.stopPropagation();

    this.setState({
      settingsCogShown: false,
      settingsHighlighted: false
    })

    this.refs.modal.show();
  },

  hideModal: function() {
    this.refs.modal.hide();
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
      <li className="community-item">
        <div className="community-line" onMouseOver={this.showCommunitySettings} onMouseLeave={this.hideCommunitySettings}>
          <DropdownMenu {...menuOptions}>
            <li><a onClick={this.settingsClicked}>Settings</a></li>
            <li><a onClick={this.leaveClicked}>Leave</a></li>
          </DropdownMenu>
          <span className='community-name' onClick={this.goToCommunity} title={this.props.community.name}>{this.props.community.name}</span>
        </div>

        <DropModal ref="modal" modalStyle={{borderRadius: '3'}} contentStyle={{textAlign: 'center', padding: '30'}}>
          <h3 style={{wordWrap: 'break-word'}}>Leave &{this.props.community.normalized_name}?</h3><br/>
          <a className="secondary small button radius" onClick={this.hideModal} style={{marginRight: '20'}}>Cancel</a>
          <a className="alert small button radius" onClick={this.leaveCommunity}>Confirm</a>
        </DropModal>
      </li>
    );
  }

});
