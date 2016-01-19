var SettingsModalHandler = React.createClass({

  getInitialState: function() {
    return {
      relationship: {
        name: '',
        normalized_name: '',
        user: {
          avatar_url: '',
          username: ''
        }
      }
    }
  },

  openWithCommunityRelationship: function(relationship) {

    this.setState({
      relationship: relationship
    }, function () {
      this.refs.modal.show();
    })
  },

  closeModal: function() {
    this.refs.modal.hide();
  },

  openNext: function() {
    this.refs.modalll.show();
  },

  closeOtherModal: function() {
    this.refs.modalll.hide();
  },

  changeAvatar: function(source) {
    this.setState({
      changedAvatar: source
    })
  },

  render: function() {

    var relationship = this.state.relationship;
    var avatar_source;

    if (this.state.changedAvatar) {
      avatar_source = this.state.changedAvatar
    } else {
      avatar_source = relationship.user.avatar_url === null ? Session.userInfo().avatar_url : relationship.user.avatar_url
    }

    return (
      <div>
        <DropModal ref="modal" modalStyle={{borderRadius: '3'}} contentStyle={{textAlign: 'center', padding: '30'}}>
          <h3 style={{wordWrap: 'break-word'}}>&{relationship.normalized_name} settings</h3>
            <Avatar source={avatar_source}
              size="lg" changeable handleChange={this.changeAvatar} /><br/>
            <b>The username: {relationship.user.username === null ? Session.userInfo().username : relationship.user.username}</b><br/>

          <a className="secondary small button radius" onClick={this.closeModal} style={{marginRight: '20'}}>Hide</a>
          <a className="small button radius" onClick={this.openNext}>Save</a>
        </DropModal>
        <DropModal ref="modalll">
          <a className="button" onClick={this.closeOtherModal}>Hide</a>
        </DropModal>
      </div>
    )
  }

})
