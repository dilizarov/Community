'use strict';

const styles = {
  container: {
    position: 'relative',
    width:'100%',
    height:'100%'
  },
  badge: {
    WebkitTransition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    MozTransition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    msTransition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    display: 'inline-block',
    position: 'absolute',
    minWidth: '10px',
    padding: '3px 7px',
    fontSize: '12px',
    fontWeight: '700',
    lineHeight: '1',
    color: '#fff',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    verticalAlign: 'baseline',
    backgroundColor: 'rgba(212, 19, 13, 1)',
    borderRadius: '10px',
    top : '-40px',
    right: '-12px'
  }
};

class NotificationBadge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    let badgeStyle = this.merge(styles.badge, this.props.style);
    let value = this.props.count > 0 ? <AnimationCounter key={'badgekey'} style={badgeStyle} className={this.props.className} count={this.props.count} label={this.props.label} effect={this.props.effect} duration={this.props.duration}/> : undefined;

    return (
      <React.addons.CSSTransitionGroup style={styles.container} transitionAppear={true} component='div' transitionName='react-notification-badge' transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={300}>
        {value}
      </React.addons.CSSTransitionGroup>
    );
  }

  merge(obj1, obj2) {
    let obj = {};
    for (let attrname1 in obj1) {
      if (obj1.hasOwnProperty(attrname1)) {
        obj[attrname1] = obj1[attrname1];
      }
    }
    for (let attrname2 in obj2) {
      if (obj2.hasOwnProperty(attrname2)) {
        obj[attrname2] = obj2[attrname2];
      }
    }
    return obj;
  }
}

NotificationBadge.propTypes = {
  count: React.PropTypes.number,
  label: React.PropTypes.string,
  containerStyle: React.PropTypes.object,
  style: React.PropTypes.object,
  className: React.PropTypes.string,
  effect: React.PropTypes.array,
  duration: React.PropTypes.number
};

NotificationBadge.defaultProps = {
  count: 0,
  style: {}
};
