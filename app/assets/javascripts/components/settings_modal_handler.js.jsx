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
      },
      checked: true
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

  updateInput: function(e) {
    this.setState({
      changedUsername: e.target.value
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

  changeState: function() {
    this.setState({
      checked: !this.state.checked
    })
  },

  render: function() {

    var relationship = this.state.relationship;
    var avatar_source;
    var username;

    if (this.state.changedAvatar) {
      avatar_source = this.state.changedAvatar
    } else {
      avatar_source = relationship.user.avatar_url === null ? Session.userInfo().avatar_url : relationship.user.avatar_url
    }

    if (this.state.changedUsername) {
      username = this.state.changedUsername;
    } else {
      username = relationship.user.username === null ? Session.userInfo().username : relationship.user.username
    }



    return (
      <div>
        <DropModal onHide={this.resetState} ref="modal" modalStyle={{borderRadius: '3'}} contentStyle={{textAlign: 'center', padding: '30'}}>
          <h3 style={{wordWrap: 'break-word'}}>&{relationship.normalized_name} settings</h3>

            <div className="switch">
              <input onChange={this.changeState} className="switch-input" checked={this.state.checked} id="default" type="checkbox" name="default" />
              <label className="switch-paddle" htmlFor="default">
                <span className="show-for-sr">Default</span>
              </label>
            </div>

            <Avatar source={avatar_source}
              size="lg" changeable handleChange={this.changeAvatar} /><br/>
            <input type="text" placeholder="Username" value={username} onChange={this.updateInput} /><br/>

          <a className="secondary small button radius" onClick={this.closeModal} style={{marginRight: '20'}}>Hide</a>
          <a className="small button radius" onClick={this.openNext}>Save</a>
        </DropModal>
      </div>
    )
  }

})
