normalizeCommunity = function(community) {
    return $.trim(community.toLowerCase()).split(' ').join('')
}
