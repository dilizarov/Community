var Communities = React.createClass({

  getInitialState: function() {
    return { loaded: false };
  },

  componentDidMount: function() {

    $('.communities-wrapper').stick_in_parent({
      offset_top: 15
    });

    this.requestCommunities()
  },

  requestCommunities: function(e) {

    if (e) {
      this.setState({
        loaded: false,
        error: false
      })
    }

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
          });
        }
      }.bind(this)
    })
  },

  addCommunity: function(community, dueToError) {
    var communities = React.addons.update(this.state.communities, { $push: [community] })

    communities.sort( function(a, b) {
      return a.normalized_name.localeCompare(b.normalized_name)
    });

    if (dueToError === true) {
      this.lastErrorCommunity = community
    }

    this.setState({ communities: communities });
  },


  removeCommunity: function(community) {
    var index = this.state.communities.indexOf(community);
    var communities = React.addons.update(this.state.communities, { $splice: [[index, 1]] });

    this.setState({ communities: communities });
  },

  revokeErrorStatus: function(community) {
    if (this.lastErrorCommunity &&
        this.lastErrorCommunity.normalized_name === community.normalized_name) {
        this.lastErrorCommunity = null;
    }
  },

  updateCommunitySettings: function (relationship) {
    var updatedCommunities = this.state.communities.map( function (community) {
      if (community.normalized_name === relationship.normalized_name) {
        return React.addons.update(community, { $set: relationship });
      } else {
        return community;
      }
    })

    this.setState({
      communities: updatedCommunities
    })
  },

  render: function() {

    var mainContent;
    var loader;
    var title = "Communities";

    if (this.state.loaded === false) {
      loader = <Spinner />
    } else if (this.state.error === true) {
      //TODO Solidify text used.
      title = "Communities had trouble loading";
      mainContent = <a className="retry-btn" onClick={this.requestCommunities}>Retry</a>
    } else if (this.state.communities.length === 0) {
      title = "Communities you join will appear here";
    } else {
      mainContent = (<ul className="no-bullet">
        {this.state.communities.map(function(community) {

          var readding = false;

          if (this.lastErrorCommunity &&
              this.lastErrorCommunity.normalized_name === community.normalized_name) {
              readding = true
          }

          return (<Community key={community.normalized_name}
                            community={community}
                            readding={readding}
                            handleOpenSettings={this.props.handleOpenSettings}
                            handleSelectCommunity={this.props.handleSelectCommunity}
                            handleAddCommunity={this.addCommunity}
                            handleRemoveCommunity={this.removeCommunity}
                            handleRemoveErrorStatus={this.revokeErrorStatus} />)

        }.bind(this))}
      </ul>)
    }

    return (
      <div className="communities">
        <h2 className="title">
          {title} {loader}
        </h2>
        {mainContent}
      </div>
    )
  }

});
