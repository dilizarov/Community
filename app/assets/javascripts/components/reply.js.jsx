var Reply = React.createClass({
  
  render: function() {
    return(
      <li>
        {this.props.reply.body}
      </li>
    );
  }
  
})