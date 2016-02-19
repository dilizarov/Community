var Spinner = React.createClass({
	displayName: 'Spinner',

	propTypes: {
		className: React.PropTypes.string,
		size: React.PropTypes.oneOf(['sm', 'md', 'lg']),
		type: React.PropTypes.oneOf(['default', 'primary', 'inverted'])
	},

	getDefaultProps: function() {
		return {
			type: 'default',
			size: 'sm'
		};
	},

	render: function() {
		var componentClass = classNames(
			'Spinner',
			'Spinner--' + this.props.type,
			'Spinner--' + this.props.size,
			this.props.className
		);

		var { className, ...other } = this.props

		return (
			<div className={componentClass} {...other} >
				<span className="Spinner_dot Spinner_dot--first" />
				<span className="Spinner_dot Spinner_dot--second" />
				<span className="Spinner_dot Spinner_dot--third" />
			</div>
		);
	}
});
