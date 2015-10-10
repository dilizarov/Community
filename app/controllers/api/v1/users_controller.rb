class Api::V1::UsersController < ApiController
  
  def upload_profile_pic
    current_user.avatar = params[:avatar]
    
    if current_user.save
      render status: :ok,
      json: { avatar: { url: current_user.avatar.url} }
    else
      render status: :unprocessable_entity,
      json: { errors: current_user.errors.full_messages }
    end
  end
  
  def request_another_meta_username
    if current_user.meta
      
      begin
        current_user.generate_unique_username!
      
        # Borrowed cringe from method in User.rb
        current_user.email = "user.#{current_user.username.split.join}@fake.hacky.solution.com"
        current_user.save
      rescue ActiveRecord::RecordNotUnique
        retry
      end
      
      render status: 200,
      json: current_user,
      serializer: CurrentUserSerializer,
      root: "user",
      meta: { success: true,
        info: "Logged in" }
    else
      render status: :unprocessable_entity,
      json: { errors: ["Restricted"] }
    end
  end
  
  def notifications
    relationships = current_user.
                    user_notifications.
                    includes(notification: [{post: {user: :communities}}, {reply: [:post, {user: :communities}]}, {user: :communities}])
    
    relationships.update_all(read: true)
    
    max = 10
    
    if relationships.to_a.count > max
      relationships, void_relationships = relationships[0..max-1], relationships[max..-1]
      UserNotification.destroy(void_relationships)
      void_relationships.each do |relationship|
        if relationship.notification.present? && relationship.notification.users.count == 0
          relationship.notification.destroy
        end
      end
    end
    
    render status: :ok,
    json: notifications,
    each_serializer: NotificationSerializer
  end
  
end
