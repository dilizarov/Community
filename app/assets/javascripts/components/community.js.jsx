var Community = React.createClass({

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
    $(e.target).find('.fa-cog').addClass('opaque');
  },

  hideCommunitySettings: function(e) {
    $(e.target).find('.fa-cog').removeClass('opaque');
  },

  highlightSettings: function(e) {
    $(e.target).addClass('solid');
  },

  unHighlightSettings: function(e) {
    $(e.target).removeClass('solid');
  },

  render: function() {
    return(
      <li onClick={this.goToCommunity}>
        <div className="community-line" onMouseOver={this.showCommunitySettings} onMouseLeave={this.hideCommunitySettings}>
          <i className="fa fa-cog" onMouseOver={this.highlightSettings} onMouseLeave={this.unHighlightSettings}></i>
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
