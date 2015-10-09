class NotificationSerializer < ActiveModel::Serializer
  attributes :kind
  
  def attributes
    data = super
    data[:read] = object.read unless object.read.nil?
    
    data[:user] = { external_id: object.user.external_id, avatar_url: object.user.avatar.url, username: object.user.username }
    
    community_name = object.post.present? ? object.post.community : object.reply.post.community
    #object.user.communities is cached from an eager load
    relationship = object.user.communities.select { |community| community.normalized_name == community_name }.first
      
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
  
  has_one :post
  has_one :reply
end
