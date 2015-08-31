class CurrentUserSerializer < ActiveModel::Serializer
  attributes :username, :email, :external_id, :created_at, :avatar_url
  
  def attributes
    data = super
    data[:auth_token] = object.auth_token unless object.auth_token.nil?
    data
  end
  
  def avatar_url
    object.avatar.url
  end
end
