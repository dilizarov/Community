class Reply < ActiveRecord::Base
  include Externalable
  
  acts_as_votable
  
  attr_accessor :liked
  
  validates :post_id, presence: true
  validates :body, presence: true
  
  belongs_to :user
  belongs_to :post, counter_cache: true, inverse_of: :replies
end
