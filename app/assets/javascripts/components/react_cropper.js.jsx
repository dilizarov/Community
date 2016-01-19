var Cropper = React.createClass({

  propTypes: {
    // react cropper options
    crossOrigin: React.PropTypes.string,
    src: React.PropTypes.string,
    alt: React.PropTypes.string,

    // cropper options
    aspectRatio: React.PropTypes.number,
    crop: React.PropTypes.func,
    preview: React.PropTypes.string,
    strict: React.PropTypes.bool,
    responsive: React.PropTypes.bool,
    checkImageOrigin: React.PropTypes.bool,
    background: React.PropTypes.bool,
    modal: React.PropTypes.bool,
    guides: React.PropTypes.bool,
    highlight: React.PropTypes.bool,
    autoCrop: React.PropTypes.bool,
    autoCropArea: React.PropTypes.number,
    dragCrop: React.PropTypes.bool,
    movable: React.PropTypes.bool,
    cropBoxMovable: React.PropTypes.bool,
    cropBoxResizable: React.PropTypes.bool,
    doubleClickToggle: React.PropTypes.bool,
    zoomable: React.PropTypes.bool,
    mouseWheelZoom: React.PropTypes.bool,
    touchDragZoom: React.PropTypes.bool,
    rotatable: React.PropTypes.bool,
    minContainerWidth: React.PropTypes.number,
    minContainerHeight: React.PropTypes.number,
    minCanvasWidth: React.PropTypes.number,
    minCanvasHeight: React.PropTypes.number,
    minCropBoxWidth: React.PropTypes.number,
    minCropBoxHeight: React.PropTypes.number,
    build: React.PropTypes.func,
    built: React.PropTypes.func,
    dragstart: React.PropTypes.func,
    dragmove: React.PropTypes.func,
    dragend: React.PropTypes.func,
    zoomin: React.PropTypes.func,
    zoomout: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      src: null
    };
  },

  componentDidMount: function() {
    var options = {};
    for(var prop in this.props){
      if(prop !== 'src' && prop !== 'alt' && prop !== 'crossOrigin'){
        options[prop] = this.props[prop];
      }
    }
    this.$img = $(this.refs.img);
    this.$img.cropper(options);
  },

  componentWillReceiveProps: function(nextProps) {
    if(nextProps.src !== this.props.src){
      this.replace(nextProps.src);
    }
    if(nextProps.aspectRatio !== this.props.aspectRatio){
      this.setAspectRatio(nextProps.aspectRatio);
    }
  },

  componentWillUnmount: function() {
    if(this.$img) {
      // Destroy the cropper, this makes sure events such as resize are cleaned up and do not leak
      this.$img.cropper('destroy');
      // While we're at it remove our reference to the jQuery instance
      delete this.$img;
    }
  },

  move: function(offsetX, offsetY){
    return this.$img.cropper('move', offsetX, offsetY);
  },

  zoom: function(ratio){
    return this.$img.cropper('zoom', ratio);
  },

  rotate: function(degree){
    return this.$img.cropper('rotate', degree);
  },

  enable: function(){
    return this.$img.cropper('enable');
  },

  disable: function(){
    return this.$img.cropper('disable');
  },

  reset: function() {
    return this.$img.cropper('reset');
  },

  clear: function() {
    return this.$img.cropper('clear');
  },

  replace: function(url) {
    return this.$img.cropper('replace', url);
  },

  getData: function(rounded) {
    return this.$img.cropper('getData', rounded);
  },

  getContainerData: function() {
    return this.$img.cropper('getContainerData');
  },

  getImageData: function(){
    return this.$img.cropper('getImageData');
  },

  getCanvasData: function(){
    return this.$img.cropper('getCanvasData');
  },

  setCanvasData: function(data){
    return this.$img.cropper('setCanvasData', data);
  },

  getCropBoxData: function(){
    return this.$img.cropper('getCropBoxData');
  },

  setCropBoxData: function(data){
    return this.$img.cropper('setCropBoxData', data);
  },

  getCroppedCanvas: function(options){
    return this.$img.cropper('getCroppedCanvas', options);
  },

  setAspectRatio: function(aspectRatio){
    return this.$img.cropper('setAspectRatio', aspectRatio);
  },

  setDragMode: function(){
    return this.$img.cropper('setDragMode');
  },

  on: function(eventname, callback){
    return this.$img.on(eventname, callback);
  },

  render: function() {
    return (
      <div {...this.props} src={null} crossOrigin={null} alt={null}>
        <img
          crossOrigin={this.props.crossOrigin}
          ref='img'
          src={this.props.src}
          alt={this.props.alt === undefined ? 'picture' : this.props.alt}
          style={{opacity: 0}}
          />
      </div>
    );
  }
});
