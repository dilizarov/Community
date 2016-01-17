var SettingsModalHandler = React.createClass({

  getInitialState: function() {
    return {
      revealContent: ''
    }
  },

  openWithCommunityRelationship: function(relationship) {

    var revealContent = (<div>
      <h2 style={{wordWrap: 'break-word'}}>&{relationship.normalized_name} settings</h2><br/>
      <b>The username: {relationship.user.username === null ? Session.userInfo().username : relationship.user.username}</b><br/>
      <Avatar source={relationship.user.avatar_url === null ? Session.userInfo().avatar_url : relationship.user.avatar_url} className="avatar" />
    </div>)

    this.setState({
      revealContent: revealContent
    }, function () {
      this.refs.foundationReveal.handleClick();
    })
  },

  render: function() {
    return (
      <div>
        <FoundationReveal ref="foundationReveal" revealContent={this.state.revealContent} stack />
      </div>
    )
  }

})
