var Avatar = React.createClass({

  getInitialState: function() {
    return {
      loadSucceeded: null,
      loadFailed: null,
      cropper_source: null,
      preview: null,
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

  openImageChooser: function() {
    this.refs.photopicker.click();
  },

  cropImageUI: function() {
    var input = this.refs.photopicker

    if (input.files && input.files[0]) {
      var reader = new FileReader();

      var that = this;

      reader.onload = function (e) {
        that.setState({
          cropper_source: reader.result
        }, function() {
          that.refs.modal.show();
        })
      }

      reader.readAsDataURL(input.files[0])
    }
  },

  confirmChange: function() {
    this.props.handleChange(this.refs.cropper.getCroppedCanvas().toDataURL())
    this.refs.modal.hide();
  },

  render: function() {

    var avatar;
    var loader;
    var editor_if_changeable;
    var modal_if_changeable;

    var avatarClass = "avatar";
    var loaderClass = "avatar-loading";
    var raysClass   = "avatar-loading-rays";

    var { source, size, whiteRays, changeable, ...other } = this.props

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

    if (changeable === true) {
      avatarClass += " avatar-pointer"
      other.onClick = this.openImageChooser;
      editor_if_changeable = <input type="file" ref="photopicker" accept="image/jpeg, image/png, image/jpg" onChange={this.cropImageUI} style={{visibility: 'hidden'}} />
      modal_if_changeable = (<DropModal ref="modal" modalStyle={{borderRadius: '3'}} contentStyle={{padding: '30'}}>
        <div className="row">
          <div className="small-8 column">
            <Cropper
              aspectRatio={1 / 1}
              guides={false}
              circle
              preview='.img-preview'
              src={this.state.cropper_source}
              ref='cropper'
               />
          </div>
          <div className="small-4 column">
            <div className="img-preview" style={{width: 100, height: 100, borderRadius: '50%', overflow: 'hidden'}}/>
            <br/>
            <a className="secondary small button radius" onClick={this.confirmChange}>Confirm</a>
          </div>
        </div>
      </DropModal>)
    }

    if (source === null || this.state.loadFailed === true) {
      avatar = <img src="/assets/avatar_placeholder.png"
        ref="avatar_image"
        className={avatarClass}
        { ...other } />
    } else {
      if (this.state.loadSucceeded === true) {
        avatar = <img src={this.props.source}
          ref="avatar_image"
          className={avatarClass}
          { ...other } />
      } else {

        avatar = <img src={this.props.source} className={avatarClass} style={{display: 'none'}} onLoad={this.makeVisible} onError={this.usePlaceholder} />
        loader = (<span className={loaderClass} style={this.props.style}>
          <span className={raysClass}></span>
        </span>)
      }
    }

    return (
      <span className="avatar-wrapper">
        {avatar}
        {loader}
        {editor_if_changeable}
        {modal_if_changeable}
      </span>
    )

  }

})
