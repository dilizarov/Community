class ReplySerializer < ActiveModel::Serializer
  attributes :external_id, :body, :created_at, :likes
  
  def attributes
    data = super
    data[:liked] = object.liked unless object.liked.nil?
    
    unless object.user.nil?
      data[:user] = { external_id: object.user.external_id }
    
      relationship = object.user.communities.select { |community| community.normalized_name == object.post.community }.first
      
      data[:user][:avatar_url] = relationship.avatar.url.nil? ? object.user.avatar.url : relationship.avatar.url
      data[:user][:username] = relationship.username.nil? ? object.user.username : relationship.username
    else
      data[:user] = { username: object.username }
    end
    
    data
  end
  
  def likes
    object.cached_votes_up
  end
end
