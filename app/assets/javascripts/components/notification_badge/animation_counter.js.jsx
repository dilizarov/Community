'use strict';

const Effect = {
  ROTATE_X: ['rotateX(-180deg)', 'rotateX(0deg)'],
  ROTATE_Y: ['rotateY(-180deg)', 'rotateY(0deg)'],
  SCALE: ['scale(1.8, 1.8)', 'scale(1, 1)']
}

class AnimationCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillEnter(callback){
    let badge = ReactDOM.findDOMNode(this.refs.badge);
    badge.style['-moz-transform'] = badge.style['-webkit-transform'] = badge.style['-o-transform'] = badge.style['-ms-transform'] = badge.style.transform = this.props.effect[0];
    if (this.props.effect[2]) {
      this.attachStyle(badge, this.props.effect[2]);
    }
    setTimeout(callback, this.props.duration);
  }

  componentDidEnter(){
    let badge = ReactDOM.findDOMNode(this.refs.badge);
    badge.style['-moz-transform'] = badge.style['-webkit-transform'] = badge.style['-o-transform'] = badge.style['-ms-transform'] = badge.style.transform = this.props.effect[1];
    if (this.props.effect[3]) {
      this.attachStyle(badge, this.props.effect[3]);
    }
  }

  componentDidMount(){
    if (this.props.count > 0) {
      let badge = ReactDOM.findDOMNode(this.refs.badge);
      badge.style['-moz-transform'] = badge.style['-webkit-transform'] = badge.style['-o-transform'] = badge.style['-ms-transform'] = badge.style.transform = this.props.effect[0];
      if (this.props.effect[2]) {
        this.attachStyle(badge, this.props.effect[2]);
      }
      setTimeout(() => {
        badge.style['-moz-transform'] = badge.style['-webkit-transform'] = badge.style['-o-transform'] = badge.style['-ms-transform'] = badge.style.transform = this.props.effect[1];
        if (this.props.effect[3]) {
          this.attachStyle(badge, this.props.effect[3]);
        }
      }, this.props.duration);
    }
  }

  componentDidUpdate(prevProps){
    if (this.props.count > prevProps.count) {
      let badge = ReactDOM.findDOMNode(this.refs.badge);
      badge.style['-moz-transform'] = badge.style['-webkit-transform'] = badge.style['-o-transform'] = badge.style['-ms-transform'] = badge.style.transform = this.props.effect[0];
      if (this.props.effect[2]) {
        this.attachStyle(badge, this.props.effect[2]);
      }
      setTimeout(() => {
        badge.style['-moz-transform'] = badge.style['-webkit-transform'] = badge.style['-o-transform'] = badge.style['-ms-transform'] = badge.style.transform = this.props.effect[1];
        if (this.props.effect[3]) {
          this.attachStyle(badge, this.props.effect[3]);
        }
      }, this.props.duration);
    }
  }

  attachStyle(node, style){
    for (let key in style) {
      node.style[key] = style[key];
    }
  }

  render() {
    let value = this.props.label || this.props.count;
    return (<span ref='badge' style={this.props.style} className={this.props.className}>{value}</span>);
  }
}

AnimationCounter.propTypes = {
  count: React.PropTypes.number,
  label: React.PropTypes.string,
  style: React.PropTypes.object,
  effect: React.PropTypes.array,
  duration: React.PropTypes.number,
  className: React.PropTypes.string
};

AnimationCounter.defaultProps = {
  count: 1,
  label: null,
  style: {},
  effect: Effect.SCALE,
  duration: 500
};
