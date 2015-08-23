class PostSerializer < ActiveModel::Serializer
  attributes :external_id, :body, :created_at, :username
  
  has_one :user
end
