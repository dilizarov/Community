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

    var { source, size, ...other } = this.props

    if (size === "sm") {
      avatarClass += "-sm"
      loaderClass += "-sm"
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
                    <span className="avatar-loading-rays" style={this.props.style}></span>
                  </span>)
      }
    }

    return (
      <span>
        {avatar}
        {loader}
      </span>
    )

  }

})
