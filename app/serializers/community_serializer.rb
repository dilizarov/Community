class CommunitySerializer < ActiveModel::Serializer
  attributes :name
  
  def attributes
    data = super    
    
    data[:user] = { avatar_url: object.avatar.url, username: object.avatar.username }
    
    data
  end
end
