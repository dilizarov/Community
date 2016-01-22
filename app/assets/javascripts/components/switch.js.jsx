var Switch = React.createClass({

  getDefaultProps: function () {
    return {
      checked: false
    };
  },

  handleClick: function () {
    if (this.props.onChange) {
      this.props.onChange(!this.props.checked);
    }
  },

  render: function () {

    var { className, checked, name, disabled, ...other } = this.props

    var switchClass = classNames('u-switch', {
      'is-checked': checked,
      'switch-disabled': disabled
    }, className);

    other.onClick = disabled === true ? function() {} : this.handleClick;

    return (
      <label className={switchClass} {...other}>
        <input type="hidden" name={name} value={checked ? 'yes' : 'no'} />
        <span className='track'></span>
        <span className='switch-button'></span>
      </label>
    )
  },

})
