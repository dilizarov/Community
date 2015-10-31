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
        
        console.log(err)
        
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
  
  render: function() {
    return(
      <li onClick={this.goToCommunity}>
      {this.props.community.name}
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