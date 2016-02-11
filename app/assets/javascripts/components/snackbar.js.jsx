var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

var objectAssign = Object.assign || function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var Snackbar = React.createClass({

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.onDismiss && nextProps.isActive && !this.props.isActive) {
      this.dismissTimeout = setTimeout(nextProps.onDismiss, nextProps.dismissAfter);
    }
  },

  componentWillUnmount: function() {
    clearTimeout(this.dismissTimeout);
  },

  /*
   * @description Dynamically get the styles for the bar.
   * @returns {object} result The style.
   */
  getBarStyle: function() {
    const { isActive } = this.props;

    let activeStateStyle;
    let defaultStateStyle;

    const baseStyle = {
      defaultState: {
        position: 'fixed',
        bottom: '2rem',
        left: '-100%',
        width: 'auto',
        padding: '1rem',
        margin: 0,
        color: '#fafafa',
        font: '1rem normal Roboto, sans-serif',
        borderRadius: '5px',
        background: '#212121',
        borderSizing: 'border-box',
        boxShadow: '0 0 1px 1px rgba(10, 10, 11, .125)',
        cursor: 'default',
        WebKittransition: '.5s cubic-bezier(0.89, 0.01, 0.5, 1.1)',
        MozTransition: '.5s cubic-bezier(0.89, 0.01, 0.5, 1.1)',
        msTransition: '.5s cubic-bezier(0.89, 0.01, 0.5, 1.1)',
        OTransition: '.5s cubic-bezier(0.89, 0.01, 0.5, 1.1)',
        transition: '.5s cubic-bezier(0.89, 0.01, 0.5, 1.1)',

        // Trigger GPU acceleration
        WebkitTransform: 'translatez(0)',
        MozTransform: 'translatez(0)',
        msTransform: 'translatez(0)',
        OTransform: 'translatez(0)',
        transform: 'translatez(0)'
      },
      activeState: {
        left: '1rem'
      }
    };

    /**
     * If styles is set to false, then return nothing.
     */
    if (this.props.style === false) {
      return {};
    }

    /**
     * If `this.props.styles.active` exists (which means
     * custom active styles should be used, override the
     * default active styles with those from the prop.
     */
    if (this.props.style && this.props.style.active) {
      activeStateStyle = objectAssign(baseStyle.activeState, this.props.style.active);
    } else {
      activeStateStyle = baseStyle.activeState;
    }

    /**
     * If `this.props.styles.bar` exists (which means custom
     * styles should be applied to the bar) combine those
     * styles with the existing base style.
     */
    if (this.props.style && this.props.style.bar) {
      defaultStateStyle = objectAssign(baseStyle.defaultState, this.props.style.bar);
    } else {
      defaultStateStyle = baseStyle.defaultState;
    }

    return isActive ? objectAssign(defaultStateStyle, activeStateStyle) : defaultStateStyle;
  },

  /*
   * @function getActionStyle
   * @description Dynamically get the styles for the action text.
   * @returns {object} result The style.
   */
  getActionStyle: function() {
    const baseStyle = {
      padding: '0.125rem',
      marginLeft: '1rem',
      color: '#f44336',
      font: '.75rem normal Roboto, sans-serif',
      lineHeight: '1rem',
      letterSpacing: '.125ex',
      textTransform: 'uppercase',
      borderRadius: '5px',
      cursor: 'pointer'
    };

    if (this.props.style === false) {
      return {};
    }

    if (this.props.style && this.props.style.action) {
      return objectAssign(baseStyle, this.props.style.action);
    }

    return baseStyle;
  },

  /*
   * @function handleClick
   * @description Handle click events on the action button.
   */
  handleClick: function(event) {
    event.preventDefault();

    if (this.props.onClick && typeof this.props.onClick === 'function') {
      return this.props.onClick(event);
    }

    return event;
  },

  render: function() {
    let className = 'notification-bar';

    if (this.props.isActive) className += ' ' + this.props.activeClassName;
    if (this.props.className) className += ' ' + this.props.className;

    return (
      <div className={className} style={this.getBarStyle()}>
        <div className="notification-bar-wrapper">
          <span
            ref="message"
            className="notification-bar-message"
          >
            {this.props.message}
          </span>
          {this.props.action ? (
            <span
              ref="action"
              className="notification-bar-action"
              onClick={this.handleClick}
              style={this.getActionStyle()}
            >
              {this.props.action}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
})
