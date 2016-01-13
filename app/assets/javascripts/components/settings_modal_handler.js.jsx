var SettingsModalHandler = React.createClass({

  getInitialState: function() {
    return {
      revealContent: ''
    }
  },

  openWithCommunityRelationship: function(relationship) {

    var revealContent = (<div>
      <h1>&{relationship.normalized_name} settings</h1><br/>
      <b>The username is {relationship.user.username}</b><br/>
      <b>The avatar url is {relationship.user.avatar_url}</b>
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
        <FoundationReveal ref="foundationReveal" revealContent={this.state.revealContent} />
      </div>
    )
  }

})
