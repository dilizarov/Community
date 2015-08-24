class User < ActiveRecord::Base
  include Externalable
  
  # Used in current_user Serializer.
  attr_accessor :auth_token
  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable
         
  validates :username, presence: true, uniqueness: true
  
  has_many :authentication_tokens
  has_many :communities, class_name: "JoinedCommunity"

  def login!
    self.auth_token = AuthenticationToken.create(user_id: self.id).token
  end
  
  def logout!(auth_token)
    AuthenticationToken.where(token: auth_token).first.destroy
  end
end
