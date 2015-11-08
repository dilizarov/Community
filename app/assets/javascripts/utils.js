getUrlParameter = function(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}

normalizeCommunity = function(community) {
    return $.trim(community.toLowerCase()).split(' ').join('_')
}

Session = {

  keys: {
    metaUserId: "meta_user_id",
    metaAuthToken: "meta_auth_token",
    metaUsername: "meta_username",
    metaCreatedAt: "meta_created_at",
    metaAvatarUrl: "meta_avatar_url",
    accountUserId: "user_id",
    accountUsername: "username",
    accountEmail: "email",
    accountAuthToken: "auth_token",
    accountCreatedAt: "created_at",
    accountAvatarUrl: "avatar_url"
  },

  authToken: function() {
    if (this.loggedIn()) {
      return localStorage.getItem(this.keys.accountAuthToken)
    } else {
      return localStorage.getItem(this.keys.metaAuthToken)
    }
  },

  userId: function() {
    if (this.loggedIn()) {
      return localStorage.getItem(this.keys.accountUserId)
    } else {
      return localStorage.getItem(this.keys.metaUserId)
    }
  },

  userInfo: function() {
    if (this.loggedIn()) {
      return {
        user_id: localStorage.getItem(this.keys.accountUserId),
        username: localStorage.getItem(this.keys.accountUsername),
        email: localStorage.getItem(this.keys.accountEmail),
        auth_token: localStorage.getItem(this.keys.accountAuthToken),
        created_at: localStorage.getItem(this.keys.accountCreatedAt),
        avatar_url: localStorage.getItem(this.keys.accountAvatarUrl)
      }
    } else {
      return {
        user_id: localStorage.getItem(this.keys.metaUserId),
        username: localStorage.getItem(this.keys.metaUsername),
        auth_token: localStorage.getItem(this.keys.metaAuthToken),
        created_at: localStorage.getItem(this.keys.metaCreatedAt),
        avatar_url: localStorage.getItem(this.keys.metaAvatarUrl)
      }
    }
  },

  isMeta: function() {
    return !this.loggedIn()
  },

  loggedIn: function() {
    return localStorage.getItem(this.keys.accountAuthToken) !== null;
  },

  needsMetaAccount: function() {
    return localStorage.getItem(this.keys.metaAuthToken) === null;
  },

  createMetaAccount: function(username, userId, createdAt, authToken) {
    localStorage.setItem(this.keys.metaUsername, username)
    localStorage.setItem(this.keys.metaUserId, userId)
    localStorage.setItem(this.keys.metaCreatedAt, createdAt)
    localStorage.setItem(this.keys.metaAuthToken, authToken)
  },

  changeMetaUsername: function(username) {
    localStorage.setItem(this.keys.metaUsername, username)
  },

  login: function(username, email, userId, authToken, createdAt, avatarUrl) {
    localStorage.setItem(this.keys.accountUsername, username)
    localStorage.setItem(this.keys.accountEmail, email)
    localStorage.setItem(this.keys.accountUserId, userId)
    localStorage.setItem(this.keys.accountAuthToken, authToken)
    localStorage.setItem(this.keys.accountCreatedAt, createdAt)

    if (avatarUrl !== null) {
      localStorage.setItem(this.keys.accountAvatarUrl, avatarUrl)
    }
  },

  logout: function() {
    localStorage.removeItem(this.keys.accountAuthToken)
    localStorage.removeItem(this.keys.accountUsername)
    localStorage.removeItem(this.keys.accountEmail)
    localStorage.removeItem(this.keys.accountUserId)
    localStorage.removeItem(this.keys.accountCreatedAt)
    localStorage.removeItem(this.keys.accountAvatarUrl)
  }

}
