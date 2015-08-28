# I wanted to mitigate the fact that I couldn't have a model named Community since the application is called that.
# I first tried Kommunity, but it didn't feel right. Decided on JoinedCommunity because inherently all communities exist
# and this only keeps track of communities that the user has joined.
class JoinedCommunity < ActiveRecord::Base
  
  belongs_to :user
  
  validate :unique_combination_of_name_and_user
  
  private
  
  def unique_combination_of_name_and_user
    errors.add(:user, "is already in this Community") unless JoinedCommunity.where(name: name, user_id: user_id).first.nil?
  end
  
end
