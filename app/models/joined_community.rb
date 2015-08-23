# I wanted to mitigate the fact that I couldn't have a model named Community since the application is called that.
# I first tried Kommunity, but it didn't feel right. Decided on JoinedCommunity because inherently all communities exist
# and this only keeps track of communities that the user has joined.
class JoinedCommunity < ActiveRecord::Base
  
  belongs_to :user
  
end
