class CommunitySerializer < ActiveModel::Serializer
  attributes :name, :normalized_name
  
  def attributes
    data = super    
    
    data[:user] = { avatar_url: object.avatar.url, username: object.username }
    
    data
  end
end
