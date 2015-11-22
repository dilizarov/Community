// Based on popular jQuery Autosize library

class TextareaAutosize extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      height: null,
      minHeight: -Infinity,
      maxHeight: Infinity
    };
    this._onNextFrameActionId = null;
    this._rootDOMNode = null;
    this._onChange = this._onChange.bind(this);
    this._resizeComponent = this._resizeComponent.bind(this);
    this._onRootDOMNode = this._onRootDOMNode.bind(this);
  }

  render() {
    let {valueLink, onChange, ...props} = this.props;
    props = {...props};
    if (typeof valueLink === 'object') {
      props.value = this.props.valueLink.value;
    }
    props.style = {
      ...props.style,
      height: this.state.height
    };
    let maxHeight = Math.max(
      props.style.maxHeight ? props.style.maxHeight : Infinity,
      this.state.maxHeight);
    if (maxHeight < this.state.height) {
      props.style.overflow = 'hidden';
    }
    return (
      <textarea
        {...props}
        onChange={this._onChange}
        ref={this._onRootDOMNode}
        />
    );
  }

  componentDidMount() {
    this._resizeComponent();
    window.addEventListener('resize', this._resizeComponent);
  }

  componentWillReceiveProps() {
    // Re-render with the new content then recalculate the height as required.
    this._clearNextFrame();
    this._onNextFrameActionId = onNextFrame(this._resizeComponent);
  }

  componentDidUpdate(prevProps, prevState) {
    // Invoke callback when old height does not equal to new one.
    if (this.state.height !== prevState.height) {
      this.props.onHeightChange(this.state.height);
    }
  }

  componentWillUnmount() {
    // Remove any scheduled events to prevent manipulating the node after it's
    // been unmounted.
    this._clearNextFrame();
    window.removeEventListener('resize', this._resizeComponent);
  }

  _clearNextFrame() {
    if (this._onNextFrameActionId) {
      clearNextFrameAction(this._onNextFrameActionId);
    }
  }

  _onRootDOMNode(node) {
    this._rootDOMNode = node;
  }

  _onChange(e) {
    this._resizeComponent();
    let {valueLink, onChange} = this.props;
    if (valueLink) {
      valueLink.requestChange(e.target.value);
    } else {
      onChange(e);
    }
  }

  _resizeComponent() {
    let {useCacheForDOMMeasurements} = this.props;
    this.setState(calculateNodeHeight(
      this._rootDOMNode,
      useCacheForDOMMeasurements,
      this.props.rows || this.props.minRows,
      this.props.maxRows));
  }

  /**
   * Read the current value of <textarea /> from DOM.
   */
  get value(): string {
    return this._rootDOMNode.value;
  }

  /**
   * Set the current value of <textarea /> DOM node.
   */
  set value(val) {
    this._rootDOMNode.value = val;
  }

  /**
   * Put focus on a <textarea /> DOM element.
   */
  focus() {
    this._rootDOMNode.focus();
  }

}

TextareaAutosize.propTypes = {
  /**
   * Current textarea value.
   */
  value: React.PropTypes.string,

  /**
   * Callback on value change.
   */
  onChange: React.PropTypes.func,

  /**
   * Callback on height changes.
   */
  onHeightChange: React.PropTypes.func,

  /**
   * Try to cache DOM measurements performed by component so that we don't
   * touch DOM when it's not needed.
   *
   * This optimization doesn't work if we dynamically style <textarea />
   * component.
   */
  useCacheForDOMMeasurements: React.PropTypes.bool,

  /**
   * Minimal numbder of rows to show.
   */
  rows: React.PropTypes.number,

  /**
   * Alias for `rows`.
   */
  minRows: React.PropTypes.number,

  /**
   * Maximum number of rows to show.
   */
  maxRows: React.PropTypes.number
}

TextareaAutosize.defaultProps = {
  onChange: function(){},
  onHeightChange: function(){},
  useCacheForDOMMeasurements: false
}

function onNextFrame(cb) {
  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame(cb);
  }
  return window.setTimeout(cb, 1);
}

function clearNextFrameAction(nextFrameId) {
  if (window.cancelAnimationFrame) {
    window.cancelAnimationFrame(nextFrameId);
  } else {
    window.clearTimeout(nextFrameId);
  }
}

// calculateNodeHeight(uiTextNode, useCache = false)

var HIDDEN_TEXTAREA_STYLE = `
  min-height:none !important;
  max-height:none !important;
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important
`;

var SIZING_STYLE = [
  'letter-spacing',
  'line-height',
  'padding-top',
  'padding-bottom',
  'font-family',
  'font-weight',
  'font-size',
  'text-rendering',
  'text-transform',
  'width',
  'padding-left',
  'padding-right',
  'border-width',
  'box-sizing'
];

var computedStyleCache = {};
var hiddenTextarea;

var calculateNodeHeight = function(uiTextNode,
    useCache = false,
    minRows = null, maxRows = null) {

  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea');
    document.body.appendChild(hiddenTextarea);
  }

  // Copy all CSS properties that have an impact on the height of the content in
  // the textbox
  let {
    paddingSize, borderSize,
    boxSizing, sizingStyle
  } = calculateNodeStyling(uiTextNode, useCache);

  // Need to have the overflow attribute to hide the scrollbar otherwise
  // text-lines will not calculated properly as the shadow will technically be
  // narrower for content
  hiddenTextarea.setAttribute('style', sizingStyle + ';' + HIDDEN_TEXTAREA_STYLE);
  hiddenTextarea.value = uiTextNode.value || uiTextNode.placeholder || '';

  var minHeight = -Infinity;
  var maxHeight = Infinity;
  var height = hiddenTextarea.scrollHeight;

  if (boxSizing === 'border-box') {
    // border-box: add border, since height = content + padding + border
    height = height + borderSize;
  } else if (boxSizing === 'content-box') {
    // remove padding, since height = content
    height = height - paddingSize;
  }

  if (minRows !== null || maxRows !== null) {
    // measure height of a textarea with a single row
    hiddenTextarea.value = '';
    var singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
    if (minRows !== null) {
      minHeight = singleRowHeight * minRows;
      if (boxSizing === 'border-box') {
        minHeight = minHeight + paddingSize + borderSize;
      }
      height = Math.max(minHeight, height);
    }
    if (maxRows !== null) {
      maxHeight = singleRowHeight * maxRows;
      if (boxSizing === 'border-box') {
        maxHeight = maxHeight + paddingSize + borderSize;
      }
      height = Math.min(maxHeight, height);
    }
  }
  return {height, minHeight, maxHeight};
}

function calculateNodeStyling(node, useCache = false) {
  var nodeRef = (
    node.getAttribute('id') ||
    node.getAttribute('data-reactid') ||
    node.getAttribute('name')
  );

  if (useCache && computedStyleCache[nodeRef]) {
    return computedStyleCache[nodeRef];
  }

  var style = window.getComputedStyle(node);

  var boxSizing = (
    style.getPropertyValue('box-sizing') ||
    style.getPropertyValue('-moz-box-sizing') ||
    style.getPropertyValue('-webkit-box-sizing')
  );

  var paddingSize = (
    parseFloat(style.getPropertyValue('padding-bottom')) +
    parseFloat(style.getPropertyValue('padding-top'))
  );

  var borderSize = (
    parseFloat(style.getPropertyValue('border-bottom-width')) +
    parseFloat(style.getPropertyValue('border-top-width'))
  );

  var sizingStyle = SIZING_STYLE
    .map(name => `${name}:${style.getPropertyValue(name)}`)
    .join(';');

  var nodeInfo = {
    sizingStyle,
    paddingSize,
    borderSize,
    boxSizing
  };

  if (useCache && nodeRef) {
    computedStyleCache[nodeRef] = nodeInfo;
  }

  return nodeInfo;
}
