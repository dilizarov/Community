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

    if (this.props.source === null || this.state.loadFailed === true) {
      avatar = <img src="/assets/avatar_placeholder.png" className="avatar" />
    } else {
      if (this.state.loadSucceeded === true) {
        avatar = <img src={this.props.source} className="avatar" />
      } else {
        avatar = <img src={this.props.source} style={{display: 'none'}} onLoad={this.makeVisible} onError={this.usePlaceholder} />
        loader = (<span className="avatar-loading">
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
