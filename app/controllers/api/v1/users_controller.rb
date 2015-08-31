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
  
end
