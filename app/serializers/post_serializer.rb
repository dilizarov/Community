class PostSerializer < ActiveModel::Serializer
  attributes :external_id, :body, :title, :created_at, :likes, :replies_count
  
  def attributes
    data = super
    data[:liked] = object.liked unless object.liked.nil?
    
    data[:user] = { external_id: object.user.external_id, avatar_url: object.user.avatar.url, username: object.user.username }
    
    #object.user.communities is cached from an eager load
    relationship = object.user.communities.select { |community| community.normalized_name == object.community }.first
      
    if relationship.present?
      unless relationship.avatar.url.nil?
        data[:user][:avatar_url] = relationship.avatar.url
      end
      
      unless relationship.username.nil?
        data[:user][:username] = relationship.username
      end
    end
    
    data
  end
  
  def likes
    object.cached_votes_up
  end
end
