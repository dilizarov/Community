var SettingsModalHandler = React.createClass({

  // This is to get thru an error that occurs on initial page-loads.
  // This is rendered, but never used, so, this works as a placeholder.
  getInitialState: function() {
    return {
      relationship: {
        name: '',
        normalized_name: '',
        user: {
          avatar_url: '',
          username: ''
        }
      },
      currentUsername: '',
      currentAvatarUrl: ''
    }
  },

  openWithCommunityRelationship: function(relationship) {

    var communityUsername = relationship.user.username;
    var communityAvatarUrl = relationship.user.avatar_url;

    var sessionData = Session.userInfo();

    this.setState({
      relationship: relationship,
      currentUsername: communityUsername === null ? sessionData.username : communityUsername,
      currentAvatarUrl: communityAvatarUrl === null ? sessionData.avatar_url : communityAvatarUrl
    }, function () {
      this.refs.modal.show();
    })
  },

  closeModal: function() {
    this.refs.modal.hide();
  },

  save: function() {
    if ($.trim(this.state.currentUsername) === '' || this.state.currentAvatarUrl === null) { return }

    this.setState({
      processing: true
    })

    var sessionData = Session.userInfo();
    var communityInfo = this.state.relationship.user;
    var currentUsername = this.state.currentUsername;
    var currentAvatarUrl = this.state.currentAvatarUrl;

    var that = this;

    var uploadBlob = function (blob) {
      var formData = new FormData();

      // Due to using canvas.toDataURL(), everything comes out a png, so
      // doesn't matter if user selects a jpg.
      formData.append("community_avatar", blob, "avatar.png");

      $.ajax({
        url: "/api/v1/communities/update.json?user_id=" + Session.userId() + "&auth_token=" + Session.authToken() + "&community=" + that.state.relationship.normalized_name + "&username=" + that.state.currentUsername,
        data: formData,
        processData: false,
        contentType: false,
        type: "PUT",
        success: function(data) {
          that.props.updateCommunitySettings(data.community);
          that.setState({
            processing: false
          })

          that.closeModal();
        },
        error: function(e) {
          console.log(e)
        }
      })
    }

    if (this.state.defaultPressed === true) {

      var data = {
        auth_token: Session.authToken(),
        user_id: Session.userId(),
        default: true
      }

      $.ajax({
        url: "/api/v1/communities/update.json",
        type: "PUT",
        data: data,
        success: function(data) {
          this.props.updateCommunitySettings(data.community);
          this.setState({
            processing: false
          })

          this.closeModal();
        },
        error: function (e) {
          console.log(e)
        }
      })
    } else {
      if (currentAvatarUrl.substring(0, 4) === "http") {
        this.refs.avatar.getImageDataURI(function (uri) {
          var blob = that.dataURItoBlob(uri);

          uploadBlob(blob);
        })
      } else {
        var blob = this.dataURItoBlob(currentAvatarUrl);

        uploadBlob(blob);
      }
    }
  },

  //http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
  dataURItoBlob: function(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  },

  changeAvatar: function(source) {
    this.setState({
      currentAvatarUrl: source,
      defaultPressed: false
    })
  },

  updateUsername: function(e) {
    var latestUsername = e.target.value;

    this.setState({
      currentUsername: latestUsername,
      defaultPressed: false
    })
  },

  revertToDefault: function() {
    var sessionData = Session.userInfo();

    this.setState({
      currentUsername: sessionData.username,
      currentAvatarUrl: sessionData.avatar_url,
      defaultPressed: true
    })
  },

  resetState: function() {
    this.replaceState({
      relationship: {
        name: '',
        normalized_name: '',
        user: {
          avatar_url: '',
          username: ''
        }
      },
      currentUsername: '',
      currentAvatarUrl: ''
    })
  },

  render: function() {

    var saveBtnClasses = classNames('small', 'button', 'radius', {
      'disabled' : ($.trim(this.state.currentUsername) === '' || this.state.currentAvatarUrl === null || this.state.processing === true)
    })

    var saveButton;

    if (this.state.processing === true) {
      saveButton = (<a className={saveBtnClasses}>
        <Spinner type="inverted" />
      </a>)
    } else {
      saveButton = <a className={saveBtnClasses} onClick={this.save}>Save</a>
    }

    return (
      <div>
        <DropModal onHide={this.resetState} closeOnClick={false} ref="modal" modalStyle={{borderRadius: '3'}} contentStyle={{textAlign: 'center', padding: '30'}}>
          <h3 style={{wordWrap: 'break-word'}}>&{this.state.relationship.normalized_name} settings</h3>

            <Avatar source={this.state.currentAvatarUrl}
              size="lg" ref="avatar" changeable handleChange={this.changeAvatar} /><br/>
            <input type="text" placeholder="Username" value={this.state.currentUsername} onChange={this.updateUsername} /><br/>

          <a className="alert small button radius" onClick={this.revertToDefault} style={{marginRight: '20', float: 'left'}}>Revert To Default</a>
          <span style={{float: 'right'}}>
            <a className="secondary small button radius" onClick={this.closeModal} style={{marginRight: '20'}}>Hide</a>
            {saveButton}
          </span>
        </DropModal>
      </div>
    )
  }

})
