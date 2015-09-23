class User < ActiveRecord::Base
  include Externalable
  
  acts_as_voter
  
  mount_uploader :avatar, AvatarUploader
  
  # Used in current_user Serializer.
  attr_accessor :auth_token
  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable
         
  validates :username, presence: true, uniqueness: true
  
  has_many :authentication_tokens
  has_many :communities, -> { order 'LOWER(joined_communities.name)' },
  class_name: "JoinedCommunity"

  def mark_liked_posts!(posts)
    liked_post_ids = self.find_up_votes_for_class(Post).where(votable_id: posts).map(&:votable_id)
    posts.each { |post| post.liked = liked_post_ids.include?(post.id) }
  end
  
  def mark_liked_replies!(replies)
    liked_reply_ids = self.find_up_votes_for_class(Reply).where(votable_id: replies).map(&:votable_id)
    replies.each { |reply| reply.liked = liked_reply_ids.include?(reply.id) }
  end

  def login!
    self.auth_token = AuthenticationToken.create(user_id: self.id).token
  end
  
  def logout!(auth_token)
    AuthenticationToken.where(token: auth_token).first.destroy
  end
end
