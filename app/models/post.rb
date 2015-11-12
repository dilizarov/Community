class Post < ActiveRecord::Base
  include Externalable

  acts_as_votable

  attr_accessor :liked

  scope :created_before, ->(time = nil) { where('posts.created_at <= ?', time) if time }

  before_save :normalize_data

  validates :community,     presence: true
  validates :body,          presence: true
  validate :user_id_or_username_must_be_present

  belongs_to :user

  has_many :notifications

  has_many :replies,
           -> { order(created_at: :asc) },
           dependent: :destroy,
           inverse_of: :post

  private

  def normalize_data
    self.title = self.title.strip unless self.title.nil?
    self.body = self.body.strip
    self.community = self.community.strip.downcase.gsub(" ", "_")
  end

  def user_id_or_username_must_be_present
    if username.nil? && user_id.nil?
      errors.add(:username, "is required to make a post")
    end
  end

end
