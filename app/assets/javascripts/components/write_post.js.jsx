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
      submitting: true,
      postButtonWidth: ReactDOM.findDOMNode(this.refs.post_button).getBoundingClientRect().width
    })

    var body = $.trim(this.refs.bodyInput.value);

    var data = {
      auth_token: Session.authToken(),
      user_id: Session.userId(),
      post: {
        body: body,
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
          submitting: false,
          error: false
        })

        this.props.handleAddPostToFeed(res.post)
      }.bind(this),
      error: function(err) {
        if (this.isMounted()) {
          this.refs.titleInput.value = title;
          this.refs.bodyInput.value = body;

          this.setState({
            buttonDisabled: false,
            submitting: false,
            error: true
          })
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
      {disabled: this.state.buttonDisabled,
       alert: this.state.error }
    )

    var button;

    if (this.state.submitting === true) {

      var otherProps = {}

      if (this.state.postButtonWidth) {
        otherProps.style = { width: this.state.postButtonWidth }
      }

      button = (<a className={btnClass} onClick={this.submitPost} {...otherProps} >
        <Spinner type="inverted" />
      </a>)
    } else {
      button = <a ref="post_button" className={btnClass} onClick={this.submitPost}>Post</a>
    }

    var rel = this.props.relationship;
    var avatar_url;

    var sessData = Session.userInfo();

    if (rel && rel.user) {
      avatar_url = rel.user.avatar_url ? rel.user.avatar_url : sessData.avatar_url;
    } else {
      avatar_url = sessData.avatar_url;
    }

    var compositeButton;

    if (this.state.error) {
      //@TODO error text
      compositeButton = (
        <Tooltip title="Something went wrong while submitting this post" position='left'>
          {button}
        </Tooltip>
      )
    } else {
      compositeButton = button;
    }

    return (
      <div className="post-to-community clearfix">
        <Avatar source={avatar_url} className="avatar" style={{float: 'left'}} />
        <input type="text" disabled={this.state.submitting} id="write-post-title" ref="titleInput" placeholder="Title (optional)" />
        <TextareaAutosize id="write-post-body"
                          disabled={this.state.submitting}
                          placeholder="Write post here..."
                          minRows={4}
                          ref="bodyInput"
                          onChange={this.toggleButtonEnabled} />
        {compositeButton}
      </div>
    )
  }

})
