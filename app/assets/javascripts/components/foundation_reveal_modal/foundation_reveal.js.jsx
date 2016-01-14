var FoundationReveal = React.createClass({

  handleClick: function(e) {
    if (e && typeof e.preventDefault == 'function' ) {
      e.preventDefault();
    }

    var contentDiv = $('<div>');
    var anchor = $('<a class="close-reveal-modal">&times;</a>');
    var reveal = $('<div class="reveal-modal medium" data-reveal>').append($(contentDiv)).append($(anchor));
    $(reveal).foundation().foundation('reveal', 'open');
    $(reveal).bind('closed.fndtn.reveal', function (e) { ReactDOM.unmountComponentAtNode(this); });

    if (React.isValidElement(this.props.revealContent)) {
      ReactDOM.render(this.props.revealContent, $(contentDiv)[0]);
    } else {
      $(contentDiv).append(this.props.revealContent);
    }

  },

  closeModal: function() {
    $(".reveal-modal").foundation().foundation('reveal', 'close');
  },

  render: function() {
    return (
      <div>
      </div>
    )
  }

})
