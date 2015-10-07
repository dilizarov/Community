class CurrentUserSerializer < ActiveModel::Serializer
  attributes :username, :external_id, :created_at, :avatar_url
  
  def attributes
    data = super
    data[:auth_token] = object.auth_token.token unless object.auth_token.nil?
    data[:email] = object.email unless object.meta
    data
  end
  
  def avatar_url
    object.avatar.url
  end
end
