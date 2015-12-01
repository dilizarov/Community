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

    if (this.props.size === "sm") {
      avatarClass += "-sm"
      loaderClass += "-sm"
    }

    if (this.props.source === null || this.state.loadFailed === true) {
      avatar = <img src="/assets/avatar_placeholder.png" className={avatarClass} />
    } else {
      if (this.state.loadSucceeded === true) {
        avatar = <img src={this.props.source} className={avatarClass} />
      } else {
        avatar = <img src={this.props.source} style={{display: 'none'}} onLoad={this.makeVisible} onError={this.usePlaceholder} />
        loader = (<span className={loaderClass}>
                    <span className="avatar-loading-rays"></span>
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
