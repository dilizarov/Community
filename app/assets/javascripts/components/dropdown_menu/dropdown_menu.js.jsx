var DropdownMenu = React.createClass({

  componentDidUpdate: function(prevProps) {

    if (this.props.isOpen === prevProps.isOpen) {
      return;
    }

    if (this.props.isOpen && !prevProps.isOpen) {
      this.lastWindowClickEvent = this.handleClickOutside;
      document.addEventListener('click', this.lastWindowClickEvent);
    } else if (!this.props.isOpen && prevProps.isOpen) {
      document.removeEventListener('click', this.lastWindowClickEvent);
      this.lastWindowClickEvent = null;
    }

  },

  handleClickOutside: function(e) {

    var target = e.target;

    while (target.parentNode) {
      if (target === this.refs.menu) {
        return;
      }

      target = target.parentNode;
    }

    this.props.close(e)
  },

  componentWillUnmount: function() {
    if (this.lastWindowClickEvent) {
      document.removeEventListener('click', this.lastWindowClickEvent);
      this.lastWindowClickEvent = null;
    }
  },

  render: function() {

    return (
      <div className="dropdown-menu" ref="menu">
        {this.props.toggle}
        <div className="dropdown-menu-items">
          {this.props.isOpen &&
            <ul key="items" className="dropdown-items">
              {this.props.children}
            </ul>
          }
        </div>
      </div>
    )

  }

})
