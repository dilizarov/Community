class Api::V1::UsersController < ApiController

  skip_before_filter :ensure_current_user!, only: [:forgot_password, :reset_password]

  def upload_profile_pic
    current_user.avatar = params[:avatar]

    if params[:avatar] && current_user.save
      render status: :ok,
      json: { avatar: { url: current_user.avatar.url } }
    else
      render status: :unprocessable_entity,
      json: { errors: params[:avatar] ?
        current_user.errors.full_messages :
        "Avatar was not included"
      }
    end
  end

  def profile_pic
    render status: :ok,
    json: { avatar: { url: current_user.avatar.url } }
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

    actual_notifications = relationships.map(&:notification)

    comms_involved = actual_notifications.map do |notif|
      notif.post.present? ? notif.post.community : notif.reply.post.community
    end

    recipient_relations = current_user.communities.where(normalized_name: comms_involved.uniq)
    rel_hash = recipient_relations.inject({}) { |hash, rel| hash.merge(rel.normalized_name => rel)}

    actual_notifications.each do |notif|
      community = notif.post.present? ? notif.post.community : notif.reply.post.community
      notif.recipient_relationship = rel_hash[community]
    end

    render status: :ok,
    json: actual_notifications,
    each_serializer: NotificationSerializer,
    root: "notifications"
  end

  def notifications_count
    count = current_user.user_notifications.where(read: false).count

    render status: :ok,
    json: { notifications_count: count }
  end

  def forgot_password
    @user = User.find_by(email: params[:email])

    if @user
      @user.send_password_reset_email!

      head :no_content
    else
      render status: :not_found,
      json: { error: "No user found with this email"}
    end
  end

  def reset_password
    @user = User.find_by(email: params[:email])

    if @user &&
       Devise.secure_compare(@user.reset_password_token, params[:reset_token]) &&
       @user.reset_password_sent_at > 24.hours.ago &&
       params[:password]

      @user.reset_password!(params[:password])

      head :no_content
    else
      render status: :unprocessable_entity,
      json: { error: "We didn't receive all the information we need. Try requesting another email and follow the instructions once more." }
    end
  end
end
