var Communities = React.createClass({

  getInitialState: function() {
    return { loaded: false };
  },

  componentDidMount: function() {
    //@TODO: listen to on scroll here
    this.scrollContainer();

    $.ajax({
      method: "GET",
      url: "/api/v1/communities.json",
      data: { auth_token: Session.authToken(), user_id: Session.userId() },
      success: function(res) {
        if (this.isMounted()) {
          this.setState({
            communities: res.communities,
            loaded: true,
            error: false
          });
        }
      }.bind(this),
      error: function(err) {
        if (this.isMounted()) {
          this.setState({
            loaded: true,
            error: true
            //Do some error data stuff as well.
          });
        }
      }.bind(this)
    })
  },

  scrollContainer: function() {
    var element = $('.communities-wrapper'),
        originalY = element.offset().top;

    // Space between element and top of screen (when scrolling)
    var topMargin = 5;

    $(window).on('scroll', function(event) {
        var scrollTop = $(window).scrollTop();

        element.stop(false, false).animate({
            top: scrollTop < originalY
                    ? 0
                    : scrollTop - originalY + topMargin
        }, 300);
    });
  },

  addCommunity: function(community) {
    var communities = React.addons.update(this.state.communities, { $push: [community] })

    communities.sort( function(a, b) {
      return a.normalized_name.localeCompare(b.normalized_name)
    });

    this.setState({ communities: communities });
  },


  removeCommunity: function(community) {
    var index = this.state.communities.indexOf(community);
    var communities = React.addons.update(this.state.communities, { $splice: [[index, 1]] });

    this.setState({ communities: communities });
  },

  //@TODO: Error handling/displaying.
  render: function() {

    var mainContent;
    var loader;

    if (this.state.loaded === false) {
      loader = <Spinner />
    } else if (this.state.error === true) {
      //TODO: Error handling/displaying is in here.
      mainContent = "Whoops, we errored :c"
    } else if (this.state.communities.length === 0) {
      mainContent = "You have not joined any communities"
    } else {
      mainContent = (<ul className="no-bullet">
        {this.state.communities.map(function(community) {
          return (<Community key={community.normalized_name}
                            community={community}
                            handleSelectCommunity={this.props.handleSelectCommunity}
                            handleAddCommunity={this.addCommunity}
                            handleRemoveCommunity={this.removeCommunity} />)

        }.bind(this))}
      </ul>)
    }

    return (
      <div className="communities">
        <h2 className="title">
          Communities {loader}
        </h2>
        {mainContent}
      </div>
    )
  }

});
