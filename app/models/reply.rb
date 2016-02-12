class Reply < ActiveRecord::Base
  include Externalable

  acts_as_votable

  attr_accessor :liked

  before_save :normalize_data

  validates :post_id, presence: true
  validates :body, presence: true

  has_many :notifications

  belongs_to :user
  belongs_to :post, counter_cache: true, inverse_of: :replies

  private

  def normalize_data
    self.body = self.body.strip.gsub(/\n{2,}/,"\n\n")
  end
end
