// Props expected:
// name
// normalizedName
// username
// avatar_url

var Community = React.createClass({
  
  bringUpSettings: function(e) {
    e.stopPropagation();
  },
  
  leaveCommunity: function(e) {
    e.stopPropagation();

    this.props.handleRemoveCommunity(this.props.community);
    
    var auth_token = "s2erStcfxkL-mifC2jsc";
    var user_id = "6c08a62f-7971-4928-8d7d-cef07e2a675d";
    
    var data = { community: this.props.community.normalized_name, auth_token: auth_token, user_id: user_id };
    
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
    alert(this.props.community.name)
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