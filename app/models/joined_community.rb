# I wanted to mitigate the fact that I couldn't have a model named Community since the application is called that.
# I first tried Kommunity, but it didn't feel right. Decided on JoinedCommunity because inherently all communities exist
# and this only keeps track of communities that the user has joined.
class JoinedCommunity < ActiveRecord::Base

  mount_uploader :avatar, AvatarUploader

  belongs_to :user

  before_validation :normalize_data
  validates :name, presence: true
  validates :username, length: { maximum: 40 }

  # Import to ensure self.name.nil? check because we do this before validation to prep a validation.
  def normalize_data
    unless self.name.nil?
      self.name = self.name.strip

      # "Cmon LETS NoRMalize This!" -> "cmon_lets_normalize_this!"
      self.normalized_name = self.name.downcase.gsub(" ", "")
    end

    self.username = self.username.strip unless self.username.nil?
  end

end
