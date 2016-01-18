var SettingsModalHandler = React.createClass({

  getInitialState: function() {
    return {
      revealContent: ''
    }
  },

  openWithCommunityRelationship: function(relationship) {

    // var revealContent = (<div>
    //   <h2 style={{wordWrap: 'break-word'}}>&{relationship.normalized_name} settings</h2><br/>
    //   <b>The username: {relationship.user.username === null ? Session.userInfo().username : relationship.user.username}</b><br/>
    //   <Avatar source={relationship.user.avatar_url === null ? Session.userInfo().avatar_url : relationship.user.avatar_url} className="avatar" />
    // </div>)
    //
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

  render: function() {
    return (
      <div>
        <DropModal ref="modal">

          <a className="button" onClick={this.closeModal}>Hide</a>
          <a className="button" onClick={this.openNext}>Open</a>
        </DropModal>
        <DropModal ref="modalll">
          <a className="button" onClick={this.closeOtherModal}>Hide</a>
        </DropModal>
      </div>
    )
  }

})
