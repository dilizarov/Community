var SettingsModalHandler = React.createClass({

  // This is to get thru an error that occurs on initial page-loads.
  // This is rendered, but never used, so, this works as a placeholder.
  getInitialState: function() {
    return {
      relationship: {
        name: '',
        normalized_name: '',
        user: {
          avatar_url: '',
          username: ''
        }
      },
      currentUsername: '',
      currentAvatarUrl: ''
    }
  },

  openWithCommunityRelationship: function(relationship) {

    var communityUsername = relationship.user.username;
    var communityAvatarUrl = relationship.user.avatar_url;

    var sessionData = Session.userInfo();

    this.setState({
      relationship: relationship,
      currentUsername: communityUsername === null ? sessionData.username : communityUsername,
      currentAvatarUrl: communityAvatarUrl === null ? sessionData.avatar_url : communityAvatarUrl
    }, function () {
      this.refs.modal.show();
    })
  },

  closeModal: function() {
    this.refs.modal.hide();
  },

  save: function() {
  },

  changeAvatar: function(source) {
    this.setState({
      currentAvatarUrl: source
    })
  },

  updateUsername: function(e) {
    var latestUsername = e.target.value;

    this.setState({
      currentUsername: $.trim(latestUsername)
    })
  },

  revertToDefault: function() {
    var sessionData = Session.userInfo();

    this.setState({
      currentUsername: sessionData.username,
      currentAvatarUrl: sessionData.avatar_url
    })
  },

  resetState: function() {
    this.replaceState({
      relationship: {
        name: '',
        normalized_name: '',
        user: {
          avatar_url: '',
          username: ''
        }
      }
    })
  },

  render: function() {

    return (
      <div>
        <DropModal className='greetingsearthling' onHide={this.resetState} ref="modal" modalStyle={{borderRadius: '3'}} contentStyle={{textAlign: 'center', padding: '30'}}>
          <h3 style={{wordWrap: 'break-word'}}>&{this.state.relationship.normalized_name} settings</h3>

            <Avatar source={this.state.currentAvatarUrl}
              size="lg" changeable handleChange={this.changeAvatar} /><br/>
            <input type="text" placeholder="Username" value={this.state.currentUsername} onChange={this.updateUsername} /><br/>

          <a className="alert small button radius" onClick={this.revertToDefault} style={{marginRight: '20', float: 'left'}}>Revert To Default</a>
          <span style={{float: 'right'}}>
            <a className="secondary small button radius" onClick={this.closeModal} style={{marginRight: '20'}}>Hide</a>
            <a className="small button radius" onClick={this.save}>Save</a>
          </span>
        </DropModal>
      </div>
    )
  }

})
