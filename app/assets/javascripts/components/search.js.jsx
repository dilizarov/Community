var Search = React.createClass({
  
  componentDidMount: function() {
    $('#search').keyup(function (e) {
      if (e.keyCode === 13) {
        this.props.handleSelectCommunity($('#search').val())
      }
    }.bind(this));
  },
  
  render: function() {
    return (
      <div className="search">
        SEARCH
        <input type="text" id="search" />
      </div>
    )
  }
  
})