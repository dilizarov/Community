var Community = React.createClass({

  getInitialState: function() {
    return {
      settingsHighlighted: false,
      settingsCogShown: false
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

  render: function() {

    var cogClass = classNames(
      "fa",
      "fa-cog",
      { solid: this.state.settingsHighlighted },
      { opaque: this.state.settingsCogShown }
    )

    return(
      <li onClick={this.goToCommunity}>
        <div className="community-line" onMouseOver={this.showCommunitySettings} onMouseLeave={this.hideCommunitySettings}>
          <i className={cogClass} onMouseOver={this.highlightSettings} onMouseLeave={this.unHighlightSettings}></i>
          <span className='community-name'>{this.props.community.name}</span>
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
