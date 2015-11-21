var WritePost = React.createClass({

  getInitialState: function() {
    return {
        buttonDisabled: true
    }
  },

  toggleButtonEnabled: function(e) {

    var body = $.trim(e.target.value)

    this.setState({
      body: body,
      buttonDisabled: body === ''
    })
  },

  submitPost: function(e) {
    if ($(e.target).hasClass('disabled') || this.state.body === '') { return }

    var data = {
      auth_token: Session.authToken(),
      user_id: Session.userId(),
      post: {
        body: this.state.body,
        community: this.props.communityNameNormalized
      }
    }

    var title = $.trim(this.refs.titleInput.value)

    if (title !== '') {
      data.post.title = title
    }

    $.ajax({
      method: "POST",
      url: "/api/v1/posts.json",
      data: data,
      success: function(res) {
        this.clearFields()
        this.props.handleAddPostToFeed(res.post)
      }.bind(this),
      error: function(err) {
        if (this.isMounted()) {
          alert('blergh that failed.')
        }
      }.bind(this)
    })

  },

  clearFields: function() {
    this.refs.titleInput.value = ''
    this.refs.growingTextarea.clearTextarea()
  },

  render: function() {

    var btnClass = classNames(
      'button',
      'tiny',
      'radius',
      { disabled: this.state.buttonDisabled}
    )

    return (
      <div className="post-to-community">
        <input type="text" id="write-post" ref="titleInput" placeholder="Title - Optional" />
        <GrowingTextarea placeholder="Body"
                         minRows={1}
                         ref="growingTextarea"
                         handleKeyUp={this.toggleButtonEnabled} />
        <a className={btnClass} onClick={this.submitPost}>Post</a>
      </div>
    )

  }

})
