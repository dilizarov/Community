class Notification < ActiveRecord::Base
  
  attr_accessor :read
  
  belongs_to :post
  belongs_to :reply
  belongs_to :user
  
  has_many :user_notifications
  
  has_many :users,
  through: :user_notifications
  
  validates :kind, presence: true, inclusion: { in: ["post_liked", "post_created", "reply_liked", "reply_created"], case_sensitive: false }
  
  after_create :mark_users_who_get_sent_notification, :send_notification
  
  private
  
  def mark_users_who_get_sent_notification
    #post_liked and reply_liked don't require checking if we're sending
    #notification to the user who triggered it because unique indexes
    #will make it impossible
    
    case self.kind
    when "post_liked"
      UserNotification.create(user_id: self.post.user_id, notification_id: self.id)
    when "post_created"
      #users in the community are the ones receiving this notification.
      relationships = JoinedCommunity.where(normalized_name: self.post.community).where.not(user_id: self.user_id)
      user_notifications = relationships.map do |relationship|
        UserNotification.new(user_id: relationship.user_id, notification_id: self.id)
      end

      UserNotification.import(user_notifications)
    when "reply_liked"
      UserNotification.create(user_id: self.reply.user_id, notification_id: self.id)
    when "reply_created"
      #user whose post it is and others who replied.
      user_ids = [self.reply.post.user_id]
      self.reply.post.replies.each do |reply|
        user_ids << reply.user_id
      end

      user_notifications = user_ids.uniq.reject { |user_id| user_id == self.user_id }.map do |user_id|
        UserNotification.new(user_id: user_id, notification_id: self.id)
      end
      
      UserNotification.import(user_notifications)
    end
  end
  
  def send_notification
    Notifications.perform_async(self.id)
  end
end
