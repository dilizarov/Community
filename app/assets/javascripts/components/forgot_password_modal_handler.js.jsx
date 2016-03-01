var ForgotPasswordModalHandler = React.createClass({

  getInitialState: function() {
    return {
      sendEmailButtonEnabled: false
    }
  },

  open: function() {
    this.setState({
      sendEmailButtonEnabled: /.+@.+/.test($.trim(this.props.email)),
      sendEmailLoading: false,
      sendEmailButtonWidth: null,
      sendEmailError: false,
      emailSent: false
    }, function() {
      this.refs.modal.show();
    })
  },

  toggleSendEmailButton: function() {

    var emailVal = $.trim(this.refs.email_field.value);

    this.setState({
      sendEmailButtonEnabled: /.+@.+/.test(emailVal)
    })

  },

  processSendEmail: function() {

    var emailVal = $.trim(this.refs.email_field.value);

    if (this.state.sendEmailButtonEnabled !== true || this.state.sendEmailLoading === true) { return }

    if (/.+@.+/.test(emailVal)) {

      this.setState({
        sendEmailLoading: true,
        sendEmailButtonWidth: ReactDOM.findDOMNode(this.refs.send_email_button).getBoundingClientRect().width
      })

      $.ajax({
          method: "POST",
          url: "api/v1/users/forgot_password.json",
          data: { email: emailVal },
          success: function() {
            if (this.isMounted()) {
              this.setState({
                emailSent: emailVal,
                sendEmailLoading: false
              })
            }
          }.bind(this),
          error: function(err) {

            var errorMsg = false;

            if (err.status === 404 && err.responseJSON) {
              errorMsg = err.responseJSON.error;
            }

            this.setState({
              sendEmailError: true,
              sendEmailErrorMsg: errorMsg,
              sendEmailLoading: false
            }, function() {
              this.refs.send_email_tooltip.show();
            })
          }.bind(this)
      })
    }
    },

    hideModal: function() {
      this.refs.modal.hide();
    },

    render: function() {
      var sendEmailBtnClass = classNames(
        'small',
        'button',
        'radius',
        {
          disabled: !this.state.sendEmailButtonEnabled || this.state.sendEmailLoading === true,
          alert: this.state.sendEmailError
        }
      )

      var otherProps = {};
      otherProps.style = { marginBottom: '0' }

      if (this.state.sendEmailLoading === true) {
        if (this.state.sendEmailButtonWidth) {
          otherProps.style.width = this.state.sendEmailButtonWidth
        }
      }

      var compositeButton = <a className={sendEmailBtnClass} onClick={this.processSendEmail} ref="send_email_button" { ...otherProps }>{this.state.sendEmailLoading === true ? <Spinner type="inverted" /> : 'Send email'}</a>

      if (this.state.sendEmailError) {
        compositeButton = (
          <Tooltip ref="send_email_tooltip" title={this.state.sendEmailErrorMsg ? this.state.sendEmailErrorMsg : "Something went wrong trying to send an email"} position='right'>
            {compositeButton}
          </Tooltip>
        )
      }

      var initialVal = $.trim(this.props.email)

      var contents;

      if (this.state.emailSent) {
        contents = (
          <div>
            <div style={{color: "#666", marginBottom: '16'}}>
              An email has been sent to <b>{this.state.emailSent}</b>
            </div>

            <div style={{textAlign: 'right'}}>
              <a className="secondary small button radius" onClick={this.hideModal} style={{marginRight: '20', marginBottom: '0'}}>Hide</a>
            </div>
          </div>
        )
      } else {
        contents = (
          <div>
            <form>
              <input defaultValue={initialVal} type="text" name="email" disabled={this.state.sendEmailLoading} placeholder="email"
                ref="email_field" onChange={this.toggleSendEmailButton} />
            </form>

            <div style={{textAlign: 'right'}}>
              <a className="secondary small button radius" onClick={this.hideModal} style={{marginRight: '20', marginBottom: '0'}}>Cancel</a>
              {compositeButton}
            </div>
          </div>
        )

      }

      return (
        <DropModal className="send-email-modal" ref="modal" modalStyle={{borderRadius: '3'}} contentStyle={{padding: '30'}}>
          {contents}
        </DropModal>
      )
    }


})
