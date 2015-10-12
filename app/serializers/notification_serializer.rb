class NotificationSerializer < ActiveModel::Serializer
  attributes :kind, :created_at
  
  def attributes
    data = super
    
    data[:user] = { external_id: object.user.external_id, avatar_url: object.user.avatar.url, username: object.user.username }
    
    community_name = object.post.present? ? object.post.community : object.reply.post.community
    data[:post_id] = object.post.present? ? object.post.external_id : object.reply.post.external_id
    #object.user.communities is cached from an eager load
    relationship = object.user.communities.select { |community| community.normalized_name == community_name }.first
    
    if relationship.present?
      data[:community] = relationship.name
      data[:community_normalized] = relationship.normalized_name
      
      unless relationship.avatar.url.nil?
        data[:user][:avatar_url] = relationship.avatar.url
      end
      
      unless relationship.username.nil?
        data[:user][:username] = relationship.username
      end
    else
      data[:community] = community_name
      data[:community_normalized] = community_name
    end
    
    data
  end  
end
