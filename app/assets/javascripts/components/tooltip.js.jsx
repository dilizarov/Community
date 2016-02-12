var Tooltip = React.createClass({

  getDefaultProps: function() {

    return {
      container: document.body,
      position: 'top',
      fixed: true,
      space: 5
    }
  },

  componentDidMount: function() {
    this.container = this.props.container || document.body;
    this.componentEl = ReactDOM.findDOMNode(this);
    this.tooltipEl = document.createElement('div');

    var tooltipArrowEl = document.createElement('div');
    tooltipArrowEl.className = 'tltip-arrow';

    var tooltipContentEl = document.createElement('div');
    tooltipContentEl.className = 'tltip-inner';
    tooltipContentEl.textContent = this.props.title;

    this.tooltipEl.appendChild(tooltipArrowEl);
    this.tooltipEl.appendChild(tooltipContentEl);
    this.tooltipEl.className = 'tltip ' + this.props.position;
    this.container.appendChild(this.tooltipEl);
    this.resetTooltip();

    this.componentEl.addEventListener('mousemove', this.handleMouseMove);
    this.componentEl.addEventListener('mouseout', this.handleMouseOut);
  },

  componentDidUpdate: function() {
    this.tooltipEl.className = 'tltip ' + this.props.position;
    this.tooltipEl.childNodes[1].textContent = this.props.title;
  },

  componentWillUnmount: function() {
    this.componentEl.removeEventListener('mousemove', this.handleMouseMove);
    this.componentEl.removeEventListener('mouseout', this.handleMouseOut);
    this.container.removeChild(this.tooltipEl);
  },

  resetTooltip: function() {
    this.tooltipEl.style.transition = 'opacity 0.4s';
    this.tooltipEl.style.left = '-500px';
    this.tooltipEl.style.top = '-500px';
    this.tooltipEl.style.opacity = 0;
  },

  handleMouseMove: function(e) {
    if (this.props.title === '') {
      return;
    }

    var tooltipPosition = this.getTooltipPosition(e);
    var tooltipOffset = this.getTooltipOffset();

    this.tooltipEl.style.left = tooltipPosition.x + tooltipOffset.x + 'px';
    this.tooltipEl.style.top = tooltipPosition.y + tooltipOffset.y + 'px';
    this.tooltipEl.style.opacity = 1;
  },

  handleMouseOut: function() {
    this.resetTooltip();
  },

  getTooltipPosition: function(e) {
    var pointX;
    var pointY;
    var bodyRect = document.body.getBoundingClientRect();
    var containerRect = this.container.getBoundingClientRect();
    var containerOffsetX = containerRect.left - bodyRect.left;
    var containerOffsetY = containerRect.top - bodyRect.top;
    if (this.props.fixed) {
      var componentRect = this.componentEl.getBoundingClientRect();
      var componentOffsetX = componentRect.left - containerOffsetX;
      var componentOffsetY = componentRect.top - containerOffsetY;
      var componentWidth = this.componentEl.offsetWidth;
      var componentHeight = this.componentEl.offsetHeight;
      var cOffsetX = 0;
      var cOffsetY = 0;
      switch (this.props.position) {
        case 'top':
          cOffsetX = componentWidth / 2;
          cOffsetY = 0;
          break;
        case 'right':
          cOffsetX = componentWidth;
          cOffsetY = componentHeight / 2;
          break;
        case 'bottom':
          cOffsetX = componentWidth / 2;
          cOffsetY = componentHeight;
          break;
        case 'left':
          cOffsetX = 0;
          cOffsetY = componentHeight / 2;
          break;
      }
      pointX = componentOffsetX + cOffsetX + window.scrollX;
      pointY = componentOffsetY + cOffsetY + window.scrollY;
    } else {
      var clientX = e.clientX;
      var clientY = e.clientY;
      pointX = clientX - containerOffsetX + window.scrollX;
      pointY = clientY - containerOffsetY + window.scrollY;
    }
    return {
      x: pointX,
      y: pointY
    };
  },

  getTooltipOffset: function() {
    var tooltipW = this.tooltipEl.offsetWidth;
    var tooltipH = this.tooltipEl.offsetHeight;
    var offsetX = 0;
    var offsetY = 0;
    switch (this.props.position) {
      case 'top':
        offsetX = -(tooltipW / 2);
        offsetY = -(tooltipH + Number(this.props.space));
        break;
      case 'right':
        offsetX = Number(this.props.space);
        offsetY = -(tooltipH / 2);
        break;
      case 'bottom':
        offsetX = -(tooltipW / 2);
        offsetY = Number(this.props.space);
        break;
      case 'left':
        offsetX = -(tooltipW + Number(this.props.space));
        offsetY = -(tooltipH / 2);
        break;
    }
    return {
      x: offsetX,
      y: offsetY
    };
  },

  show: function() {
    if (this.isMounted()) {
      this.handleMouseMove();
    }
  },

  render: function() {
    return this.props.children;
  }
})
