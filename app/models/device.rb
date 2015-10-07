class Device < ActiveRecord::Base

  belongs_to :user
  belongs_to :authentication_token,
             foreign_key: :auth_id
             
  validates :token, presence: true
  validates :platform, presence: true, inclusion: { in: %w(ios android), case_sensitive: false }
  
  scope :platform_is, -> (device_platform) { where(platform: device_platform.to_s.downcase) }
  
  before_validation :normalize_data
  
  def platform_is?(device_platform)
    device_platform.to_s.downcase == platform.downcase
  end
  
  def normalize_data
    platform.downcase! if attribute_present?("platform")
  end

end
