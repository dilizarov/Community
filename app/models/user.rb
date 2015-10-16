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
         
  before_create :normalize_data
         
  validate :ensure_non_meta_username_for_account
  #We use DB constraint for uniqueness and catch ActiveRecord::RecordNotUnique when necessary
  validates :username, presence: true
  
  has_many :authentication_tokens
  has_many :communities, -> { order 'joined_communities.normalized_name' },
  class_name: "JoinedCommunity"
  
  has_many :user_notifications, -> { order(created_at: :desc) }
  
  has_many :notifications,
  through: :user_notifications
  
  has_many :devices

  # The following two methods are used by devise and overridden to handle meta accounts
  def email_required?
    !meta
  end

  # I essentially copied the Devise source and appended it after the &&
  def password_required?
    !meta && (!persisted? || !password.nil? || !password_confirmation.nil?)    
  end

  def mark_liked_posts!(posts)
    liked_post_ids = self.find_up_votes_for_class(Post).where(votable_id: posts).map(&:votable_id)
    posts.each { |post| post.liked = liked_post_ids.include?(post.id) }
  end
  
  def mark_liked_replies!(replies)
    liked_reply_ids = self.find_up_votes_for_class(Reply).where(votable_id: replies).map(&:votable_id)
    replies.each { |reply| reply.liked = liked_reply_ids.include?(reply.id) }
  end

  def login!
    self.auth_token = AuthenticationToken.create(user_id: self.id)
  end
  
  # We can do self.auth_token.destroy, but that won't trigger a RecordNotFound on race-conditions.
  def logout!
    AuthenticationToken.destroy(self.auth_token.id)
  end
  
  def sync_device!(device_data)
    return if device_data[:token].nil? || device_data[:platform].nil?
    
    device = Device.find_or_initialize_by(auth_id: self.auth_token.id)
    device.platform = device_data[:platform]
    device.token = device_data[:token]
    device.user_id = self.id
    
    device.save
  end
    
  def self.create_meta_account!
    user = User.new(meta: true)
    
    begin
      user.generate_unique_username!
      
      # So... Well... *cringe*... this gets past the unique email DB constraint
      # and... is it hacky? Yes!... but... it has some elegance to it... no?
      # >_> *wipes sweat off forehead*
      user.email = "user.#{user.username.split.join}@fake.hacky.solution.com"
      user.save
    rescue ActiveRecord::RecordNotUnique
      retry
    end
    
    return user
  end
  
  # Adjective Adjective Animal
  # Very simple... don't need to worry about efficiency right now but once we do... that'll be a good thing and we can
  # fix this
  def generate_unique_username! 
    pieces = []
          
    pieces << GenerationWord.where(kind: "adjective").sample.word
    pieces << GenerationWord.where(kind: "adjective").where.not(word: pieces.first).sample.word
    pieces << GenerationWord.where(kind: "animal").sample.word
    
    pieces.map! { |word| word.split.map(&:capitalize).join(' ') }
          
    self.username = pieces.join(' ')  
  end
  
  def transfer_communities_to!(user)
    
    # We could always work towards a bulk import solution, but right now not really important. Realistically this isn't too large a number anyways...
    # I hope... and it isn't called often.
    self.communities.find_each do |community|
      JoinedCommunity.create(name: community.name, user_id: user.id) rescue ActiveRecord::RecordNotUnique
    end        
  end
  
  def send_password_reset_email!
    
    begin
      user.reset_password_token = SecureRandom.uuid
      user.save
    rescue ActiveRecord::RecordNotUnique
      retry
    end  
    
    ResetPasswordEmail.perform_async(self.id)
  end
  
  private
  
  def ensure_non_meta_username_for_account
    return if self.meta
    
    string_being_checked = self.username.downcase.strip
    
    split_string = string_being_checked.split
    
    return if split_string.count <= 2
    
    error = false
    
    # Assumptions: At max, adjectives could be two words. At max, animals could be two words.
    if split_string.count == 3 
      # This only corresponds to 1 word Adj, 1 word Adj, 1 word Animal.
      if GenerationWord.find_by(word: split_string[0], kind: "adjective") &&
         GenerationWord.find_by(word: split_string[1], kind: "adjective") &&
         GenerationWord.find_by(word: split_string[2], kind: "animal")
                 
        error = true
      end
    elsif split_string.count == 4
      # This corresponds to one of the 3 terms being 2 words.
      if (GenerationWord.find_by(word: "#{split_string[0]} #{split_string[1]}", kind: "adjective") &&
         GenerationWord.find_by(word: split_string[2], kind: "adjective") &&
         GenerationWord.find_by(word: split_string[3], kind: "animal")) ||
         (GenerationWord.find_by(word: split_string[0], kind: "adjective") &&
         GenerationWord.find_by(word: "#{split_string[1]} #{split_string[2]}", kind: "adjective") &&
         GenerationWord.find_by(word: split_string[3], kind: "animal")) ||
         (GenerationWord.find_by(word: split_string[0], kind: "adjective") &&
         GenerationWord.find_by(word: split_string[1], kind: "adjective") &&
         GenerationWord.find_by(word: "#{split_string[2]} #{split_string[3]}", kind: "animal"))
        
        error = true
      end
    elsif split_string.count == 5
      # This corresponds to two of the 3 terms being 2 words.
      if (GenerationWord.find_by(word: "#{split_string[0]} #{split_string[1]}", kind: "adjective") &&
         GenerationWord.find_by(word: "#{split_string[2]} #{split_string[3]}", kind: "adjective") &&
         GenerationWord.find_by(word: split_string[4], kind: "animal")) ||
         (GenerationWord.find_by(word: "#{split_string[0]} #{split_string[1]}", kind: "adjective") &&
         GenerationWord.find_by(word: split_string[2], kind: "adjective") &&
         GenerationWord.find_by(word: "#{split_string[3]} #{split_string[4]}", kind: "animal")) ||
         (GenerationWord.find_by(word: split_string[0], kind: "adjective") &&
         GenerationWord.find_by(word: "#{split_string[1]} #{split_string[2]}", kind: "adjective") &&
         GenerationWord.find_by(word: "#{split_string[3]} #{split_string[4]}", kind: "animal"))
        
        error = true
      end
    elsif split_string.count == 6
      # This only corresponds to 2 word Adj, 2 word Adj, 2 word Animal
      if GenerationWord.find_by(word: "#{split_string[0]} #{split_string[1]}", kind: "adjective") &&
         GenerationWord.find_by(word: "#{split_string[2]} #{split_string[3]}", kind: "adjective") &&
         GenerationWord.find_by(word: "#{split_string[4]} #{split_string[5]}", kind: "animal")
         
         error = true
      end
    end
    
    errors.add(:username, "is reserved for those without accounts") if error
  end
  
  def normalize_data
    self.email = self.email.strip
    self.username = self.username.strip
  end  
end
