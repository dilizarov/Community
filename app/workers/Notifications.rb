require 'pushmeup'

class Notifications
  include Sidekiq::Worker
  sidekiq_options :retry => false
  
  def perform(notification_id)
    
    notification = Notification.includes(:post, :user, :reply).find(notification_id)
    
    case notification.kind
    when "post_created"
      send_post_created_notification(notification)
    when "post_liked"
      send_post_liked_notification(notification)
    when "reply_created"
      send_reply_created_notification(notification)
    when "reply_liked"
      send_reply_liked_notification(notification)
    end
  end
  
  def send_post_created_notification(notification)
    return unless notification.post.present?
    
    users = notification.users.includes(:devices, :user_notifications).to_a

    devices = []
    badge_counts = {}
    
    users.each do |user|
      next if user.id == notification.user_id
      
      user_badge_count = user.user_notifications.reject { |relation| relation.read }.count
      user_badge_count = 1 if user_badge_count.zero?
      
      if user.meta
        potentially_shared_devices = Device.where(token: user.devices.map(&:token))
        valid_tokens = potentially_shared_devices.group_by(&:token).delete_if { |key, value| value.count > 1 }.keys
        eligible_devices = user.devices.select { |device| valid_tokens.include? device.token }
      else
        eligible_devices = user.devices.to_a
      end
      
      eligible_devices.each do |device|
        badge_counts[device.token] = user_badge_count
      end
      
      devices << eligible_devices
    end
    
    devices.flatten!
    
    ios_destinations = []
    
    devices.each do |device|
      if device.platform == "ios"
        ios_destinations << device.token
      end
    end
    
    return if ios_destinations.empty?
    
    user_relationship = notification.user.communities.select { |community| community.normalized_name == notification.post.community }.first
          
    username_used = notification.user.username
          
    if user_relationship.present?
      unless user_relationship.username.nil?
        username_used = user_relationship.username
      end
    end
    
    summary = "#{username_used} posted in &#{notification.post.community}"
    
    ios_data = {
      alert: summary,
      sound: "default",
      other: { notification_type: notification.kind, post_id: notification.post.external_id, community: notification.post.community }
    }
    
    notifications = ios_destinations.map do |ios_dest|
      ios_data[:badge] = badge_counts[ios_dest]
      APNS::Notification.new(ios_dest, ios_data)
    end
    
    APNS.send_notifications(notifications) unless ios_destinations.empty?
  end
  
  def send_post_liked_notification(notification)
    return if
    notification.post.nil? || notification.post.user_id == notification.user_id
    
    devices = notification.post.user.devices.to_a
    
    badge_count = UserNotification.where(user_id: notification.post.user_id, read: false).count
    badge_count = 1 if badge_count.zero?
    
    # If the user is meta, we need to ensure that no other user is currently on that device
    if notification.post.user.meta
      # takes all the devices tokens, and find all devices associated with those tokens, once we have all devices associated with those tokens
      # we get rid of devices in use by other accounts.
      potentially_shared_devices = Device.where(token: devices.map(&:token))
      valid_tokens = potentially_shared_devices.group_by(&:token).delete_if { |key, value| value.count > 1 }.keys
      devices.select! { |device| valid_tokens.include? device.token }
    end
    
    ios_destinations = []
    
    devices.each do |device|
      if device.platform == "ios"
        ios_destinations << device.token
      end
    end
    
    return if ios_destinations.empty?
    
    # Use the correct username for the user who liked
    user_relationship = notification.user.communities.select { |community| community.normalized_name == notification.post.community }.first
          
    username_used = notification.user.username
          
    if user_relationship.present?
      unless user_relationship.username.nil?
        username_used = user_relationship.username
      end
    end
    
    summary = "#{username_used} likes your post in &#{notification.post.community}"
    
    ios_data = {
      badge: badge_count,
      alert: summary,
      sound: "default",
      other: { notification_type: notification.kind, post_id: notification.post.external_id, community: notification.post.community }
    }
    
    notifications = ios_destinations.map do |ios_dest|
      APNS::Notification.new(ios_dest, ios_data)
    end
    
    APNS.send_notifications(notifications) unless ios_destinations.empty?
  end
  
  def send_reply_created_notification(notification)
    return unless notification.reply.present?
    
    users = notification.users.includes(:devices, :user_notifications).to_a

    devices = []
    badge_counts = {}
    
    users.each do |user|
      next if user.id == notification.user_id
      
      user_badge_count = user.user_notifications.reject { |relation| relation.read }.count
      user_badge_count = 1 if user_badge_count.zero?
            
      if user.meta
        potentially_shared_devices = Device.where(token: user.devices.map(&:token))
        valid_tokens = potentially_shared_devices.group_by(&:token).delete_if { |key, value| value.count > 1 }.keys
        eligible_devices = user.devices.select { |device| valid_tokens.include? device.token }
      else
        eligible_devices = user.devices.to_a
      end
      
      eligible_devices.each do |device|
        badge_counts[device.token] = user_badge_count
      end
      
      devices << eligible_devices
    end
    
    devices.flatten!
    
    ios_destinations = []
    
    devices.each do |device|
      if device.platform == "ios"
        ios_destinations << device.token
      end
    end
    
    return if ios_destinations.empty?
    
    user_relationship = notification.user.communities.select { |community| community.normalized_name == notification.reply.post.community }.first
          
    username_used = notification.user.username
          
    if user_relationship.present?
      unless user_relationship.username.nil?
        username_used = user_relationship.username
      end
    end
    
    summary = "#{username_used} replied to a post in &#{notification.reply.post.community}"
    
    ios_data = {
      alert: summary,
      sound: "default",
      other: { notification_type: notification.kind, post_id: notification.reply.post.external_id, reply_id: notification.reply.external_id, community: notification.reply.post.community }
    }
    
    notifications = ios_destinations.map do |ios_dest|
      ios_data[:badge] = badge_counts[ios_dest]
      APNS::Notification.new(ios_dest, ios_data)
    end
    
    p notifications
    
    APNS.send_notifications(notifications) unless ios_destinations.empty?
  end
  
  def send_reply_liked_notification(notification)
    return if notification.reply.nil? || notification.reply.user_id == notification.user_id
    
    devices = notification.reply.user.devices.to_a
    
    badge_count = UserNotification.where(user_id: notification.reply.user_id, read: false).count
    badge_count = 1 if badge_count.zero?
    
    # If the user is meta, we need to ensure that no other user is currently on that device
    if notification.reply.user.meta
      # takes all the devices tokens, and find all devices associated with those tokens, once we have all devices associated with those tokens
      # we get rid of devices in use by other accounts.
      potentially_shared_devices = Device.where(token: devices.map(&:token))
      valid_tokens = potentially_shared_devices.group_by(&:token).delete_if { |key, value| value.count > 1 }.keys
      devices.select! { |device| valid_tokens.include? device.token }
    end
    
    ios_destinations = []
    
    devices.each do |device|
      if device.platform == "ios"
        ios_destinations << device.token
      end
    end
    
    return if ios_destinations.empty?
    
    # Use the correct username for the user who liked
    user_relationship = notification.user.communities.select { |community| community.normalized_name == notification.reply.post.community }.first
          
    username_used = notification.user.username
          
    if user_relationship.present?
      unless user_relationship.username.nil?
        username_used = user_relationship.username
      end
    end
    
    summary = "#{username_used} likes your reply"
    
    ios_data = {
      badge: badge_count,
      alert: summary,
      sound: "default",
      other: { notification_type: notification.kind, reply_id: notification.reply.external_id, post_id: notification.reply.post.external_id, community: notification.reply.post.community }
    }
    
    notifications = ios_destinations.map do |ios_dest|
      APNS::Notification.new(ios_dest, ios_data)
    end
    
    APNS.send_notifications(notifications) unless ios_destinations.empty?
  end
end