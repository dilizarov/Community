var WritePost = React.createClass({

  getInitialState: function() {
    return {
        buttonDisabled: true,
        submitting: false
    }
  },

  toggleButtonEnabled: function(e) {
    this.setState({
      buttonDisabled: $.trim(e.target.value) === ''
    })
  },

  submitPost: function(e) {
    if ($(e.target).hasClass('disabled') || $.trim(this.refs.bodyInput.value) === '') { return }

    this.setState({
      buttonDisabled: true,
      submitting: true
    })

    var data = {
      auth_token: Session.authToken(),
      user_id: Session.userId(),
      post: {
        body: this.refs.bodyInput.value,
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
        this.setState({
          buttonDisabled: true,
          submitting: false
        })
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
    this.refs.bodyInput.value = ''
  },

  render: function() {

    var btnClass = classNames(
      'button',
      'tiny',
      'radius',
      'post-btn',
      {disabled: this.state.buttonDisabled}
    )

    var button;

    if (this.state.submitting === true) {
      button = (<a className={btnClass} onClick={this.submitPost}>
        <Spinner type="inverted" />
      </a>)
    } else {
      button = <a className={btnClass} onClick={this.submitPost}>Post</a>
    }

    return (
      <div className="post-to-community clearfix">
        <span className="dummy-avatar"></span>
        <input type="text" disabled={this.state.submitting} id="write-post-title" ref="titleInput" placeholder="Title (optional)" />
        <TextareaAutosize id="write-post-body"
                          disabled={this.state.submitting}
                          placeholder="Write post here..."
                          minRows={4}
                          ref="bodyInput"
                          onChange={this.toggleButtonEnabled} />
        {button}
      </div>
    )

  }

})
