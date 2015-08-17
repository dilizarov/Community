class Post < ActiveRecord::Base
  include Externalable
  
  scope :created_before, ->(time = nil) { where('posts.created_at < ?', time) if time }
  
  validates :community,     presence: true
  validates :username,      presence: true
  validates :body,          presence: true

end
