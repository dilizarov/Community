var Post = React.createClass({
      
  render: function() {
    return(
      <li>
        {this.props.post.body}
      </li>
    );
  }
  
});