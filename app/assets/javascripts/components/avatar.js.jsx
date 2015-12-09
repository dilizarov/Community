var Avatar = React.createClass({

getInitialState: function() {
  return {
    loadSucceeded: null,
    loadFailed: null
  }
},

  makeVisible: function() {
    this.setState({
      loadSucceeded: true
    })
  },

  usePlaceholder: function() {
    this.setState({
      loadFailed: true
    })
  },

  render: function() {

    var avatar;
    var loader;

    var avatarClass = "avatar";
    var loaderClass = "avatar-loading";
    var raysClass   = "avatar-loading-rays";

    var { source, size, whiteRays, ...other } = this.props

    if (size === "sm") {
      avatarClass += "-sm"
      loaderClass += "-sm"
    } else if (size === "lg") {
      avatarClass += "-lg"
      loaderClass += "-lg"
    }

    if (whiteRays === true) {
      raysClass += "-white"
    }

    if (source === null || this.state.loadFailed === true) {
      avatar = <img src="/assets/avatar_placeholder.png"
                    className={avatarClass}
                    { ...other } />
    } else {
      if (this.state.loadSucceeded === true) {
        avatar = <img src={this.props.source}
                      className={avatarClass}
                      { ...other } />
      } else {

        avatar = <img src={this.props.source} className={avatarClass} style={{display: 'none'}} onLoad={this.makeVisible} onError={this.usePlaceholder} />
        loader = (<span className={loaderClass} style={this.props.style}>
                    <span className={raysClass} style={this.props.style}></span>
                  </span>)
      }
    }

    return (
      <span className="avatar-wrapper">
        {avatar}
        {loader}
      </span>
    )

  }

})
