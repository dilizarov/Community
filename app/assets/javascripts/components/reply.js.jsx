var Reply = React.createClass({

  render: function() {
    return(
      <li className="reply">
        {this.props.reply.body}
      </li>
    );
  }

})
