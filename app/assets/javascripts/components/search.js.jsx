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

  focusSearchBox: function() {
    this.refs.searchBox.focus();
  },

  adjustPlaceholder: function(e) {
    // Adjust placeholder text and search icon to make room for user's text input
    // and re-adjust placeholder text and search icon if search box input is empty
    if(e.type === 'focus') {
      this.setState({adjustedPlaceholder: true});
    }
    else if(this.refs.searchBox.value === '') {
      this.setState({adjustedPlaceholder: false});
    }
  },

  render: function() {
    var searchClasses = classNames('search', {'adjust-placeholder': this.state.adjustedPlaceholder}),
        searchIconClasses = classNames('fa', 'fa-search', {'adjust-placeholder': this.state.adjustedPlaceholder});

    return (
        <span className="search-wrapper">
          <i className={searchIconClasses}
             onClick={this.focusSearchBox}></i>
          <input type="text"
                 className={searchClasses}
                 placeholder="Visit communities"
                 onKeyUp={this.maybeGoToCommunity}
                 onFocus={this.adjustPlaceholder}
                 onBlur={this.adjustPlaceholder}
                 ref="searchBox" />
       </span>
    )
  }

})
