var Search = React.createClass({

  getInitialState: function() {
    return {
      adjustedPlaceholder: false
    };
  },

  maybeGoToCommunity: function(e) {
    if (e.keyCode === 13) {

      var communityName = $.trim(e.target.value)

      if (communityName.length > 0) {
        if (communityName[0] === "&" && communityName.length !== 1) {
          communityName = communityName.substring(1)
        }

        //Clear search input and unfocus
        e.target.value = '';
        e.target.blur();
        //Re-adjust search box icon and placeholder text once search is complete
        this.setState({adjustedPlaceholder: false});

        this.props.handleSelectCommunity(communityName);
      }
    }
  },

  adjustPlaceholder: function(e) {
    // Adjust placeholder text and search icon to make room for user's text input
    if(e.type === 'focus') {
      this.setState({adjustedPlaceholder: true});
    }
  },

  render: function() {
    var searchClasses = classNames('search', {'adjust-placeholder': this.state.adjustedPlaceholder}),
        searchIconClasses = classNames('fa', 'fa-search', {'adjust-placeholder': this.state.adjustedPlaceholder});

    return (
        <span className="search-wrapper">
          <i className={searchIconClasses}></i>
          <input type="text"
                 className={searchClasses}
                 placeholder="Visit communities"
                 onKeyUp={this.maybeGoToCommunity}
                 onFocus={this.adjustPlaceholder} />
       </span>
    )
  }

})
