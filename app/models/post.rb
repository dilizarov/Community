class Post < ActiveRecord::Base
  include Externalable
  
  acts_as_votable
  
  attr_accessor :liked
  
  scope :created_before, ->(time = nil) { where('posts.created_at < ?', time) if time }
  
  validates :community,     presence: true
  validates :body,          presence: true
  validate :user_id_or_username_must_be_present
  
  belongs_to :user
  
  def user_id_or_username_must_be_present
    if username.nil? && user_id.nil?
      errors.add(:username, "is required to make a post")
    end
  end

end
